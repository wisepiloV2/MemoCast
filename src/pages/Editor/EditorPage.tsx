import { useEffect, useState } from "react";
import { MainLayout } from "../../component/layout/MainLayout";
import { Button } from "../../component/Button/Button";
import styles from './EditorPage.module.css'; 
import { useNavigate, useParams } from "react-router-dom"; 
import { useForm, FormProvider } from 'react-hook-form';
import { DocumentFormFields } from "../../feature/editor/components/DocumentFormFields";
import { useDocumentMutations, useDocumentById } from "../../feature/document";
import type { Document } from "../../db/types";

type DocumentFormData = {
    title: string;
    category: string;
    htmlText: string;
};

export function EditorPage() {
    const navigate = useNavigate();
    const { id } = useParams(); 
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
                const newDocument: Document = {
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

    if (isLoadingData) {
        return (
            <MainLayout>
                <div className={styles.loadingContainer}>
                    <p className={styles.loadingText}>Loading document...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className={styles.pageContainer}>
                <header className={styles.header}>
                    <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
                </header>
                
                <h1 className={styles.title}>
                    {isEditing ? "Edit document" : "Create new document"}
                </h1>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                        <DocumentFormFields />

                        <div className={styles.formActions}>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Saving..." : (isEditing ? "Update document" : "Save document")}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </MainLayout>
    );
}