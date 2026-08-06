import { useState } from "react";
import { db } from "../../../db/dbDexie";

export const useCreateDocument = () => {
    const [isCreating, setIsCreating] = useState(false);

    const createDocument = async (
        title: string, 
        category: string, 
        htmlText: string, 
        audioBlob: Blob | null
    ) => {
        setIsCreating(true);
        try {
            const cleanCategory = category.trim();
            
            if (cleanCategory !== "") {
                const exist = await db.categories.where('name').equalsIgnoreCase(cleanCategory).first();
                if (!exist) {
                    await db.categories.add({ name: cleanCategory });
                }
            }

            const newDocumentId = await db.documents.add({
                title,
                category: cleanCategory, 
                htmlText,
                createdAt: new Date()
            });

            if (audioBlob) {
                await db.audioFiles.add({
                    documentId: newDocumentId,
                    audioBlob
                });
            }

            return newDocumentId;
        } catch (error) {
            console.error("Error al crear el documento:", error);
            throw error;
        } finally {
            setIsCreating(false);
        }
    };

    return { createDocument, isCreating };
};