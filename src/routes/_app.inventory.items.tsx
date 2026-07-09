import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { itemTemplates } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/inventory/items")({
  head: () => ({
    meta: [
      { title: "Item Templates — CZAR Production" },
      { name: "description", content: "Reusable item templates used across stock and sourcing." },
    ],
  }),
  component: ItemsPage,
});

function ItemsPage() {
  const [q, setQ] = useState("");
  const filtered = itemTemplates.filter((t) =>
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
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> New template
          </Button>
        }
      />

      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates…" className="h-9 pl-8" />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Company part code</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="font-mono text-xs">{t.companyPartCode}</TableCell>
                  <TableCell>
                    <StatusBadge tone={t.isSerialized ? "info" : "neutral"}>
                      {t.isSerialized ? "Serialized" : "Bulk"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{t.unit}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(t.attributes).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 rounded border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px]"
                        >
                          <span className="text-muted-foreground">{k}:</span>
                          <span>{v}</span>
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {t.isActive ? (
                      <StatusBadge tone="success">Active</StatusBadge>
                    ) : (
                      <StatusBadge tone="destructive">Inactive</StatusBadge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
