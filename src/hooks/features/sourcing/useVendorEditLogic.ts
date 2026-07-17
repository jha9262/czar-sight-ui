import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Vendor } from "@/lib/mock/data3";
import { useVendor, useUpdateVendor } from "@/lib/queries";

export function useVendorEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: vendor, isLoading } = useVendor(id);
  const updateVendor = useUpdateVendor();

  const [form, setForm] = useState<Vendor | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vendor) setForm({ ...vendor });
  }, [vendor]);

  function set<K extends keyof Vendor>(k: K, v: Vendor[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    updateVendor.mutate(form, {
      onSuccess: () => {
        toast.success("Vendor updated");
        navigate({ to: "/sourcing/vendors" });
      },
    });
  }

  return {
    state: { vendor, form, errors, isLoading, isPending: updateVendor.isPending },
    handlers: { set, submit },
  };
}
