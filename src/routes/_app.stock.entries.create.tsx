import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type StockEntry } from "@/lib/mock/data";
import { useCreateStockEntry } from "@/lib/queries";

export const Route = createFileRoute("/_app/stock/entries/create")({
  head: () => ({
    meta: [{ title: "New Stock Entry — CZAR Production" }],
  }),
  component: StockEntryCreatePage,
});

function StockEntryCreatePage() {
  const navigate = useNavigate();
  const createEntry = useCreateStockEntry();

  const [form, setForm] = useState<StockEntry>({
    id: crypto.randomUUID(),
    code: "",
    template: "TPL-INBOUND",
    warehouse: "",
    createdBy: "System",
    status: "draft",
    itemsCount: 0,
    createdAt: new Date().toISOString(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof StockEntry>(k: K, v: StockEntry[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.warehouse.trim()) e.warehouse = "Warehouse is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createEntry.mutate(form, {
      onSuccess: () => {
        toast.success("Stock entry created");
        navigate({ to: "/stock/entries" });
      },
    });
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Stock Management" },
          { label: "Entries", to: "/stock/entries" },
          { label: "New Entry" },
        ]}
        title="New Stock Entry"
        description="Record a new inbound, outbound or transfer movement."
      />

      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/stock/entries">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to entries
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Entry Code" error={errors.code}>
                <Input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="STE-26-0001"
                  className="font-mono"
                />
              </Field>
              <Field label="Warehouse" error={errors.warehouse}>
                <Input value={form.warehouse} onChange={(e) => set("warehouse", e.target.value)} placeholder="WH-BLR-01" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Template">
                <Select value={form.template} onValueChange={(v) => set("template", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TPL-INBOUND">Inbound Receipt</SelectItem>
                    <SelectItem value="TPL-XFER">Transfer Out</SelectItem>
                    <SelectItem value="TPL-ASM">Assembly Consumption</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Items Count">
                <Input type="number" value={form.itemsCount} onChange={(e) => set("itemsCount", parseInt(e.target.value) || 0)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <Select value={form.status} onValueChange={(v: any) => set("status", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="posted">Posted</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/stock/entries">Cancel</Link>
            </Button>
            <Button onClick={submit}>Create Entry</Button>
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
