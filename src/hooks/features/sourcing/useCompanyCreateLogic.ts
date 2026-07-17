import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type CompanyFull } from "@/lib/mock/data3";
import { useCreateCompany } from "@/lib/queries";

export function useCompanyCreateLogic() {
  const navigate = useNavigate();
  const create = useCreateCompany();
  const [form, setForm] = useState<CompanyFull>({ id: crypto.randomUUID(), code: "", title: "", phone: "", isActive: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof CompanyFull>(k: K, v: CompanyFull[K]) { 
    setForm((f) => ({ ...f, [k]: v })); 
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Required"; 
    if (!form.title.trim()) e.title = "Required";
    setErrors(e); 
    if (Object.keys(e).length) return;
    
    create.mutate(form, { 
      onSuccess: () => { 
        toast.success("Company created"); 
        navigate({ to: "/companies" }); 
      } 
    });
  }

  return {
    state: { form, errors, isPending: create.isPending },
    handlers: { set, submit },
  };
}
