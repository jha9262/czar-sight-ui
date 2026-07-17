import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type PartMaster, partTypes } from "@/lib/mock/data2";
import { usePart, useUpdatePart } from "@/lib/queries";

export function usePartEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: part, isLoading } = usePart(id);
  const updatePart = useUpdatePart();
  const [form, setForm] = useState<PartMaster | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (part) setForm({ ...part });
  }, [part]);

  function set<K extends keyof PartMaster>(k: K, v: PartMaster[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.partNumber.trim()) e.partNumber = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.partType) e.partType = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    updatePart.mutate(form, {
      onSuccess: () => {
        toast.success("Part updated");
        navigate({ to: "/inventory/parts" });
      },
    });
  }

  return {
    state: { form, errors, isLoading, partTypes },
    handlers: { set, submit },
  };
}
