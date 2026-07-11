import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";
import { useUser } from "@/lib/queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_app/users/$id")({
  head: () => ({ meta: [{ title: "View User — CZAR Production" }] }),
  component: UserViewPage,
});

function UserViewPage() {
  const { id } = Route.useParams();
  const { data: user, isLoading } = useUser(id);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">User not found</div>;

  const initials = user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Users", to: "/users" },
          { label: user.name },
        ]}
        title={user.name}
        description="View user details."
      />
      <div className="mx-auto max-w-3xl p-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground">
          <Link to="/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to users
          </Link>
        </Button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role">
                <div className="font-medium capitalize">{user.role.replace("_", " ")}</div>
              </Field>
              <Field label="Department">
                <div>{user.department}</div>
              </Field>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-xs text-muted-foreground">Current access status.</p>
                </div>
                <StatusBadge tone={user.isActive ? "success" : "neutral"}>
                  {user.isActive ? "Active" : "Inactive"}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">MFA Status</p>
                  <p className="text-xs text-muted-foreground">Two-factor authentication.</p>
                </div>
                <StatusBadge tone={user.mfaEnabled ? "success" : "warning"}>
                  {user.mfaEnabled ? "Enabled" : "Disabled"}
                </StatusBadge>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to={`/users/edit/${user.id}`}>Edit User</Link>
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
