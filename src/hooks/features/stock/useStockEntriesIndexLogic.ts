import { useState } from "react";
import { toast } from "sonner";
import { useStockEntries, useDeleteStockEntry } from "@/lib/queries";

export function useStockEntriesIndexLogic() {
  const { data: stockEntries = [] } = useStockEntries();
  const deleteEntry = useDeleteStockEntry();
  
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  
  const filtered = stockEntries.filter((e) =>
    `${e.code} ${e.template} ${e.warehouse} ${e.createdBy}`.toLowerCase().includes(q.toLowerCase()),
  );

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteEntry.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Stock entry deleted");
        setDeleteTarget(null);
      },
    });
  };

  return {
    state: { q, filtered, deleteTarget, isDeleting: deleteEntry.isPending },
    handlers: { setQ, setDeleteTarget, confirmDelete },
  };
}
