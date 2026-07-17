import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useWarehouses, useUpdateWarehouse, useDeleteWarehouse } from "@/lib/queries";

const PAGE_SIZE = 5;

export function useWarehousesIndexLogic() {
  const { data: rows = [], isLoading } = useWarehouses();
  const updateWarehouse = useUpdateWarehouse();
  const deleteWarehouse = useDeleteWarehouse();
  
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const cities = useMemo(() => Array.from(new Set(rows.map((r) => r.city))), [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter === "active" && !r.isActive) return false;
      if (statusFilter === "inactive" && r.isActive) return false;
      if (cityFilter !== "all" && r.city !== cityFilter) return false;
      if (query && !`${r.code} ${r.name} ${r.email}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [rows, query, statusFilter, cityFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteWarehouse.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Warehouse deleted");
        setDeleteTarget(null);
      },
    });
  }

  function toggleActive(id: string) {
    const warehouse = rows.find(r => r.id === id);
    if (warehouse) {
      updateWarehouse.mutate(
        { ...warehouse, isActive: !warehouse.isActive },
        { onSuccess: () => toast.success("Warehouse status updated") }
      );
    }
  }

  return {
    state: {
      query,
      statusFilter,
      cityFilter,
      page,
      deleteTarget,
      cities,
      filtered,
      view,
      total,
      pages,
      isDeleting: deleteWarehouse.isPending,
      isLoading,
    },
    handlers: {
      setQuery,
      setStatusFilter,
      setCityFilter,
      setPage,
      setDeleteTarget,
      confirmDelete,
      toggleActive,
    },
  };
}
