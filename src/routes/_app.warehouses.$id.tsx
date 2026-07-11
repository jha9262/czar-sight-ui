import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { useWarehouse } from "@/lib/queries";

export const Route = createFileRoute("/_app/warehouses/$id")({
  head: () => ({ meta: [{ title: "View Warehouse — CZAR Production" }] }),
  component: WarehouseViewPage,
});

function WarehouseViewPage() {
  const { id } = Route.useParams();
  const { data: warehouse, isLoading } = useWarehouse(id);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!warehouse) return <div className="p-10 text-center">Warehouse not found</div>;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Warehouses", to: "/warehouses" },
          { label: warehouse.name },
        ]}
        title={warehouse.name}
        description="View warehouse details."
      />
      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/warehouses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to warehouses
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Warehouse Code">
                <div className="font-mono">{warehouse.code}</div>
              </Field>
              <Field label="Warehouse Name">
                <div className="font-medium">{warehouse.name}</div>
              </Field>
            </div>
            
            <Field label="Description">
              <div>{warehouse.description || "—"}</div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone">
                <div>{warehouse.phone || "—"}</div>
              </Field>
              <Field label="Email">
                <div>{warehouse.email || "—"}</div>
              </Field>
            </div>
            
            <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
              <h3 className="text-sm font-medium">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Address">
                  <div>{warehouse.address}</div>
                </Field>
                <Field label="City">
                  <div>{warehouse.city}</div>
                </Field>
                <Field label="State/Region">
                  <div>{warehouse.state}</div>
                </Field>
                <Field label="Postal Code">
                  <div>{warehouse.postalCode}</div>
                </Field>
                <Field label="Country">
                  <div>{warehouse.country}</div>
                </Field>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-muted-foreground">Current active status.</p>
              </div>
              <StatusBadge tone={warehouse.isActive ? "success" : "neutral"}>
                {warehouse.isActive ? "Active" : "Inactive"}
              </StatusBadge>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to={`/warehouses/edit/${warehouse.id}`}>Edit Warehouse</Link>
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
