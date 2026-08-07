import { useState, useEffect } from "react";
import { useDocumentById } from "../../document"; 
import { useDocumentMutations } from "../../document/hooks/useDocumentMutations"; 

export function useMainEditor(documentId?: number) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(""); 
    const [htmlText, setHtmlText] = useState("Write here...");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    const [error, setError] = useState<string | null>(null);
    
    const { document, isLoading } = useDocumentById(documentId);
    const { createDocument, updateDocument, isSaving } = useDocumentMutations();

    useEffect(() => {
        if (document) {
            setTitle(document.title);
            setCategory(document.category);
            setHtmlText(document.htmlText || "Write here...");
        }
    }, [document]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!title.trim() || !category.trim()) {
            setError("El título y la categoría son obligatorios.");
            return;
        }
        
        try {
            const documentData = {
                title: title.trim(),
                category: category.trim(),
                htmlText: htmlText
            };

            if (documentId) {
                await updateDocument(documentId, documentData);
            } else {
                await createDocument({
                    ...documentData,
                    createdAt: new Date()
                });
            }

            setTitle("");
            setCategory("");
            setHtmlText("Write here...");
        } catch (err) {
            setError("Hubo un error al guardar el documento. Inténtalo de nuevo.");
        }
    };

    return {
        title, setTitle,
        category, setCategory,
        htmlText, setHtmlText,
        isPreviewOpen, setIsPreviewOpen,
        handleSubmit,
        isLoading, 
        document,
        isSaving,
        error 
    };
}