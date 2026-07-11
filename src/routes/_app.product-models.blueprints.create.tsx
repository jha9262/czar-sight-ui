import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateBlueprint, useDispenserModels } from "@/lib/queries";
import type { Blueprint } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/product-models/blueprints/create")({
  component: CreateBlueprintPage,
});

function CreateBlueprintPage() {
  const navigate = useNavigate();
  const createBlueprint = useCreateBlueprint();
  const { data: models = [] } = useDispenserModels();

  const [name, setName] = useState("");
  const [productModelId, setProductModelId] = useState("");
  const [activeRevision, setActiveRevision] = useState("v1.0");
  const [status, setStatus] = useState("Draft");

  const handleSave = () => {
    if (!name || !productModelId || !activeRevision) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload: Blueprint = {
      id: "bp" + Date.now(),
      name,
      productModelId,
      activeRevision,
      status,
    };

    createBlueprint.mutate(payload, {
      onSuccess: () => {
        toast.success("Blueprint created successfully");
        navigate({ to: "/product-models" });
      },
      onError: () => toast.error("Failed to create blueprint"),
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Product Models", to: "/product-models" },
          { label: "Blueprints", to: "/product-models" },
          { label: "New Blueprint" },
        ]}
        title="Create Blueprint"
        description="Define a new assembly structure."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/product-models">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Cancel
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={createBlueprint.isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Create Blueprint
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Blueprint Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. DSP-V4 Production Assembly" />
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
              <Label htmlFor="rev">Initial Revision</Label>
              <Input id="rev" value={activeRevision} onChange={(e) => setActiveRevision(e.target.value)} placeholder="v1.0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
