import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Download } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ledger } from "@/lib/mock/data2";
import { warehouses } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/stock/ledger")({
  head: () => ({
    meta: [
      { title: "Stock Ledger — CZAR Production" },
      { name: "description", content: "Balance-of-stock ledger per warehouse and item." },
    ],
  }),
  component: LedgerPage,
});

function LedgerPage() {
  const [wh, setWh] = useState("all");
  const rows = ledger.filter((r) => wh === "all" || r.warehouse === wh);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Stock Management" },
          { label: "Ledger" },
        ]}
        title="Stock ledger"
        description="Opening → in → out → closing balance per item, per warehouse."
        actions={
          <>
            <Select value={wh} onValueChange={setWh}>
              <SelectTrigger className="h-9 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.code}>
                    {w.code} — {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
          </>
        }
      />

      <div className="p-6">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Warehouse</TableHead>
                <TableHead>Part</TableHead>
                <TableHead className="text-right">Opening</TableHead>
                <TableHead className="text-right text-success">In</TableHead>
                <TableHead className="text-right text-destructive">Out</TableHead>
                <TableHead className="text-right">Closing</TableHead>
                <TableHead className="text-right">Reorder</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const low = r.closingQty < r.reorderLevel;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.warehouse}</TableCell>
                    <TableCell>
                      <div className="font-medium">{r.partName}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{r.partCode}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {r.openingQty.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-success">
                      +{r.inQty.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-destructive">
                      −{r.outQty.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-semibold">
                      {r.closingQty.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{r.unit}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {r.reorderLevel.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {low ? (
                        <StatusBadge tone="destructive">
                          <AlertTriangle className="h-3 w-3" /> Low stock
                        </StatusBadge>
                      ) : (
                        <StatusBadge tone="success">Healthy</StatusBadge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
