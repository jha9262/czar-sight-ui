import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Vendor } from "@/lib/mock/data3";
import { useCreateVendor } from "@/lib/queries";

export const Route = createFileRoute("/_app/sourcing/vendors/create")({
  head: () => ({ meta: [{ title: "New Vendor — CZAR Production" }] }),
  component: VendorCreatePage,
});

function VendorCreatePage() {
  const navigate = useNavigate();
  const createVendor = useCreateVendor();
  const [form, setForm] = useState<Vendor>({ code: "", name: "", contact: "", email: "", phone: "", address: "", status: "ACTIVE" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof Vendor>(k: K, v: Vendor[K]) { setForm((f) => ({ ...f, [k]: v })); }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    createVendor.mutate(form, { onSuccess: () => { toast.success("Vendor created"); navigate({ to: "/sourcing/vendors" }); } });
  }

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Vendors", to: "/sourcing/vendors" }, { label: "New Vendor" }]} title="New Vendor" description="Add a new supply chain vendor." />
      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/sourcing/vendors"><ArrowLeft className="mr-2 h-4 w-4" />Back to vendors</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Code" error={errors.code}><Input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className="font-mono" placeholder="V-XX" /></Field>
              <Field label="Company Name" error={errors.name}><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact Person"><Input value={form.contact} onChange={(e) => set("contact", e.target.value)} /></Field>
              <Field label="Email" error={errors.email}><Input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
              <Field label="Status">
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.status} onChange={(e) => set("status", e.target.value as Vendor["status"])}>
                  <option value="ACTIVE">Active</option><option value="OFFLINE">Offline</option>
                </select>
              </Field>
            </div>
            <Field label="Address"><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild><Link to="/sourcing/vendors">Cancel</Link></Button>
            <Button onClick={submit}>Create vendor</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>);
}
