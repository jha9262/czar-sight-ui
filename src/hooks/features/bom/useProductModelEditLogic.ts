import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type DispenserModel } from "@/lib/mock/data2";
import { useDispenserModel, useUpdateDispenserModel } from "@/lib/queries";

export function useProductModelEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: model, isLoading } = useDispenserModel(id);
  const updateModel = useUpdateDispenserModel();

  const [form, setForm] = useState<DispenserModel | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (model) setForm({ ...model });
  }, [model]);

  function set<K extends keyof DispenserModel>(k: K, v: DispenserModel[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.modelCode.trim()) e.modelCode = "Required";
    if (!form.modelTitle.trim()) e.modelTitle = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    
    updateModel.mutate(form, {
      onSuccess: () => {
        toast.success("Model updated");
        navigate({ to: "/product-models" });
      },
    });
  }

  return {
    state: { form, errors, isLoading, isPending: updateModel.isPending },
    handlers: { set, submit },
  };
}
