import { useState } from "react";
import { toast } from "sonner";
import { useSourcings, useDeleteSourcing } from "@/lib/queries";

export function useSourcingIndexLogic() {
  const { data: sourcings = [] } = useSourcings();
  const deleteSourcing = useDeleteSourcing();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = sourcings.filter((s) => 
    `${s.templateName} ${s.templateCode} ${s.manufacturer} ${s.mpn}`.toLowerCase().includes(q.toLowerCase())
  );

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteSourcing.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Sourcing link removed");
        setDeleteTarget(null);
      },
    });
  }

  return {
    state: { sourcings, filtered, q, deleteTarget, isDeleting: deleteSourcing.isPending },
    handlers: { setQ, setDeleteTarget, confirmDelete },
  };
}
