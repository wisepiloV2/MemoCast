import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import { useDocumentById, useDocumentMutations } from "../../document";

type DocumentFormData = {
    title: string;
    category: string;
    htmlText: string;
};

export function useDocumentForm() { 
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    
    const isEditing = Boolean(id);
    const documentId = id ? Number(id) : undefined;

    const [isLoadingData, setIsLoadingData] = useState(isEditing);

    const { document } = useDocumentById(documentId);

    const methods = useForm<DocumentFormData>({
        defaultValues: {
            title: "",
            category: "", 
            htmlText: "",
        }
    });

    const { handleSubmit, reset } = methods;
    const { createDocument, isSaving, updateDocument } = useDocumentMutations();
    
    useEffect(() => {
        if (isEditing && document) {
            reset({
                title: document.title,
                category: document.category,
                htmlText: document.htmlText,
            });
            setIsLoadingData(false);
        }
    }, [document, isEditing, reset]);

    const onSubmit = async (data: DocumentFormData) => {
        try {
            if (isEditing && documentId) {
                await updateDocument(documentId, data);
                console.log("Documento actualizado:", data);
            } else {
                const newDocument = {
                    ...data,
                    createdAt: new Date(),
                };
                await createDocument(newDocument);
                console.log("Documento creado:", newDocument);
                reset(); 
            }
            navigate('/'); 
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return {
        methods,
        onSubmit: handleSubmit(onSubmit), 
        isLoadingData,
        isSaving,
        isEditing
    };
}