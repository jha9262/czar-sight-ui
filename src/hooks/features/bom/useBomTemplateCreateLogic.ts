import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCreateBomTemplate } from "@/lib/queries";
import type { BomTemplate } from "@/lib/mock/data2";

export function useBomTemplateCreateLogic() {
  const navigate = useNavigate();
  const createTemplate = useCreateBomTemplate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<string[]>(["Designator", "Quantity"]);

  const addColumn = () => {
    setColumns([...columns, ""]);
  };

  const removeColumn = (idx: number) => {
    setColumns(columns.filter((_, i) => i !== idx));
  };

  const updateColumn = (idx: number, val: string) => {
    const nc = [...columns];
    nc[idx] = val;
    setColumns(nc);
  };

  const handleSave = () => {
    if (!name) {
      toast.error("Template Name is required.");
      return;
    }
    
    if (columns.some(c => !c.trim())) {
      toast.error("All column names must be filled or removed.");
      return;
    }

    const payload: BomTemplate = {
      id: "bt" + Date.now(),
      name,
      description,
      columns: columns.map(c => c.trim()),
    };

    createTemplate.mutate(payload, {
      onSuccess: () => {
        toast.success("BOM Template created");
        navigate({ to: "/bom" });
      },
      onError: () => toast.error("Failed to create template"),
    });
  };

  return {
    state: { name, description, columns, isPending: createTemplate.isPending },
    handlers: { setName, setDescription, addColumn, removeColumn, updateColumn, handleSave },
  };
}
