import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type UserRow } from "@/lib/mock/data2";
import { useUser, useUpdateUser } from "@/lib/queries";

export function useUserEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id);
  const updateUser = useUpdateUser();
  const [form, setForm] = useState<UserRow | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) setForm({ ...user });
  }, [user]);

  function set<K extends keyof UserRow>(k: K, v: UserRow[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    updateUser.mutate(form, {
      onSuccess: () => {
        toast.success("User updated");
        navigate({ to: "/users" });
      },
    });
  }

  return {
    state: { form, errors, isLoading, isPending: updateUser.isPending },
    handlers: { set, submit },
  };
}
