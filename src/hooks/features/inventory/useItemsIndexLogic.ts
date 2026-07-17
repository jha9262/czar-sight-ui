import { useState } from "react";
import { toast } from "sonner";
import { useItems, useDeleteItem } from "@/lib/queries";

export function useItemsIndexLogic() {
  const { data: items = [] } = useItems();
  const deleteItem = useDeleteItem();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = items.filter((t) =>
    `${t.name} ${t.companyPartCode}`.toLowerCase().includes(q.toLowerCase())
  );

  function confirmDelete() {
    if (deleteTarget) {
      deleteItem.mutate(deleteTarget, {
        onSuccess: () => {
          toast.success("Item deleted");
          setDeleteTarget(null);
        },
      });
    }
  }

  return {
    state: {
      items,
      filtered,
      q,
      deleteTarget,
      isDeleting: deleteItem.isPending,
    },
    handlers: {
      setQ,
      setDeleteTarget,
      confirmDelete,
    },
  };
}
