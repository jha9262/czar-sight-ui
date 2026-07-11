# CZAR IMS - Comprehensive UI & Functionality Documentation

This document provides a comprehensive in-depth overview of every page, section, table, and form (including modals) present in the CZAR IMS web application.

## 1. Pages & Sections

### Interactive Dashboard
> Real-time inventory overview and platform stats.

**Page Actions:**
- MANAGE PARTS ➔
- MANAGE BOMS ➔
- SYSTEM LOGS ➔
- VIEW FULFILLMENT ➔
- TRACK ORDERS ➔
- VIEW LOGISTICS ➔

**Data Table Columns:**
- Part, Status, Order ID, Client, Status, Progress, Item, Transferred From, Transferred To, Part SKU, Tracking #, Status, User, Operation / Action, Timestamp, BOM Element, Calculated Cost

### Parts Management Desk
> Unified dashboard to manage part classifications, masters, versions, and variants.

**Subsections / Tabs:**
- Part Types
- Part Templates

**Page Actions:**
- CREATE PART TYPE
- VIEW
- CREATE PART TEMPLATE

**Data Table Columns:**
- Type ID, Category Name, Description, Template ID, Template Name, Category, Status, Actions

### Items Management Desk
> Unified dashboard to manage catalog templates, vendors, and physical stock.

**Subsections / Tabs:**
- Item Templates
- Sourcing Links
- Item Instances

**Page Actions:**
- ADD SOURCING LINK
- CREATE ITEM TEMPLATE
- REGISTER ITEM INSTANCE

**Data Table Columns:**
- Template ID, Part Code, Item Name, Serialized, Unit, BOM Category, Technical Specifications, Sourcing ID, Item Template, Manufacturer, Mfg Part Code, Serial / Batch, Linked Sourcing, Item Name, Location, Qty, Physical Status

### Product Management Desk
> Unified dashboard to manage DU classifications, hardware models, and assembly blueprints.

**Subsections / Tabs:**
- Product Types
- Product Models
- Blueprints

**Page Actions:**
- CREATE PRODUCT MODEL
- CREATE PRODUCT TYPE
- VIEW
- CREATE BLUEPRINT

**Data Table Columns:**
- Type ID, Type Code, Description, Model ID, Model Code, Model Title, DU Type Code, Description, Status, Blueprint ID, Blueprint Name, Product Model, Active Revision, Status, Actions

### Companies Directory Desk
> Manage client companies, buyer organizations, and customer accounts (API Section 10.1).

**Page Actions:**
- CREATE COMPANY

**Data Table Columns:**
- Company ID, Company Code, Company Name, Phone Contact, Status

### Bill Of Materials
> Coordinate assembly component counts, placements, and quantities (API Section 12).

**Page Actions:**
- EDIT
- ADD ITEM
- Create BOM
- DELETE
- Create BOM Template
- VIEW

**Data Table Columns:**
- BOM NAME, BOM DESCRIPTION, ACTIONS, NAME, VERSION, TEMPLATE, DATE CREATED, ACTIONS

### Vendors
> Manage procurement partnerships, external suppliers, and origin companies (API Section 11).

**Subsections / Tabs:**
- Vendors
- Manufacturers

**Page Actions:**
- EDIT
- DELETE
- CREATE VENDOR
- VIEW
- CREATE MANUFACTURER

**Data Table Columns:**
- Code, Vendor Name, Contact Person, Email, Phone, Status, Actions, Code, Manufacturer Name, Contact Person, Email, Phone, Status, Actions

### Attached System Files
> View technical documents, schematic diagrams, and attachments (API Section 13).

**Page Actions:**
- UPLOAD SYSTEM FILE
- VIEW
- Delete

**Data Table Columns:**
- UUID, Filename, MIME Type, Size, Visibility, Upload Date, Actions

### System User Management
> Manage enterprise access, active sessions, and security overrides (API Section 7).

**Page Actions:**
- ADD SYSTEM USER

**Data Table Columns:**
- Avatar, Display Name, Email Address, Roles, Status, MFA Enforced, Operations

## 2. Modals & Forms

The application heavily relies on modals for data entry and CRUD operations. Below are the modal forms, their triggering context, and their fields:

### ${user.name}
*(Internal ID: `viewUser`)*

### editUser
*(Internal ID: `editUser`)*

**Form Fields:**
- Display Name *
- Email Address *
- Reset Password (Optional)
- Assigned System Roles

### addUser
*(Internal ID: `addUser`)*

**Form Fields:**
- Display Name *
- Email Address *
- Password *
- Assigned System Roles

### addPartTemplate
*(Internal ID: `addPartTemplate`)*

**Form Fields:**
- Name
- Part Type *
- Description
- Custom Specifications / Properties

### viewPartTemplate
*(Internal ID: `viewPartTemplate`)*

**Form Fields:**
- Template Name
- Part Type / Category
- Status
- Description
- Custom Specifications / Properties

### addPartType
*(Internal ID: `addPartType`)*

**Form Fields:**
- Part Type Name *
- Description

### addPartMaster
*(Internal ID: `addPartMaster`)*

**Form Fields:**
- Part Code *
- Part Master Name *
- Component Type *
- Description

### addPartVersion
*(Internal ID: `addPartVersion`)*

**Form Fields:**
- Parent Part Master  *
- Version Label / Name *
- Description / Changelog

### addPartVariant
*(Internal ID: `addPartVariant`)*

**Form Fields:**
- Parent Part Version *
- Variant Name *
- Physical Specifications

### addItemTemplate
*(Internal ID: `addItemTemplate`)*

**Form Fields:**
- Item Name *
- Internal Part Code *
- Unit *
- BOM Component Type *
- Custom Specifications / Properties

### addItemSourcing
*(Internal ID: `addItemSourcing`)*

**Form Fields:**
- Select Item Template *
- Select Manufacturer *
- Manufacturer Part Code *

### addItemInstance
*(Internal ID: `addItemInstance`)*

**Form Fields:**
- Select Sourcing Link *
- Serial Number *
- Batch / Lot Number
- Quantity *
- Inventory Status *
- Warehouse Location *

### addProductType
*(Internal ID: `addProductType`)*

**Form Fields:**
- Type Code *
- Description

### addProductModel
*(Internal ID: `addProductModel`)*

**Form Fields:**
- Model Code *
- Model Title *
- Parent DU Type *
- Description

### addProductBlueprint
*(Internal ID: `addProductBlueprint`)*

**Form Fields:**
- Blueprint Name *
- Parent Product Model *

### addBlueprintPart
*(Internal ID: `addBlueprintPart`)*

**Form Fields:**
- Select Target Blueprint *
- Parts Requirements List *

### addCompany
*(Internal ID: `addCompany`)*

**Form Fields:**
- Company Code *
- Company Name / Title *
- Phone Contact Number

### addBom
*(Internal ID: `addBom`)*

**Form Fields:**
- Template Name *
- Description
- TEMPLATE COLUMNS *

### addBomInstance
*(Internal ID: `addBomInstance`)*

**Form Fields:**
- BOM Name *
- Description
- Version *
- Select BOM Template *

### displayVendor
*(Internal ID: `displayVendor`)*

### displayBlueprintParts
*(Internal ID: `displayBlueprintParts`)*

**Embedded Table Columns:**
- Part Code, Part Master Name, Required Qty, Mandatory clearance

### displayBom
*(Internal ID: `displayBom`)*

**Embedded Table Columns:**
- No., COLUMN NAME

### displayBomInstance
*(Internal ID: `displayBomInstance`)*

**Embedded Table Columns:**
- DETAILS

### addBomItem
*(Internal ID: `addBomItem`)*

**Form Fields:**
- ${col} *

### editBom
*(Internal ID: `editBom`)*

**Form Fields:**
- Template Name *
- Description
- TEMPLATE COLUMNS *

### addBomItem
*(Internal ID: `addBomItem`)*

**Form Fields:**
- Select Target BOM *
- Select Component Template *
- Quantity *
- PCB Footprint
- PCB Designators
- Placement Remark

### addBomCompType
*(Internal ID: `addBomCompType`)*

**Form Fields:**
- Classification Code *
- Classification Name *
- Description
- COMPONENT PROPERTIES *

### PROPERTY SCHEMA
*(Internal ID: `viewBomCompType`)*

**Embedded Table Columns:**
- Property Key, Data Type, Requirement

### editBomCompType
*(Internal ID: `editBomCompType`)*

**Form Fields:**
- Classification Code *
- Classification Name *
- Description
- COMPONENT PROPERTIES *

### addVendor
*(Internal ID: `addVendor`)*

**Form Fields:**
- Vendor Code *
- Vendor Company Name *
- Contact Person
- Phone Number
- Email Address
- Physical Address

### editVendor
*(Internal ID: `editVendor`)*

**Form Fields:**
- Vendor Code *
- Vendor Company Name *
- Contact Person
- Phone Number
- Email Address
- Physical Address

### addManufacturer
*(Internal ID: `addManufacturer`)*

**Form Fields:**
- Manufacturer Code *
- Manufacturer Name *
- Contact Person
- Phone Number
- Email Address
- Physical Address

### editManufacturer
*(Internal ID: `editManufacturer`)*

**Form Fields:**
- Manufacturer Code *
- Manufacturer Name *
- Contact Person
- Phone Number
- Email Address
- Physical Address

### uploadFile
*(Internal ID: `uploadFile`)*
