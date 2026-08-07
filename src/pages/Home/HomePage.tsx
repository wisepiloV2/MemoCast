import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { DocumentCard, useSearchDocuments } from '../../feature/document';
import { useDocumentMutations } from '../../feature/document'; 
import { SearchInput } from '../../component/SearchInput/SearchInput';
import { Button } from '../../component/Button/Button';
import { MainLayout } from '../../component/layout/MainLayout';

export function HomePage() {
    const { results, isLoading, searchDocuments } = useSearchDocuments();
    const { deleteDocument } = useDocumentMutations();
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        searchDocuments(query, 6);
    }, [query]); 

    const handleDeleteDocument = async (id: number) => {
        try {
            await deleteDocument(id); 
            searchDocuments(query, 6);
        } catch (error) {
            console.error("Error al eliminar el documento:", error);
        }
    };

    return (
        <MainLayout>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My documents</h1>
                    <p className={styles.subtitle}>
                        Manage your local files
                    </p>
                </div>
                <Button variant='primary' onClick={() => navigate("/editor")}>+ New Document</Button>
            </div>

            <div className={styles.searchContainer}>
                <SearchInput 
                    query={query}
                    setQuery={setQuery}
                    placeholder="Search by title..." 
                />
            </div>

            <div className={styles.grid}>
                {isLoading ? (
                    <p className={styles.emptyState}>Loading documents...</p>
                ) : results.length === 0 ? (
                    <p className={styles.emptyState}>No documents found.</p>
                ) : (
                    results.map(doc => (
                        <DocumentCard  
                            key={doc.id}
                            id={doc.id!} 
                            category={doc.category}
                            title={doc.title}
                            onDelete={handleDeleteDocument}
                        />
                    ))
                )}
            </div>
        </MainLayout>
    );
}