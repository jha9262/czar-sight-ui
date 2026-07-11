import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouses, type Warehouse, stockEntries, type StockEntry, serializedItems, type SerializedItem, bulkItems, type BulkItem } from "./mock/data";
import { partMasters, type PartMaster, itemTemplates, type ItemTemplate, users, type UserRow, dispenserModels, type DispenserModel, sourcings, type Sourcing, entryTemplates, type EntryTemplate, blueprints, type Blueprint, partVersions, type PartVersion, partVariants, type PartVariant, bomComponentTypes, type BomComponentType, bomTemplates, type BomTemplate } from "./mock/data2";

/* ═══════════════════════════════════════════
   Warehouses
   ═══════════════════════════════════════════ */
export const warehouseApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...warehouses]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return warehouses.find(w => w.id === id) ?? null; },
  create: async (w: Warehouse) => { await new Promise(r => setTimeout(r, 200)); warehouses.unshift(w); return w; },
  update: async (w: Warehouse) => { await new Promise(r => setTimeout(r, 200)); const i = warehouses.findIndex(x => x.id === w.id); if (i !== -1) warehouses[i] = w; return w; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = warehouses.findIndex(x => x.id === id); if (i !== -1) warehouses.splice(i, 1); return id; },
};
export function useWarehouses() { return useQuery({ queryKey: ["warehouses"], queryFn: warehouseApi.getAll }); }
export function useWarehouse(id: string) { return useQuery({ queryKey: ["warehouses", id], queryFn: () => warehouseApi.getById(id) }); }
export function useCreateWarehouse() { const qc = useQueryClient(); return useMutation({ mutationFn: warehouseApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }) }); }
export function useUpdateWarehouse() { const qc = useQueryClient(); return useMutation({ mutationFn: warehouseApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }) }); }
export function useDeleteWarehouse() { const qc = useQueryClient(); return useMutation({ mutationFn: warehouseApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }) }); }

/* ═══════════════════════════════════════════
   Parts (Part Masters)
   ═══════════════════════════════════════════ */
export const partApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...partMasters]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return partMasters.find(p => p.id === id) ?? null; },
  create: async (p: PartMaster) => { await new Promise(r => setTimeout(r, 200)); partMasters.unshift(p); return p; },
  update: async (p: PartMaster) => { await new Promise(r => setTimeout(r, 200)); const i = partMasters.findIndex(x => x.id === p.id); if (i !== -1) partMasters[i] = p; return p; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = partMasters.findIndex(x => x.id === id); if (i !== -1) partMasters.splice(i, 1); return id; },
};
export function useParts() { return useQuery({ queryKey: ["parts"], queryFn: partApi.getAll }); }
export function usePart(id: string) { return useQuery({ queryKey: ["parts", id], queryFn: () => partApi.getById(id) }); }
export function useCreatePart() { const qc = useQueryClient(); return useMutation({ mutationFn: partApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["parts"] }) }); }
export function useUpdatePart() { const qc = useQueryClient(); return useMutation({ mutationFn: partApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["parts"] }) }); }
export function useDeletePart() { const qc = useQueryClient(); return useMutation({ mutationFn: partApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["parts"] }) }); }

/* ═══════════════════════════════════════════
   Item Templates
   ═══════════════════════════════════════════ */
export const itemApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...itemTemplates]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return itemTemplates.find(t => t.id === id) ?? null; },
  create: async (i: ItemTemplate) => { await new Promise(r => setTimeout(r, 200)); itemTemplates.unshift(i); return i; },
  update: async (i: ItemTemplate) => { await new Promise(r => setTimeout(r, 200)); const idx = itemTemplates.findIndex(x => x.id === i.id); if (idx !== -1) itemTemplates[idx] = i; return i; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const idx = itemTemplates.findIndex(x => x.id === id); if (idx !== -1) itemTemplates.splice(idx, 1); return id; },
};
export function useItems() { return useQuery({ queryKey: ["items"], queryFn: itemApi.getAll }); }
export function useItem(id: string) { return useQuery({ queryKey: ["items", id], queryFn: () => itemApi.getById(id) }); }
export function useCreateItem() { const qc = useQueryClient(); return useMutation({ mutationFn: itemApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }) }); }
export function useUpdateItem() { const qc = useQueryClient(); return useMutation({ mutationFn: itemApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }) }); }
export function useDeleteItem() { const qc = useQueryClient(); return useMutation({ mutationFn: itemApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }) }); }

/* ═══════════════════════════════════════════
   Users
   ═══════════════════════════════════════════ */
export const userApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...users]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return users.find(u => u.id === id) ?? null; },
  create: async (u: UserRow) => { await new Promise(r => setTimeout(r, 200)); users.unshift(u); return u; },
  update: async (u: UserRow) => { await new Promise(r => setTimeout(r, 200)); const i = users.findIndex(x => x.id === u.id); if (i !== -1) users[i] = u; return u; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = users.findIndex(x => x.id === id); if (i !== -1) users.splice(i, 1); return id; },
};
export function useUsers() { return useQuery({ queryKey: ["users"], queryFn: userApi.getAll }); }
export function useUser(id: string) { return useQuery({ queryKey: ["users", id], queryFn: () => userApi.getById(id) }); }
export function useCreateUser() { const qc = useQueryClient(); return useMutation({ mutationFn: userApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }) }); }
export function useUpdateUser() { const qc = useQueryClient(); return useMutation({ mutationFn: userApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }) }); }
export function useDeleteUser() { const qc = useQueryClient(); return useMutation({ mutationFn: userApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }) }); }

/* ═══════════════════════════════════════════
   Serialized & Bulk Stock
   ═══════════════════════════════════════════ */
export const stockApi = {
  getSerialized: async () => { await new Promise(r => setTimeout(r, 200)); return [...serializedItems]; },
  getSerializedById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return serializedItems.find(s => s.id === id) ?? null; },
  createSerialized: async (s: SerializedItem) => { await new Promise(r => setTimeout(r, 200)); serializedItems.unshift(s); return s; },
  updateSerialized: async (s: SerializedItem) => { await new Promise(r => setTimeout(r, 200)); const i = serializedItems.findIndex(x => x.id === s.id); if (i !== -1) serializedItems[i] = s; return s; },
  deleteSerialized: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = serializedItems.findIndex(x => x.id === id); if (i !== -1) serializedItems.splice(i, 1); return id; },
  getBulk: async () => { await new Promise(r => setTimeout(r, 200)); return [...bulkItems]; },
  getBulkById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return bulkItems.find(b => b.id === id) ?? null; },
  createBulk: async (b: BulkItem) => { await new Promise(r => setTimeout(r, 200)); bulkItems.unshift(b); return b; },
  updateBulk: async (b: BulkItem) => { await new Promise(r => setTimeout(r, 200)); const i = bulkItems.findIndex(x => x.id === b.id); if (i !== -1) bulkItems[i] = b; return b; },
  deleteBulk: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = bulkItems.findIndex(x => x.id === id); if (i !== -1) bulkItems.splice(i, 1); return id; },
};
export function useSerializedItems() { return useQuery({ queryKey: ["serialized"], queryFn: stockApi.getSerialized }); }
export function useSerializedItem(id: string) { return useQuery({ queryKey: ["serialized", id], queryFn: () => stockApi.getSerializedById(id) }); }
export function useCreateSerializedItem() { const qc = useQueryClient(); return useMutation({ mutationFn: stockApi.createSerialized, onSuccess: () => qc.invalidateQueries({ queryKey: ["serialized"] }) }); }
export function useUpdateSerializedItem() { const qc = useQueryClient(); return useMutation({ mutationFn: stockApi.updateSerialized, onSuccess: () => qc.invalidateQueries({ queryKey: ["serialized"] }) }); }
export function useDeleteSerializedItem() { const qc = useQueryClient(); return useMutation({ mutationFn: stockApi.deleteSerialized, onSuccess: () => qc.invalidateQueries({ queryKey: ["serialized"] }) }); }
export function useBulkItems() { return useQuery({ queryKey: ["bulk"], queryFn: stockApi.getBulk }); }
export function useBulkItem(id: string) { return useQuery({ queryKey: ["bulk", id], queryFn: () => stockApi.getBulkById(id) }); }
export function useCreateBulkItem() { const qc = useQueryClient(); return useMutation({ mutationFn: stockApi.createBulk, onSuccess: () => qc.invalidateQueries({ queryKey: ["bulk"] }) }); }
export function useUpdateBulkItem() { const qc = useQueryClient(); return useMutation({ mutationFn: stockApi.updateBulk, onSuccess: () => qc.invalidateQueries({ queryKey: ["bulk"] }) }); }
export function useDeleteBulkItem() { const qc = useQueryClient(); return useMutation({ mutationFn: stockApi.deleteBulk, onSuccess: () => qc.invalidateQueries({ queryKey: ["bulk"] }) }); }

/* ═══════════════════════════════════════════
   Dispenser Models (Product Models)
   ═══════════════════════════════════════════ */
export const modelApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...dispenserModels]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return dispenserModels.find(m => m.id === id) ?? null; },
  create: async (m: DispenserModel) => { await new Promise(r => setTimeout(r, 200)); dispenserModels.unshift(m); return m; },
  update: async (m: DispenserModel) => { await new Promise(r => setTimeout(r, 200)); const i = dispenserModels.findIndex(x => x.id === m.id); if (i !== -1) dispenserModels[i] = m; return m; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = dispenserModels.findIndex(x => x.id === id); if (i !== -1) dispenserModels.splice(i, 1); return id; },
};
export function useDispenserModels() { return useQuery({ queryKey: ["dispenserModels"], queryFn: modelApi.getAll }); }
export function useDispenserModel(id: string) { return useQuery({ queryKey: ["dispenserModels", id], queryFn: () => modelApi.getById(id) }); }
export function useCreateDispenserModel() { const qc = useQueryClient(); return useMutation({ mutationFn: modelApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["dispenserModels"] }) }); }
export function useUpdateDispenserModel() { const qc = useQueryClient(); return useMutation({ mutationFn: modelApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["dispenserModels"] }) }); }
export function useDeleteDispenserModel() { const qc = useQueryClient(); return useMutation({ mutationFn: modelApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["dispenserModels"] }) }); }

/* ═══════════════════════════════════════════
   Sourcing
   ═══════════════════════════════════════════ */
export const sourcingApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...sourcings]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return sourcings.find(s => s.id === id) ?? null; },
  create: async (s: Sourcing) => { await new Promise(r => setTimeout(r, 200)); sourcings.unshift(s); return s; },
  update: async (s: Sourcing) => { await new Promise(r => setTimeout(r, 200)); const i = sourcings.findIndex(x => x.id === s.id); if (i !== -1) sourcings[i] = s; return s; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = sourcings.findIndex(x => x.id === id); if (i !== -1) sourcings.splice(i, 1); return id; },
};
export function useSourcings() { return useQuery({ queryKey: ["sourcings"], queryFn: sourcingApi.getAll }); }
export function useSourcing(id: string) { return useQuery({ queryKey: ["sourcings", id], queryFn: () => sourcingApi.getById(id) }); }
export function useCreateSourcing() { const qc = useQueryClient(); return useMutation({ mutationFn: sourcingApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["sourcings"] }) }); }
export function useUpdateSourcing() { const qc = useQueryClient(); return useMutation({ mutationFn: sourcingApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["sourcings"] }) }); }
export function useDeleteSourcing() { const qc = useQueryClient(); return useMutation({ mutationFn: sourcingApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["sourcings"] }) }); }

/* ═══════════════════════════════════════════
   Stock Entry Templates
   ═══════════════════════════════════════════ */
export const templateApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...entryTemplates]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return entryTemplates.find(t => t.id === id) ?? null; },
  create: async (t: EntryTemplate) => { await new Promise(r => setTimeout(r, 200)); entryTemplates.unshift(t); return t; },
  update: async (t: EntryTemplate) => { await new Promise(r => setTimeout(r, 200)); const i = entryTemplates.findIndex(x => x.id === t.id); if (i !== -1) entryTemplates[i] = t; return t; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = entryTemplates.findIndex(x => x.id === id); if (i !== -1) entryTemplates.splice(i, 1); return id; },
};
export function useStockTemplates() { return useQuery({ queryKey: ["stockTemplates"], queryFn: templateApi.getAll }); }
export function useStockTemplate(id: string) { return useQuery({ queryKey: ["stockTemplates", id], queryFn: () => templateApi.getById(id) }); }
export function useCreateStockTemplate() { const qc = useQueryClient(); return useMutation({ mutationFn: templateApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["stockTemplates"] }) }); }
export function useUpdateStockTemplate() { const qc = useQueryClient(); return useMutation({ mutationFn: templateApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["stockTemplates"] }) }); }
export function useDeleteStockTemplate() { const qc = useQueryClient(); return useMutation({ mutationFn: templateApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["stockTemplates"] }) }); }

/* ═══════════════════════════════════════════
   Stock Entries
   ═══════════════════════════════════════════ */
export const entryApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...stockEntries]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return stockEntries.find(e => e.id === id) ?? null; },
  create: async (e: StockEntry) => { await new Promise(r => setTimeout(r, 200)); stockEntries.unshift(e); return e; },
  update: async (e: StockEntry) => { await new Promise(r => setTimeout(r, 200)); const i = stockEntries.findIndex(x => x.id === e.id); if (i !== -1) stockEntries[i] = e; return e; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = stockEntries.findIndex(x => x.id === id); if (i !== -1) stockEntries.splice(i, 1); return id; },
};
export function useStockEntries() { return useQuery({ queryKey: ["stockEntries"], queryFn: entryApi.getAll }); }
export function useStockEntry(id: string) { return useQuery({ queryKey: ["stockEntries", id], queryFn: () => entryApi.getById(id) }); }
export function useCreateStockEntry() { const qc = useQueryClient(); return useMutation({ mutationFn: entryApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["stockEntries"] }) }); }
export function useUpdateStockEntry() { const qc = useQueryClient(); return useMutation({ mutationFn: entryApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["stockEntries"] }) }); }
export function useDeleteStockEntry() { const qc = useQueryClient(); return useMutation({ mutationFn: entryApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["stockEntries"] }) }); }

/* ═══════════════════════════════════════════
   Phase 2 Entities — Vendors, Manufacturers, Companies, Files
   (imported from data3.ts)
   ═══════════════════════════════════════════ */
import { vendors, type Vendor, manufacturers, type Manufacturer, companiesFull, type CompanyFull, productTypes, type ProductType, files, type FileRecord } from "./mock/data3";

// Vendors
export const vendorApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...vendors]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return vendors.find(v => v.code === id) ?? null; },
  create: async (v: Vendor) => { await new Promise(r => setTimeout(r, 200)); vendors.unshift(v); return v; },
  update: async (v: Vendor) => { await new Promise(r => setTimeout(r, 200)); const i = vendors.findIndex(x => x.code === v.code); if (i !== -1) vendors[i] = v; return v; },
  delete: async (code: string) => { await new Promise(r => setTimeout(r, 200)); const i = vendors.findIndex(x => x.code === code); if (i !== -1) vendors.splice(i, 1); return code; },
};
export function useVendors() { return useQuery({ queryKey: ["vendors"], queryFn: vendorApi.getAll }); }
export function useVendor(code: string) { return useQuery({ queryKey: ["vendors", code], queryFn: () => vendorApi.getById(code) }); }
export function useCreateVendor() { const qc = useQueryClient(); return useMutation({ mutationFn: vendorApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }) }); }
export function useUpdateVendor() { const qc = useQueryClient(); return useMutation({ mutationFn: vendorApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }) }); }
export function useDeleteVendor() { const qc = useQueryClient(); return useMutation({ mutationFn: vendorApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }) }); }

// Manufacturers
export const manufacturerApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...manufacturers]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return manufacturers.find(m => m.code === id) ?? null; },
  create: async (m: Manufacturer) => { await new Promise(r => setTimeout(r, 200)); manufacturers.unshift(m); return m; },
  update: async (m: Manufacturer) => { await new Promise(r => setTimeout(r, 200)); const i = manufacturers.findIndex(x => x.code === m.code); if (i !== -1) manufacturers[i] = m; return m; },
  delete: async (code: string) => { await new Promise(r => setTimeout(r, 200)); const i = manufacturers.findIndex(x => x.code === code); if (i !== -1) manufacturers.splice(i, 1); return code; },
};
export function useManufacturers() { return useQuery({ queryKey: ["manufacturers"], queryFn: manufacturerApi.getAll }); }
export function useManufacturer(code: string) { return useQuery({ queryKey: ["manufacturers", code], queryFn: () => manufacturerApi.getById(code) }); }
export function useCreateManufacturer() { const qc = useQueryClient(); return useMutation({ mutationFn: manufacturerApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["manufacturers"] }) }); }
export function useUpdateManufacturer() { const qc = useQueryClient(); return useMutation({ mutationFn: manufacturerApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["manufacturers"] }) }); }
export function useDeleteManufacturer() { const qc = useQueryClient(); return useMutation({ mutationFn: manufacturerApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["manufacturers"] }) }); }

// Companies
export const companyApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...companiesFull]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return companiesFull.find(c => c.id === id) ?? null; },
  create: async (c: CompanyFull) => { await new Promise(r => setTimeout(r, 200)); companiesFull.unshift(c); return c; },
  update: async (c: CompanyFull) => { await new Promise(r => setTimeout(r, 200)); const i = companiesFull.findIndex(x => x.id === c.id); if (i !== -1) companiesFull[i] = c; return c; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = companiesFull.findIndex(x => x.id === id); if (i !== -1) companiesFull.splice(i, 1); return id; },
};
export function useCompanies() { return useQuery({ queryKey: ["companies"], queryFn: companyApi.getAll }); }
export function useCompany(id: string) { return useQuery({ queryKey: ["companies", id], queryFn: () => companyApi.getById(id) }); }
export function useCreateCompany() { const qc = useQueryClient(); return useMutation({ mutationFn: companyApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }) }); }
export function useUpdateCompany() { const qc = useQueryClient(); return useMutation({ mutationFn: companyApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }) }); }
export function useDeleteCompany() { const qc = useQueryClient(); return useMutation({ mutationFn: companyApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }) }); }

// Files
export const fileApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...files]; },
  create: async (f: FileRecord) => { await new Promise(r => setTimeout(r, 200)); files.unshift(f); return f; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = files.findIndex(x => x.uuid === id); if (i !== -1) files.splice(i, 1); return id; },
};
export function useFiles() { return useQuery({ queryKey: ["files"], queryFn: fileApi.getAll }); }
export function useCreateFile() { const qc = useQueryClient(); return useMutation({ mutationFn: fileApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["files"] }) }); }
export function useDeleteFile() { const qc = useQueryClient(); return useMutation({ mutationFn: fileApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["files"] }) }); }

// Blueprints
export const blueprintApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...blueprints]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return blueprints.find(b => b.id === id) ?? null; },
  create: async (b: Blueprint) => { await new Promise(r => setTimeout(r, 200)); blueprints.unshift(b); return b; },
  update: async (b: Blueprint) => { await new Promise(r => setTimeout(r, 200)); const i = blueprints.findIndex(x => x.id === b.id); if (i !== -1) blueprints[i] = b; return b; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = blueprints.findIndex(x => x.id === id); if (i !== -1) blueprints.splice(i, 1); return id; },
};
export function useBlueprints() { return useQuery({ queryKey: ["blueprints"], queryFn: blueprintApi.getAll }); }
export function useBlueprint(id: string) { return useQuery({ queryKey: ["blueprints", id], queryFn: () => blueprintApi.getById(id) }); }
export function useCreateBlueprint() { const qc = useQueryClient(); return useMutation({ mutationFn: blueprintApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["blueprints"] }) }); }
export function useUpdateBlueprint() { const qc = useQueryClient(); return useMutation({ mutationFn: blueprintApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["blueprints"] }) }); }
export function useDeleteBlueprint() { const qc = useQueryClient(); return useMutation({ mutationFn: blueprintApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["blueprints"] }) }); }

// Part Versions
export const partVersionApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...partVersions]; },
  create: async (v: PartVersion) => { await new Promise(r => setTimeout(r, 200)); partVersions.unshift(v); return v; },
};
export function usePartVersions() { return useQuery({ queryKey: ["partVersions"], queryFn: partVersionApi.getAll }); }
export function useCreatePartVersion() { const qc = useQueryClient(); return useMutation({ mutationFn: partVersionApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["partVersions"] }) }); }

// Part Variants
export const partVariantApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...partVariants]; },
  create: async (v: PartVariant) => { await new Promise(r => setTimeout(r, 200)); partVariants.unshift(v); return v; },
};
export function usePartVariants() { return useQuery({ queryKey: ["partVariants"], queryFn: partVariantApi.getAll }); }
export function useCreatePartVariant() { const qc = useQueryClient(); return useMutation({ mutationFn: partVariantApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["partVariants"] }) }); }

// BOM Component Types
export const bomComponentTypeApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...bomComponentTypes]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return bomComponentTypes.find(b => b.id === id) ?? null; },
  create: async (b: BomComponentType) => { await new Promise(r => setTimeout(r, 200)); bomComponentTypes.unshift(b); return b; },
  update: async (b: BomComponentType) => { await new Promise(r => setTimeout(r, 200)); const i = bomComponentTypes.findIndex(x => x.id === b.id); if (i !== -1) bomComponentTypes[i] = b; return b; },
  delete: async (id: string) => { await new Promise(r => setTimeout(r, 200)); const i = bomComponentTypes.findIndex(x => x.id === id); if (i !== -1) bomComponentTypes.splice(i, 1); return id; },
};
export function useBomComponentTypes() { return useQuery({ queryKey: ["bomComponentTypes"], queryFn: bomComponentTypeApi.getAll }); }
export function useBomComponentType(id: string) { return useQuery({ queryKey: ["bomComponentTypes", id], queryFn: () => bomComponentTypeApi.getById(id) }); }
export function useCreateBomComponentType() { const qc = useQueryClient(); return useMutation({ mutationFn: bomComponentTypeApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["bomComponentTypes"] }) }); }
export function useUpdateBomComponentType() { const qc = useQueryClient(); return useMutation({ mutationFn: bomComponentTypeApi.update, onSuccess: () => qc.invalidateQueries({ queryKey: ["bomComponentTypes"] }) }); }
export function useDeleteBomComponentType() { const qc = useQueryClient(); return useMutation({ mutationFn: bomComponentTypeApi.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ["bomComponentTypes"] }) }); }

// BOM Templates
export const bomTemplateApi = {
  getAll: async () => { await new Promise(r => setTimeout(r, 200)); return [...bomTemplates]; },
  getById: async (id: string) => { await new Promise(r => setTimeout(r, 100)); return bomTemplates.find(b => b.id === id) ?? null; },
  create: async (b: BomTemplate) => { await new Promise(r => setTimeout(r, 200)); bomTemplates.unshift(b); return b; },
};
export function useBomTemplates() { return useQuery({ queryKey: ["bomTemplates"], queryFn: bomTemplateApi.getAll }); }
export function useBomTemplate(id: string) { return useQuery({ queryKey: ["bomTemplates", id], queryFn: () => bomTemplateApi.getById(id) }); }
export function useCreateBomTemplate() { const qc = useQueryClient(); return useMutation({ mutationFn: bomTemplateApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["bomTemplates"] }) }); }
