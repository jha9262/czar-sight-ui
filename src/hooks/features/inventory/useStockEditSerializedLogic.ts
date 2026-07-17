import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSerializedItem, useUpdateSerializedItem } from "@/lib/queries";
import { itemTemplates } from "@/lib/mock/data2";
import { warehouses } from "@/lib/mock/data";

export function useStockEditSerializedLogic(id: string) {
  const navigate = useNavigate();
  const { data: item, isLoading } = useSerializedItem(id);
  const updateItem = useUpdateSerializedItem();

  const [template, setTemplate] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setTemplate(item.template);
      setWarehouse(item.warehouse);
      setSerial(item.serial);
      setStatus(item.status);
    }
  }, [item]);

  function submit() {
    const e: Record<string, string> = {};
    if (!template) e.template = "Template is required";
    if (!warehouse) e.warehouse = "Warehouse is required";
    if (!serial.trim()) e.serial = "Serial number is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    updateItem.mutate(
      {
        ...item!,
        serial,
        template,
        warehouse,
        status: status as any,
        companyPartCode: itemTemplates.find((t) => t.name === template)?.companyPartCode || item!.companyPartCode,
      },
      {
        onSuccess: () => {
          toast.success("Serialized stock updated");
          navigate({ to: "/inventory/stock" });
        },
      }
    );
  }

  return {
    state: { item, isLoading, template, warehouse, serial, status, errors, itemTemplates, warehouses, isPending: updateItem.isPending },
    handlers: { setTemplate, setWarehouse, setSerial, setStatus, submit },
  };
}
