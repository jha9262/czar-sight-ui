import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useItemEditLogic } from "@/hooks/features/inventory/useItemEditLogic";

export const Route = createFileRoute("/_app/inventory/items/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Item Template — CZAR Production" }] }),
  component: ItemEditPage,
});

function ItemEditPage() {
  const { id } = Route.useParams();
  const { state, handlers } = useItemEditLogic(id);
  const { form, errors, isLoading } = state;
  const { set, submit } = handlers;

  if (isLoading || !form) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Item Templates", to: "/inventory/items" }, { label: `Edit ${form.companyPartCode}` }]} title={`Edit ${form.name}`} description="Update item template details." />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/inventory/items"><ArrowLeft className="mr-2 h-4 w-4" />Back to items</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" error={errors.name}><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Company Part Code" error={errors.companyPartCode}><Input value={form.companyPartCode} onChange={(e) => set("companyPartCode", e.target.value.toUpperCase())} className="font-mono" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">

              <div className="flex items-center gap-3 pt-5">
                <Switch checked={form.isSerialized} onCheckedChange={(v) => set("isSerialized", v)} />
                <Label className="text-sm">Serialized</Label>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
              <div><p className="text-sm font-medium">Active</p><p className="text-xs text-muted-foreground">Inactive templates won't appear in stock entry forms.</p></div>
              <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild><Link to="/inventory/items">Cancel</Link></Button>
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
