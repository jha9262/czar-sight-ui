import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type FileRecord } from "@/lib/mock/data3";
import { useCreateFile } from "@/lib/queries";

export function useFileUploadLogic() {
  const navigate = useNavigate();
  const create = useCreateFile();
  const [form, setForm] = useState<FileRecord>({
    uuid: `F-${crypto.randomUUID().slice(0, 8)}`,
    filename: "",
    type: "application/pdf",
    size: "0 KB",
    visibility: "PUBLIC",
    date: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof FileRecord>(k: K, v: FileRecord[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.filename.trim()) e.filename = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    create.mutate(form, {
      onSuccess: () => {
        toast.success("File uploaded");
        navigate({ to: "/files" });
      },
    });
  }

  return {
    state: { form, errors, isPending: create.isPending },
    handlers: { set, submit },
  };
}
