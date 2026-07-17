import { useManufacturer } from "@/lib/queries";

export function useManufacturerViewLogic(id: string) {
  const { data: manufacturer, isLoading } = useManufacturer(id);

  return {
    state: { manufacturer, isLoading },
  };
}
