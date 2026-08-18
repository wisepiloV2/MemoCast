[Leer en español](README.es.md)

# Local-First Study Project

This web application was designed as a comprehensive study tool that combines active reading and listening. It allows users to manage documents, organize them by categories, and take personalized notes.

A **local-first** approach was chosen, guaranteeing privacy and speed by eliminating the dependency on a traditional server. It uses **IndexedDB** for data persistence and **Piper Web** for audio generation through text-to-speech (TTS) bots executed directly in the browser.

It can currently be accessed at: https://memocast-v1.netlify.app/

---

## Main Features

* **Category Management:** Efficient organization of study material.
* **Document Management:** Creation, reading, and structuring of content.
* **Rich Text Editor:** WYSIWYG interface for formatting notes and documents.
* **Integrated Search:** Quick localization of documents and notes.
* **TTS Audio Generation:** High-quality local text-to-speech conversion using Piper Web.
* **Local Playback:** Storage and management of audio generated directly in the browser.
* **Local Persistence:** Robust database using IndexedDB for zero-latency, offline-capable usage.
* **Export and Import:** Integrated system (ZIP files) to backup or migrate data and audio between devices.

---

## Technologies Used

* **Core & UI:** React, TypeScript, Vite.
* **Persistence:** Dexie.js (Wrapper for IndexedDB).
* **Audio (TTS):** Piper TTS Web.
* **Routing:** React Router.
* **Forms:** React Hook Form.
* **Utilities:** FileSaver.js, JSZip (Import/export handling), WYSIWYG Editor.

---

## Architecture and Project Structure

The project follows a modular, feature-based architecture (simplified *Feature-Sliced Design*), which facilitates scalability and a potential paradigm shift (e.g., migrating to a cloud API).

```text
src/
├── components/    # Shared and generic UI components
├── db/            # Dexie configuration (dbDexie.ts) and typings (types.ts)
├── features/      # Business logic divided by domains
│   ├── audio/         # Audio generation, playback, and DB connection
│   ├── category/      # Category management and its UI components
│   ├── document/      # Document management and associated components
│   ├── downloadData/  # Backup logic (import/export with JSZip)
│   ├── editor/        # WYSIWYG editor management
│   └── task/          # General processing queue manager (used by Audio)
├── pages/         # Main application views (Visual routing)
└── router/        # Route configuration (React Router)
```

> **Architectural note:** Data access services (Services) are not centralized in the `db/` folder; instead, they live within their respective `feature/`. This decouples the domains and facilitates future migration to a remote backend if necessary.

### Data Structure (IndexedDB)

| Table | Main Fields |
| :--- | :--- |
| **Categories** | `id` (PK), `name` |
| **Documents** | `id` (PK), `category`, `title`, `content`, `notes` |
| **Audio** | `idDocument` (FK), `blob` (AudioData) |

---

## Technical Decisions

### 1. Local-First Approach (IndexedDB)
We opted to forgo a traditional backend to reduce data operation latency to the absolute minimum and avoid the operational complexity of *serverless* infrastructures or authentication management. 

**Trade-off:** The conveniences of automatic cloud synchronization and multi-device usage are sacrificed in favor of a fast launch and **maximum privacy** (the information never leaves the user's browser). 
> **Note:** Although the data lives locally, the application requires a network connection to load the interface and download the Piper Web voice models.

### 2. Export / Import as Backup
To mitigate the lack of cloud synchronization, a database import/export module was developed (packaging JSONs and audio blobs into a `.zip` file). This allows the user to manually migrate their study environment between devices.

### 3. Audio Management and Queue System
*   **Bot Restriction:** It was decided to limit the configuration of multiple voices/bots in Piper Web to simplify the generation logic, reduce the error surface, and speed up development times.
*   **Update Decoupling:** The generated audio is saved in the database to facilitate instant playback. **An automatic audio update was not implemented when the document text is edited.** This decision prevents the execution of heavy cascading events (audio regeneration) and gives the user the freedom to keep an audio version different from their current text notes if they so desire.
*   **Task Queue (`task`):** A queue system was introduced for TTS generation, preventing UI blockages while Piper Web processes text to speech.

---

## Installation and Execution

Follow these steps to run the project in your local environment:

```bash
# 1. Clone the repository
git clone <repository-url>

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```