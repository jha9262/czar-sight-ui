import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
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
import { entryTemplates as seed, type EntryTemplate } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/stock/templates")({
  head: () => ({
    meta: [
      { title: "Stock Entry Templates — CZAR Production" },
      { name: "description", content: "Reusable stock entry templates with soft-delete support." },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const [rows, setRows] = useState<EntryTemplate[]>(seed);
  const active = useMemo(() => rows.filter((r) => !r.deletedAt), [rows]);
  const deleted = useMemo(() => rows.filter((r) => r.deletedAt), [rows]);

  function softDelete(id: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, deletedAt: new Date().toISOString().slice(0, 10) } : r)));
    toast.success("Template moved to trash");
  }
  function restore(id: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, deletedAt: null } : r)));
    toast.success("Template restored");
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Stock Management" },
          { label: "Templates" },
        ]}
        title="Stock entry templates"
        description="Define reusable field schemas for the different kinds of stock movements you post."
        actions={
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> New template
          </Button>
        }
      />

      <div className="p-6">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              Active
              <span className="rounded bg-muted-foreground/15 px-1.5 py-0.5 font-mono text-[10px]">{active.length}</span>
            </TabsTrigger>
            <TabsTrigger value="deleted" className="gap-2">
              Deleted
              <span className="rounded bg-muted-foreground/15 px-1.5 py-0.5 font-mono text-[10px]">{deleted.length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <TemplateTable rows={active} onDelete={softDelete} />
          </TabsContent>

          <TabsContent value="deleted" className="mt-4">
            {deleted.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-card/30 p-10 text-center text-sm text-muted-foreground">
                No deleted templates.
              </div>
            ) : (
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Deleted</TableHead>
                      <TableHead className="text-right">Restore</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deleted.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs">{t.code}</TableCell>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{t.deletedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => restore(t.id)}>
                            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TemplateTable({ rows, onDelete }: { rows: EntryTemplate[]; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Fields</TableHead>
            <TableHead className="text-right">Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-mono text-xs">{t.code}</TableCell>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell className="text-right font-mono">{t.fields}</TableCell>
              <TableCell className="text-right font-mono">{t.usage}</TableCell>
              <TableCell>
                <StatusBadge tone="success">Active</StatusBadge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(t.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
