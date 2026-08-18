# Proyecto de Estudio Local-First

Esta aplicación web fue diseñada como una herramienta de estudio integral que combina la lectura y la escucha activa. Permite a los usuarios gestionar documentos, organizarlos por categorías y tomar notas personalizadas.

Se opto por un enfoque **local-first**, garantizando privacidad y velocidad al eliminar la dependencia de un servidor tradicional. Utiliza **IndexedDB** para la persistencia de datos y **Piper Web** para la generación de audio mediante bots de texto a voz (TTS) ejecutados directamente en el navegador.

Actualmente se puede acceder mediante: https://memocast-v1.netlify.app/

---

## Características Principales

* **Gestión de Categorías:** Organización eficiente del material de estudio.
* **Gestión de Documentos:** Creación, lectura y estructuración del contenido.
* **Editor de Texto Enriquecido:** Interfaz WYSIWYG para formatear notas y documentos.
* **Búsqueda Integrada:** Localización rápida de documentos y apuntes.
* **Generación de Audio TTS:** Conversión de texto a voz de alta calidad de forma local usando Piper Web.
* **Reproducción Local:** Almacenamiento y gestión de audios generados directamente en el navegador.
* **Persistencia Local:** Base de datos robusta usando IndexedDB para uso offline y sin latencia.
* **Exportación e Importación:** Sistema integrado (archivos ZIP) para respaldar o migrar datos y audios entre dispositivos.

---

## Tecnologías Utilizadas

* **Core & UI:** React, TypeScript, Vite.
* **Persistencia:** Dexie.js (Wrapper para IndexedDB).
* **Audio (TTS):** Piper TTS Web.
* **Enrutamiento:** React Router.
* **Formularios:** React Hook Form.
* **Utilidades:** FileSaver.js, JSZip (Manejo de importación/exportación), Editor WYSIWYG.

---

## Arquitectura y Estructura del Proyecto

El proyecto sigue una arquitectura modular basada en características (*Feature-Sliced Design* simplificado), lo que facilita la escalabilidad y un eventual cambio de paradigma (ej. migrar a una API en la nube).

```text
src/
├── components/    # Componentes UI compartidos y genéricos
├── db/            # Configuración de Dexie (dbDexie.ts) y tipados (types.ts)
├── features/      # Lógica de negocio dividida por dominios
│   ├── audio/         # Generación, reproducción y conexión a DB de audios
│   ├── category/      # Gestión de categorías y sus componentes UI
│   ├── document/      # Gestión de documentos y componentes asociados
│   ├── downloadData/  # Lógica de backup (importación/exportación con JSZip)
│   ├── editor/        # Manejo del editor WYSIWYG
│   └── task/          # Gestor general de colas de procesamiento (usado por Audio)
├── pages/         # Vistas principales de la aplicación (Enrutamiento visual)
└── router/        # Configuración de rutas (React Router) 
```

> **Nota arquitectónica:** Los servicios de acceso a datos (Services) no se centralizan en la carpeta `db/`, sino que viven dentro de su respectivo `feature/`. Esto desacopla los dominios y facilita la futura migración a un backend remoto si fuera necesario.

### Estructura de Datos (IndexedDB)

| Tabla | Campos Principales |
| :--- | :--- |
| **Categories** | `id` (PK), `name` |
| **Documents** | `id` (PK), `category`, `title`, `content`, `notes` |
| **Audio** | `idDocument` (FK), `blob` (AudioData) |

---

## Decisiones Técnicas

### 1. Enfoque Local-First (IndexedDB)
Se optó por prescindir de un backend tradicional para reducir la latencia en las operaciones de datos al mínimo absoluto y evitar la complejidad operativa de infraestructuras *serverless* o el manejo de autenticaciones. 

**Trade-off:** Se sacrifican las comodidades de la sincronización automática en la nube y el uso multi-dispositivo en favor de un lanzamiento rápido y **máxima privacidad** (la información nunca sale del navegador del usuario). 
> **Nota:** Aunque los datos viven localmente, la aplicación requiere conexión a la red para cargar la interfaz y descargar los modelos de voz de Piper Web.*

### 2. Exportación / Importación como Backup
Para mitigar la falta de sincronización en la nube, se desarrolló un módulo de importación/exportación de la base de datos (empaquetando JSONs y blobs de audio en un `.zip`). Esto permite al usuario migrar su entorno de estudio entre dispositivos de manera manual.

### 3. Gestión de Audio y Sistema de Colas
*   **Restricción de Bots:** Se decidió limitar la configuración de múltiples voces/bots en Piper Web para simplificar la lógica de generación, reducir la superficie de errores y agilizar los tiempos de desarrollo.
*   **Desacoplamiento de actualización:** El audio generado se guarda en la base de datos para facilitar su reproducción instantánea. **No se implementó una actualización automática del audio cuando se edita el texto del documento.** Esta decisión evita la ejecución de eventos en cascada pesados (re-generación de audio) y le da al usuario la libertad de tener una versión de audio diferente a sus notas de texto actuales si así lo desea.
*   **Cola de tareas (`task`):** Se introdujo un sistema de colas (Queue) para la generación de TTS, evitando bloqueos en la UI mientras Piper Web procesa el texto a voz.

---

## Instalación y Ejecución

Sigue estos pasos para correr el proyecto en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>

# 2. Instalar las dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev