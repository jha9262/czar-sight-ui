import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSerializedItem, useUpdateSerializedItem } from "@/lib/queries";
import { itemTemplates } from "@/lib/mock/data2";
import { warehouses } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/inventory/stock/edit-serialized/$id")({
  head: () => ({
    meta: [{ title: "Edit Serialized Stock — CZAR Production" }],
  }),
  component: EditSerializedPage,
});

function EditSerializedPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: item, isLoading } = useSerializedItem(id);
  const updateItem = useUpdateSerializedItem();

  const [template, setTemplate] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setTemplate(item.template);
      setWarehouse(item.warehouse);
      setSerial(item.serial);
      setStatus(item.status);
    }
  }, [item]);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!item) return <div className="p-10 text-center">Item not found</div>;

  function submit() {
    const e: Record<string, string> = {};
    if (!template) e.template = "Template is required";
    if (!warehouse) e.warehouse = "Warehouse is required";
    if (!serial.trim()) e.serial = "Serial number is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    updateItem.mutate(
      {
        ...item!,
        serial,
        template,
        warehouse,
        status: status as any,
        companyPartCode: itemTemplates.find((t) => t.name === template)?.companyPartCode || item!.companyPartCode,
      },
      {
        onSuccess: () => {
          toast.success("Serialized item updated");
          navigate({ to: "/inventory/stock" });
        },
      }
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Item Stock", to: "/inventory/stock" },
          { label: "Edit Serialized Stock" },
        ]}
        title="Edit Serialized Stock"
        description="Update details for a specific serialized item."
      />

      <div className="mx-auto max-w-3xl p-6">
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
                  <option key={w.id} value={w.code}>{w.code} - {w.title}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Serial Number" error={errors.serial}>
              <Input
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="SN-XXXX"
                className="font-mono"
              />
            </Field>
            <Field label="Status">
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="in_stock">In Stock</option>
                <option value="reserved">Reserved</option>
                <option value="shipped">Shipped</option>
                <option value="faulty">Faulty</option>
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" asChild>
              <Link to="/inventory/stock">Cancel</Link>
            </Button>
            <Button onClick={submit} disabled={updateItem.isPending}>
              {updateItem.isPending ? "Saving..." : "Save changes"}
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
