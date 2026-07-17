import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCompanyEditLogic } from "@/hooks/features/sourcing/useCompanyEditLogic";

export const Route = createFileRoute("/_app/companies/edit/$id")({ head: () => ({ meta: [{ title: "Edit Company — CZAR Production" }] }), component: CompanyEditPage });

function CompanyEditPage() {
  const { id } = Route.useParams();
  const { state, handlers } = useCompanyEditLogic(id);
  const { form, errors, isLoading, isPending } = state;
  const { set, submit } = handlers;

  if (isLoading || !form) return <div className="flex items-center justify-center p-12 text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Companies", to: "/companies" }, { label: "Edit" }]} title="Edit Company" description="Update client or partner details." />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/companies"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm"><div className="space-y-6">
          <div className="grid grid-cols-2 gap-4"><Field label="Code" error={errors.code}><Input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className="font-mono" /></Field><Field label="Company Name" error={errors.title}><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></Field></div>
          <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4"><div><p className="text-sm font-medium">Active</p><p className="text-xs text-muted-foreground">Inactive companies won't appear in order forms.</p></div><Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} /></div>
        </div><div className="mt-8 flex justify-end gap-3 border-t pt-6"><Button variant="outline" asChild><Link to="/companies">Cancel</Link></Button><Button onClick={submit} disabled={isPending}>{isPending ? "Saving..." : "Save changes"}</Button></div></div>
      </div>
    </div>
  );
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return (<div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>); }
