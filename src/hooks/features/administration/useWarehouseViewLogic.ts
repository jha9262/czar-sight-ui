import { useWarehouse } from "@/lib/queries";

export function useWarehouseViewLogic(id: string) {
  const { data: warehouse, isLoading } = useWarehouse(id);

  return {
    state: { warehouse, isLoading },
  };
}
