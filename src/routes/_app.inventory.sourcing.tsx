import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Link2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { itemTemplates, sourcings } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/inventory/sourcing")({
  head: () => ({
    meta: [
      { title: "Sourcing — CZAR Production" },
      { name: "description", content: "Link manufacturers and MPNs to item templates." },
    ],
  }),
  component: SourcingPage,
});

const manufacturers = ["Delta EMS", "Foxpoint", "Kamoer", "SealTech", "Bossard", "Molex"];

function SourcingPage() {
  const [tpl, setTpl] = useState("");
  const [mfr, setMfr] = useState("");
  const [mpn, setMpn] = useState("");
  const [lead, setLead] = useState("");

  function link() {
    if (!tpl || !mfr || !mpn) return toast.error("Fill template, manufacturer and MPN");
    toast.success("Manufacturer linked to template");
    setMpn("");
    setLead("");
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Inventory" },
          { label: "Sourcing" },
        ]}
        title="Item sourcing"
        description="Link manufacturers and MPNs to item templates and mark preferred suppliers."
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-lg border bg-card p-5">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Link2 className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold">Link manufacturer</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Attach a manufacturer + MPN to an existing item template.
          </p>
          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Item template</Label>
              <Select value={tpl} onValueChange={setTpl}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {itemTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.companyPartCode}>
                      {t.companyPartCode} — {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Manufacturer</Label>
              <Select value={mfr} onValueChange={setMfr}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">MPN</Label>
                <Input value={mpn} onChange={(e) => setMpn(e.target.value)} className="font-mono" placeholder="MFR-PART-001" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Lead time (days)</Label>
                <Input type="number" value={lead} onChange={(e) => setLead(e.target.value)} className="font-mono" placeholder="14" />
              </div>
            </div>
            <Button className="w-full" onClick={link}>
              <Plus className="mr-1 h-4 w-4" /> Link source
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold">Existing sources</h2>
              <p className="text-xs text-muted-foreground">Manufacturers linked to templates</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Template</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>MPN</TableHead>
                <TableHead className="text-right">Lead time</TableHead>
                <TableHead>Preferred</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourcings.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium">{s.templateName}</div>
                    <div className="font-mono text-xs text-muted-foreground">{s.templateCode}</div>
                  </TableCell>
                  <TableCell className="text-sm">{s.manufacturer}</TableCell>
                  <TableCell className="font-mono text-xs">{s.mpn}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{s.leadTimeDays} d</TableCell>
                  <TableCell>
                    {s.preferred ? (
                      <StatusBadge tone="success">
                        <CheckCircle2 className="h-3 w-3" /> Preferred
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">Alternate</StatusBadge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
