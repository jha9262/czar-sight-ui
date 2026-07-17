import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStockRegisterInstanceLogic } from "@/hooks/features/inventory/useStockRegisterInstanceLogic";

export const Route = createFileRoute("/_app/inventory/stock/register-instance")({
  component: RegisterInstancePage,
});

function RegisterInstancePage() {
  const { state, handlers } = useStockRegisterInstanceLogic();
  const { templates, warehouses, itemTemplateId, serial, warehouseId, status, isPending } = state;
  const { setItemTemplateId, setSerial, setWarehouseId, setStatus, handleSave } = handlers;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory", to: "/inventory/stock" },
          { label: "Item Stock", to: "/inventory/stock" },
          { label: "Register Instance" },
        ]}
        title="Register Item Instance"
        description="Directly register a new serialized unit into a warehouse."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/inventory/stock">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Cancel
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Register
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 p-6">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid gap-2">
            <Label htmlFor="itemTemplate">Item Template</Label>
            <Select value={itemTemplateId} onValueChange={setItemTemplateId}>
              <SelectTrigger id="itemTemplate">
                <SelectValue placeholder="Select an item template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.filter(t => t.isSerialized).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.companyPartCode} - {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="serial">Serial Number</Label>
              <Input id="serial" value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="e.g. SN-998123" className="font-mono" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="faulty">Faulty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="warehouse">Warehouse</Label>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger id="warehouse">
                <SelectValue placeholder="Select destination warehouse..." />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
