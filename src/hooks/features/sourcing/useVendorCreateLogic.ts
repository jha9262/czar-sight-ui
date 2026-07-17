import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Vendor } from "@/lib/mock/data3";
import { useCreateVendor } from "@/lib/queries";

export function useVendorCreateLogic() {
  const navigate = useNavigate();
  const createVendor = useCreateVendor();
  const [form, setForm] = useState<Vendor>({ code: "", name: "", contact: "", email: "", phone: "", address: "", status: "ACTIVE" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof Vendor>(k: K, v: Vendor[K]) { 
    setForm((f) => ({ ...f, [k]: v })); 
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    
    createVendor.mutate(form, { 
      onSuccess: () => { 
        toast.success("Vendor created"); 
        navigate({ to: "/sourcing/vendors" }); 
      } 
    });
  }

  return {
    state: { form, errors, isPending: createVendor.isPending },
    handlers: { set, submit },
  };
}
