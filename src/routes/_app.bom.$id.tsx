import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { partMasters, type BomNode } from "@/lib/mock/data2";
import { useBomViewLogic, useAddBomItemLogic } from "@/hooks/features/bom/useBomViewLogic";

export const Route = createFileRoute("/_app/bom/$id")({
  head: () => ({
    meta: [
      { title: "BOM detail — CZAR Production" },
      { name: "description", content: "Hierarchical BOM tree and part quantities." },
    ],
  }),
  component: BomDetailPage,
});

function BomDetailPage() {
  const { id } = Route.useParams();
  const { state, handlers } = useBomViewLogic(id);
  const { bom, bomTree, isAddDialogOpen } = state;
  const { setAddDialogOpen } = handlers;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Bill of Materials", to: "/bom" },
          { label: bom.duModel },
        ]}
        title={bom.name}
        description={`Version ${bom.version} • ${bom.itemsCount} line items • updated ${bom.updatedAt}`}
        actions={
          <>
            {bom.isActive ? (
              <StatusBadge tone="success">Active</StatusBadge>
            ) : (
              <StatusBadge tone="warning">Draft</StatusBadge>
            )}
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add BOM item
            </Button>
          </>
        }
      />

      <div className="p-6">
        <div className="rounded-lg border bg-card">
          <div className="grid grid-cols-[1fr_120px_1fr] gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div>Part</div>
            <div className="text-right">Quantity</div>
            <div>Description</div>
          </div>
          <div className="p-2">
            {bomTree.map((n) => (
              <TreeRow key={n.id} node={n} depth={0} />
            ))}
          </div>
        </div>
      </div>

      <AddBomItemDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
}

function TreeRow({ node, depth }: { node: BomNode; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasKids = !!node.children?.length;
  return (
    <div>
      <div
        className="grid cursor-pointer grid-cols-[1fr_120px_1fr] items-center gap-4 rounded px-3 py-2 text-sm hover:bg-accent/40"
        onClick={() => hasKids && setOpen((v) => !v)}
      >
        <div className="flex items-center gap-1.5" style={{ paddingLeft: depth * 20 }}>
          {hasKids ? (
            open ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )
          ) : (
            <span className="inline-block h-3.5 w-3.5" />
          )}
          <div className="min-w-0">
            <p className={depth === 0 ? "font-semibold" : "font-medium"}>{node.name}</p>
            <p className="font-mono text-[11px] text-muted-foreground">{node.partNumber}</p>
          </div>
        </div>
        <div className="text-right font-mono tabular-nums">{node.quantity}</div>
        <div className="truncate text-xs text-muted-foreground">{node.description}</div>
      </div>
      {hasKids && open && (
        <div>
          {node.children!.map((c) => (
            <TreeRow key={c.id} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddBomItemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { state, handlers } = useAddBomItemLogic(onOpenChange);
  const { part, qty } = state;
  const { setPart, setQty, submit } = handlers;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add BOM item</DialogTitle>
          <DialogDescription>Link a part master to this BOM with a quantity.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Part</Label>
            <Select value={part} onValueChange={setPart}>
              <SelectTrigger>
                <SelectValue placeholder="Select part" />
              </SelectTrigger>
              <SelectContent>
                {partMasters.map((p) => (
                  <SelectItem key={p.id} value={p.partNumber}>
                    {p.partNumber} — {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Quantity</Label>
            <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="font-mono" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
