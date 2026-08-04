import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/dbDexie";

export function useMainEditor() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(""); 
    const userCategories = useLiveQuery(
    () => db.categories.orderBy('name').keys()) as string[] || [];
    
    const [htmlText, setHtmlText] = useState("Write here...");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        try {
            const cleanCategory = category.trim();
            if (cleanCategory !== "") {
                const exist = await db.categories.where('name').equalsIgnoreCase(cleanCategory).first();
                if (!exist) {
                    await db.categories.add({ name: cleanCategory });
                }
            }

            const newDocumentId = await db.documents.add({
                title: title,
                category: cleanCategory, 
                htmlText: htmlText,
                createdAt: new Date()
            });

            if (audioBlob) {
                await db.audioFiles.add({
                    documentId: newDocumentId,
                    audioBlob: audioBlob
                });
            }

            console.log("¡Documento guardado con éxito! ID:", newDocumentId);
            alert("Guardado correctamente en tu navegador");

            setTitle("");
            setCategory("");
            setHtmlText("Write here...");
            setAudioBlob(null);

        } catch (error) {
            console.error("Error al guardar en IndexedDB:", error);
            alert("Hubo un error al guardar el documento.");
        }
    };

    return {
        title, setTitle,
        category, setCategory,
        userCategories,
        htmlText, setHtmlText,
        isPreviewOpen, setIsPreviewOpen,
        audioBlob, setAudioBlob,
        handleSubmit
    };
}