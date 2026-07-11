import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Pencil, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
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
import { partTypes, partMasters as seed } from "@/lib/mock/data2";
import { useParts, useDeletePart } from "@/lib/queries";

export const Route = createFileRoute("/_app/inventory/parts/")({
  head: () => ({
    meta: [
      { title: "Parts — CZAR Production" },
      { name: "description", content: "Part types and part masters catalog." },
    ],
  }),
  component: PartsPage,
});

function PartsPage() {
  const { data: partMasters = [] } = useParts();
  const deletePart = useDeletePart();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const filteredMasters = partMasters.filter((p) =>
    `${p.partNumber} ${p.name} ${p.partType}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Parts" },
        ]}
        title="Parts catalog"
        description="Structured catalog of part types and master parts used across BOMs."
        actions={
          <Button size="sm" asChild>
            <Link to="/inventory/parts/create">
              <Plus className="mr-1.5 h-4 w-4" /> New part
            </Link>
          </Button>
        }
      />

      <div className="p-6">
        <Tabs defaultValue="masters">
          <div className="flex items-center justify-between gap-2">
            <TabsList>
              <TabsTrigger value="masters" className="gap-2">
                Part masters
                <span className="rounded bg-muted-foreground/15 px-1.5 py-0.5 font-mono text-[10px]">
                  {partMasters.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="types" className="gap-2">
                Part types
                <span className="rounded bg-muted-foreground/15 px-1.5 py-0.5 font-mono text-[10px]">
                  {partTypes.length}
                </span>
              </TabsTrigger>
            </TabsList>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search parts…" className="h-9 pl-8" />
            </div>
          </div>

          <TabsContent value="masters" className="mt-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <DataTableToolbar searchPlaceholder="Search parts..." searchValue={q} onSearchChange={setQ} />
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[150px]">
                      <div className="flex items-center gap-1 cursor-pointer">Part number <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Name <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Type <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Description <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>

                    <TableHead className="w-[100px]">
                      <div className="flex items-center justify-center gap-1 cursor-pointer">Actions</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMasters.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs text-left">{p.partNumber}</TableCell>
                      <TableCell className="font-medium text-center">{p.name}</TableCell>
                      <TableCell className="text-center">
                        <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                          {p.partType}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground text-center">{p.description}</TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800" asChild>
                            <Link to={`/inventory/parts/${p.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                            <Link to={`/inventory/parts/edit/${p.id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget(p.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <DataTablePagination totalItems={partMasters.length} itemsPerPage={filteredMasters.length} itemName="parts" />
            </div>
          </TabsContent>

          <TabsContent value="types" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {partTypes.map((t) => (
                <div key={t.id} className="rounded-lg border bg-card p-4 transition hover:shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                    </div>
                    <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                      {t.partsCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete part?" description="This part master will be permanently removed." onConfirm={() => { if (deleteTarget) deletePart.mutate(deleteTarget, { onSuccess: () => { toast.success("Part deleted"); setDeleteTarget(null); } }); }} isPending={deletePart.isPending} />
    </div>
  );
}
