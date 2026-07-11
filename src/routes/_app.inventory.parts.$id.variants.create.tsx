import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePart, usePartVersions, useCreatePartVariant } from "@/lib/queries";
import type { PartVariant } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/inventory/parts/$id/variants/create")({
  component: CreateVariantPage,
});

function CreateVariantPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: part } = usePart(id);
  const { data: versions = [] } = usePartVersions();
  const createVariant = useCreatePartVariant();

  const partVersions = versions.filter((v) => v.partMasterId === id);

  const [partVersionId, setPartVersionId] = useState("");
  const [variantName, setVariantName] = useState("");
  const [specifications, setSpecifications] = useState("");

  const handleSave = () => {
    if (!partVersionId || !variantName) {
      toast.error("Version and Variant Name are required.");
      return;
    }

    const payload: PartVariant = {
      id: "pva" + Date.now(),
      partVersionId,
      variantName,
      specifications,
    };

    createVariant.mutate(payload, {
      onSuccess: () => {
        toast.success("Variant created successfully");
        navigate({ to: `/inventory/parts/${id}` });
      },
      onError: () => toast.error("Failed to create variant"),
    });
  };

  if (!part) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory", to: "/inventory/parts" },
          { label: "Parts", to: "/inventory/parts" },
          { label: part.partNumber, to: `/inventory/parts/${id}` },
          { label: "New Variant" },
        ]}
        title="Create Variant"
        description={`Creating a new variant for ${part.name}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/inventory/parts/${id}`}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Cancel
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={createVariant.isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Create Variant
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="partVersion">Base Version</Label>
              <Select value={partVersionId} onValueChange={setPartVersionId}>
                <SelectTrigger id="partVersion">
                  <SelectValue placeholder="Select version..." />
                </SelectTrigger>
                <SelectContent>
                  {partVersions.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.versionLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="variantName">Variant Name</Label>
              <Input id="variantName" value={variantName} onChange={(e) => setVariantName(e.target.value)} placeholder="e.g. EU Band" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea id="specifications" value={specifications} onChange={(e) => setSpecifications(e.target.value)} placeholder="List specific changes or specs..." rows={4} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
