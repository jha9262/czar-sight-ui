import { useVendor } from "@/lib/queries";

export function useVendorViewLogic(id: string) {
  const { data: vendor, isLoading } = useVendor(id);

  return {
    state: { vendor, isLoading },
  };
}
