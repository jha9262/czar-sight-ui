export type PartType = { id: string; name: string; description: string; partsCount: number };
export const partTypes: PartType[] = [
  { id: "pt1", name: "Electronics", description: "PCBs, controllers, sensors, wiring", partsCount: 34 },
  { id: "pt2", name: "Mechanical", description: "Housings, brackets, fasteners", partsCount: 88 },
  { id: "pt3", name: "Fluidics", description: "Pumps, valves, tubing, gaskets", partsCount: 27 },
  { id: "pt4", name: "Consumables", description: "Cartridges, refills, filters", partsCount: 12 },
  { id: "pt5", name: "Packaging", description: "Boxes, foam inserts, labels", partsCount: 19 },
];

export type PartMaster = {
  id: string;
  partNumber: string;
  partType: string;
  name: string;
  description: string;
  unit: string;
};
export const partMasters: PartMaster[] = [
  { id: "pm1", partNumber: "CZR-CTL-R4-001", partType: "Electronics", name: "Controller Board r4", description: "Main IoT controller w/ LTE-M", unit: "pcs" },
  { id: "pm2", partNumber: "CZR-PMP-STD-002", partType: "Fluidics", name: "Peristaltic Pump 12V", description: "Standard 100 mL/min pump", unit: "pcs" },
  { id: "pm3", partNumber: "CZR-GSK-22-003", partType: "Fluidics", name: "Silicone Gasket 22mm", description: "Food-grade EPDM sealing gasket", unit: "pcs" },
  { id: "pm4", partNumber: "CZR-HSG-DSP-004", partType: "Mechanical", name: "Dispenser Housing", description: "ABS injection-moulded shell", unit: "pcs" },
  { id: "pm5", partNumber: "CZR-SCR-M4-005", partType: "Mechanical", name: "M4x12 SS Screw", description: "Stainless machine screw", unit: "pcs" },
  { id: "pm6", partNumber: "CZR-WIR-18-006", partType: "Electronics", name: "18AWG Silicone Wire", description: "Red/black flexible wire", unit: "m" },
  { id: "pm7", partNumber: "CZR-NZL-STD-007", partType: "Fluidics", name: "Nozzle Assembly", description: "Anti-drip dispenser nozzle", unit: "pcs" },
  { id: "pm8", partNumber: "CZR-BOX-DSP-008", partType: "Packaging", name: "Retail Box — DSP v3", description: "Printed corrugated box", unit: "pcs" },
];

export type ItemTemplate = {
  id: string;
  name: string;
  companyPartCode: string;
  isSerialized: boolean;
  unit: string;
  attributes: Record<string, string>;
  isActive: boolean;
};
export const itemTemplates: ItemTemplate[] = [
  { id: "it1", name: "Dispenser Unit v3", companyPartCode: "CZR-DSP-V3", isSerialized: true, unit: "pcs", attributes: { color: "White", firmware: "v3.2.1", region: "IN" }, isActive: true },
  { id: "it2", name: "Controller Board r4", companyPartCode: "CZR-CTL-R4", isSerialized: true, unit: "pcs", attributes: { revision: "r4", modem: "LTE-M" }, isActive: true },
  { id: "it3", name: "Peristaltic Pump", companyPartCode: "CZR-PMP-STD", isSerialized: true, unit: "pcs", attributes: { flow: "100mL/min", voltage: "12V" }, isActive: true },
  { id: "it4", name: "Silicone Gasket 22mm", companyPartCode: "CZR-GSK-22", isSerialized: false, unit: "pcs", attributes: { material: "EPDM", grade: "FDA" }, isActive: true },
  { id: "it5", name: "M4x12 SS Screw", companyPartCode: "CZR-SCR-M4-12", isSerialized: false, unit: "pcs", attributes: { drive: "Torx T20", finish: "SS304" }, isActive: true },
  { id: "it6", name: "18AWG Wire", companyPartCode: "CZR-WIR-18", isSerialized: false, unit: "m", attributes: { colors: "Red/Black" }, isActive: true },
  { id: "it7", name: "Legacy Nozzle v1", companyPartCode: "CZR-NZL-V1", isSerialized: false, unit: "pcs", attributes: { deprecated: "true" }, isActive: false },
];

export type Sourcing = {
  id: string;
  templateCode: string;
  templateName: string;
  manufacturer: string;
  mpn: string;
  leadTimeDays: number;
  preferred: boolean;
};
export const sourcings: Sourcing[] = [
  { id: "sr1", templateCode: "CZR-CTL-R4", templateName: "Controller Board r4", manufacturer: "Delta EMS", mpn: "DE-CTL-2871", leadTimeDays: 21, preferred: true },
  { id: "sr2", templateCode: "CZR-CTL-R4", templateName: "Controller Board r4", manufacturer: "Foxpoint", mpn: "FP-BRD-441", leadTimeDays: 35, preferred: false },
  { id: "sr3", templateCode: "CZR-PMP-STD", templateName: "Peristaltic Pump", manufacturer: "Kamoer", mpn: "KMR-KP12-100", leadTimeDays: 28, preferred: true },
  { id: "sr4", templateCode: "CZR-GSK-22", templateName: "Silicone Gasket 22mm", manufacturer: "SealTech", mpn: "ST-EPDM-22", leadTimeDays: 10, preferred: true },
  { id: "sr5", templateCode: "CZR-SCR-M4-12", templateName: "M4x12 SS Screw", manufacturer: "Bossard", mpn: "BS-M4-12-T20", leadTimeDays: 7, preferred: true },
];

export type Company = { id: string; code: string; title: string; models: number };
export const companies: Company[] = [
  { id: "c1", code: "CZAR", title: "CZAR Production Pvt. Ltd.", models: 5 },
  { id: "c2", code: "AQUAX", title: "Aquax Beverages", models: 2 },
  { id: "c3", code: "NUTRO", title: "Nutro FoodTech", models: 3 },
];

export type DispenserModel = {
  id: string;
  modelCode: string;
  modelTitle: string;
  duType: string;
  description: string;
  activeUnits: number;
};
export const dispenserModels: DispenserModel[] = [
  { id: "dm1", modelCode: "DSP-V3-STD", modelTitle: "Dispenser v3 Standard", duType: "Retail", description: "8-channel retail beverage dispenser", activeUnits: 184 },
  { id: "dm2", modelCode: "DSP-V3-PRO", modelTitle: "Dispenser v3 Pro", duType: "Commercial", description: "16-channel commercial unit w/ RFID", activeUnits: 62 },
  { id: "dm3", modelCode: "DSP-V2-LEG", modelTitle: "Dispenser v2 Legacy", duType: "Retail", description: "Superseded — service only", activeUnits: 41 },
  { id: "dm4", modelCode: "DSP-COMPACT", modelTitle: "Compact Countertop", duType: "SOHO", description: "4-channel counter unit", activeUnits: 128 },
];

export type Bom = {
  id: string;
  name: string;
  duModel: string;
  version: string;
  isActive: boolean;
  itemsCount: number;
  updatedAt: string;
};
export const boms: Bom[] = [
  { id: "bom1", name: "DSP v3 Standard — Production BOM", duModel: "DSP-V3-STD", version: "v1.4.2", isActive: true, itemsCount: 42, updatedAt: "2026-07-02" },
  { id: "bom2", name: "DSP v3 Pro — Production BOM", duModel: "DSP-V3-PRO", version: "v0.9.0", isActive: false, itemsCount: 61, updatedAt: "2026-07-08" },
  { id: "bom3", name: "Compact Countertop", duModel: "DSP-COMPACT", version: "v2.1.0", isActive: true, itemsCount: 28, updatedAt: "2026-06-28" },
  { id: "bom4", name: "DSP v2 Legacy — Service BOM", duModel: "DSP-V2-LEG", version: "v3.0.0", isActive: true, itemsCount: 35, updatedAt: "2026-05-11" },
];

export type BomNode = {
  id: string;
  partNumber: string;
  name: string;
  quantity: number;
  unit: string;
  description?: string;
  children?: BomNode[];
};
export const bomTree: BomNode[] = [
  {
    id: "n1",
    partNumber: "CZR-ASM-DSP-V3",
    name: "Dispenser Unit v3 (Assembly)",
    quantity: 1,
    unit: "pcs",
    description: "Top-level dispenser assembly",
    children: [
      {
        id: "n1a",
        partNumber: "CZR-ASM-HOUSING",
        name: "Housing Assembly",
        quantity: 1,
        unit: "pcs",
        children: [
          { id: "n1a1", partNumber: "CZR-HSG-DSP-004", name: "Dispenser Housing", quantity: 1, unit: "pcs" },
          { id: "n1a2", partNumber: "CZR-GSK-22-003", name: "Silicone Gasket 22mm", quantity: 4, unit: "pcs" },
          { id: "n1a3", partNumber: "CZR-SCR-M4-005", name: "M4x12 SS Screw", quantity: 12, unit: "pcs" },
        ],
      },
      {
        id: "n1b",
        partNumber: "CZR-ASM-ELECTRONICS",
        name: "Electronics Assembly",
        quantity: 1,
        unit: "pcs",
        children: [
          { id: "n1b1", partNumber: "CZR-CTL-R4-001", name: "Controller Board r4", quantity: 1, unit: "pcs" },
          { id: "n1b2", partNumber: "CZR-WIR-18-006", name: "18AWG Silicone Wire", quantity: 2.4, unit: "m" },
        ],
      },
      {
        id: "n1c",
        partNumber: "CZR-ASM-FLUIDICS",
        name: "Fluidics Assembly",
        quantity: 1,
        unit: "pcs",
        children: [
          { id: "n1c1", partNumber: "CZR-PMP-STD-002", name: "Peristaltic Pump 12V", quantity: 2, unit: "pcs" },
          { id: "n1c2", partNumber: "CZR-NZL-STD-007", name: "Nozzle Assembly", quantity: 1, unit: "pcs" },
        ],
      },
    ],
  },
];

export type EntryTemplate = {
  id: string;
  code: string;
  name: string;
  fields: number;
  usage: number;
  deletedAt: string | null;
};
export const entryTemplates: EntryTemplate[] = [
  { id: "et1", code: "TPL-INBOUND", name: "Inbound Receipt", fields: 8, usage: 421, deletedAt: null },
  { id: "et2", code: "TPL-RMA", name: "RMA Return", fields: 6, usage: 87, deletedAt: null },
  { id: "et3", code: "TPL-ASM", name: "Assembly Consumption", fields: 5, usage: 302, deletedAt: null },
  { id: "et4", code: "TPL-CYCLE", name: "Cycle Count Adjustment", fields: 4, usage: 154, deletedAt: null },
  { id: "et5", code: "TPL-XFER", name: "Transfer Out", fields: 7, usage: 92, deletedAt: null },
  { id: "et6", code: "TPL-LEGACY", name: "Legacy Inbound (v1)", fields: 5, usage: 12, deletedAt: "2026-05-14" },
  { id: "et7", code: "TPL-TEST", name: "Test Template", fields: 3, usage: 0, deletedAt: "2026-06-01" },
];

export type LedgerRow = {
  id: string;
  warehouse: string;
  partCode: string;
  partName: string;
  openingQty: number;
  inQty: number;
  outQty: number;
  closingQty: number;
  unit: string;
  reorderLevel: number;
};
export const ledger: LedgerRow[] = [
  { id: "l1", warehouse: "WH-BLR-01", partCode: "CZR-DSP-V3", partName: "Dispenser Unit v3", openingQty: 180, inQty: 24, outQty: 20, closingQty: 184, unit: "pcs", reorderLevel: 100 },
  { id: "l2", warehouse: "WH-BLR-01", partCode: "CZR-GSK-22", partName: "Silicone Gasket 22mm", openingQty: 4000, inQty: 500, outQty: 300, closingQty: 4200, unit: "pcs", reorderLevel: 1500 },
  { id: "l3", warehouse: "WH-PUN-06", partCode: "CZR-CTL-R4", partName: "Controller Board r4", openingQty: 100, inQty: 50, outQty: 42, closingQty: 108, unit: "pcs", reorderLevel: 60 },
  { id: "l4", warehouse: "WH-MUM-02", partCode: "CZR-PMP-STD", partName: "Peristaltic Pump", openingQty: 55, inQty: 12, outQty: 8, closingQty: 59, unit: "pcs", reorderLevel: 80 },
  { id: "l5", warehouse: "WH-DEL-03", partCode: "CZR-NZL-STD", partName: "Nozzle Assembly", openingQty: 400, inQty: 0, outQty: 60, closingQty: 340, unit: "pcs", reorderLevel: 200 },
  { id: "l6", warehouse: "WH-HYD-05", partCode: "CZR-WIR-18", partName: "18AWG Wire", openingQty: 500, inQty: 200, outQty: 80, closingQty: 620, unit: "m", reorderLevel: 250 },
  { id: "l7", warehouse: "WH-CHN-04", partCode: "CZR-FIL-PLA", partName: "PLA Filament 1.75", openingQty: 150, inQty: 0, outQty: 30, closingQty: 120, unit: "kg", reorderLevel: 100 },
];

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Operator";
  isActive: boolean;
  mfaEnabled: boolean;
  lastActive: string;
};
export const users: UserRow[] = [
  { id: "u1", name: "Aarav Shah", email: "aarav@czar.io", role: "Admin", isActive: true, mfaEnabled: true, lastActive: "2 min ago" },
  { id: "u2", name: "Priya Nair", email: "priya@czar.io", role: "Manager", isActive: true, mfaEnabled: true, lastActive: "18 min ago" },
  { id: "u3", name: "Rohit Mehta", email: "rohit@czar.io", role: "Operator", isActive: true, mfaEnabled: false, lastActive: "2 h ago" },
  { id: "u4", name: "Neha Kapoor", email: "neha@czar.io", role: "Manager", isActive: true, mfaEnabled: true, lastActive: "yesterday" },
  { id: "u5", name: "Karan Malhotra", email: "karan@czar.io", role: "Operator", isActive: true, mfaEnabled: false, lastActive: "3 d ago" },
  { id: "u6", name: "Vikram Iyer", email: "vikram@czar.io", role: "Operator", isActive: false, mfaEnabled: false, lastActive: "2 mo ago" },
];
