import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { DeleteDialog } from "@/components/delete-dialog";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useCompaniesIndexLogic } from "@/hooks/features/sourcing/useCompaniesIndexLogic";

export const Route = createFileRoute("/_app/companies/")({
  head: () => ({ meta: [{ title: "Companies — CZAR Production" }] }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const { state, handlers } = useCompaniesIndexLogic();
  const { companies, filtered, q, deleteTarget, isDeleting } = state;
  const { setQ, setDeleteTarget, confirmDelete } = handlers;

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Companies" }]} title="Companies" description="Client companies and manufacturing partners."
        actions={<Button size="sm" asChild><Link to="/companies/create"><Plus className="mr-1.5 h-4 w-4" />New company</Link></Button>} />
      
      <div className="p-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <DataTableToolbar searchPlaceholder="Search companies..." searchValue={q} onSearchChange={setQ} />
          
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[120px]">
                  <div className="flex items-center gap-1 cursor-pointer">Code <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Name <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Phone <ArrowUpDown className="h-3 w-3" /></div>
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
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-left">{c.code}</TableCell>
                  <TableCell className="font-medium text-center">{c.title}</TableCell>
                  <TableCell className="text-xs text-muted-foreground text-center">{c.phone}</TableCell>
                  <TableCell className="text-center"><StatusBadge tone={c.isActive ? "success" : "neutral"}>{c.isActive ? "Active" : "Inactive"}</StatusBadge></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800" asChild>
                        <Link to={`/companies/${c.id}`}><Eye className="h-4 w-4" /><span className="sr-only">View</span></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                        <Link to={`/companies/edit/${c.id}`}><Pencil className="h-4 w-4" /><span className="sr-only">Edit</span></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget(c.id)}>
                        <Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <DataTablePagination totalItems={companies.length} itemsPerPage={filtered.length} itemName="companies" />
        </div>
      </div>

      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete company?" description="This action will permanently remove this company." onConfirm={confirmDelete} isPending={isDeleting} />
    </div>
  );
}
