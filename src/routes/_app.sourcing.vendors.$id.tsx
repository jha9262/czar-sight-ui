import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";
import { useVendorViewLogic } from "@/hooks/features/sourcing/useVendorViewLogic";

export const Route = createFileRoute("/_app/sourcing/vendors/$id")({
  head: () => ({ meta: [{ title: "View Vendor — CZAR Production" }] }),
  component: VendorViewPage,
});

function VendorViewPage() {
  const { id } = Route.useParams();
  const { state } = useVendorViewLogic(id);
  const { vendor, isLoading } = state;

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!vendor) return <div className="p-10 text-center">Vendor not found</div>;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Sourcing", to: "/sourcing/vendors" },
          { label: vendor.name },
        ]}
        title={vendor.name}
        description="View vendor details."
      />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/sourcing/vendors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to vendors
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Code">
                <div className="font-mono">{vendor.code}</div>
              </Field>
              <Field label="Name">
                <div className="font-medium">{vendor.name}</div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact Person">
                <div>{vendor.contact}</div>
              </Field>
              <Field label="Phone">
                <div>{vendor.phone}</div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <div>{vendor.email}</div>
              </Field>
            </div>

            <Field label="Address">
              <div>{vendor.address}</div>
            </Field>

            <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-muted-foreground">Current active status.</p>
              </div>
              <StatusBadge tone={vendor.status === "ACTIVE" ? "success" : "neutral"}>
                {vendor.status}
              </StatusBadge>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to={`/sourcing/vendors/edit/${vendor.code}`}>Edit Vendor</Link>
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
