import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Manufacturer } from "@/lib/mock/data3";
import { useManufacturer, useUpdateManufacturer } from "@/lib/queries";

export function useManufacturerEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: manufacturer, isLoading } = useManufacturer(id);
  const update = useUpdateManufacturer();

  const [form, setForm] = useState<Manufacturer | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (manufacturer) setForm(manufacturer);
  }, [manufacturer]);

  function set<K extends keyof Manufacturer>(k: K, v: Manufacturer[K]) { 
    setForm((f) => (f ? { ...f, [k]: v } : null)); 
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Required"; 
    if (!form.name.trim()) e.name = "Required"; 
    if (!form.email.trim()) e.email = "Required";
    setErrors(e); 
    if (Object.keys(e).length) return;
    
    update.mutate(form, { 
      onSuccess: () => { 
        toast.success("Manufacturer updated"); 
        navigate({ to: "/sourcing/manufacturers" }); 
      } 
    });
  }

  return {
    state: { manufacturer, form, errors, isLoading, isPending: update.isPending },
    handlers: { set, submit },
  };
}
