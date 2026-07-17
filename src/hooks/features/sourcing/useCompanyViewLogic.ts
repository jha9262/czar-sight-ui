import { useCompany } from "@/lib/queries";

export function useCompanyViewLogic(id: string) {
  const { data: company, isLoading } = useCompany(id);

  return {
    state: { company, isLoading },
  };
}
