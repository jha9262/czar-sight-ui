import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus, Pencil, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DeleteDialog } from "@/components/delete-dialog";
import { useBomIndexLogic } from "@/hooks/features/bom/useBomIndexLogic";

export const Route = createFileRoute("/_app/bom")({
  head: () => ({
    meta: [
      { title: "Bill of Materials — CZAR Production" },
      { name: "description", content: "Manage production and service bills of materials." },
    ],
  }),
  component: BomListPage,
});

function BomListPage() {
  const { state, handlers } = useBomIndexLogic();
  const {
    tab,
    q,
    boms,
    templates,
    componentTypes,
    filteredInstances,
    filteredTemplates,
    filteredCompTypes,
    deleteTarget,
    isDeleting,
  } = state;
  const { setTab, setQ, setDeleteTarget, confirmDeleteCompType } = handlers;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Bill of Materials" },
        ]}
        title="Bill of Materials"
        description="Versioned BOMs, reusable templates, and component types."
        actions={
          <div className="flex items-center gap-2">
            {tab === "instances" && (
              <Button size="sm" asChild>
                <Link to="/bom/create">
                  <Plus className="mr-1.5 h-4 w-4" /> New BOM Instance
                </Link>
              </Button>
            )}
            {tab === "templates" && (
              <Button size="sm" asChild>
                <Link to="/bom/templates/create">
                  <Plus className="mr-1.5 h-4 w-4" /> New Template
                </Link>
              </Button>
            )}
            {tab === "component-types" && (
              <Button size="sm" asChild>
                <Link to="/bom/component-types/create">
                  <Plus className="mr-1.5 h-4 w-4" /> New Component Type
                </Link>
              </Button>
            )}
          </div>
        }
      />

      <div className="p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="instances">BOM Instances ({boms.length})</TabsTrigger>
            <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
            <TabsTrigger value="component-types">Component Types ({componentTypes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="instances" className="mt-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <DataTableToolbar searchPlaceholder="Search BOM instances..." searchValue={q} onSearchChange={setQ} />
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>
                      <div className="flex items-center gap-1 cursor-pointer">Name <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstances.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell className="font-mono text-xs">{b.duModel}</TableCell>
                      <TableCell className="font-mono text-xs">{b.version}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">{b.itemsCount}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{b.updatedAt}</TableCell>
                      <TableCell>
                        {b.isActive ? (
                          <StatusBadge tone="success">Active</StatusBadge>
                        ) : (
                          <StatusBadge tone="warning">Draft</StatusBadge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800" asChild>
                            <Link to="/bom/$id" params={{ id: b.id }}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                            <Link to="/bom/$id" params={{ id: b.id }}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredInstances.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">No instances found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <DataTablePagination totalItems={boms.length} itemsPerPage={filteredInstances.length} itemName="instances" />
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <DataTableToolbar searchPlaceholder="Search BOM templates..." searchValue={q} onSearchChange={setQ} />
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Schema Columns</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="text-muted-foreground">{t.description}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {t.columns.join(", ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTemplates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">No templates found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <DataTablePagination totalItems={templates.length} itemsPerPage={filteredTemplates.length} itemName="templates" />
            </div>
          </TabsContent>

          <TabsContent value="component-types" className="mt-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <DataTableToolbar searchPlaceholder="Search component types..." searchValue={q} onSearchChange={setQ} />
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompTypes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.code}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.description}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.properties.length} props
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                            <Link to={`/bom/component-types/edit/${c.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCompTypes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">No component types found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <DataTablePagination totalItems={componentTypes.length} itemsPerPage={filteredCompTypes.length} itemName="component types" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
        <DeleteDialog
          open={!!deleteTarget}
          onOpenChange={() => setDeleteTarget(null)}
          title="Delete component type?"
          description="This action will permanently remove this component type. Any templates using it will show a warning."
          onConfirm={confirmDeleteCompType}
          isPending={isDeleting}
        /></div>
  );
}
