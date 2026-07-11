import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { type Warehouse } from "@/lib/mock/data";
import { useWarehouse, useUpdateWarehouse } from "@/lib/queries";

export const Route = createFileRoute("/_app/warehouses/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Warehouse — CZAR Production" }] }),
  component: WarehouseEditPage,
});

function WarehouseEditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: warehouse, isLoading } = useWarehouse(id);
  const updateWarehouse = useUpdateWarehouse();

  const [form, setForm] = useState<Warehouse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (warehouse) setForm({ ...warehouse });
  }, [warehouse]);

  if (isLoading || !form) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>;

  function set<K extends keyof Warehouse>(k: K, v: Warehouse[K]) {
    setForm((f) => f ? { ...f, [k]: v } : f);
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    updateWarehouse.mutate(form, {
      onSuccess: () => {
        toast.success("Warehouse updated");
        navigate({ to: "/warehouses" });
      },
    });
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Warehouses", to: "/warehouses" },
          { label: `Edit ${form.code}` },
        ]}
        title={`Edit ${form.name}`}
        description="Update warehouse details."
      />
      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/warehouses"><ArrowLeft className="mr-2 h-4 w-4" />Back to warehouses</Link>
        </Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Code" error={errors.code}><Input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className="font-mono" /></Field>
              <Field label="Name" error={errors.name}><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            </div>
            <Field label="Description"><Textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
              <Field label="Email" error={errors.email}><Input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" /></Field>
            </div>
            <Field label="Address"><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="City" error={errors.city}><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
              <Field label="State"><Input value={form.state} onChange={(e) => set("state", e.target.value)} /></Field>
              <Field label="Postal code"><Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} className="font-mono" /></Field>
            </div>
            <Field label="Country"><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
            <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
              <div><p className="text-sm font-medium">Active Status</p><p className="text-xs text-muted-foreground">Inactive warehouses are hidden from new stock entries.</p></div>
              <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild><Link to="/warehouses">Cancel</Link></Button>
            <Button onClick={submit}>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
