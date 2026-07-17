import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Sourcing } from "@/lib/mock/data2";
import { useSourcing, useUpdateSourcing } from "@/lib/queries";

export function useSourcingEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: sourcing, isLoading } = useSourcing(id);
  const updateSourcing = useUpdateSourcing();
  const [form, setForm] = useState<Sourcing | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sourcing) setForm({ ...sourcing });
  }, [sourcing]);

  function set<K extends keyof Sourcing>(k: K, v: Sourcing[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.manufacturer.trim()) e.manufacturer = "Required";
    if (!form.mpn.trim()) e.mpn = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    updateSourcing.mutate(form, {
      onSuccess: () => {
        toast.success("Sourcing link updated");
        navigate({ to: "/inventory/sourcing" });
      },
    });
  }

  return {
    state: { form, errors, isLoading },
    handlers: { set, submit },
  };
}
