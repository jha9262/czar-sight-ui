import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useBlueprint, useUpdateBlueprint, useDispenserModels } from "@/lib/queries";

export function useBlueprintEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: blueprint } = useBlueprint(id);
  const updateBlueprint = useUpdateBlueprint();
  const { data: models = [] } = useDispenserModels();

  const [name, setName] = useState("");
  const [productModelId, setProductModelId] = useState("");
  const [activeRevision, setActiveRevision] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (blueprint) {
      setName(blueprint.name);
      setProductModelId(blueprint.productModelId);
      setActiveRevision(blueprint.activeRevision);
      setStatus(blueprint.status);
    }
  }, [blueprint]);

  const handleSave = () => {
    if (!blueprint || !name || !productModelId || !activeRevision) {
      toast.error("Please fill in all required fields.");
      return;
    }

    updateBlueprint.mutate(
      { ...blueprint, name, productModelId, activeRevision, status },
      {
        onSuccess: () => {
          toast.success("Blueprint updated");
          navigate({ to: "/product-models" });
        },
        onError: () => toast.error("Failed to update blueprint"),
      }
    );
  };

  return {
    state: { blueprint, models, name, productModelId, activeRevision, status, isPending: updateBlueprint.isPending },
    handlers: { setName, setProductModelId, setActiveRevision, setStatus, handleSave },
  };
}
