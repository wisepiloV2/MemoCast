// src/feature/document/hooks/useUpdateDocument.ts
import { useState } from "react";
import { db } from "../../../db/dbDexie";

export const useUpdateDocument = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateDocument = async (
        documentId: number,
        title: string, 
        category: string, 
        htmlText: string, 
        audioBlob: Blob | null
    ) => {
        setIsUpdating(true);
        try {
            const cleanCategory = category.trim();
            
            if (cleanCategory !== "") {
                const exist = await db.categories.where('name').equalsIgnoreCase(cleanCategory).first();
                if (!exist) {
                    await db.categories.add({ name: cleanCategory });
                }
            }

            await db.documents.update(documentId, {
                title,
                category: cleanCategory,
                htmlText,
            });

            if (audioBlob) {
                await db.audioFiles.where({ documentId }).delete();
                await db.audioFiles.add({ documentId, audioBlob });
            }

            return documentId;
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateDocument, isUpdating };
};