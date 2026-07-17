import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { usePart, useCreatePartVersion } from "@/lib/queries";
import type { PartVersion } from "@/lib/mock/data2";

export function usePartVersionCreateLogic(id: string) {
  const navigate = useNavigate();
  const { data: part } = usePart(id);
  const createVersion = useCreatePartVersion();

  const [versionLabel, setVersionLabel] = useState("");
  const [changelog, setChangelog] = useState("");

  const handleSave = () => {
    if (!versionLabel) {
      toast.error("Version label is required.");
      return;
    }

    const payload: PartVersion = {
      id: "pv" + Date.now(),
      partMasterId: id,
      versionLabel,
      changelog,
    };

    createVersion.mutate(payload, {
      onSuccess: () => {
        toast.success("Version created successfully");
        navigate({ to: `/inventory/parts/${id}` });
      },
      onError: () => toast.error("Failed to create version"),
    });
  };

  return {
    state: { part, versionLabel, changelog },
    handlers: { setVersionLabel, setChangelog, handleSave },
  };
}
