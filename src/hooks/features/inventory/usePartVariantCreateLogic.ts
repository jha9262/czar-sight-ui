import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { usePart, usePartVersions, useCreatePartVariant } from "@/lib/queries";
import type { PartVariant } from "@/lib/mock/data2";

export function usePartVariantCreateLogic(id: string) {
  const navigate = useNavigate();
  const { data: part } = usePart(id);
  const { data: versions = [] } = usePartVersions();
  const createVariant = useCreatePartVariant();

  const partVersions = versions.filter((v) => v.partMasterId === id);

  const [partVersionId, setPartVersionId] = useState("");
  const [variantName, setVariantName] = useState("");
  const [specifications, setSpecifications] = useState("");

  const handleSave = () => {
    if (!partVersionId || !variantName) {
      toast.error("Version and Variant Name are required.");
      return;
    }

    const payload: PartVariant = {
      id: "pva" + Date.now(),
      partVersionId,
      variantName,
      specifications,
    };

    createVariant.mutate(payload, {
      onSuccess: () => {
        toast.success("Variant created successfully");
        navigate({ to: `/inventory/parts/${id}` });
      },
      onError: () => toast.error("Failed to create variant"),
    });
  };

  return {
    state: { part, partVersions, partVersionId, variantName, specifications },
    handlers: { setPartVersionId, setVariantName, setSpecifications, handleSave },
  };
}
