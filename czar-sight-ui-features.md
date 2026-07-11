# CZAR Sight UI - Comprehensive UI & Functionality Documentation

This document provides a comprehensive in-depth overview of every page, section, data table, and action present in the CZAR Sight UI web application.

## 1. Core Pages & Sections

### Interactive Dashboard (`/dashboard`)
> Real-time inventory overview, critical metrics, and quick actions.

**Page Actions:**
- **Quick Links:** Navigate directly to parts, BOMs, stock entries, etc.
- **Data Visualizations:** View stock distribution and low stock alerts.

### Companies Directory (`/companies`)
> Manage client companies, buyer organizations, and customer accounts.

**Page Actions:**
- **CREATE COMPANY** (`/companies/create`): Add a new company.
- **EDIT COMPANY** (`/companies/edit/$id`): Update existing company details.
- **DELETE COMPANY**: Remove a company from the system.

**Data Table Columns:**
- Code, Name, Phone, Status, Actions

---

## 2. Inventory & Catalog

### Parts Catalog (`/inventory/parts`)
> Structured catalog of part types and master parts used across BOMs.

**Subsections / Tabs:**
- Part Masters
- Part Types

**Page Actions:**
- **NEW PART** (`/inventory/parts/create`)
- **EDIT PART** (`/inventory/parts/edit/$id`)
- **DELETE PART**

**Data Table Columns (Masters):**
- Part number, Name, Type, Description, Unit, Actions

### Item Templates (`/inventory/items`)
> Reusable item templates used across stock and sourcing, defining whether items are serialized or bulk.

**Page Actions:**
- **NEW TEMPLATE** (`/inventory/items/create`)
- **EDIT TEMPLATE** (`/inventory/items/edit/$id`)
- **DELETE TEMPLATE**

**Data Table Columns:**
- Name, Company part code, Kind (Serialized/Bulk), Unit, Attributes, Status, Actions

### Sourcing Links (`/inventory/sourcing`)
> Link manufacturers and MPNs to item templates and mark preferred suppliers.

**Page Actions:**
- **NEW LINK** (`/inventory/sourcing/create`)
- **EDIT LINK** (`/inventory/sourcing/edit/$id`)
- **DELETE LINK**

**Data Table Columns:**
- Template, Manufacturer, MPN, Lead time, Preferred, Actions

### Stock Control (`/inventory/stock`)
> Track physical inventory across all warehouses for both serialized and bulk items.

**Subsections / Tabs:**
- Serialized Items
- Bulk Items

**Page Actions:**
- **RECEIVE STOCK** (`/inventory/stock/create`)
- **EDIT SERIALIZED** (`/inventory/stock/edit-serialized/$id`)
- **EDIT BULK** (`/inventory/stock/edit-bulk/$id`)
- **DELETE STOCK**

**Data Table Columns (Serialized):**
- Serial number, Template, Part code, Warehouse, Received, Status, Actions

**Data Table Columns (Bulk):**
- Batch number, Template, Part code, Warehouse, Quantity, Received, Actions

---

## 3. Supply Chain (Sourcing)

### Manufacturers (`/sourcing/manufacturers`)
> Manage production partners, factories, and hardware manufacturers.

**Page Actions:**
- **NEW MANUFACTURER** (`/sourcing/manufacturers/create`)
- **EDIT MANUFACTURER** (`/sourcing/manufacturers/edit/$id`)
- **DELETE MANUFACTURER**

**Data Table Columns:**
- Code, Name, Country, Rating, Certified, Status, Actions

### Vendors (`/sourcing/vendors`)
> Manage supply chain vendor relationships.

**Page Actions:**
- **NEW VENDOR** (`/sourcing/vendors/create`)
- **EDIT VENDOR** (`/sourcing/vendors/edit/$id`)
- **DELETE VENDOR**

**Data Table Columns:**
- Code, Name, Contact, Email, Phone, Status, Actions

---

## 4. Product Engineering

### Product Models (`/product-models`)
> Manage DU classifications, hardware models, and assembly blueprints.

**Subsections / Tabs:**
- Product Models
- Product Types

**Page Actions:**
- **NEW MODEL** (`/product-models/create`)
- **EDIT MODEL** (`/product-models/edit/$id`)
- **DELETE MODEL**

**Data Table Columns (Models):**
- Code, Title, Type, Status, Actions

### Bill Of Materials (`/bom`)
> Coordinate assembly component counts, placements, and quantities.

**Page Actions:**
- **CREATE BOM** (`/bom/create`)
- **VIEW/EDIT BOM** (`/bom/$id`)

**Data Table Columns:**
- Name, Version, Template, Date Created, Actions

---

## 5. Stock Management & Operations

### Stock Entries (`/stock/entries`)
> Every posted movement, transfer, adjustment and return.

**Page Actions:**
- **NEW ENTRY** (`/stock/entries/create`)
- **EDIT ENTRY** (`/stock/entries/edit/$id`)
- **DELETE ENTRY**

**Data Table Columns:**
- Code, Template, Warehouse, Created by, Items, Created at, Status, Actions

### Stock Ledger (`/stock/ledger`)
> Immutable ledger of all inventory transactions and movements.

### Entry Templates (`/stock/templates`)
> Reusable templates for standard stock movements.

**Page Actions:**
- **NEW TEMPLATE** (`/stock/templates/create`)
- **EDIT TEMPLATE** (`/stock/templates/edit/$id`)

---

## 6. System & Administration

### Warehouses (`/warehouses`)
> Manage distribution centres and fulfilment hubs.

**Page Actions:**
- **NEW WAREHOUSE** (`/warehouses/create`)
- **EDIT WAREHOUSE** (`/warehouses/edit/$id`)
- **DELETE WAREHOUSE**

**Data Table Columns:**
- Code, Name, City, Country, Contact, Status, Actions

### Users & Access (`/users`)
> Manage administrators, managers and warehouse operators.

**Page Actions:**
- **NEW USER** (`/users/create`)
- **EDIT USER** (`/users/edit/$id`)
- **DELETE USER**

**Data Table Columns:**
- User, Role, Active, MFA, Last active, Actions

### Files & Media (`/files`)
> Manage system uploads, documents, and media assets.

**Page Actions:**
- **UPLOAD FILE** (`/files/upload`)

### Settings (`/settings`)
> Global configuration and preferences.

---

## 7. Authentication
- **Login** (`/login`): Secure access portal.
- **MFA Setup** (`/mfa-setup`): Multi-factor authentication enrollment.

## 8. Common UI Components
- **Data Table Redesign**: All tables feature a consistent, premium design with `bg-muted/30` headers, centered columns, and distinct action buttons.
- **Toolbar & Pagination**: Interactive search, filtering, and pagination components uniformly applied.
- **Status Badges**: Color-coded indicators for states (Active, Inactive, Pending, Posted, etc.).
- **Delete Dialogs**: Confirmation modals for all destructive actions to prevent accidental data loss.
