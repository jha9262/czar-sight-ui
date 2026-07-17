import { useState } from "react";
import { toast } from "sonner";
import { useFiles, useDeleteFile } from "@/lib/queries";

export function useFilesIndexLogic() {
  const { data: files = [] } = useFiles();
  const deleteFile = useDeleteFile();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const filtered = files.filter((f) => f.filename.toLowerCase().includes(q.toLowerCase()));

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteFile.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("File deleted");
        setDeleteTarget(null);
      },
    });
  }

  return {
    state: {
      q,
      filtered,
      deleteTarget,
      isDeleting: deleteFile.isPending,
    },
    handlers: {
      setQ,
      setDeleteTarget,
      confirmDelete,
    },
  };
}
