import { createFileRoute } from "@tanstack/react-router";
import { Building2, Cpu, Layers, Plus } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/page-header";
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
import { companies, dispenserModels, bomTree } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/product-models")({
  head: () => ({
    meta: [
      { title: "Product Models — CZAR Production" },
      { name: "description", content: "Companies, dispenser models and blueprints." },
    ],
  }),
  component: ProductModelsPage,
});

function ProductModelsPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Product Models" },
        ]}
        title="Product models"
        description="Companies, dispenser models and the blueprints of parts they need."
        actions={
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> New model
          </Button>
        }
      />

      <div className="p-6">
        <Tabs defaultValue="models">
          <TabsList>
            <TabsTrigger value="models" className="gap-2">
              <Cpu className="h-3.5 w-3.5" /> Dispenser models
            </TabsTrigger>
            <TabsTrigger value="companies" className="gap-2">
              <Building2 className="h-3.5 w-3.5" /> Companies
            </TabsTrigger>
            <TabsTrigger value="blueprints" className="gap-2">
              <Layers className="h-3.5 w-3.5" /> Blueprints
            </TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              {dispenserModels.map((m) => (
                <div key={m.id} className="rounded-lg border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{m.modelCode}</p>
                      <h3 className="mt-0.5 text-base font-semibold">{m.modelTitle}</h3>
                    </div>
                    <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium">{m.duType}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
                    <span className="text-muted-foreground">Active units in field</span>
                    <span className="font-mono text-sm font-semibold">{m.activeUnits}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="companies" className="mt-4">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Code</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="text-right">Models</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.code}</TableCell>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell className="text-right font-mono">{c.models}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="blueprints" className="mt-4">
            <div className="rounded-lg border bg-card p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold">DSP-V3-STD Blueprint</h3>
                <p className="text-xs text-muted-foreground">Parts required for one production unit.</p>
              </div>
              <BlueprintList nodes={bomTree[0].children ?? []} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BlueprintList({ nodes }: { nodes: any[] }) {
  return (
    <ul className="space-y-2">
      {nodes.map((n) => (
        <li key={n.id} className="rounded-md border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{n.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{n.partNumber}</p>
            </div>
            <span className="font-mono text-xs">
              × {n.quantity} {n.unit}
            </span>
          </div>
          {n.children && (
            <ul className="mt-2 space-y-1 border-l border-border pl-3">
              {n.children.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between text-xs">
                  <div>
                    <span>{c.name}</span>{" "}
                    <span className="font-mono text-muted-foreground">{c.partNumber}</span>
                  </div>
                  <span className="font-mono text-muted-foreground">
                    × {c.quantity} {c.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
