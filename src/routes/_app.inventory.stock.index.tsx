import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/delete-dialog";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { warehouses } from "@/lib/mock/data";
import { useSerializedItems, useBulkItems, useDeleteSerializedItem, useDeleteBulkItem } from "@/lib/queries";

export const Route = createFileRoute("/_app/inventory/stock/")({
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
  const { data: serializedItems = [] } = useSerializedItems();
  const { data: bulkItems = [] } = useBulkItems();
  const deleteSerialized = useDeleteSerializedItem();
  const deleteBulk = useDeleteBulkItem();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: "serialized" | "bulk" } | null>(null);

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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/inventory/stock/register-instance">
                <Plus className="mr-1.5 h-4 w-4" /> Register Instance
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/inventory/stock/create">
                <Plus className="mr-1.5 h-4 w-4" /> Add stock
              </Link>
            </Button>
          </div>
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
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <DataTableToolbar searchPlaceholder="Search serial, template..." searchValue={query} onSearchChange={setQuery} />
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[150px]">
                      <div className="flex items-center gap-1 cursor-pointer">Serial number <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Template <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Part code <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Warehouse <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Received <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Status <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Actions</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSer.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs text-left">{s.serial}</TableCell>
                      <TableCell className="text-sm text-center">{s.template}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground text-center">
                        {s.companyPartCode}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-center">{s.warehouse}</TableCell>
                      <TableCell className="text-xs text-muted-foreground text-center">{s.receivedAt}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge tone={statusTone(s.status)}>{s.status.replace("_", " ")}</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                            <Link to={`/inventory/stock/edit-serialized/${s.id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget({ id: s.id, type: "serialized" })}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination totalItems={stockSerialized.length} itemsPerPage={filteredSer.length} itemName="serialized items" />
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="mt-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <DataTableToolbar searchPlaceholder="Search batch, template..." searchValue={query} onSearchChange={setQuery} />
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[150px]">
                      <div className="flex items-center gap-1 cursor-pointer">Batch number <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Template <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Part code <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Warehouse <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Quantity <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Received <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Actions</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBulk.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs text-left">{b.batchNumber}</TableCell>
                      <TableCell className="text-sm text-center">{b.template}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground text-center">
                        {b.companyPartCode}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-center">{b.warehouse}</TableCell>
                      <TableCell className="text-center font-mono tabular-nums">
                        {b.quantity.toLocaleString()}{" "}

                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground text-center">{b.receivedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                            <Link to={`/inventory/stock/edit-bulk/${b.id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget({ id: b.id, type: "bulk" })}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination totalItems={stockBulk.length} itemsPerPage={filteredBulk.length} itemName="bulk items" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete stock?" description="This stock record will be removed." onConfirm={() => {
        if (!deleteTarget) return;
        const fn = deleteTarget.type === "serialized" ? deleteSerialized : deleteBulk;
        fn.mutate(deleteTarget.id, { onSuccess: () => { toast.success("Stock deleted"); setDeleteTarget(null); } });
      }} isPending={deleteSerialized.isPending || deleteBulk.isPending} />
    </div>
  );
}
