export type Warehouse = {
  id: string;
  code: string;
  name: string;
  description?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isActive: boolean;
  deletedAt?: string | null;
};

export const warehouses: Warehouse[] = [
  { id: "w1", code: "WH-BLR-01", name: "Bengaluru Central DC", phone: "+91 80 4567 1200", email: "blr@czar.io", address: "Plot 42, Whitefield", city: "Bengaluru", state: "KA", country: "India", postalCode: "560066", isActive: true },
  { id: "w2", code: "WH-MUM-02", name: "Mumbai Fulfilment", phone: "+91 22 6789 4300", email: "mum@czar.io", address: "Andheri East", city: "Mumbai", state: "MH", country: "India", postalCode: "400069", isActive: true },
  { id: "w3", code: "WH-DEL-03", name: "Delhi NCR Hub", phone: "+91 11 4501 9900", email: "del@czar.io", address: "Okhla Phase III", city: "New Delhi", state: "DL", country: "India", postalCode: "110020", isActive: true },
  { id: "w4", code: "WH-CHN-04", name: "Chennai Ops", phone: "+91 44 3311 8811", email: "chn@czar.io", address: "Guindy Industrial", city: "Chennai", state: "TN", country: "India", postalCode: "600032", isActive: false },
  { id: "w5", code: "WH-HYD-05", name: "Hyderabad Micro-DC", phone: "+91 40 2299 5511", email: "hyd@czar.io", address: "Gachibowli", city: "Hyderabad", state: "TS", country: "India", postalCode: "500032", isActive: true },
  { id: "w6", code: "WH-PUN-06", name: "Pune Assembly", phone: "+91 20 6712 4400", email: "pun@czar.io", address: "Hinjewadi Phase II", city: "Pune", state: "MH", country: "India", postalCode: "411057", isActive: true },
  { id: "w7", code: "WH-KOL-07", name: "Kolkata Depot", phone: "+91 33 4001 5522", email: "kol@czar.io", address: "Salt Lake Sector V", city: "Kolkata", state: "WB", country: "India", postalCode: "700091", isActive: false },
];

export type StockEntry = {
  id: string;
  code: string;
  template: string;
  warehouse: string;
  createdBy: string;
  status: "posted" | "pending" | "draft" | "rejected";
  itemsCount: number;
  createdAt: string;
};

export const stockEntries: StockEntry[] = [
  { id: "se1", code: "SE-2026-01184", template: "Inbound Receipt", warehouse: "WH-BLR-01", createdBy: "Aarav Shah", status: "posted", itemsCount: 42, createdAt: "2026-07-09T09:12:00Z" },
  { id: "se2", code: "SE-2026-01183", template: "RMA Return", warehouse: "WH-MUM-02", createdBy: "Priya Nair", status: "pending", itemsCount: 6, createdAt: "2026-07-09T08:45:00Z" },
  { id: "se3", code: "SE-2026-01182", template: "Assembly Consumption", warehouse: "WH-PUN-06", createdBy: "Rohit Mehta", status: "posted", itemsCount: 128, createdAt: "2026-07-09T07:30:00Z" },
  { id: "se4", code: "SE-2026-01181", template: "Cycle Count Adj.", warehouse: "WH-HYD-05", createdBy: "Neha Kapoor", status: "posted", itemsCount: 12, createdAt: "2026-07-08T18:02:00Z" },
  { id: "se5", code: "SE-2026-01180", template: "Inbound Receipt", warehouse: "WH-DEL-03", createdBy: "Karan Malhotra", status: "draft", itemsCount: 0, createdAt: "2026-07-08T16:41:00Z" },
  { id: "se6", code: "SE-2026-01179", template: "Transfer Out", warehouse: "WH-BLR-01", createdBy: "Aarav Shah", status: "posted", itemsCount: 24, createdAt: "2026-07-08T15:22:00Z" },
  { id: "se7", code: "SE-2026-01178", template: "Assembly Consumption", warehouse: "WH-PUN-06", createdBy: "Rohit Mehta", status: "rejected", itemsCount: 8, createdAt: "2026-07-08T14:10:00Z" },
  { id: "se8", code: "SE-2026-01177", template: "Inbound Receipt", warehouse: "WH-MUM-02", createdBy: "Priya Nair", status: "posted", itemsCount: 60, createdAt: "2026-07-08T11:55:00Z" },
  { id: "se9", code: "SE-2026-01176", template: "RMA Return", warehouse: "WH-CHN-04", createdBy: "Vikram Iyer", status: "pending", itemsCount: 3, createdAt: "2026-07-08T10:31:00Z" },
  { id: "se10", code: "SE-2026-01175", template: "Cycle Count Adj.", warehouse: "WH-BLR-01", createdBy: "Aarav Shah", status: "posted", itemsCount: 17, createdAt: "2026-07-08T09:08:00Z" },
];

export type SerializedItem = {
  id: string;
  serial: string;
  template: string;
  companyPartCode: string;
  warehouse: string;
  status: "in_stock" | "reserved" | "shipped" | "faulty";
  receivedAt: string;
};

export const serializedItems: SerializedItem[] = [
  { id: "s1", serial: "CZR-DSP-2026-000184", template: "Dispenser Unit v3", companyPartCode: "CZR-DSP-V3", warehouse: "WH-BLR-01", status: "in_stock", receivedAt: "2026-07-08" },
  { id: "s2", serial: "CZR-DSP-2026-000183", template: "Dispenser Unit v3", companyPartCode: "CZR-DSP-V3", warehouse: "WH-BLR-01", status: "reserved", receivedAt: "2026-07-08" },
  { id: "s3", serial: "CZR-CTL-2026-004411", template: "Controller Board r4", companyPartCode: "CZR-CTL-R4", warehouse: "WH-PUN-06", status: "in_stock", receivedAt: "2026-07-07" },
  { id: "s4", serial: "CZR-CTL-2026-004410", template: "Controller Board r4", companyPartCode: "CZR-CTL-R4", warehouse: "WH-PUN-06", status: "shipped", receivedAt: "2026-07-05" },
  { id: "s5", serial: "CZR-PMP-2026-001902", template: "Peristaltic Pump", companyPartCode: "CZR-PMP-STD", warehouse: "WH-MUM-02", status: "in_stock", receivedAt: "2026-07-07" },
  { id: "s6", serial: "CZR-PMP-2026-001901", template: "Peristaltic Pump", companyPartCode: "CZR-PMP-STD", warehouse: "WH-MUM-02", status: "faulty", receivedAt: "2026-07-06" },
  { id: "s7", serial: "CZR-DSP-2026-000182", template: "Dispenser Unit v3", companyPartCode: "CZR-DSP-V3", warehouse: "WH-DEL-03", status: "in_stock", receivedAt: "2026-07-06" },
  { id: "s8", serial: "CZR-DSP-2026-000181", template: "Dispenser Unit v3", companyPartCode: "CZR-DSP-V3", warehouse: "WH-HYD-05", status: "in_stock", receivedAt: "2026-07-05" },
];

export type BulkItem = {
  id: string;
  batchNumber: string;
  template: string;
  companyPartCode: string;
  warehouse: string;
  quantity: number;
  unit: string;
  receivedAt: string;
};

export const bulkItems: BulkItem[] = [
  { id: "b1", batchNumber: "BATCH-2026-0712", template: "Silicone Gasket 22mm", companyPartCode: "CZR-GSK-22", warehouse: "WH-BLR-01", quantity: 4200, unit: "pcs", receivedAt: "2026-07-08" },
  { id: "b2", batchNumber: "BATCH-2026-0711", template: "M4x12 SS Screw", companyPartCode: "CZR-SCR-M4-12", warehouse: "WH-BLR-01", quantity: 18500, unit: "pcs", receivedAt: "2026-07-07" },
  { id: "b3", batchNumber: "BATCH-2026-0710", template: "18AWG Wire", companyPartCode: "CZR-WIR-18", warehouse: "WH-PUN-06", quantity: 620, unit: "m", receivedAt: "2026-07-07" },
  { id: "b4", batchNumber: "BATCH-2026-0709", template: "Thermal Paste", companyPartCode: "CZR-TP-05", warehouse: "WH-HYD-05", quantity: 48, unit: "tubes", receivedAt: "2026-07-06" },
  { id: "b5", batchNumber: "BATCH-2026-0708", template: "PLA Filament 1.75", companyPartCode: "CZR-FIL-PLA", warehouse: "WH-CHN-04", quantity: 120, unit: "kg", receivedAt: "2026-07-05" },
  { id: "b6", batchNumber: "BATCH-2026-0707", template: "Nozzle Assembly", companyPartCode: "CZR-NZL-STD", warehouse: "WH-DEL-03", quantity: 340, unit: "pcs", receivedAt: "2026-07-05" },
];
