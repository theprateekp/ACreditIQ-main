# AccreditIQ - Dashboard Section

## Overview
The Dashboard section of AccreditIQ serves as the central hub for managing NBA (National Board of Accreditation) Self Assessment Reports (SAR). It provides an intuitive, data-driven interface for Super Admins and Faculty members to track progress, assign responsibilities, manage documents, and assess overall accreditation readiness.

## Core Features

### 1. Main Dashboard
- **Overall SAR Readiness:** Visual representation of the institution's readiness based on completed criteria and assigned marks.
- **Key Metrics:** Quick stats on uploaded documents, completed criteria, and the current academic year.
- **Active Criteria Progress:** Real-time progress bars for each active criterion, showing completion percentages and assigned faculty.
- **Activity & Deadlines:** A rapid view of recently uploaded documents and urgent upcoming deadlines color-coded by urgency.

### 2. SAR (Self Assessment Report) Overview
- **Score Summary:** A comprehensive breakdown of the overall SAR score, weighted across all active criteria.
- **Criteria Tracking:** A detailed table listing each criterion's max marks, assigned incharge, completion status, and points achieved out of the maximum.

### 3. Criteria Management & Skeleton View
- **Criteria Activation:** Super Admins can activate any of the standard NBA criteria, set completion deadlines, and assign specific Faculty Incharges.
- **Skeleton View:** Clicking into a criterion opens its "Skeleton," which breaks down the requirements into actionable sections and sub-sections.
- **Data Points & Guidance:** Clearly lists required text/numeric data and table columns, preventing guesswork. Includes a built-in AI Assistant toolbar for contextual guidance.

### 4. Document Vault
- **Centralized Storage:** A unified system to upload, organize, and manage institutional documents (PDF, DOCX, XLSX, TXT) tagged to specific criteria.
- **Auto Text Extraction:** Uploaded documents are automatically parsed to extract text for immediate indexing natively in the browser.
- **Approval Workflow:** Super Admins can view recent uploads and approve or reject documents submitted by faculty.

### 5. Cross-Document Search
- **Global Search:** Search for any keyword (e.g., "CO attainment", "syllabus") across all indexed documents in the vault.
- **Contextual Results:** Displays exact snippets and the page numbers/sheet names where matches occur within the documents. It can find up to 500 matches per document to ensure no vital details are hidden.

### 6. Faculty Management
- **Directory:** A complete directory of institution staff including roles, designations, and departments.
- **Role-Based Access:** Granular roles like Super Admin, NBA Coordinator, Criterion Incharge, and Faculty Member to manage access logic securely.
- **Responsibility Tracking:** Quickly view which active criteria are assigned to specific faculty members to monitor operational distribution.

## Technical Implementation
- **Architecture:** Client-side Single Page Application (SPA) utilizing dynamic JavaScript component rendering mapped to navigation.
- **Local Text Processing:** Integrates libraries seamlessly (`pdf.js` for PDFs, `SheetJS` for Spreadsheets, `mammoth.js` for Word Documents) to extract and index file text accurately without requiring backend processing.
- **Theme & CSS:** Adapts modern, fluid styling elements like interactive progress components, dynamically colored status pills, and responsive grids for cross-device consistency.
