import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";
import { useManufacturerViewLogic } from "@/hooks/features/sourcing/useManufacturerViewLogic";

export const Route = createFileRoute("/_app/sourcing/manufacturers/$id")({
  head: () => ({ meta: [{ title: "View Manufacturer — CZAR Production" }] }),
  component: ManufacturerViewPage,
});

function ManufacturerViewPage() {
  const { id } = Route.useParams();
  const { state } = useManufacturerViewLogic(id);
  const { manufacturer: mfr, isLoading } = state;

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!mfr) return <div className="p-10 text-center">Manufacturer not found</div>;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Sourcing", to: "/sourcing/manufacturers" },
          { label: mfr.name },
        ]}
        title={mfr.name}
        description="View manufacturer details."
      />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/sourcing/manufacturers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to manufacturers
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Code">
                <div className="font-mono">{mfr.code}</div>
              </Field>
              <Field label="Name">
                <div className="font-medium">{mfr.name}</div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact Person">
                <div>{mfr.contact}</div>
              </Field>
              <Field label="Phone">
                <div>{mfr.phone}</div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <div>{mfr.email}</div>
              </Field>
            </div>

            <Field label="Address">
              <div>{mfr.address}</div>
            </Field>

            <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-muted-foreground">Current active status.</p>
              </div>
              <StatusBadge tone={mfr.status === "ACTIVE" ? "success" : "neutral"}>
                {mfr.status}
              </StatusBadge>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to={`/sourcing/manufacturers/edit/${mfr.code}`}>Edit Manufacturer</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="text-sm">{children}</div>
    </div>
  );
}
