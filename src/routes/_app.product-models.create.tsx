import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type DispenserModel } from "@/lib/mock/data2";
import { useProductModelCreateLogic } from "@/hooks/features/bom/useProductModelCreateLogic";

export const Route = createFileRoute("/_app/product-models/create")({
  head: () => ({
    meta: [{ title: "New Product Model — CZAR Production" }],
  }),
  component: ProductModelCreatePage,
});

function ProductModelCreatePage() {
  const { state, handlers } = useProductModelCreateLogic();
  const { form, errors, isPending } = state;
  const { set, submit } = handlers;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Catalog" },
          { label: "Product Models", to: "/product-models" },
          { label: "New Model" },
        ]}
        title="New Product Model"
        description="Define a top-level manufacturable product."
      />

      <div className="mx-auto max-w-[100%] p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/product-models">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to models
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Model Code" error={errors.code}>
                <Input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="CZR-MOD-001"
                  className="font-mono"
                />
              </Field>
              <Field label="Name" error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Model Name" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="MSRP (USD)">
                <Input type="number" value={form.msrp} onChange={(e) => set("msrp", parseFloat(e.target.value) || 0)} />
              </Field>
            </div>

            <Field label="Description">
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
            </Field>

            <Field label="Status">
              <Select value={form.status} onValueChange={(v: any) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/product-models">Cancel</Link>
            </Button>
            <Button onClick={submit} disabled={isPending}>
              {isPending ? "Creating..." : "Create Product Model"}
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
