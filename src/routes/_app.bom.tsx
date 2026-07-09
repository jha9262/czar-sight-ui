import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";

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
import { boms } from "@/lib/mock/data2";

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
  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Bill of Materials" },
        ]}
        title="Bill of Materials"
        description="Versioned BOMs mapping parts to dispenser models."
        actions={
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> New BOM
          </Button>
        }
      />

      <div className="p-6">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Open</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boms.map((b) => (
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
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/bom/$id" params={{ id: b.id }}>
                        View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
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
