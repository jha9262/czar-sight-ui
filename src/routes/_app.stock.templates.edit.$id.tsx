import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type EntryTemplate } from "@/lib/mock/data2";
import { useStockTemplate, useUpdateStockTemplate } from "@/lib/queries";

export const Route = createFileRoute("/_app/stock/templates/edit/$id")({
  head: () => ({
    meta: [{ title: "Edit Stock Template — CZAR Production" }],
  }),
  component: StockTemplateEditPage,
});

function StockTemplateEditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: template, isLoading } = useStockTemplate(id);
  const updateTemplate = useUpdateStockTemplate();

  const [form, setForm] = useState<EntryTemplate | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template) {
      setForm(template);
    }
  }, [template]);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!template || !form) return <div className="p-10 text-center">Template not found</div>;

  function set<K extends keyof EntryTemplate>(k: K, v: EntryTemplate[K]) {
    setForm((f) => f ? { ...f, [k]: v } : null);
  }

  function submit() {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    updateTemplate.mutate(form, {
      onSuccess: () => {
        toast.success("Stock template updated");
        navigate({ to: "/stock/templates" });
      },
    });
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Stock Management" },
          { label: "Templates", to: "/stock/templates" },
          { label: "Edit Template" },
        ]}
        title="Edit Stock Template"
        description="Update schema for stock entries."
      />

      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/stock/templates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to templates
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Template Code" error={errors.code}>
                <Input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="TPL-XYZ"
                  className="font-mono"
                />
              </Field>
              <Field label="Name" error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Template Name" />
              </Field>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fields Count">
                <Input type="number" value={form.fields} onChange={(e) => set("fields", parseInt(e.target.value) || 0)} />
              </Field>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/stock/templates">Cancel</Link>
            </Button>
            <Button onClick={submit} disabled={updateTemplate.isPending}>
              {updateTemplate.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
