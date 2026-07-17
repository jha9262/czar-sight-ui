import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePartEditLogic } from "@/hooks/features/inventory/usePartEditLogic";

export const Route = createFileRoute("/_app/inventory/parts/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Part — CZAR Production" }] }),
  component: PartEditPage,
});

function PartEditPage() {
  const { id } = Route.useParams();
  const { state, handlers } = usePartEditLogic(id);
  const { form, errors, isLoading, partTypes } = state;
  const { set, submit } = handlers;

  if (isLoading || !form) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Parts", to: "/inventory/parts" }, { label: `Edit ${form.partNumber}` }]} title={`Edit ${form.name}`} description="Update part master details." />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/inventory/parts"><ArrowLeft className="mr-2 h-4 w-4" />Back to parts</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Part Number" error={errors.partNumber}><Input value={form.partNumber} onChange={(e) => set("partNumber", e.target.value.toUpperCase())} className="font-mono" /></Field>
              <Field label="Part Type" error={errors.partType}>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.partType} onChange={(e) => set("partType", e.target.value)}>
                  <option value="" disabled>Select type</option>
                  {partTypes.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Name" error={errors.name}><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Description"><Input value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>

          </div>
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild><Link to="/inventory/parts">Cancel</Link></Button>
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
