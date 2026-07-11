export type Vendor = {
  code: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: "ACTIVE" | "OFFLINE";
};
export const vendors: Vendor[] = [
  { code: "V-DK", name: "DigiKey Electronics", contact: "Sarah Jenkins", email: "sales@digikey.com", phone: "+1-800-344-4539", address: "701 Brooks Ave S, Thief River Falls, MN", status: "ACTIVE" },
  { code: "V-MO", name: "Mouser Electronics", contact: "David Miller", email: "sales@mouser.com", phone: "+1-800-346-6873", address: "1000 N Main St, Mansfield, TX", status: "ACTIVE" },
  { code: "V-AV", name: "Arrow Electronics", contact: "Ellen Croft", email: "support@arrow.com", phone: "+1-855-326-4757", address: "9201 E Dry Creek Rd, Centennial, CO", status: "ACTIVE" },
  { code: "V-EL", name: "Element14 Corp", contact: "Marcus Vance", email: "sales@element14.com", phone: "+1-800-463-9275", address: "150 S Wacker Dr, Chicago, IL", status: "OFFLINE" },
  { code: "V-AS", name: "Avnet Silica", contact: "Laura Dupont", email: "info@avnet.com", phone: "+32-2-709-9000", address: "Gruber Str. 60c, Poing, Germany", status: "ACTIVE" },
];

export type Manufacturer = {
  code: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: "ACTIVE" | "INACTIVE";
};
export const manufacturers: Manufacturer[] = [
  { code: "M-TI", name: "Texas Instruments", contact: "Robert Chen", email: "sales@ti.com", phone: "+1-800-336-5236", address: "12500 TI Blvd, Dallas, TX", status: "ACTIVE" },
  { code: "M-ST", name: "STMicroelectronics", contact: "Giovanni Rossi", email: "contact@st.com", phone: "+39-039-603-1", address: "39 Chemin du Champ des Filles, Geneva, Switzerland", status: "ACTIVE" },
  { code: "M-AD", name: "Analog Devices", contact: "Alice Vance", email: "analog@devices.com", phone: "+1-781-329-4700", address: "1 Analog Way, Wilmington, MA", status: "ACTIVE" },
  { code: "M-XM", name: "Espressif Systems", contact: "Wei Zhao", email: "iot@espressif.com", phone: "+86-21-6106-2080", address: "Suite 204, Block 2, 690 Bibo Rd, Shanghai, China", status: "ACTIVE" },
  { code: "M-IN", name: "Intel Corporation", contact: "Patrick Gelsinger", email: "support@intel.com", phone: "+1-408-765-8080", address: "2200 Mission College Blvd, Santa Clara, CA", status: "INACTIVE" },
];

export type CompanyFull = {
  id: string;
  code: string;
  title: string;
  phone: string;
  isActive: boolean;
};
export const companiesFull: CompanyFull[] = [
  { id: "CO-ACME", code: "C-001", title: "Acme Retail Solutions", phone: "+1-555-0100", isActive: true },
  { id: "CO-GLOBEX", code: "C-002", title: "Globex Dispensing Corp", phone: "+1-555-0210", isActive: true },
  { id: "CO-INITECH", code: "C-003", title: "Initech Medical Systems", phone: "+1-555-0344", isActive: false },
];

export type ProductType = {
  id: string;
  code: string;
  description: string;
};
export const productTypes: ProductType[] = [
  { id: "PT-RETAIL", code: "DU-TYPE-01", description: "Retail Dispenser Units for storefront operations" },
  { id: "PT-INDUSTRIAL", code: "DU-TYPE-02", description: "Industrial high-capacity chemical dispensers" },
  { id: "PT-MEDICAL", code: "DU-TYPE-03", description: "Medical grade sterile fluid dispensers" },
];

export type Blueprint = {
  id: string;
  name: string;
  duModelId: string;
  revision: string;
  status: "APPROVED" | "UNDER REVIEW" | "DRAFT";
};
export const blueprints: Blueprint[] = [
  { id: "BP-001", name: "Factory Blueprint A", duModelId: "dm1", revision: "r1.2", status: "APPROVED" },
  { id: "BP-002", name: "Factory Blueprint B", duModelId: "dm2", revision: "r2.0-beta", status: "UNDER REVIEW" },
  { id: "BP-003", name: "Factory Blueprint C", duModelId: "dm3", revision: "r1.0", status: "APPROVED" },
];

export type FileRecord = {
  uuid: string;
  filename: string;
  type: string;
  size: string;
  visibility: "PUBLIC" | "PRIVATE";
  date: string;
};
export const files: FileRecord[] = [
  { uuid: "F-3fa85f64", filename: "intel_xeon_datasheet.pdf", type: "application/pdf", size: "4.82 MB", visibility: "PUBLIC", date: "2026-06-25" },
  { uuid: "F-57174562", filename: "samsung_ram_specs.pdf", type: "application/pdf", size: "1.15 MB", visibility: "PRIVATE", date: "2026-06-24" },
  { uuid: "F-b3fc2c96", filename: "motherboard_layout.dxf", type: "image/vnd.dxf", size: "12.42 MB", visibility: "PRIVATE", date: "2026-06-23" },
  { uuid: "F-3f66afa6", filename: "firmware_v2.4.bin", type: "application/octet-stream", size: "256.00 KB", visibility: "PUBLIC", date: "2026-06-22" },
  { uuid: "F-a238fb01", filename: "chassis_dimensions.png", type: "image/png", size: "1.78 MB", visibility: "PUBLIC", date: "2026-06-21" },
];
