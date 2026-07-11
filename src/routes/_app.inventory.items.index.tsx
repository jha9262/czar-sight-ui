import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteDialog } from "@/components/delete-dialog";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { itemTemplates as seed } from "@/lib/mock/data2";
import { useItems, useDeleteItem } from "@/lib/queries";

export const Route = createFileRoute("/_app/inventory/items/")({
  head: () => ({
    meta: [
      { title: "Item Templates — CZAR Production" },
      { name: "description", content: "Reusable item templates used across stock and sourcing." },
    ],
  }),
  component: ItemsPage,
});

function ItemsPage() {
  const { data: items = [] } = useItems();
  const deleteItem = useDeleteItem();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  
  const filtered = items.filter((t) =>
    `${t.name} ${t.companyPartCode}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Item Templates" },
        ]}
        title="Item templates"
        description="Templates define whether items are serialized or bulk, and carry shared attributes."
        actions={
          <Button size="sm" asChild>
            <Link to="/inventory/items/create">
              <Plus className="mr-1.5 h-4 w-4" /> New template
            </Link>
          </Button>
        }
      />

      <div className="p-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <DataTableToolbar searchPlaceholder="Search templates..." searchValue={q} onSearchChange={setQ} />

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-1 cursor-pointer">Name <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Company part code <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Kind <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Attributes <ArrowUpDown className="h-3 w-3" /></div>
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
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium text-left">{t.name}</TableCell>
                  <TableCell className="font-mono text-xs text-center">{t.companyPartCode}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge tone={t.isSerialized ? "info" : "neutral"}>
                      {t.isSerialized ? "Serialized" : "Bulk"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {Object.entries(t.attributes).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 rounded border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px]"
                        >
                          <span className="text-muted-foreground">{k}:</span>
                          <span>{v as React.ReactNode}</span>
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {t.isActive ? (
                      <StatusBadge tone="success">Active</StatusBadge>
                    ) : (
                      <StatusBadge tone="destructive">Inactive</StatusBadge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800" asChild>
                        <Link to={`/inventory/items/${t.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                        <Link to={`/inventory/items/edit/${t.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget(t.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DataTablePagination totalItems={items.length} itemsPerPage={filtered.length} itemName="templates" />
        </div>
      </div>
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete item template?" description="This item template will be permanently removed." onConfirm={() => { if (deleteTarget) deleteItem.mutate(deleteTarget, { onSuccess: () => { toast.success("Item deleted"); setDeleteTarget(null); } }); }} isPending={deleteItem.isPending} />
    </div>
  );
}
