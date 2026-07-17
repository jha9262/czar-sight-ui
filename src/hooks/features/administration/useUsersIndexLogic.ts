import { useState } from "react";
import { toast } from "sonner";
import { useUsers, useDeleteUser } from "@/lib/queries";

export function useUsersIndexLogic() {
  const { data: rows = [] } = useUsers();
  const deleteUser = useDeleteUser();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = rows.filter((u) => 
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q.toLowerCase())
  );

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("User deleted");
        setDeleteTarget(null);
      },
    });
  }

  return {
    state: {
      q,
      rows,
      filtered,
      deleteTarget,
      isDeleting: deleteUser.isPending,
    },
    handlers: {
      setQ,
      setDeleteTarget,
      confirmDelete,
    },
  };
}
