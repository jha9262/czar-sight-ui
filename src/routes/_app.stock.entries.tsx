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
import { stockEntries } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/stock/entries")({
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
  const [q, setQ] = useState("");
  const filtered = stockEntries.filter((e) =>
    `${e.code} ${e.template} ${e.warehouse} ${e.createdBy}`.toLowerCase().includes(q.toLowerCase()),
  );

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
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> New entry
          </Button>
        }
      />

      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search entries…" className="h-9 pl-8" />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Code</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.code}</TableCell>
                  <TableCell className="text-sm">{e.template}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.warehouse}</TableCell>
                  <TableCell className="text-sm">{e.createdBy}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{e.itemsCount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{fmt(e.createdAt)}</TableCell>
                  <TableCell>
                    <StatusBadge tone={tone(e.status)}>{e.status}</StatusBadge>
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
