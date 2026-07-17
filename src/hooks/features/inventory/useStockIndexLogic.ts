import { useState } from "react";
import { toast } from "sonner";
import { useSerializedItems, useBulkItems, useDeleteSerializedItem, useDeleteBulkItem } from "@/lib/queries";
import { warehouses } from "@/lib/mock/data";

export function useStockIndexLogic() {
  const [tab, setTab] = useState<"serialized" | "bulk">("serialized");
  const [query, setQuery] = useState("");
  
  const { data: serializedItems = [] } = useSerializedItems();
  const { data: bulkItems = [] } = useBulkItems();
  
  const deleteSerialized = useDeleteSerializedItem();
  const deleteBulk = useDeleteBulkItem();
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: "serialized" | "bulk" } | null>(null);

  const filteredSer = serializedItems.filter((i) =>
    `${i.serial} ${i.template} ${i.companyPartCode}`.toLowerCase().includes(query.toLowerCase()),
  );
  
  const filteredBulk = bulkItems.filter((i) =>
    `${i.batchNumber} ${i.template} ${i.companyPartCode}`.toLowerCase().includes(query.toLowerCase()),
  );

  function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === "serialized") {
      deleteSerialized.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Serialized item deleted");
          setDeleteTarget(null);
        },
      });
    } else {
      deleteBulk.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Bulk item deleted");
          setDeleteTarget(null);
        },
      });
    }
  }

  return {
    state: {
      tab,
      query,
      serializedItems,
      bulkItems,
      filteredSer,
      filteredBulk,
      deleteTarget,
      warehouses,
      isDeleting: deleteSerialized.isPending || deleteBulk.isPending,
    },
    handlers: {
      setTab,
      setQuery,
      setDeleteTarget,
      confirmDelete,
    },
  };
}
