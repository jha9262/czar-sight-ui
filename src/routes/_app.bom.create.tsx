import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dispenserModels } from "@/lib/mock/data2";
import { useBomCreateLogic } from "@/hooks/features/bom/useBomCreateLogic";

export const Route = createFileRoute("/_app/bom/create")({ head: () => ({ meta: [{ title: "New BOM — CZAR Production" }] }), component: BomCreatePage });

function BomCreatePage() {
  const { state, handlers } = useBomCreateLogic();
  const { form, errors } = state;
  const { set, submit } = handlers;

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Bill of Materials", to: "/bom" }, { label: "New" }]} title="New BOM" description="Create a new Bill of Materials version." />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground"><Link to="/bom"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
        <div className="rounded-xl border bg-card p-6 shadow-sm"><div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="BOM Instance Name" error={errors.name}><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. V3 Standard Release" /></Field>
            <Field label="Dispenser Model" error={errors.duModel}>
              <Select value={form.duModel} onValueChange={(v) => set("duModel", v)}>
                <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                <SelectContent>
                  {dispenserModels.map(m => <SelectItem key={m.id} value={m.modelCode}>{m.modelCode} - {m.modelTitle}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Version" error={errors.version}><Input value={form.version} onChange={(e) => set("version", e.target.value)} placeholder="v1.0" className="font-mono" /></Field>
            <Field label="BOM Template">
              <Select defaultValue="bt1">
                <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bt1">Standard Electronics BOM</SelectItem>
                  <SelectItem value="bt2">Standard Mechanical BOM</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4"><div><p className="text-sm font-medium">Active</p><p className="text-xs text-muted-foreground">Inactive BOMs are kept as drafts.</p></div><Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} /></div>
        </div><div className="mt-8 flex justify-end gap-3 border-t pt-6"><Button variant="outline" asChild><Link to="/bom">Cancel</Link></Button><Button onClick={submit}>Create BOM</Button></div></div>
      </div>
    </div>
  );
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return (<div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>); }
