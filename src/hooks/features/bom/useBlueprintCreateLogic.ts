import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCreateBlueprint, useDispenserModels } from "@/lib/queries";
import type { Blueprint } from "@/lib/mock/data2";

export function useBlueprintCreateLogic() {
  const navigate = useNavigate();
  const createBlueprint = useCreateBlueprint();
  const { data: models = [] } = useDispenserModels();

  const [name, setName] = useState("");
  const [productModelId, setProductModelId] = useState("");
  const [activeRevision, setActiveRevision] = useState("v1.0");
  const [status, setStatus] = useState("Draft");

  const handleSave = () => {
    if (!name || !productModelId || !activeRevision) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload: Blueprint = {
      id: "bp" + Date.now(),
      name,
      productModelId,
      activeRevision,
      status,
    };

    createBlueprint.mutate(payload, {
      onSuccess: () => {
        toast.success("Blueprint created successfully");
        navigate({ to: "/product-models" });
      },
      onError: () => toast.error("Failed to create blueprint"),
    });
  };

  return {
    state: { models, name, productModelId, activeRevision, status, isPending: createBlueprint.isPending },
    handlers: { setName, setProductModelId, setActiveRevision, setStatus, handleSave },
  };
}
