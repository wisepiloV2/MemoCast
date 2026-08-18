// Ruta aproximada: src/services/importDb.ts
import { serviceDb } from "./serviceDb"; 
import JSZip from "jszip";
import type { Document, Category, AudioDocument } from "../../../db/types";

export type ImportMode = "replace" | "merge";

export async function importDb(archivoZip: File, mode: ImportMode){
    try {
        const zip = new JSZip();
        const contenidoZip = await zip.loadAsync(archivoZip);

        let categorias: Category[] = [];
        let documentos: Document[] = [];
        let audios: AudioDocument[] = [];

        const archivoCategorias = contenidoZip.file("categories.json");
        if (archivoCategorias) {
            const texto = await archivoCategorias.async("string");
            categorias = JSON.parse(texto);
        }

        const archivoDocumentos = contenidoZip.file("documents.json");
        if (archivoDocumentos) {
            const texto = await archivoDocumentos.async("string");
            const docsRaw = JSON.parse(texto);

            documentos = docsRaw.map((doc: any) => ({
                ...doc,
                createdAt: new Date(doc.createdAt)
            }));
        }

        const archivosExtraidos = Object.values(contenidoZip.files);
        const archivosDeAudio = archivosExtraidos.filter(
            archivo => archivo.name.startsWith("audios/") && !archivo.dir
        );

        for (const archivo of archivosDeAudio) {
            const blob = await archivo.async("blob");
            const match = archivo.name.match(/audio_(\d+)\.blob/);

            if (match) {
                audios.push({
                    idDocument: parseInt(match[1], 10),
                    audio: blob
                });
            }
        }

        if (mode === "replace") {
            await serviceDb.replaceDb(documentos, audios, categorias);
        } else if (mode === "merge") {
            await serviceDb.mergeDb(documentos, audios, categorias);
        }

        return true;
    } catch (error) {
        console.error(`Error importing data in mode ${mode}:`, error);
        throw error;
    }
}