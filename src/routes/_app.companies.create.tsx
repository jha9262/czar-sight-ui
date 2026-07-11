import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type CompanyFull } from "@/lib/mock/data3";
import { useCreateCompany } from "@/lib/queries";

export const Route = createFileRoute("/_app/companies/create")({ head: () => ({ meta: [{ title: "New Company — CZAR Production" }] }), component: CompanyCreatePage });

function CompanyCreatePage() {
  const navigate = useNavigate();
  const create = useCreateCompany();
  const [form, setForm] = useState<CompanyFull>({ id: crypto.randomUUID(), code: "", title: "", phone: "", isActive: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set<K extends keyof CompanyFull>(k: K, v: CompanyFull[K]) { setForm((f) => ({ ...f, [k]: v })); }
  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Required"; if (!form.title.trim()) e.title = "Required";
    setErrors(e); if (Object.keys(e).length) return;
    create.mutate(form, { onSuccess: () => { toast.success("Company created"); navigate({ to: "/companies" }); } });
  }
  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Companies", to: "/companies" }, { label: "New" }]} title="New Company" description="Add a new client or partner company." />
      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/companies"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm"><div className="space-y-6">
          <div className="grid grid-cols-2 gap-4"><Field label="Code" error={errors.code}><Input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className="font-mono" /></Field><Field label="Company Name" error={errors.title}><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></Field></div>
          <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4"><div><p className="text-sm font-medium">Active</p><p className="text-xs text-muted-foreground">Inactive companies won't appear in order forms.</p></div><Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} /></div>
        </div><div className="mt-8 flex justify-end gap-3 border-t pt-6"><Button variant="outline" asChild><Link to="/companies">Cancel</Link></Button><Button onClick={submit}>Create company</Button></div></div>
      </div>
    </div>
  );
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return (<div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>); }
