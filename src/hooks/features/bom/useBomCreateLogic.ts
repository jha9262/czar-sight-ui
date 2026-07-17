import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { boms } from "@/lib/mock/data2";

export function useBomCreateLogic() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", duModel: "", version: "", isActive: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.duModel) e.duModel = "Required";
    if (!form.version.trim()) e.version = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    
    const newBom = {
      id: crypto.randomUUID(),
      name: form.name,
      duModel: form.duModel,
      version: form.version,
      itemsCount: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
      isActive: form.isActive,
    };
    boms.unshift(newBom);
    
    toast.success("BOM created");
    navigate({ to: "/bom" });
  }

  return {
    state: { form, errors },
    handlers: { set, submit },
  };
}
