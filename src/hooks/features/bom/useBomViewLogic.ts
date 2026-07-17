import { useState } from "react";
import { toast } from "sonner";
import { boms, bomTree } from "@/lib/mock/data2";

export function useBomViewLogic(id: string) {
  const bom = boms.find((b) => b.id === id) ?? boms[0];
  const [open, setOpen] = useState(false);

  return {
    state: { bom, bomTree, isAddDialogOpen: open },
    handlers: { setAddDialogOpen: setOpen },
  };
}

export function useAddBomItemLogic(onOpenChange: (open: boolean) => void) {
  const [part, setPart] = useState("");
  const [qty, setQty] = useState("");

  function submit() {
    if (!part || !qty) return toast.error("Select a part and quantity");
    toast.success("BOM item added");
    onOpenChange(false);
    setPart("");
    setQty("");
  }

  return {
    state: { part, qty },
    handlers: { setPart, setQty, submit },
  };
}
