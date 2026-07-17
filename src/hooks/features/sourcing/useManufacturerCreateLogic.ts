import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Manufacturer } from "@/lib/mock/data3";
import { useCreateManufacturer } from "@/lib/queries";

export function useManufacturerCreateLogic() {
  const navigate = useNavigate();
  const create = useCreateManufacturer();
  const [form, setForm] = useState<Manufacturer>({ code: "", name: "", contact: "", email: "", phone: "", address: "", status: "ACTIVE" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof Manufacturer>(k: K, v: Manufacturer[K]) { 
    setForm((f) => ({ ...f, [k]: v })); 
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Required"; 
    if (!form.name.trim()) e.name = "Required"; 
    if (!form.email.trim()) e.email = "Required";
    setErrors(e); 
    if (Object.keys(e).length) return;
    
    create.mutate(form, { 
      onSuccess: () => { 
        toast.success("Manufacturer created"); 
        navigate({ to: "/sourcing/manufacturers" }); 
      } 
    });
  }

  return {
    state: { form, errors, isPending: create.isPending },
    handlers: { set, submit },
  };
}
