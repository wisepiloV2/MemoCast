import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../component/layout/MainLayout';
import { useDocument } from '../../feature/document/hooks/useDocument';
import { DocumentContent } from '../../feature/document/components/DocumentContent';
import { Button } from '../../component/Button/Button'; // <-- Tu nuevo y flamante botón
import styles from './DocumentPage.module.css'; 

export function DocumentPage() {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const { document, isLoading, error } = useDocument(id);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className={styles.loading}>
                    <p>Loading document...</p>
                </div>
            );
        }

        if (error || !document) {
            return (
                <div className={styles.errorContainer}>
                    <h2 className={styles.errorTitle}>{error || "Document not found"}</h2>
                    <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
                </div>
            );
        }

        return (
            <div className={styles.documentPage}>
                <header className={styles.header}>
                    <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
                    
                    <Button variant="primary" onClick={() => navigate(`/edit/${id}`)}>
                        Edit Document
                    </Button>
                </header>
                
                <section className={styles.content}>
                    <DocumentContent 
                        title={document.title}
                        category={document.category}
                        htmlText={document.htmlText}
                    />
                </section>
            </div>
        );
    };

    return (
        <MainLayout>
            {renderContent()}
        </MainLayout>
    );
}