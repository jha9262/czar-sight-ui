import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { partTypes, type PartMaster } from "@/lib/mock/data2";
import { useCreatePart } from "@/lib/queries";

export const Route = createFileRoute("/_app/inventory/parts/create")({
  head: () => ({
    meta: [{ title: "New Part — CZAR Production" }],
  }),
  component: PartCreatePage,
});

function PartCreatePage() {
  const navigate = useNavigate();
  const createPart = useCreatePart();

  const [form, setForm] = useState<PartMaster>({
    id: crypto.randomUUID(),
    partNumber: "",
    partType: partTypes[0]?.name || "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof PartMaster>(k: K, v: PartMaster[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.partNumber.trim()) e.partNumber = "Part Number is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.partType.trim()) e.partType = "Part Type is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createPart.mutate(form, {
      onSuccess: () => {
        toast.success("Part created successfully");
        navigate({ to: "/inventory/parts" });
      },
    });
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Parts", to: "/inventory/parts" },
          { label: "New Part" },
        ]}
        title="New Part"
        description="Add a new component or part to your catalog."
      />

      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/inventory/parts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to parts
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Part Number" error={errors.partNumber}>
                <Input
                  value={form.partNumber}
                  onChange={(e) => set("partNumber", e.target.value.toUpperCase())}
                  placeholder="CZR-XYZ-001"
                  className="font-mono"
                />
              </Field>
              <Field label="Name" error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Part Name" />
              </Field>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Field label="Part Type" error={errors.partType}>
                <Select value={form.partType} onValueChange={(v) => set("partType", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {partTypes.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Description">
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Detailed description of the part..." />
            </Field>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/inventory/parts">Cancel</Link>
            </Button>
            <Button onClick={submit}>Create Part</Button>
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
