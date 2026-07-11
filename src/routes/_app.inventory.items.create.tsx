import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type ItemTemplate } from "@/lib/mock/data2";
import { useCreateItem } from "@/lib/queries";

export const Route = createFileRoute("/_app/inventory/items/create")({
  head: () => ({
    meta: [{ title: "New Item Template — CZAR Production" }],
  }),
  component: ItemCreatePage,
});

function ItemCreatePage() {
  const navigate = useNavigate();
  const createItem = useCreateItem();

  const [form, setForm] = useState<ItemTemplate>({
    id: crypto.randomUUID(),
    name: "",
    companyPartCode: "",
    isSerialized: false,
    attributes: {},
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof ItemTemplate>(k: K, v: ItemTemplate[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.companyPartCode.trim()) e.companyPartCode = "Company Part Code is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    createItem.mutate(form, {
      onSuccess: () => {
        toast.success("Item template created");
        navigate({ to: "/inventory/items" });
      },
    });
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Item Templates", to: "/inventory/items" },
          { label: "New Item" },
        ]}
        title="New Item Template"
        description="Create a catalog item template."
      />

      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/inventory/items">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to items
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Item Name" />
              </Field>
              <Field label="Company Part Code" error={errors.companyPartCode}>
                <Input
                  value={form.companyPartCode}
                  onChange={(e) => set("companyPartCode", e.target.value.toUpperCase())}
                  placeholder="CZR-XYZ-001"
                  className="font-mono"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Serialized</p>
                  <p className="text-xs text-muted-foreground">Track individual serial numbers for this item.</p>
                </div>
                <Switch checked={form.isSerialized} onCheckedChange={(v) => set("isSerialized", v)} />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Active Status</p>
                  <p className="text-xs text-muted-foreground">Item is available for new stock entries.</p>
                </div>
                <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/inventory/items">Cancel</Link>
            </Button>
            <Button onClick={submit}>Create Item Template</Button>
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
