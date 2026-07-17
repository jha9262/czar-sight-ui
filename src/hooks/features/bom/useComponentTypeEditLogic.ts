import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useBomComponentType, useUpdateBomComponentType } from "@/lib/queries";

export function useComponentTypeEditLogic(id: string) {
  const navigate = useNavigate();
  const { data: componentType, isLoading } = useBomComponentType(id);
  const updateComponentType = useUpdateBomComponentType();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState<{ key: string; dataType: string; requirement: string }[]>([]);

  useEffect(() => {
    if (componentType) {
      setCode(componentType.code);
      setName(componentType.name);
      setDescription(componentType.description);
      setProperties(componentType.properties || []);
    }
  }, [componentType]);

  const addProperty = () => {
    setProperties([...properties, { key: "", dataType: "String", requirement: "Optional" }]);
  };

  const removeProperty = (idx: number) => {
    setProperties(properties.filter((_, i) => i !== idx));
  };

  const updateProperty = (idx: number, field: string, value: string) => {
    const newProps = [...properties];
    newProps[idx] = { ...newProps[idx], [field]: value };
    setProperties(newProps);
  };

  const handleSave = () => {
    if (!componentType || !code || !name) {
      toast.error("Code and Name are required.");
      return;
    }

    updateComponentType.mutate(
      { ...componentType, code, name, description, properties },
      {
        onSuccess: () => {
          toast.success("Component Type updated");
          navigate({ to: "/bom" });
        },
        onError: () => toast.error("Failed to update component type"),
      }
    );
  };

  return {
    state: { componentType, isLoading, code, name, description, properties, isPending: updateComponentType.isPending },
    handlers: { setCode, setName, setDescription, addProperty, removeProperty, updateProperty, handleSave },
  };
}
