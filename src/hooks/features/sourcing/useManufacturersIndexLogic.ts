import { useState } from "react";
import { toast } from "sonner";
import { useManufacturers, useDeleteManufacturer } from "@/lib/queries";

export function useManufacturersIndexLogic() {
  const { data: manufacturers = [] } = useManufacturers();
  const deleteMfr = useDeleteManufacturer();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = manufacturers.filter((m) =>
    `${m.name} ${m.code} ${m.contact}`.toLowerCase().includes(q.toLowerCase())
  );

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMfr.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Manufacturer deleted");
        setDeleteTarget(null);
      },
    });
  }

  return {
    state: { manufacturers, filtered, q, deleteTarget, isDeleting: deleteMfr.isPending },
    handlers: { setQ, setDeleteTarget, confirmDelete },
  };
}
