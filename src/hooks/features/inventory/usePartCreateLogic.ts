import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { partTypes, type PartMaster } from "@/lib/mock/data2";
import { useCreatePart } from "@/lib/queries";

export function usePartCreateLogic() {
  const navigate = useNavigate();
  const createPart = useCreatePart();

  const [form, setForm] = useState<PartMaster>({
    id: crypto.randomUUID(),
    partNumber: "",
    partType: partTypes[0]?.name || "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof PartMaster>(k: K, v: PartMaster[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.partNumber.trim()) e.partNumber = "Part Number is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.partType.trim()) e.partType = "Part Type is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createPart.mutate(form, {
      onSuccess: () => {
        toast.success("Part created successfully");
        navigate({ to: "/inventory/parts" });
      },
    });
  }

  return {
    state: { form, errors, partTypes },
    handlers: { set, submit },
  };
}
