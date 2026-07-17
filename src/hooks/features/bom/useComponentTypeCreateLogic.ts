import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCreateBomComponentType } from "@/lib/queries";
import type { BomComponentType } from "@/lib/mock/data2";

export function useComponentTypeCreateLogic() {
  const navigate = useNavigate();
  const createComponentType = useCreateBomComponentType();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState<{ key: string; dataType: string; requirement: string }[]>([]);

  const addProperty = () => {
    setProperties([...properties, { key: "", dataType: "String", requirement: "Optional" }]);
  };

  const removeProperty = (idx: number) => {
    setProperties(properties.filter((_, i) => i !== idx));
  };

  const updateProperty = (idx: number, field: string, value: string) => {
    const newProps = [...properties];
    newProps[idx] = { ...newProps[idx], [field]: value };
    setProperties(newProps);
  };

  const handleSave = () => {
    if (!code || !name) {
      toast.error("Code and Name are required.");
      return;
    }

    const payload: BomComponentType = {
      id: "bct" + Date.now(),
      code,
      name,
      description,
      properties,
    };

    createComponentType.mutate(payload, {
      onSuccess: () => {
        toast.success("Component Type created");
        navigate({ to: "/bom" });
      },
      onError: () => toast.error("Failed to create component type"),
    });
  };

  return {
    state: { code, name, description, properties, isPending: createComponentType.isPending },
    handlers: { setCode, setName, setDescription, addProperty, removeProperty, updateProperty, handleSave },
  };
}
