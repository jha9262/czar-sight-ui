import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteDialog } from "@/components/delete-dialog";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useStockEntriesIndexLogic } from "@/hooks/features/stock/useStockEntriesIndexLogic";
import { stockEntries } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/stock/entries/")({
  head: () => ({
    meta: [
      { title: "Stock Entries — CZAR Production" },
      { name: "description", content: "All stock movement records." },
    ],
  }),
  component: StockEntriesPage,
});

function tone(s: string) {
  return s === "posted" ? "success" as const : s === "pending" ? "warning" as const : s === "rejected" ? "destructive" as const : "neutral" as const;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function StockEntriesPage() {
  const { state, handlers } = useStockEntriesIndexLogic();
  const { q, filtered, deleteTarget, isDeleting } = state;
  const { setQ, setDeleteTarget, confirmDelete } = handlers;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Stock Management" },
          { label: "Entries" },
        ]}
        title="Stock entries"
        description="Every posted movement, transfer, adjustment and return."
        actions={
          <Button size="sm" asChild>
            <Link to="/stock/entries/create">
              <Plus className="mr-1.5 h-4 w-4" /> New entry
            </Link>
          </Button>
        }
      />

      <div className="p-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <DataTableToolbar searchPlaceholder="Search entries..." searchValue={q} onSearchChange={setQ} />

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[120px]">
                  <div className="flex items-center gap-1 cursor-pointer">Code <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Template <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Warehouse <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Created by <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Items <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Created at <ArrowUpDown className="h-3 w-3" /></div>
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
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs text-left">{e.code}</TableCell>
                  <TableCell className="text-sm text-center">{e.template}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground text-center">{e.warehouse}</TableCell>
                  <TableCell className="text-sm text-center">{e.createdBy}</TableCell>
                  <TableCell className="text-center font-mono tabular-nums">{e.itemsCount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground text-center">{fmt(e.createdAt)}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge tone={tone(e.status)}>{e.status}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                        <Link to={`/stock/entries/edit/${e.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget(e.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataTablePagination totalItems={stockEntries.length} itemsPerPage={filtered.length} itemName="entries" />
        </div>
      </div>
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Stock Entry"
        description="Are you sure you want to delete this stock entry? This action cannot be undone."
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
}
