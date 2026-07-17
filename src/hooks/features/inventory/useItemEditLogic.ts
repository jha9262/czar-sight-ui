import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type ItemTemplate } from "@/lib/mock/data2";
import { useItem, useUpdateItem } from "@/lib/queries";

export function useItemEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: item, isLoading } = useItem(id);
  const updateItem = useUpdateItem();
  const [form, setForm] = useState<ItemTemplate | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) setForm({ ...item });
  }, [item]);

  function set<K extends keyof ItemTemplate>(k: K, v: ItemTemplate[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.companyPartCode.trim()) e.companyPartCode = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    updateItem.mutate(form, {
      onSuccess: () => {
        toast.success("Item template updated");
        navigate({ to: "/inventory/items" });
      },
    });
  }

  return {
    state: { form, errors, isLoading },
    handlers: { set, submit },
  };
}
