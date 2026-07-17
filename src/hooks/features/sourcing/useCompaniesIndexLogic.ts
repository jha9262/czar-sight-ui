import { useState } from "react";
import { toast } from "sonner";
import { useCompanies, useDeleteCompany } from "@/lib/queries";

export function useCompaniesIndexLogic() {
  const { data: companies = [] } = useCompanies();
  const deleteCompany = useDeleteCompany();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = companies.filter((c) =>
    `${c.title} ${c.code}`.toLowerCase().includes(q.toLowerCase())
  );

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteCompany.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Company deleted");
        setDeleteTarget(null);
      },
    });
  }

  return {
    state: { companies, filtered, q, deleteTarget, isDeleting: deleteCompany.isPending },
    handlers: { setQ, setDeleteTarget, confirmDelete },
  };
}
