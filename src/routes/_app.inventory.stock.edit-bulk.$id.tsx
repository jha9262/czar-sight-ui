import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStockEditBulkLogic } from "@/hooks/features/inventory/useStockEditBulkLogic";

export const Route = createFileRoute("/_app/inventory/stock/edit-bulk/$id")({
  head: () => ({
    meta: [{ title: "Edit Bulk Stock — CZAR Production" }],
  }),
  component: EditBulkPage,
});

function EditBulkPage() {
  const { id } = Route.useParams();
  const { state, handlers } = useStockEditBulkLogic(id);
  const { item, isLoading, template, warehouse, batch, qty, errors, itemTemplates, warehouses, isPending } = state;
  const { setTemplate, setWarehouse, setBatch, setQty, submit } = handlers;

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!item) return <div className="p-10 text-center">Item not found</div>;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Item Stock", to: "/inventory/stock" },
          { label: "Edit Bulk Stock" },
        ]}
        title="Edit Bulk Stock"
        description="Update details for a specific bulk batch."
      />

      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/inventory/stock">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to stock
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
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
                  <option key={w.id} value={w.code}>{w.code} - {w.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Batch Number" error={errors.batch}>
              <Input
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="BAT-XXXX"
                className="font-mono"
              />
            </Field>
            <Field label="Quantity" error={errors.qty}>
              <Input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" asChild>
              <Link to="/inventory/stock">Cancel</Link>
            </Button>
            <Button onClick={submit} disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
