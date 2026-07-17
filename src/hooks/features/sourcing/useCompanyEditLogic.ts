import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type CompanyFull } from "@/lib/mock/data3";
import { useCompany, useUpdateCompany } from "@/lib/queries";

export function useCompanyEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: company, isLoading } = useCompany(id);
  const updateCompany = useUpdateCompany();

  const [form, setForm] = useState<CompanyFull | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (company) setForm({ ...company });
  }, [company]);

  function set<K extends keyof CompanyFull>(k: K, v: CompanyFull[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Required";
    if (!form.title.trim()) e.title = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    updateCompany.mutate(form, {
      onSuccess: () => {
        toast.success("Company updated");
        navigate({ to: "/companies" });
      },
    });
  }

  return {
    state: { company, form, errors, isLoading, isPending: updateCompany.isPending },
    handlers: { set, submit },
  };
}
