import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type UserRow } from "@/lib/mock/data2";
import { useUser, useUpdateUser } from "@/lib/queries";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/users/edit/$id")({
  head: () => ({ meta: [{ title: "Edit User — CZAR Production" }] }),
  component: UserEditPage,
});

function UserEditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id);
  const updateUser = useUpdateUser();
  const [form, setForm] = useState<UserRow | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (user) setForm({ ...user }); }, [user]);
  if (isLoading || !form) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>;

  function set<K extends keyof UserRow>(k: K, v: UserRow[K]) { setForm((f) => f ? { ...f, [k]: v } : f); }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    updateUser.mutate(form, { onSuccess: () => { toast.success("User updated"); navigate({ to: "/users" }); } });
  }

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Users", to: "/users" }, { label: `Edit ${form.name}` }]} title={`Edit ${form.name}`} description="Update user account details." />
      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/users"><ArrowLeft className="mr-2 h-4 w-4" />Back to users</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" error={errors.name}><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Email" error={errors.email}><Input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" /></Field>
            </div>
            <Field label="Role">
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.role} onChange={(e) => set("role", e.target.value as UserRow["role"])}>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Operator">Operator</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div><p className="text-sm font-medium">Active</p><p className="text-xs text-muted-foreground">Deactivated users cannot login.</p></div>
                <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div><p className="text-sm font-medium">MFA Enabled</p><p className="text-xs text-muted-foreground">Two-factor authentication.</p></div>
                <Switch checked={form.mfaEnabled} onCheckedChange={(v) => set("mfaEnabled", v)} />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild><Link to="/users">Cancel</Link></Button>
            <Button onClick={submit}>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>);
}
