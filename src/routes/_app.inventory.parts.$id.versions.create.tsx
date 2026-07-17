import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePartVersionCreateLogic } from "@/hooks/features/inventory/usePartVersionCreateLogic";

export const Route = createFileRoute("/_app/inventory/parts/$id/versions/create")({
  component: CreateVersionPage,
});

function CreateVersionPage() {
  const { id } = Route.useParams();
  const { state, handlers } = usePartVersionCreateLogic(id);
  const { part, versionLabel, changelog } = state;
  const { setVersionLabel, setChangelog, handleSave } = handlers;

  if (!part) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory", to: "/inventory/parts" },
          { label: "Parts", to: "/inventory/parts" },
          { label: part.partNumber, to: `/inventory/parts/${id}` },
          { label: "New Version" },
        ]}
        title="Create Version"
        description={`Creating a new version for ${part.name}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/inventory/parts/${id}`}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Cancel
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={createVersion.isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Create Version
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="versionLabel">Version Label</Label>
              <Input id="versionLabel" value={versionLabel} onChange={(e) => setVersionLabel(e.target.value)} placeholder="e.g. r5.0" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="changelog">Changelog / Notes</Label>
              <Textarea id="changelog" value={changelog} onChange={(e) => setChangelog(e.target.value)} placeholder="Describe the changes in this version..." rows={4} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
