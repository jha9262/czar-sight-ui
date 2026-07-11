import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBomComponentType, useUpdateBomComponentType } from "@/lib/queries";

export const Route = createFileRoute("/_app/bom/component-types/edit/$id")({
  component: EditComponentTypePage,
});

function EditComponentTypePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: componentType } = useBomComponentType(id);
  const updateComponentType = useUpdateBomComponentType();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState<{ key: string; dataType: string; requirement: string }[]>([]);

  useEffect(() => {
    if (componentType) {
      setCode(componentType.code);
      setName(componentType.name);
      setDescription(componentType.description);
      setProperties(componentType.properties || []);
    }
  }, [componentType]);

  const addProperty = () => {
    setProperties([...properties, { key: "", dataType: "String", requirement: "Optional" }]);
  };

  const removeProperty = (idx: number) => {
    setProperties(properties.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!componentType || !code || !name) {
      toast.error("Code and Name are required.");
      return;
    }

    updateComponentType.mutate(
      { ...componentType, code, name, description, properties },
      {
        onSuccess: () => {
          toast.success("Component Type updated");
          navigate({ to: "/bom" });
        },
        onError: () => toast.error("Failed to update component type"),
      }
    );
  };

  if (!componentType) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Bill of Materials", to: "/bom" },
          { label: "Edit Component Type" },
        ]}
        title="Edit Component Type"
        description={`Managing ${componentType.name}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/bom">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Cancel
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={updateComponentType.isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Save Changes
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 p-6">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Property Schema</h3>
              <p className="text-sm text-muted-foreground">Dynamic properties required for this component type.</p>
            </div>
            <Button size="sm" onClick={addProperty} variant="outline">
              <Plus className="mr-1.5 h-4 w-4" /> Add Property
            </Button>
          </div>

          {properties.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
              No properties defined. Add properties to enforce schema validation.
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((prop, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-md border p-3">
                  <div className="flex-1 grid gap-2">
                    <Label>Key</Label>
                    <Input value={prop.key} onChange={(e) => { const np = [...properties]; np[idx].key = e.target.value; setProperties(np); }} />
                  </div>
                  <div className="w-1/4 grid gap-2">
                    <Label>Data Type</Label>
                    <Select value={prop.dataType} onValueChange={(v) => { const np = [...properties]; np[idx].dataType = v; setProperties(np); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Number">Number</SelectItem>
                        <SelectItem value="Boolean">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/4 grid gap-2">
                    <Label>Requirement</Label>
                    <Select value={prop.requirement} onValueChange={(v) => { const np = [...properties]; np[idx].requirement = v; setProperties(np); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Optional">Optional</SelectItem>
                        <SelectItem value="Mandatory">Mandatory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-6">
                    <Button variant="ghost" size="icon" onClick={() => removeProperty(idx)} className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
