import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductModelEditLogic } from "@/hooks/features/bom/useProductModelEditLogic";

export const Route = createFileRoute("/_app/product-models/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Model — CZAR Production" }] }),
  component: ModelEditPage,
});

function ModelEditPage() {
  const { id } = Route.useParams();
  const { state, handlers } = useProductModelEditLogic(id);
  const { form, errors, isLoading, isPending } = state;
  const { set, submit } = handlers;

  if (isLoading || !form) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Product Models", to: "/product-models" }, { label: `Edit ${form.modelCode}` }]} title={`Edit ${form.modelTitle}`} description="Update dispenser model details." />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/product-models"><ArrowLeft className="mr-2 h-4 w-4" />Back to models</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Model Code" error={errors.modelCode}><Input value={form.modelCode} onChange={(e) => set("modelCode", e.target.value.toUpperCase())} className="font-mono" /></Field>
              <Field label="Model Title" error={errors.modelTitle}><Input value={form.modelTitle} onChange={(e) => set("modelTitle", e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="DU Type"><Input value={form.duType} onChange={(e) => set("duType", e.target.value)} /></Field>
              <Field label="Active Units"><Input type="number" value={form.activeUnits} onChange={(e) => set("activeUnits", Number(e.target.value))} /></Field>
            </div>
            <Field label="Description"><Input value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild><Link to="/product-models">Cancel</Link></Button>
            <Button onClick={submit} disabled={isPending}>{isPending ? "Saving..." : "Save changes"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>);
}
