import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSerializedItem, useCreateBulkItem } from "@/lib/queries";
import { itemTemplates } from "@/lib/mock/data2";
import { warehouses } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/inventory/stock/create")({
  head: () => ({
    meta: [{ title: "Add Stock — CZAR Production" }],
  }),
  component: StockCreatePage,
});

function StockCreatePage() {
  const navigate = useNavigate();
  const createSerialized = useCreateSerializedItem();
  const createBulk = useCreateBulkItem();

  const [isSerialized, setIsSerialized] = useState(true);
  const [template, setTemplate] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [serial, setSerial] = useState("");
  const [batch, setBatch] = useState("");
  const [qty, setQty] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const e: Record<string, string> = {};
    if (!template) e.template = "Template is required";
    if (!warehouse) e.warehouse = "Warehouse is required";
    if (isSerialized) {
      if (!serial.trim()) e.serial = "Serial number is required";
    } else {
      if (!batch.trim()) e.batch = "Batch number is required";
      if (!qty || Number(qty) <= 0) e.qty = "Enter a positive quantity";
    }
    setErrors(e);
    if (Object.keys(e).length) return;

    if (isSerialized) {
      createSerialized.mutate(
        {
          id: crypto.randomUUID(),
          serial: serial,
          template: template,
          companyPartCode: itemTemplates.find((t) => t.name === template)?.companyPartCode || "CZR-UNKNOWN",
          warehouse: warehouse,
          status: "in_stock",
          receivedAt: new Date().toISOString().slice(0, 10),
        },
        {
          onSuccess: () => {
            toast.success("Serialized item added");
            navigate({ to: "/inventory/stock" });
          },
        }
      );
    } else {
      createBulk.mutate(
        {
          id: crypto.randomUUID(),
          batchNumber: batch,
          template: template,
          companyPartCode: itemTemplates.find((t) => t.name === template)?.companyPartCode || "CZR-UNKNOWN",
          warehouse: warehouse,
          quantity: Number(qty),
          receivedAt: new Date().toISOString().slice(0, 10),
        },
        {
          onSuccess: () => {
            toast.success("Bulk batch added");
            navigate({ to: "/inventory/stock" });
          },
        }
      );
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Item Stock", to: "/inventory/stock" },
          { label: "Add Stock" },
        ]}
        title="Add Stock"
        description="Add serialized instances or bulk inventory batches."
      />

      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/inventory/stock">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to stock
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-8 flex items-center gap-2 rounded-md border p-1 text-sm">
            <button
              onClick={() => setIsSerialized(true)}
              className={`flex-1 rounded px-3 py-2 font-medium transition ${
                isSerialized ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Serialized Item
            </button>
            <button
              onClick={() => setIsSerialized(false)}
              className={`flex-1 rounded px-3 py-2 font-medium transition ${
                !isSerialized ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Bulk Batch
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Item Template" error={errors.template}>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  <option value="" disabled>Select template</option>
                  {itemTemplates.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Warehouse" error={errors.warehouse}>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                >
                  <option value="" disabled>Select warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.code}>{w.code} - {w.title}</option>
                  ))}
                </select>
              </Field>
            </div>

            {isSerialized ? (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Serial Number" error={errors.serial}>
                  <Input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="CZR-DSP-2026-..." />
                </Field>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Batch Number" error={errors.batch}>
                  <Input value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="BATCH-2026-..." />
                </Field>
                <Field label="Quantity" error={errors.qty}>
                  <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="100" />
                </Field>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/inventory/stock">Cancel</Link>
            </Button>
            <Button onClick={submit}>Add {isSerialized ? "Serialized Item" : "Bulk Batch"}</Button>
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
