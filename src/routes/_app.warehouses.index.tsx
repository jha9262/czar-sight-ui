import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Pencil, Plus, RotateCcw, Search, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/delete-dialog";
import { warehouses as seed, type Warehouse } from "@/lib/mock/data";
import { useWarehousesIndexLogic } from "@/hooks/features/administration/useWarehousesIndexLogic";

export const Route = createFileRoute("/_app/warehouses/")({
  head: () => ({
    meta: [
      { title: "Warehouses — CZAR Production" },
      { name: "description", content: "Manage distribution centres and fulfilment hubs." },
    ],
  }),
  component: WarehousesPage,
});

const PAGE_SIZE = 5;

function WarehousesPage() {
  const { state, handlers } = useWarehousesIndexLogic();
  const { query, statusFilter, cityFilter, page, deleteTarget, cities, view, total, pages, isDeleting } = state;
  const { setQuery, setStatusFilter, setCityFilter, setPage, setDeleteTarget, confirmDelete } = handlers;
  function toggleActive(id: string) {
    const warehouse = rows.find(r => r.id === id);
    if (warehouse) {
      updateWarehouse.mutate(
        { ...warehouse, isActive: !warehouse.isActive },
        { onSuccess: () => toast.success("Warehouse status updated") }
      );
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Warehouses" },
        ]}
        title="Warehouses"
        description={`${total} location${total === 1 ? "" : "s"} across your network`}
        actions={
          <Button size="sm" asChild>
            <Link to="/warehouses/create">
              <Plus className="mr-1.5 h-4 w-4" /> New warehouse
            </Link>
          </Button>
        }
      />

      <div className="p-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 p-4 border-b bg-card">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search code, name, email…"
                className="h-9 pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
              <Filter className="mr-1.5 h-3.5 w-3.5" /> More filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[140px]">
                  <div className="flex items-center gap-1 cursor-pointer">Code <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Name <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">City <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Country <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Contact <ArrowUpDown className="h-3 w-3" /></div>
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
              {view.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                    No warehouses match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                view.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-mono text-xs text-left">{w.code}</TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium">{w.name}</div>
                      <div className="text-xs text-muted-foreground">{w.address}</div>
                    </TableCell>
                    <TableCell className="text-sm text-center">{w.city}</TableCell>
                    <TableCell className="text-sm text-center">{w.country}</TableCell>
                    <TableCell className="text-center">
                      <div className="text-xs text-muted-foreground">{w.phone}</div>
                      <div className="text-xs">{w.email}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      {w.isActive ? (
                        <StatusBadge tone="success">Active</StatusBadge>
                      ) : (
                        <StatusBadge tone="destructive">Inactive</StatusBadge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800" asChild>
                          <Link to={`/warehouses/${w.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                          <Link to={`/warehouses/edit/${w.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget(w.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3 bg-muted/10 text-xs text-muted-foreground">
            <span>
              Showing <span className="font-medium text-foreground">{view.length}</span> of{" "}
              {total} warehouses
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="px-3 font-medium">
                Page {page} of {pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete warehouse?"
        description="This warehouse will be permanently removed."
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
}
