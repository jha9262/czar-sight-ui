import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { type UserRow } from "@/lib/mock/data2";
import { useCreateUser } from "@/lib/queries";

export function useUserCreateLogic() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const [form, setForm] = useState<UserRow>({
    id: crypto.randomUUID(),
    name: "",
    email: "",
    role: "Operator",
    isActive: true,
    mfaEnabled: false,
    lastActive: "just now",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof UserRow>(k: K, v: UserRow[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    if (Object.keys(e).length) return;

    createUser.mutate(form, {
      onSuccess: () => {
        toast.success("User created successfully");
        navigate({ to: "/users" });
      },
    });
  }

  return {
    state: { form, errors, isPending: createUser.isPending },
    handlers: { set, submit },
  };
}
