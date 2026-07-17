import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useBulkItem, useUpdateBulkItem } from "@/lib/queries";
import { itemTemplates } from "@/lib/mock/data2";
import { warehouses } from "@/lib/mock/data";

export function useStockEditBulkLogic(id: string) {
  const navigate = useNavigate();
  const { data: item, isLoading } = useBulkItem(id);
  const updateItem = useUpdateBulkItem();

  const [template, setTemplate] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [batch, setBatch] = useState("");
  const [qty, setQty] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setTemplate(item.template);
      setWarehouse(item.warehouse);
      setBatch(item.batchNumber);
      setQty(item.quantity.toString());
    }
  }, [item]);

  function submit() {
    const e: Record<string, string> = {};
    if (!template) e.template = "Template is required";
    if (!warehouse) e.warehouse = "Warehouse is required";
    if (!batch.trim()) e.batch = "Batch number is required";
    if (!qty || Number(qty) < 0) e.qty = "Enter a valid quantity";
    setErrors(e);
    if (Object.keys(e).length) return;

    updateItem.mutate(
      {
        ...item!,
        batchNumber: batch,
        template,
        warehouse,
        quantity: Number(qty),
        companyPartCode: itemTemplates.find((t) => t.name === template)?.companyPartCode || item?.companyPartCode || "CZR-UNKNOWN",
      },
      {
        onSuccess: () => {
          toast.success("Bulk stock updated");
          navigate({ to: "/inventory/stock" });
        },
      }
    );
  }

  return {
    state: { item, isLoading, template, warehouse, batch, qty, errors, itemTemplates, warehouses, isPending: updateItem.isPending },
    handlers: { setTemplate, setWarehouse, setBatch, setQty, submit },
  };
}
