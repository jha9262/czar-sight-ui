import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVendorEditLogic } from "@/hooks/features/sourcing/useVendorEditLogic";

export const Route = createFileRoute("/_app/sourcing/vendors/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Vendor — CZAR Production" }] }),
  component: VendorEditPage,
});

function VendorEditPage() {
  const { id } = Route.useParams();
  const { state, handlers } = useVendorEditLogic(id);
  const { form, errors, isLoading, isPending } = state;
  const { set, submit } = handlers;

  if (isLoading || !form) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Vendors", to: "/sourcing/vendors" }, { label: `Edit ${form.code}` }]} title={`Edit ${form.name}`} description="Update vendor details." />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/sourcing/vendors"><ArrowLeft className="mr-2 h-4 w-4" />Back to vendors</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Code"><Input value={form.code} disabled className="font-mono bg-muted" /></Field>
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
