import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBomTemplate } from "@/lib/queries";
import type { BomTemplate } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/bom/templates/create")({
  component: CreateBomTemplatePage,
});

function CreateBomTemplatePage() {
  const navigate = useNavigate();
  const createTemplate = useCreateBomTemplate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<string[]>(["Designator", "Quantity"]);

  const addColumn = () => {
    setColumns([...columns, ""]);
  };

  const removeColumn = (idx: number) => {
    setColumns(columns.filter((_, i) => i !== idx));
  };

  const updateColumn = (idx: number, val: string) => {
    const nc = [...columns];
    nc[idx] = val;
    setColumns(nc);
  };

  const handleSave = () => {
    if (!name) {
      toast.error("Template Name is required.");
      return;
    }
    
    if (columns.some(c => !c.trim())) {
      toast.error("All column names must be filled or removed.");
      return;
    }

    const payload: BomTemplate = {
      id: "bt" + Date.now(),
      name,
      description,
      columns: columns.map(c => c.trim()),
    };

    createTemplate.mutate(payload, {
      onSuccess: () => {
        toast.success("BOM Template created");
        navigate({ to: "/bom" });
      },
      onError: () => toast.error("Failed to create template"),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Bill of Materials", to: "/bom" },
          { label: "New Template" },
        ]}
        title="Create BOM Template"
        description="Define the column structure for a type of bill of materials."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/bom">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Cancel
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={createTemplate.isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Save Template
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 p-6">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid gap-2">
            <Label htmlFor="name">Template Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. PCB Assembly Template" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">BOM Columns</h3>
              <p className="text-sm text-muted-foreground">Define the standard columns that will appear in this BOM.</p>
            </div>
            <Button size="sm" onClick={addColumn} variant="outline">
              <Plus className="mr-1.5 h-4 w-4" /> Add Column
            </Button>
          </div>

          {columns.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
              No columns defined.
            </div>
          ) : (
            <div className="space-y-3">
              {columns.map((col, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input value={col} onChange={(e) => updateColumn(idx, e.target.value)} placeholder="e.g. Reference Designator" />
                  <Button variant="ghost" size="icon" onClick={() => removeColumn(idx)} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
