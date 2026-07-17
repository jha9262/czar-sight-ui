import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Box } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePartViewLogic } from "@/hooks/features/inventory/usePartViewLogic";

export const Route = createFileRoute("/_app/inventory/parts/$id")({
  component: PartDetailView,
});

function PartDetailView() {
  const { id } = Route.useParams();
  const { state } = usePartViewLogic(id);
  const { part, partVersions, partVariants, isLoading } = state;

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!part) return <div className="p-10 text-center">Part not found</div>;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory", to: "/inventory/parts" },
          { label: "Parts", to: "/inventory/parts" },
          { label: part.partNumber },
        ]}
        title={part.name}
        description={`Manage versions and variants for ${part.partNumber}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/inventory/parts">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Parts
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to={`/inventory/parts/edit/${part.id}`}>
                Edit Master Part
              </Link>
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="mb-6 rounded-xl border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Box className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{part.name}</h3>
            <p className="font-mono text-sm text-muted-foreground">{part.partNumber}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium">{part.partType}</p>

          </div>
        </div>

        <Tabs defaultValue="versions">
          <TabsList>
            <TabsTrigger value="versions">Versions ({partVersions.length})</TabsTrigger>
            <TabsTrigger value="variants">Variants ({partVariants.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="versions" className="mt-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Part Versions</h3>
                <Button size="sm" asChild>
                  <Link to={`/inventory/parts/${part.id}/versions/create`}>
                    <Plus className="mr-1.5 h-4 w-4" /> New Version
                  </Link>
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Version Label</TableHead>
                    <TableHead>Changelog</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partVersions.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium font-mono">{v.versionLabel}</TableCell>
                      <TableCell>{v.changelog}</TableCell>
                    </TableRow>
                  ))}
                  {partVersions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">No versions found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="variants" className="mt-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Part Variants</h3>
                <Button size="sm" asChild>
                  <Link to={`/inventory/parts/${part.id}/variants/create`}>
                    <Plus className="mr-1.5 h-4 w-4" /> New Variant
                  </Link>
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Variant Name</TableHead>
                    <TableHead>Base Version</TableHead>
                    <TableHead>Specifications</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partVariants.map((v) => {
                    const version = partVersions.find(pv => pv.id === v.partVersionId);
                    return (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.variantName}</TableCell>
                        <TableCell className="font-mono text-xs">{version?.versionLabel}</TableCell>
                        <TableCell>{v.specifications}</TableCell>
                      </TableRow>
                    );
                  })}
                  {partVariants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">No variants found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
