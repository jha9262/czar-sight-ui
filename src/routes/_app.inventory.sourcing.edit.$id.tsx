import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSourcingEditLogic } from "@/hooks/features/inventory/useSourcingEditLogic";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/inventory/sourcing/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Sourcing — CZAR Production" }] }),
  component: SourcingEditPage,
});

function SourcingEditPage() {
  const { id } = Route.useParams();
  const { state, handlers } = useSourcingEditLogic(id);
  const { form, errors, isLoading } = state;
  const { set, submit } = handlers;

  if (isLoading || !form) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Sourcing", to: "/inventory/sourcing" }, { label: `Edit ${form.mpn}` }]} title={`Edit Sourcing — ${form.templateName}`} description="Update sourcing link details." />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/inventory/sourcing"><ArrowLeft className="mr-2 h-4 w-4" />Back to sourcing</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Template Code"><Input value={form.templateCode} disabled className="font-mono bg-muted" /></Field>
              <Field label="Template Name"><Input value={form.templateName} disabled className="bg-muted" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Manufacturer" error={errors.manufacturer}><Input value={form.manufacturer} onChange={(e) => set("manufacturer", e.target.value)} /></Field>
              <Field label="MPN" error={errors.mpn}><Input value={form.mpn} onChange={(e) => set("mpn", e.target.value.toUpperCase())} className="font-mono" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Lead Time (days)"><Input type="number" value={form.leadTimeDays} onChange={(e) => set("leadTimeDays", Number(e.target.value))} className="max-w-[120px]" /></Field>
              <div className="flex items-center gap-3 pt-5">
                <Switch checked={form.preferred} onCheckedChange={(v) => set("preferred", v)} />
                <Label className="text-sm">Preferred supplier</Label>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild><Link to="/inventory/sourcing">Cancel</Link></Button>
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
