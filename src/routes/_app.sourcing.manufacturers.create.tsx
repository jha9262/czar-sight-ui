import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Manufacturer } from "@/lib/mock/data3";
import { useCreateManufacturer } from "@/lib/queries";

export const Route = createFileRoute("/_app/sourcing/manufacturers/create")({ head: () => ({ meta: [{ title: "New Manufacturer — CZAR Production" }] }), component: MfrCreatePage });

function MfrCreatePage() {
  const navigate = useNavigate();
  const create = useCreateManufacturer();
  const [form, setForm] = useState<Manufacturer>({ code: "", name: "", contact: "", email: "", phone: "", address: "", status: "ACTIVE" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set<K extends keyof Manufacturer>(k: K, v: Manufacturer[K]) { setForm((f) => ({ ...f, [k]: v })); }
  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Required"; if (!form.name.trim()) e.name = "Required"; if (!form.email.trim()) e.email = "Required";
    setErrors(e); if (Object.keys(e).length) return;
    create.mutate(form, { onSuccess: () => { toast.success("Manufacturer created"); navigate({ to: "/sourcing/manufacturers" }); } });
  }
  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Manufacturers", to: "/sourcing/manufacturers" }, { label: "New" }]} title="New Manufacturer" description="Add a component manufacturer." />
      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/sourcing/manufacturers"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm"><div className="space-y-6">
          <div className="grid grid-cols-2 gap-4"><Field label="Code" error={errors.code}><Input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className="font-mono" placeholder="M-XX" /></Field><Field label="Name" error={errors.name}><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field></div>
          <div className="grid grid-cols-2 gap-4"><Field label="Contact"><Input value={form.contact} onChange={(e) => set("contact", e.target.value)} /></Field><Field label="Email" error={errors.email}><Input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" /></Field></div>
          <div className="grid grid-cols-2 gap-4"><Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field><Field label="Status"><select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.status} onChange={(e) => set("status", e.target.value as Manufacturer["status"])}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></Field></div>
          <Field label="Address"><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
        </div><div className="mt-8 flex justify-end gap-3 border-t pt-6"><Button variant="outline" asChild><Link to="/sourcing/manufacturers">Cancel</Link></Button><Button onClick={submit}>Create manufacturer</Button></div></div>
      </div>
    </div>
  );
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return (<div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>); }
