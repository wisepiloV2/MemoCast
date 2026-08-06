import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/dbDexie";
import { useCreateDocument } from "../../document/hooks/useCreateDocument";
import { useUpdateDocument } from "../../document/hooks/useUpdateDocument";

export function useMainEditor(documentId?: number) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(""); 
    const [htmlText, setHtmlText] = useState("Write here...");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const { createDocument, isCreating } = useCreateDocument();
    const { updateDocument, isUpdating } = useUpdateDocument();

    const userCategories = useLiveQuery(
        () => db.categories.orderBy('name').keys()
    ) as string[] || [];

    useEffect(() => {
        const loadDocumentToEdit = async () => {
            if (documentId) {
                const doc = await db.documents.get(documentId);
                if (doc) {
                    setTitle(doc.title);
                    setCategory(doc.category);
                    setHtmlText(doc.htmlText);
                }
            }
        };
        loadDocumentToEdit();
    }, [documentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        try {
            if (documentId) {
                await updateDocument(documentId, title, category, htmlText, audioBlob);
                alert("Actualizado correctamente en tu navegador");
            } else {
                await createDocument(title, category, htmlText, audioBlob);
                alert("Guardado correctamente en tu navegador");

                setTitle("");
                setCategory("");
                setHtmlText("Write here...");
                setAudioBlob(null);
            }
        } catch (error) {
            alert("Hubo un error al guardar el documento.");
        }
    };

    const isSaving = isCreating || isUpdating;

    return {
        title, setTitle,
        category, setCategory,
        userCategories,
        htmlText, setHtmlText,
        isPreviewOpen, setIsPreviewOpen,
        audioBlob, setAudioBlob,
        handleSubmit,
        isSaving 
    };
}