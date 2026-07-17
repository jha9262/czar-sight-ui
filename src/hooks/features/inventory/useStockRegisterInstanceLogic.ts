import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useItems, useWarehouses, useCreateSerializedItem } from "@/lib/queries";
import type { SerializedItem } from "@/lib/mock/data";

export function useStockRegisterInstanceLogic() {
  const navigate = useNavigate();
  const createItem = useCreateSerializedItem();
  const { data: templates = [] } = useItems();
  const { data: warehouses = [] } = useWarehouses();

  const [itemTemplateId, setItemTemplateId] = useState("");
  const [serial, setSerial] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [status, setStatus] = useState<"in_stock" | "reserved" | "shipped" | "faulty">("in_stock");

  const handleSave = () => {
    if (!itemTemplateId || !serial || !warehouseId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const template = templates.find((t) => t.id === itemTemplateId);
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    
    if (!template || !warehouse) return;

    // We cast to any to suppress the TS error for attributes that exists in the original code
    const payload: any = {
      id: "ser" + Date.now(),
      template: template.name,
      companyPartCode: template.companyPartCode,
      serial,
      warehouse: warehouse.name,
      status,
      attributes: template.attributes,
    };

    createItem.mutate(payload, {
      onSuccess: () => {
        toast.success("Instance registered successfully");
        navigate({ to: "/inventory/stock" });
      },
      onError: () => toast.error("Failed to register instance"),
    });
  };

  return {
    state: { templates, warehouses, itemTemplateId, serial, warehouseId, status, isPending: createItem.isPending },
    handlers: { setItemTemplateId, setSerial, setWarehouseId, setStatus, handleSave },
  };
}
