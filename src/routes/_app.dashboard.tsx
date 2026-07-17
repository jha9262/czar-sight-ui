import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  Package,
  Plus,
  UserCheck,
  Warehouse,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
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
import { stockEntries } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CZAR Production" },
      { name: "description", content: "Operations overview across warehouses and inventory." },
    ],
  }),
  component: Dashboard,
});

const stockDist = [
  { warehouse: "BLR-01", bulk: 22700, serialized: 184 },
  { warehouse: "MUM-02", bulk: 9800, serialized: 92 },
  { warehouse: "DEL-03", bulk: 6400, serialized: 71 },
  { warehouse: "PUN-06", bulk: 12100, serialized: 148 },
  { warehouse: "HYD-05", bulk: 4800, serialized: 44 },
  { warehouse: "CHN-04", bulk: 3100, serialized: 21 },
];

function statusTone(s: string) {
  return s === "posted"
    ? ("success" as const)
    : s === "pending"
    ? ("warning" as const)
    : s === "rejected"
    ? ("destructive" as const)
    : ("neutral" as const);
}

function Dashboard() {
  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Dashboard" }]}
        title="Operations overview"
        description="Live snapshot across warehouses, inventory and stock movements."
        actions={
          <>
            {/* <Button variant="outline" size="sm">
              <Warehouse className="mr-1.5 h-4 w-4" /> Add warehouse
            </Button>
            <Button variant="outline" size="sm">
              <Package className="mr-1.5 h-4 w-4" /> Register item
            </Button> */}
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> New stock entry
            </Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          <KpiCard label="Warehouses" value={7} icon={Warehouse} tone="primary" delta={{ value: "+1", direction: "up" }} hint="active this quarter" />
          <KpiCard label="Items in stock" value="58,921" icon={Boxes} tone="info" delta={{ value: "+3.4%", direction: "up" }} hint="vs last week" />
          <KpiCard label="Active users" value={42} icon={UserCheck} tone="success" delta={{ value: "0", direction: "flat" }} hint="last 30 days" />
          <KpiCard label="Pending BOMs" value={6} icon={ClipboardList} tone="warning" delta={{ value: "+2", direction: "up" }} hint="awaiting approval" />
          <KpiCard label="Low stock alerts" value={11} icon={AlertTriangle} tone="destructive" delta={{ value: "+4", direction: "up" }} hint="below reorder" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border bg-card lg:col-span-2">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div>
                <h2 className="text-sm font-semibold">Recent stock entries</h2>
                <p className="text-xs text-muted-foreground">Last 10 postings across all warehouses</p>
              </div>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[160px]">Entry</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockEntries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{e.code}</TableCell>
                    <TableCell className="text-sm">{e.template}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{e.warehouse}</TableCell>
                    <TableCell className="text-sm">{e.createdBy}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{e.itemsCount}</TableCell>
                    <TableCell>
                      <StatusBadge tone={statusTone(e.status)}>{e.status}</StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b px-5 py-3">
              <h2 className="text-sm font-semibold">Stock distribution</h2>
              <p className="text-xs text-muted-foreground">Bulk vs serialized by warehouse</p>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stockDist} barGap={4}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="bulk" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} name="Bulk" />
                  <Bar dataKey="serialized" fill="var(--color-chart-2)" radius={[3, 3, 0, 0]} name="Serialized" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-chart-1" /> Bulk
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-chart-2" /> Serialized
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
