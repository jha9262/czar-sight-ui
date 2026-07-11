import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, Pencil, Plus, ShieldCheck, ShieldOff, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/delete-dialog";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
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
import { useUsers, useUpdateUser, useDeleteUser } from "@/lib/queries";

export const Route = createFileRoute("/_app/users/")({
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
  const { data: rows = [] } = useUsers();
  const deleteUser = useDeleteUser();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = rows.filter((u) => 
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q.toLowerCase())
  );

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
          <Button size="sm" asChild>
            <Link to="/users/create">
              <Plus className="mr-1.5 h-4 w-4" /> New user
            </Link>
          </Button>
        }
      />

      <div className="p-6">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <DataTableToolbar searchPlaceholder="Search users..." searchValue={q} onSearchChange={setQ} />
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[200px]">
                  <div className="flex items-center gap-1 cursor-pointer">User <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Role <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Active <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">MFA <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Last active <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center justify-center gap-1 cursor-pointer">Actions</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="text-left">
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
                  <TableCell className="text-center">
                    <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium">{u.role}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {u.isActive ? (
                      <StatusBadge tone="success">Active</StatusBadge>
                    ) : (
                      <StatusBadge tone="destructive">Disabled</StatusBadge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
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
                  <TableCell className="text-xs text-muted-foreground text-center">{u.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800" asChild>
                        <Link to={`/users/${u.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20" asChild>
                        <Link to={`/users/edit/${u.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setDeleteTarget(u.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <DataTablePagination totalItems={rows.length} itemsPerPage={filtered.length} itemName="users" />
        </div>
      </div>

      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete user?" description="This will remove the user and revoke all sessions." onConfirm={() => { if (deleteTarget) deleteUser.mutate(deleteTarget, { onSuccess: () => { toast.success("User deleted"); setDeleteTarget(null); } }); }} isPending={deleteUser.isPending} />
    </div>
  );
}
