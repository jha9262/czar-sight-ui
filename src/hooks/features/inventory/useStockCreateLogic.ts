import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCreateSerializedItem, useCreateBulkItem } from "@/lib/queries";
import { itemTemplates } from "@/lib/mock/data2";
import { warehouses } from "@/lib/mock/data";

export function useStockCreateLogic() {
  const navigate = useNavigate();
  const createSerialized = useCreateSerializedItem();
  const createBulk = useCreateBulkItem();

  const [isSerialized, setIsSerialized] = useState(true);
  const [template, setTemplate] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [serial, setSerial] = useState("");
  const [batch, setBatch] = useState("");
  const [qty, setQty] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const e: Record<string, string> = {};
    if (!template) e.template = "Template is required";
    if (!warehouse) e.warehouse = "Warehouse is required";
    if (isSerialized) {
      if (!serial.trim()) e.serial = "Serial number is required";
    } else {
      if (!batch.trim()) e.batch = "Batch number is required";
      if (!qty || Number(qty) <= 0) e.qty = "Enter a positive quantity";
    }
    setErrors(e);
    if (Object.keys(e).length) return;

    if (isSerialized) {
      createSerialized.mutate(
        {
          id: crypto.randomUUID(),
          serial: serial,
          template: template,
          companyPartCode: itemTemplates.find((t) => t.name === template)?.companyPartCode || "CZR-UNKNOWN",
          warehouse: warehouse,
          status: "in_stock",
          receivedAt: new Date().toISOString().slice(0, 10),
        },
        {
          onSuccess: () => {
            toast.success("Serialized item added");
            navigate({ to: "/inventory/stock" });
          },
        }
      );
    } else {
      createBulk.mutate(
        {
          id: crypto.randomUUID(),
          batchNumber: batch,
          template: template,
          companyPartCode: itemTemplates.find((t) => t.name === template)?.companyPartCode || "CZR-UNKNOWN",
          warehouse: warehouse,
          quantity: Number(qty),
          unit: "pcs",
          receivedAt: new Date().toISOString().slice(0, 10),
        },
        {
          onSuccess: () => {
            toast.success("Bulk batch added");
            navigate({ to: "/inventory/stock" });
          },
        }
      );
    }
  }

  return {
    state: { isSerialized, template, warehouse, serial, batch, qty, errors, itemTemplates, warehouses },
    handlers: { setIsSerialized, setTemplate, setWarehouse, setSerial, setBatch, setQty, submit },
  };
}
