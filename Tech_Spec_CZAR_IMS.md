# CZAR IMS - Technical Specification Document

## 1. Data Models
The application relies on an in-memory database represented by the `appState` object. The primary data models and their shapes are:

*   **User**: `{ id, name, email, isActive, mfaEnabled, roles: [], createdAt, updatedAt }`
*   **Part Type**: `{ id, name, description }`
*   **Part Master**: `{ sku, name, category, version, status }`
*   **Part Version**: `{ id, partMasterSku, versionName, description }`
*   **Part Variant**: `{ id, partVersionId, variantName, specifications }`
*   **Component Type (BOM Classification)**: `{ id, code, name, description, propertySchema: {}, isActive }`
*   **Item Template**: `{ id, code, name, componentTypeId, status }`
*   **Item Sourcing**: `{ id, templateId, vendorCode, manufacturerCode }`
*   **Instance**: `{ id, serialNumber, sourcingId, status }`
*   **Company**: `{ id, code, title, phone, isActive }`
*   **Product Type**: `{ id, code, description }`
*   **Product Model**: `{ id, modelCode, modelTitle, typeId, isActive }`
*   **Blueprint**: `{ id, blueprintName, modelId }`
*   **Blueprint Part**: `{ id, blueprintId, partMasterId, qty, isRequired }`
*   **BOM**: `{ id, name, modelId, version, isActive }`
*   **BOM Item**: `{ id, bomId, templateId, quantity }`
*   **Vendor**: `{ code, name, contact, email, phone, address, status }`
*   **Manufacturer**: `{ code, name, contact, email, phone, address, status }`
*   **File**: `{ uuid, filename, type, size, visibility, date }`
*   **Log Entry**: `{ user, action, time }`

## 2. Inferred State
The application state is highly distributed across global variables, `let` bindings, and DOM properties. Key state variables tracking the UI include:

*   **Global / Window Scope Variables**:
    *   `window.currentPage` / `activePage`: Tracks the active module view (e.g., `'dashboard'`, `'parts'`, `'items'`, `'products'`, `'boms'`, `'sourcing'`, `'files'`, `'users'`).
    *   `window.isFormPage`, `window.formPageType`, `window.formPageContext`: Determine if the application is running in the isolated form view.
*   **Tab & Filter State (Local Variables)**:
    *   `activePartsTab`, `activeItemsTab`, `activeProductsTab`, `activeSourcingTab`, `activeBomTab`: String variables tracking the active sub-tab within a module.
    *   `activeBomFilter`, `activeBlueprintFilter`, `activeInventoryView`: Track the currently selected filters in list views.
*   **Form & Modal State**:
    *   `isValid`, `duplicateDetected`: Boolean flags for inline form validation.
    *   `selectedFile`: Object tracking the currently staged file for upload.
    *   `currentIdx`: Used for tracking context in iterative UI operations.
*   **DOM-Inferred State**:
    *   Modal visibility is inferred from the presence of the `.show` class on the modal backdrop element.
    *   Form loading states are inferred from `.is-loading` classes on submit buttons and `disabled` attributes on inputs.

## 3. API Contracts
**Important Note:** The current frontend code (`app.js`) is purely functional via local memory (`appState`) and **contains no actual `fetch` or `XMLHttpRequest` calls.** The UI cosmetically displays REST endpoints to simulate functionality. However, the system is designed to integrate with the following API contracts (as documented in `CZAR_API_Summary.md`):

### Authentication
*   `POST /api/auth/register`: `{ name, email, password }` -> `201 { id, name, email }`
*   `POST /api/auth/login`: `{ email, password }` -> `200 { accessToken, user }` or `{ challengeToken }`
*   `POST /api/auth/mfa/setup`: `{ challengeToken }` -> `200 { qrCodeUri, secret }`
*   `POST /api/auth/mfa/enable`: `{ challengeToken, otp }` -> `200` (User Object)
*   `POST /api/auth/mfa/verify`: `{ challengeToken, otp }` -> `200 { accessToken }`

### Users
*   `GET /api/users/me`: None -> `200` (User Object)
*   `GET /api/users`: None -> `200` (Paginated User Array)
*   `GET /api/users/:id`: None -> `200` (User Object)
*   `PATCH /api/users/:id`: `{ name, email, password, isActive, mfaEnabled }` -> `200` (Updated User)
*   `DELETE /api/users/:id`: None -> `204 No Content`

### Inventory - Parts
*   `POST /api/inventory/parts/types`: `{ name, description }` -> `201`
*   `GET /api/inventory/parts/types`: None -> `200` (Array)
*   `POST /api/inventory/parts/masters`: `{ partTypeId, partNumber, name, unit }` -> `201`
*   `GET /api/inventory/parts/masters`: None -> `200` (Array)
*   `POST /api/inventory/parts/versions`: `{ partMasterId, versionName }` -> `201`
*   `POST /api/inventory/parts/variants`: `{ partVersionId, variantName }` -> `201`

### Inventory - Items & Sourcing
*   `POST /api/inventory/items/templates`: `{ name, companyPartCode, isSerialized, componentTypeId }` -> `201`
*   `PATCH /api/inventory/items/templates/:id`: `{ ...template fields }` -> `200`
*   `POST /api/inventory/items/sourcing`: `{ itemTemplateId, manufacturerId, manufacturerPartCode }` -> `201`
*   `POST /api/inventory/items/instances`: `{ itemSourcingId, quantity, status }` -> `201`
*   `GET /api/inventory/items/instances/serial/:serialNumber`: None -> `200` (Instance Object)

### Vendors & Manufacturers
*   `POST /api/inventory/sourcing/vendors`: `{ code, name, contactPerson, email, phone, address }` -> `201`
*   `PATCH /api/inventory/sourcing/vendors/:id`: `{ name, isActive }` -> `200`
*   `POST /api/inventory/sourcing/manufacturers`: `{ code, name, contactPerson, email, phone, address }` -> `201`

### BOM (Bill of Materials)
*   `POST /api/inventory/bom/component-types`: `{ code, name, propertySchema }` -> `201`
*   `POST /api/inventory/bom`: `{ name, duModelId, version }` -> `201`
*   `POST /api/inventory/bom/:bomId/items`: `{ itemTemplateId, quantity }` -> `201`
*   `GET /api/inventory/bom/:bomId/production-requirements?productionQuantity=N`: None -> `200` (Shortfall Analysis)

### Files
*   `POST /api/files/upload`: FormData `file`, `isPublic` -> `201 { id, url }`
*   `GET /api/files/:id/download`: None -> `200` (Binary Stream)

## 4. Business Logic Functions
The legacy code is heavily coupled with the DOM. Most functions mix data manipulation and UI rendering. However, the following logic patterns represent the core business logic scattered throughout the file:

*   **Authentication Flow Simulation**: Validating presence of email/password, simulating a network delay, assigning a mock `challengeToken`, and transitioning the UI to the MFA challenge.
*   **OTP Validation (`checkOtpCompleteness`)**: Verifying that all 6 digits of the MFA challenge have been inputted before enabling the submission button. 
*   **Duplicate Detection Validation**: When creating entities (e.g., BOM Component Types, Vendors, Manufacturers), iterating through existing items in `appState` to prevent duplicate `code` values.
*   **Schema Property Management**: Adding and removing dynamic key-value properties from `propertySchema` objects within component types.
*   **Entity Deletion Checks**: Preventing the logged-in user from deleting their own user account (`deleteUserProfile`).

## 5. User Interactions
Events are bound to DOM elements to trigger state changes, validation, and rendering:

*   **`DOMContentLoaded`**: Initializes the application, sets the theme, reads URL parameters (to set `isFormPage`), and binds foundational event listeners.
*   **`click` events**:
    *   **Tabs & Navigation**: Updates `activePage`, `activePartsTab`, etc., and triggers `renderPage()` or sub-renders.
    *   **Action Buttons**: Triggers `openModal()` to create, edit, or view entities.
    *   **Modal Controls**: `#modalCancel` or backdrop clicks trigger `closeModal()`.
    *   **Dynamic Forms**: `#btnAddPropertyRow` and `.btn-del-prop` clicks manipulate dynamic form arrays.
    *   **Utilities**: `togglePassword` toggles password field visibility; `btnBackToLogin` resets the auth flow.
    *   **File Dropzone**: Clicking the `#dragZone` stages a simulated file object.
*   **`submit` events**:
    *   **Forms**: Triggers validation, mutates the underlying `appState` array/object, and calls `closeModal()` followed by re-rendering the relevant view.
*   **`input` / `change` events**:
    *   **Theme Selection**: Updates CSS variables and local storage.
    *   **Form Validation**: Clears `.has-error` classes when the user starts typing to correct a mistake.
*   **`focus` / `keydown` / `paste` events**:
    *   **OTP Inputs**: Handles auto-advancing focus on type, returning focus on backspace, and splitting pasted 6-digit codes across the individual inputs.
