import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Warehouse } from "@/lib/mock/data";
import { useCreateWarehouse } from "@/lib/queries";

export function useWarehouseCreateLogic() {
  const navigate = useNavigate();
  const createWarehouse = useCreateWarehouse();

  const [form, setForm] = useState<Warehouse>({
    id: crypto.randomUUID(),
    code: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof Warehouse>(k: K, v: Warehouse[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createWarehouse.mutate(form, {
      onSuccess: () => {
        toast.success("Warehouse created");
        navigate({ to: "/warehouses" });
      },
    });
  }

  return {
    state: { form, errors, isPending: createWarehouse.isPending },
    handlers: { set, submit },
  };
}
