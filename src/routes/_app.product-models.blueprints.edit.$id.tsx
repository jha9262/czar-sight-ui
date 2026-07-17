import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Save, Plus, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBlueprintEditLogic } from "@/hooks/features/bom/useBlueprintEditLogic";
import { bomTree } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/product-models/blueprints/edit/$id")({
  component: EditBlueprintPage,
});

function EditBlueprintPage() {
  const { id } = Route.useParams();
  const { state, handlers } = useBlueprintEditLogic(id);
  const { blueprint, models, name, productModelId, activeRevision, status, isPending } = state;
  const { setName, setProductModelId, setActiveRevision, setStatus, handleSave } = handlers;

  if (!blueprint) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Product Models", to: "/product-models" },
          { label: "Blueprints", to: "/product-models" },
          { label: "Edit" },
        ]}
        title="Edit Blueprint"
        description={`Managing configuration for ${blueprint.name}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/product-models">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Cancel
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Save Changes
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 p-6">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Blueprint Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="productModel">Product Model</Label>
                <Select value={productModelId} onValueChange={setProductModelId}>
                  <SelectTrigger id="productModel">
                    <SelectValue placeholder="Select model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.modelCode} - {m.modelTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Obsolete">Obsolete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rev">Active Revision</Label>
              <Input id="rev" value={activeRevision} onChange={(e) => setActiveRevision(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Blueprint Parts</h3>
              <p className="text-sm text-muted-foreground">The assembly tree for this blueprint.</p>
            </div>
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> Add Part
            </Button>
          </div>

          <div className="mt-4">
            <BlueprintList nodes={bomTree[0].children ?? []} />
          </div>
        </div>
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
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs">
                × {n.quantity}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
          {n.children && (
            <ul className="mt-2 space-y-1 border-l border-border pl-3">
              {n.children.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between text-xs p-1 hover:bg-muted/50 rounded">
                  <div>
                    <span>{c.name}</span>{" "}
                    <span className="font-mono text-muted-foreground">{c.partNumber}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-muted-foreground">
                      × {c.quantity}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
