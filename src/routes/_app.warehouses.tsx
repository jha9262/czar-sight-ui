import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { warehouses as seed, type Warehouse } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/warehouses")({
  head: () => ({
    meta: [
      { title: "Warehouses — CZAR Production" },
      { name: "description", content: "Manage distribution centres and fulfilment hubs." },
    ],
  }),
  component: WarehousesPage,
});

const PAGE_SIZE = 5;

function WarehousesPage() {
  const [rows, setRows] = useState<Warehouse[]>(seed);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);

  const cities = useMemo(() => Array.from(new Set(rows.map((r) => r.city))), [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter === "active" && !r.isActive) return false;
      if (statusFilter === "inactive" && r.isActive) return false;
      if (cityFilter !== "all" && r.city !== cityFilter) return false;
      if (query && !`${r.code} ${r.name} ${r.email}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [rows, query, statusFilter, cityFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(w: Warehouse) {
    setEditing(w);
    setOpen(true);
  }
  function toggleActive(id: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
    toast.success("Warehouse status updated");
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Warehouses" },
        ]}
        title="Warehouses"
        description={`${total} location${total === 1 ? "" : "s"} across your network`}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" /> New warehouse
          </Button>
        }
      />

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search code, name, email…"
              className="h-9 pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
            <Filter className="mr-1.5 h-3.5 w-3.5" /> More filters
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[140px]">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {view.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                    No warehouses match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                view.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-mono text-xs">{w.code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{w.name}</div>
                      <div className="text-xs text-muted-foreground">{w.address}</div>
                    </TableCell>
                    <TableCell className="text-sm">{w.city}</TableCell>
                    <TableCell className="text-sm">{w.country}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">{w.phone}</div>
                      <div className="text-xs">{w.email}</div>
                    </TableCell>
                    <TableCell>
                      {w.isActive ? (
                        <StatusBadge tone="success">Active</StatusBadge>
                      ) : (
                        <StatusBadge tone="destructive">Inactive</StatusBadge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(w)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(w.id)}>
                          {w.isActive ? <Trash2 className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
            <span>
              Showing <span className="font-mono">{view.length}</span> of{" "}
              <span className="font-mono">{total}</span>
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="px-2 font-mono">
                {page} / {pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <WarehouseFormDrawer
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSave={(w) => {
          setRows((rs) => {
            const exists = rs.find((r) => r.id === w.id);
            return exists ? rs.map((r) => (r.id === w.id ? w : r)) : [w, ...rs];
          });
          toast.success(editing ? "Warehouse updated" : "Warehouse created");
          setOpen(false);
        }}
      />
    </div>
  );
}

function WarehouseFormDrawer({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Warehouse | null;
  onSave: (w: Warehouse) => void;
}) {
  const empty: Warehouse = {
    id: crypto.randomUUID(),
    code: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    isActive: true,
  };
  const [form, setForm] = useState<Warehouse>(initial ?? empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset on open
  useMemo(() => {
    setForm(initial ?? { ...empty, id: crypto.randomUUID() });
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, open]);

  function set<K extends keyof Warehouse>(k: K, v: Warehouse[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit() {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{initial ? "Edit warehouse" : "New warehouse"}</SheetTitle>
          <SheetDescription>
            Location codes are used across stock entries, transfers and ledgers.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code" error={errors.code}>
              <Input
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="WH-BLR-01"
                className="font-mono"
              />
            </Field>
            <Field label="Name" error={errors.name}>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Bengaluru Central DC" />
            </Field>
          </div>
          <Field label="Description">
            <Textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" />
            </Field>
          </div>
          <Field label="Address">
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="City" error={errors.city}>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="State">
              <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
            </Field>
            <Field label="Postal code">
              <Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} className="font-mono" />
            </Field>
          </div>
          <Field label="Country">
            <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
          </Field>
          <div className="flex items-center justify-between rounded-md border bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">Inactive warehouses are hidden from new stock entries.</p>
            </div>
            <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
          </div>
        </div>
        <SheetFooter className="border-t p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{initial ? "Save changes" : "Create warehouse"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
