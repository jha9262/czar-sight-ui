import { useState } from "react";
import { toast } from "sonner";
import { useParts, useDeletePart } from "@/lib/queries";
import { partTypes } from "@/lib/mock/data2";

export function usePartsIndexLogic() {
  const { data: partMasters = [] } = useParts();
  const deletePart = useDeletePart();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredMasters = partMasters.filter((p) =>
    `${p.partNumber} ${p.name} ${p.partType}`.toLowerCase().includes(q.toLowerCase())
  );

  function confirmDelete() {
    if (deleteTarget) {
      deletePart.mutate(deleteTarget, {
        onSuccess: () => {
          toast.success("Part deleted");
          setDeleteTarget(null);
        },
      });
    }
  }

  return {
    state: {
      partMasters,
      filteredMasters,
      partTypes,
      q,
      deleteTarget,
      isDeleting: deletePart.isPending,
    },
    handlers: {
      setQ,
      setDeleteTarget,
      confirmDelete,
    },
  };
}
