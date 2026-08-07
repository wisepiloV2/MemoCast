import { useState } from "react";
import { documentService } from "../service/documentService";
import { type Document } from "../../../db/types";

export function useDocumentMutations() {
    const [isSaving, setIsSaving] = useState(false);

    async function createDocument(data: Document) {
        setIsSaving(true);
        try {
            const newId = await documentService.create(data);
            return newId;
        } catch (error) {
            console.error("Error al crear el documento:", error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }

    async function updateDocument(id: number, data: Partial<Document>) {
        setIsSaving(true);
        try {
            await documentService.update(id, data);
            return id;
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }


    async function deleteDocument(id: number) {
        setIsSaving(true);
        try {
            await documentService.delete(id);
        } catch (error) {
            console.error("Error al borrar el documento:", error);
            throw new Error("Error al borrar el documento");
        } finally {
            setIsSaving(false);
        }
    }

    return {
        isSaving,
        createDocument,
        updateDocument,
        deleteDocument
    };
}