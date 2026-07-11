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
import { type Sourcing, itemTemplates } from "@/lib/mock/data2";
import { useCreateSourcing } from "@/lib/queries";

export const Route = createFileRoute("/_app/inventory/sourcing/create")({
  head: () => ({
    meta: [{ title: "New Sourcing Link — CZAR Production" }],
  }),
  component: SourcingCreatePage,
});

const manufacturers = ["Delta EMS", "Foxpoint", "Kamoer", "SealTech", "Bossard", "Molex"];

function SourcingCreatePage() {
  const navigate = useNavigate();
  const createSourcing = useCreateSourcing();

  const [form, setForm] = useState<Sourcing>({
    id: crypto.randomUUID(),
    templateCode: "",
    templateName: "",
    manufacturer: "",
    mpn: "",
    leadTimeDays: 0,
    preferred: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof Sourcing>(k: K, v: Sourcing[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.templateCode.trim()) e.templateCode = "Template is required";
    if (!form.manufacturer.trim()) e.manufacturer = "Manufacturer is required";
    if (!form.mpn.trim()) e.mpn = "MPN is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createSourcing.mutate(form, {
      onSuccess: () => {
        toast.success("Manufacturer linked to template");
        navigate({ to: "/inventory/sourcing" });
      },
    });
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Sourcing", to: "/inventory/sourcing" },
          { label: "New Link" },
        ]}
        title="Link Manufacturer"
        description="Attach a manufacturer and MPN to an existing item template."
      />

      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/inventory/sourcing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sourcing
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Item Template" error={errors.templateCode}>
                <Select
                  value={form.templateCode}
                  onValueChange={(v) => {
                    const tpl = itemTemplates.find((t) => t.companyPartCode === v);
                    set("templateCode", v);
                    set("templateName", tpl?.name || "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.companyPartCode}>
                        {t.companyPartCode} — {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Manufacturer" error={errors.manufacturer}>
                <Select value={form.manufacturer} onValueChange={(v) => set("manufacturer", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Field label="Manufacturer Part Number (MPN)" error={errors.mpn}>
                <Input value={form.mpn} onChange={(e) => set("mpn", e.target.value.toUpperCase())} placeholder="MFR-XYZ-123" className="font-mono" />
              </Field>
              <Field label="Lead Time (Days)">
                <Input type="number" value={form.leadTimeDays} onChange={(e) => set("leadTimeDays", parseInt(e.target.value) || 0)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Preferred Supplier</p>
                  <p className="text-xs text-muted-foreground">Mark this as the primary source for this template.</p>
                </div>
                <Switch checked={form.preferred} onCheckedChange={(v) => set("preferred", v)} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/inventory/sourcing">Cancel</Link>
            </Button>
            <Button onClick={submit}>Link Manufacturer</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
