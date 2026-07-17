import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type ItemTemplate } from "@/lib/mock/data2";
import { useCreateItem } from "@/lib/queries";

export function useItemCreateLogic() {
  const navigate = useNavigate();
  const createItem = useCreateItem();

  const [form, setForm] = useState<ItemTemplate>({
    id: crypto.randomUUID(),
    name: "",
    companyPartCode: "",
    isSerialized: false,
    attributes: {},
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof ItemTemplate>(k: K, v: ItemTemplate[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.companyPartCode.trim()) e.companyPartCode = "Company Part Code is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createItem.mutate(form, {
      onSuccess: () => {
        toast.success("Item template created");
        navigate({ to: "/inventory/items" });
      },
    });
  }

  return {
    state: { form, errors },
    handlers: { set, submit },
  };
}
