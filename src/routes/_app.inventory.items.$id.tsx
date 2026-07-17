import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";
import { useItemViewLogic } from "@/hooks/features/inventory/useItemViewLogic";

export const Route = createFileRoute("/_app/inventory/items/$id")({
  head: () => ({ meta: [{ title: "View Item Template — CZAR Production" }] }),
  component: ItemViewPage,
});

function ItemViewPage() {
  const { id } = Route.useParams();
  const { state } = useItemViewLogic(id);
  const { item, isLoading } = state;

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!item) return <div className="p-10 text-center">Item template not found</div>;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Items", to: "/inventory/items" },
          { label: item.name },
        ]}
        title={item.name}
        description="View item template details."
      />
      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/inventory/items">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to items
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Item Name">
                <div className="font-medium">{item.name}</div>
              </Field>
              <Field label="Company Part Code">
                <div className="font-mono">{item.companyPartCode}</div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Tracking</p>
                  <p className="text-xs text-muted-foreground">Type of inventory tracking.</p>
                </div>
                <StatusBadge tone={item.isSerialized ? "warning" : "neutral"}>
                  {item.isSerialized ? "Serialized" : "Bulk"}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-xs text-muted-foreground">Current active status.</p>
                </div>
                <StatusBadge tone={item.isActive ? "success" : "neutral"}>
                  {item.isActive ? "Active" : "Inactive"}
                </StatusBadge>
              </div>
            </div>

            {item.attributes && Object.keys(item.attributes).length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-semibold">Attributes</Label>
                <div className="grid gap-2">
                  {Object.entries(item.attributes).map(([k, v]) => (
                    <div key={k} className="flex justify-between rounded-md bg-muted/30 px-3 py-2 text-sm">
                      <span className="font-medium text-muted-foreground capitalize">{k}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to={`/inventory/items/edit/${item.id}`}>Edit Item</Link>
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
