import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type UserRow } from "@/lib/mock/data2";
import { useCreateUser } from "@/lib/queries";

export const Route = createFileRoute("/_app/users/create")({
  head: () => ({
    meta: [{ title: "New User — CZAR Production" }],
  }),
  component: UserCreatePage,
});

function UserCreatePage() {
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

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Settings" },
          { label: "Users", to: "/users" },
          { label: "New User" },
        ]}
        title="New User"
        description="Add a new operator, manager, or admin."
      />

      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to users
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" />
              </Field>
              <Field label="Email Address" error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jane@example.com"
                />
              </Field>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role">
                <Select value={form.role} onValueChange={(v: any) => set("role", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operator">Operator</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Active Account</p>
                  <p className="text-xs text-muted-foreground">User can log into the system.</p>
                </div>
                <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Require MFA</p>
                  <p className="text-xs text-muted-foreground">Force two-factor authentication.</p>
                </div>
                <Switch checked={form.mfaEnabled} onCheckedChange={(v) => set("mfaEnabled", v)} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/users">Cancel</Link>
            </Button>
            <Button onClick={submit}>Create User</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
