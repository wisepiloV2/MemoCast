import { useState } from "react";
import { db } from "../../../db/dbDexie";

export function useMainEditor() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    
    const categories = ["Desarrollo Web", "Diseño Gráfico", "Marketing", "Ventas", "Recursos Humanos"];
    
    const [htmlText, setHtmlText] = useState("Escribe tu contenido aquí...");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        try {
            const nuevoDocumentoId = await db.documentos.add({
                title: title,
                category: category,
                htmlText: htmlText,
                createdAt: new Date()
            });

            if (audioBlob) {
                await db.audios.add({
                    documentoId: nuevoDocumentoId,
                    audioBlob: audioBlob
                });
            }

            console.log("¡Documento guardado con éxito! ID:", nuevoDocumentoId);
            alert("Guardado correctamente en tu navegador");

            setTitle("");
            setCategory("");
            setHtmlText("Escribe tu contenido aquí...");
            setAudioBlob(null);

        } catch (error) {
            console.error("Error al guardar en IndexedDB:", error);
            alert("Hubo un error al guardar el documento.");
        }
    };

    return {
        title, setTitle,
        category, setCategory,
        categories,
        htmlText, setHtmlText,
        isPreviewOpen, setIsPreviewOpen,
        audioBlob, setAudioBlob, 
        handleSubmit
    };
}