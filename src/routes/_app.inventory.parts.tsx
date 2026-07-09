import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

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
import { partTypes, partMasters } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/inventory/parts")({
  head: () => ({
    meta: [
      { title: "Parts — CZAR Production" },
      { name: "description", content: "Part types and part masters catalog." },
    ],
  }),
  component: PartsPage,
});

function PartsPage() {
  const [q, setQ] = useState("");
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
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> New part
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
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Part number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMasters.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.partNumber}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                          {p.partType}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.description}</TableCell>
                      <TableCell className="font-mono text-xs">{p.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </div>
  );
}
