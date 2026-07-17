import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Sourcing, itemTemplates } from "@/lib/mock/data2";
import { useCreateSourcing } from "@/lib/queries";

export const manufacturers = ["Delta EMS", "Foxpoint", "Kamoer", "SealTech", "Bossard", "Molex"];

export function useSourcingCreateLogic() {
  const navigate = useNavigate();
  const createSourcing = useCreateSourcing();

  const [form, setForm] = useState<Sourcing>({
    id: crypto.randomUUID(),
    templateCode: "",
    templateName: "",
    manufacturer: "",
    mpn: "",
    leadTimeDays: 0,
    preferred: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof Sourcing>(k: K, v: Sourcing[K]) {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "templateCode") {
        const t = itemTemplates.find((x) => x.companyPartCode === v);
        if (t) next.templateName = t.name;
      }
      return next;
    });
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.templateCode.trim()) e.templateCode = "Template is required";
    if (!form.manufacturer.trim()) e.manufacturer = "Manufacturer is required";
    if (!form.mpn.trim()) e.mpn = "MPN is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createSourcing.mutate(form, {
      onSuccess: () => {
        toast.success("Manufacturer linked to template");
        navigate({ to: "/inventory/sourcing" });
      },
    });
  }

  return {
    state: { form, errors, itemTemplates, manufacturers },
    handlers: { set, submit },
  };
}
