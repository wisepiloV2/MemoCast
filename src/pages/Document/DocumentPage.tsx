import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../component/layout/MainLayout';
import { useDocumentById } from '../../feature/document';
import { DocumentContent } from '../../feature/document';
import { Button } from '../../component/Button/Button';
import styles from './DocumentPage.module.css';
import { VoiceReproducer } from '../../feature/piper';

export function DocumentPage() {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const documentId = id ? Number(id) : undefined;
    const { document, isLoading } = useDocumentById(documentId);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className={styles.loading}>
                    <p>Loading document...</p>
                </div>
            );
        }

        if (!document) {
            return (
                <div className={styles.errorContainer}>
                    <h2 className={styles.errorTitle}>
                        { "Document not found" }
                    </h2>
                    <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
                </div>
            );
        }

        return (
            <div className={styles.documentPage}>
                <header className={styles.header}>
                    <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
                    
                    <Button variant="primary" onClick={() => navigate(`/editor/${id}`)}>
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

                <VoiceReproducer text={document.htmlText}/>
            </div>
        );
    };

    return (
        <MainLayout>
            {renderContent()}
        </MainLayout>
    );
}