import { useItem } from "@/lib/queries";

export function useItemViewLogic(id: string) {
  const { data: item, isLoading } = useItem(id);

  return {
    state: { item, isLoading },
  };
}
