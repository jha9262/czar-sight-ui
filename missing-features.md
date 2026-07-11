# CZAR IMS Feature Gap Analysis

This document outlines the features and functionalities that were present in the original `czar-ims-documentation.md` but are currently missing or abstracted differently in the new `czar-sight-ui-features.md` implementation.

## 1. Product Blueprints
The original documentation included a dedicated system for **Blueprints** under the Product Management Desk, which is currently missing from the new UI.
- **Missing Pages/Tabs:** Blueprints tab under Product Management.
- **Missing Actions:** `CREATE BLUEPRINT`, `ADD BLUEPRINT PART`.
- **Missing Forms:** `addProductBlueprint`, `addBlueprintPart`, `displayBlueprintParts`.

## 2. Part Versions and Variants
The original Parts Management Desk supported a deep hierarchy of parts, including **Versions** and **Variants**. The new UI simplifies this into "Part Masters" and "Part Types", omitting versions and variants.
- **Missing Forms:** `addPartVersion`, `addPartVariant`.

## 3. BOM Component Types & Properties
The original Bill of Materials (BOM) section allowed users to define custom **Component Types** and dynamic **Property Schemas** for BOM components.
- **Missing Actions:** Define BOM Component Type, Edit BOM Component Type.
- **Missing Forms:** `addBomCompType`, `editBomCompType`.
- **Missing Tables:** `PROPERTY SCHEMA` table showing Property Key, Data Type, and Requirement.

## 4. BOM Templates vs. BOM Instances
The original app explicitly distinguished between **BOM Templates** (defining the column structure) and **BOM Instances** (the actual BOMs based on templates). The new UI abstracts this into a simpler unified BOMs page.
- **Missing Actions:** `Create BOM Template`, `Create BOM Instance`.
- **Missing Forms:** `addBomInstance`, `displayBomInstance`.

## 5. Direct Item Instance Registration
In the original app, there was a specific "Item Instances" tab under the Items Management Desk with a "Register Item Instance" action (`addItemInstance`). In the new UI, this concept has been moved entirely into the **Stock Control** and **Stock Entries** sections (receiving serialized/bulk stock), meaning the standalone "Item Instance" registration form is no longer present.

## 6. Form/Modal Granularity
The original documentation listed detailed embedded forms (e.g., `viewUser`, `displayVendor`, `viewPartTemplate`). While the new UI has Edit/Create pages for these entities, it currently uses dedicated routes (e.g., `/users/edit/$id`) rather than the heavy modal-based architecture (`addCompany`, `addVendor` modals) detailed in the old specs.
