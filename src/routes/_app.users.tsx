import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Pencil, Plus, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users as seed, type UserRow } from "@/lib/mock/data2";

export const Route = createFileRoute("/_app/users")({
  head: () => ({
    meta: [
      { title: "Users — CZAR Production" },
      { name: "description", content: "Manage operators, managers and administrators." },
    ],
  }),
  component: UsersPage,
});

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>(seed);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState<UserRow | null>(null);

  function save(u: UserRow) {
    setRows((rs) => rs.map((r) => (r.id === u.id ? u : r)));
    toast.success("User updated");
    setEditing(null);
  }
  function remove(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
    toast.success("User deleted");
    setDeleting(null);
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Users" },
        ]}
        title="Users & access"
        description="Manage administrators, managers and warehouse operators."
        actions={
          <>
            <span className="hidden text-xs text-muted-foreground md:inline">
              Admin-only area
            </span>
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> Invite user
            </Button>
          </>
        }
      />

      <div className="p-6">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                          {initials(u.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium">{u.role}</span>
                  </TableCell>
                  <TableCell>
                    {u.isActive ? (
                      <StatusBadge tone="success">Active</StatusBadge>
                    ) : (
                      <StatusBadge tone="destructive">Disabled</StatusBadge>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.mfaEnabled ? (
                      <StatusBadge tone="success">
                        <ShieldCheck className="h-3 w-3" /> Enabled
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="warning">
                        <ShieldOff className="h-3 w-3" /> Off
                      </StatusBadge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(u)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleting(u)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <EditUserDialog user={editing} onOpenChange={(v) => !v && setEditing(null)} onSave={save} />
      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the user and revoke all sessions. Stock entries authored by this user
              remain in the audit log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && remove(deleting.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EditUserDialog({
  user,
  onOpenChange,
  onSave,
}: {
  user: UserRow | null;
  onOpenChange: (v: boolean) => void;
  onSave: (u: UserRow) => void;
}) {
  const [form, setForm] = useState<UserRow | null>(user);
  // sync when user changes
  if (user && (!form || form.id !== user.id)) setForm(user);
  if (!user || !form) return null;

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Update profile, status or reset the password.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => toast.success("Password reset email sent")}>
            <KeyRound className="mr-1.5 h-4 w-4" /> Send password reset email
          </Button>
          <div className="flex items-center justify-between rounded-md border bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium">Account active</p>
              <p className="text-xs text-muted-foreground">Disabled users cannot sign in.</p>
            </div>
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium">Require MFA</p>
              <p className="text-xs text-muted-foreground">User must set up an authenticator to sign in.</p>
            </div>
            <Switch checked={form.mfaEnabled} onCheckedChange={(v) => setForm({ ...form, mfaEnabled: v })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
