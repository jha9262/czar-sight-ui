import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useState } from "react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/delete-dialog";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useSourcingIndexLogic } from "@/hooks/features/inventory/useSourcingIndexLogic";

export const Route = createFileRoute("/_app/inventory/sourcing/")({
  head: () => ({
    meta: [
      { title: "Sourcing — CZAR Production" },
      { name: "description", content: "Link manufacturers and MPNs to item templates." },
    ],
  }),
  component: SourcingPage,
});

function SourcingPage() {
  const { state, handlers } = useSourcingIndexLogic();
  const { sourcings, filtered, q, deleteTarget, isDeleting } = state;
  const { setQ, setDeleteTarget, confirmDelete } = handlers;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Sourcing" },
        ]}
        title="Item sourcing"
        description="Link manufacturers and MPNs to item templates and mark preferred suppliers."
        actions={
          <Button size="sm" asChild>
            <Link to="/inventory/sourcing/create">
              <Plus className="mr-1.5 h-4 w-4" /> New link
            </Link>
          </Button>
        }
      />

      <div className="p-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <DataTableToolbar searchPlaceholder="Search sourcing..." searchValue={q} onSearchChange={setQ} />
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-1 cursor-pointer">Template <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Manufacturer <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">MPN <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Lead time <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Preferred <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Actions</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-left">
                    <div className="font-medium">{s.templateName}</div>
                    <div className="font-mono text-xs text-muted-foreground">{s.templateCode}</div>
                  </TableCell>
                  <TableCell className="text-sm text-center">{s.manufacturer}</TableCell>
                  <TableCell className="font-mono text-xs text-center">{s.mpn}</TableCell>
                  <TableCell className="text-center font-mono text-xs">{s.leadTimeDays} d</TableCell>
                  <TableCell className="text-center">
                    {s.preferred ? (
                      <StatusBadge tone="success">
                        <CheckCircle2 className="h-3 w-3" /> Preferred
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">Alternate</StatusBadge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                        <Link to={`/inventory/sourcing/edit/${s.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget(s.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <DataTablePagination totalItems={sourcings.length} itemsPerPage={filtered.length} itemName="sources" />
        </div>
      </div>
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete sourcing link?" description="This manufacturer-MPN link will be removed." onConfirm={confirmDelete} isPending={isDeleting} />
    </div>
  );
}
