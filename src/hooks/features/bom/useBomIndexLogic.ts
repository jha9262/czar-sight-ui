import { useState } from "react";
import { toast } from "sonner";
import { boms } from "@/lib/mock/data2";
import { useBomComponentTypes, useDeleteBomComponentType, useBomTemplates } from "@/lib/queries";

export function useBomIndexLogic() {
  const [tab, setTab] = useState("instances");
  const [q, setQ] = useState("");
  const { data: componentTypes = [] } = useBomComponentTypes();
  const { data: templates = [] } = useBomTemplates();
  const deleteCompType = useDeleteBomComponentType();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredInstances = boms.filter((b) =>
    `${b.name} ${b.duModel}`.toLowerCase().includes(q.toLowerCase())
  );

  const filteredTemplates = templates.filter((t) =>
    `${t.name} ${t.description}`.toLowerCase().includes(q.toLowerCase())
  );

  const filteredCompTypes = componentTypes.filter((c) =>
    `${c.name} ${c.code}`.toLowerCase().includes(q.toLowerCase())
  );

  function confirmDeleteCompType() {
    if (!deleteTarget) return;
    deleteCompType.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Component type deleted");
        setDeleteTarget(null);
      },
    });
  }

  return {
    state: {
      tab,
      q,
      boms,
      templates,
      componentTypes,
      filteredInstances,
      filteredTemplates,
      filteredCompTypes,
      deleteTarget,
      isDeleting: deleteCompType.isPending,
    },
    handlers: {
      setTab,
      setQ,
      setDeleteTarget,
      confirmDeleteCompType,
    },
  };
}
