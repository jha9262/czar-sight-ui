import { useState } from "react";
import { toast } from "sonner";
import { useVendors, useDeleteVendor } from "@/lib/queries";

export function useVendorsIndexLogic() {
  const { data: vendors = [] } = useVendors();
  const deleteVendor = useDeleteVendor();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = vendors.filter((v) =>
    `${v.name} ${v.code} ${v.contact}`.toLowerCase().includes(q.toLowerCase())
  );

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteVendor.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Vendor deleted");
        setDeleteTarget(null);
      },
    });
  }

  return {
    state: { vendors, filtered, q, deleteTarget, isDeleting: deleteVendor.isPending },
    handlers: { setQ, setDeleteTarget, confirmDelete },
  };
}
