import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Warehouse } from "@/lib/mock/data";
import { useWarehouse, useUpdateWarehouse } from "@/lib/queries";

export function useWarehouseEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: warehouse, isLoading } = useWarehouse(id);
  const updateWarehouse = useUpdateWarehouse();

  const [form, setForm] = useState<Warehouse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (warehouse) setForm({ ...warehouse });
  }, [warehouse]);

  function set<K extends keyof Warehouse>(k: K, v: Warehouse[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    updateWarehouse.mutate(form, {
      onSuccess: () => {
        toast.success("Warehouse updated");
        navigate({ to: "/warehouses" });
      },
    });
  }

  return {
    state: { form, errors, isLoading, isPending: updateWarehouse.isPending },
    handlers: { set, submit },
  };
}
