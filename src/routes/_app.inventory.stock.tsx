import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serializedItems, bulkItems, warehouses } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/inventory/stock")({
  head: () => ({
    meta: [
      { title: "Item Stock — CZAR Production" },
      { name: "description", content: "Serialized and bulk inventory instances by warehouse." },
    ],
  }),
  component: StockPage,
});

function statusTone(s: string) {
  switch (s) {
    case "in_stock":
      return "success" as const;
    case "reserved":
      return "info" as const;
    case "shipped":
      return "neutral" as const;
    case "faulty":
      return "destructive" as const;
    default:
      return "neutral" as const;
  }
}

function StockPage() {
  const [tab, setTab] = useState<"serialized" | "bulk">("serialized");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredSer = serializedItems.filter((i) =>
    `${i.serial} ${i.template} ${i.companyPartCode}`.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredBulk = bulkItems.filter((i) =>
    `${i.batchNumber} ${i.template} ${i.companyPartCode}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Item Stock" },
        ]}
        title="Item stock"
        description="Individual serialized units and bulk batches held across your warehouses."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add stock
          </Button>
        }
      />

      <div className="space-y-4 p-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TabsList>
              <TabsTrigger value="serialized" className="gap-2">
                Serialized
                <span className="rounded bg-muted-foreground/15 px-1.5 py-0.5 font-mono text-[10px]">
                  {serializedItems.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="bulk" className="gap-2">
                Bulk
                <span className="rounded bg-muted-foreground/15 px-1.5 py-0.5 font-mono text-[10px]">
                  {bulkItems.length}
                </span>
              </TabsTrigger>
            </TabsList>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tab === "serialized" ? "Search serial, template…" : "Search batch, template…"}
                className="h-9 pl-8"
              />
            </div>
          </div>

          <TabsContent value="serialized" className="mt-4">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Serial number</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Part code</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSer.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.serial}</TableCell>
                      <TableCell className="text-sm">{s.template}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {s.companyPartCode}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{s.warehouse}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.receivedAt}</TableCell>
                      <TableCell>
                        <StatusBadge tone={statusTone(s.status)}>{s.status.replace("_", " ")}</StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="mt-4">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Batch number</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Part code</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBulk.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.batchNumber}</TableCell>
                      <TableCell className="text-sm">{b.template}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {b.companyPartCode}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{b.warehouse}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {b.quantity.toLocaleString()}{" "}
                        <span className="text-xs text-muted-foreground">{b.unit}</span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{b.receivedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddStockDialog open={open} onOpenChange={setOpen} defaultTab={tab} />
    </div>
  );
}

function AddStockDialog({
  open,
  onOpenChange,
  defaultTab,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultTab: "serialized" | "bulk";
}) {
  const [isSerialized, setIsSerialized] = useState(defaultTab === "serialized");
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
    toast.success(isSerialized ? "Serialized item added" : "Bulk batch added");
    onOpenChange(false);
    setSerial("");
    setBatch("");
    setQty("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add stock</DialogTitle>
          <DialogDescription>
            Fields adapt based on whether the item template is serialized or bulk.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-md border p-1 text-xs">
            <button
              onClick={() => setIsSerialized(true)}
              className={`flex-1 rounded px-3 py-1.5 font-medium transition ${
                isSerialized ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Serialized
            </button>
            <button
              onClick={() => setIsSerialized(false)}
              className={`flex-1 rounded px-3 py-1.5 font-medium transition ${
                !isSerialized ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Bulk
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Item template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dsp-v3">Dispenser Unit v3</SelectItem>
                <SelectItem value="ctl-r4">Controller Board r4</SelectItem>
                <SelectItem value="pmp-std">Peristaltic Pump</SelectItem>
                <SelectItem value="gsk-22">Silicone Gasket 22mm</SelectItem>
              </SelectContent>
            </Select>
            {errors.template && <p className="text-xs text-destructive">{errors.template}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Warehouse</Label>
            <Select value={warehouse} onValueChange={setWarehouse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.filter((w) => w.isActive).map((w) => (
                  <SelectItem key={w.id} value={w.code}>
                    {w.code} — {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.warehouse && <p className="text-xs text-destructive">{errors.warehouse}</p>}
          </div>

          {isSerialized ? (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Serial number</Label>
              <Input
                value={serial}
                onChange={(e) => setSerial(e.target.value.toUpperCase())}
                placeholder="CZR-DSP-2026-000185"
                className="font-mono"
              />
              {errors.serial && <p className="text-xs text-destructive">{errors.serial}</p>}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Batch number</Label>
                <Input
                  value={batch}
                  onChange={(e) => setBatch(e.target.value.toUpperCase())}
                  placeholder="BATCH-2026-0713"
                  className="font-mono"
                />
                {errors.batch && <p className="text-xs text-destructive">{errors.batch}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0"
                  className="font-mono"
                />
                {errors.qty && <p className="text-xs text-destructive">{errors.qty}</p>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Add to stock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
