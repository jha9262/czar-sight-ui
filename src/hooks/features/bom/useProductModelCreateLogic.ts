import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCreateDispenserModel } from "@/lib/queries";

export function useProductModelCreateLogic() {
  const navigate = useNavigate();
  const createModel = useCreateDispenserModel();

  const [form, setForm] = useState<any>({
    id: crypto.randomUUID(),
    code: "",
    name: "",
    description: "",
    category: "Standard",
    msrp: 0,
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(k: string, v: any) {
    setForm((f: any) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createModel.mutate(form, {
      onSuccess: () => {
        toast.success("Product model created");
        navigate({ to: "/product-models" });
      },
    });
  }

  return {
    state: { form, errors, isPending: createModel.isPending },
    handlers: { set, submit },
  };
}
