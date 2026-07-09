import { createFileRoute } from "@tanstack/react-router";
import { Bell, Building2, KeyRound, Palette, ShieldCheck, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CZAR Production" },
      { name: "description", content: "Organisation, security and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Settings" },
        ]}
        title="Settings"
        description="Organisation, security, notifications and appearance."
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1 text-sm">
          {[
            { label: "Organisation", icon: Building2, active: true },
            { label: "Security", icon: ShieldCheck },
            { label: "Access & roles", icon: Users },
            { label: "API keys", icon: KeyRound },
            { label: "Notifications", icon: Bell },
            { label: "Appearance", icon: Palette },
          ].map((s) => (
            <a
              key={s.label}
              href="#"
              className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition ${
                s.active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
          <Card
            title="Organisation profile"
            description="Public details used across invoices, exports and system emails."
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Legal name</Label>
                <Input defaultValue="CZAR Production Pvt. Ltd." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Short code</Label>
                <Input defaultValue="CZAR" className="font-mono" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Support email</Label>
                <Input defaultValue="ops@czar.io" />
              </div>
            </div>
          </Card>

          <Card
            title="Security"
            description="Global authentication policies for all users in the workspace."
          >
            <Row
              title="Require MFA for admins"
              hint="Administrators must complete TOTP setup before signing in."
              control={<Switch defaultChecked />}
            />
            <Row
              title="Require MFA for all users"
              hint="Extends the same requirement to managers and operators."
              control={<Switch />}
            />
            <Row
              title="Password strength: Strong"
              hint="Minimum 12 chars, mixed case, digits and symbols."
              control={<Switch defaultChecked />}
            />
            <Row
              title="Session timeout"
              hint="Automatically sign out inactive sessions after 30 minutes."
              control={<Switch defaultChecked />}
            />
          </Card>

          <Card
            title="Notifications"
            description="How CZAR emails you about stock movements and system events."
          >
            <Row title="Low-stock alerts" hint="Nightly digest of items below reorder level." control={<Switch defaultChecked />} />
            <Row title="Pending BOM approvals" hint="Weekly digest for BOM owners." control={<Switch defaultChecked />} />
            <Row title="Rejected stock entries" hint="Instant alert when an entry is rejected." control={<Switch />} />
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Discard</Button>
            <Button>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-card">
      <header className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </header>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  );
}

function Row({ title, hint, control }: { title: string; hint: string; control: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        {control}
      </div>
      <Separator className="last:hidden" />
    </>
  );
}
