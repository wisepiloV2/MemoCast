import { useParams } from 'react-router-dom';
import { useDocument } from '../hooks/useDocument';
import { BackButton } from '../../../component/BackButton/BackButton';
import { ViewText } from '../../../component/ViewText/ViewText';
import './Document.css'; 

export function Document() {
    const { id } = useParams(); 
    const { document, isLoading, error } = useDocument(id);

    if (isLoading) {
        return <div className="document-loading">Cargando documento...</div>;
    }

    if (error || !document) {
        return (
            <div className="document-error">
                <h2>{error || "Document not find"}</h2>
                <BackButton />
            </div>
        );
    }

    return (
        <main className="document">
            <header className="document-header">
                <BackButton />
            </header>
            
            <section className="document-content">
                <ViewText 
                    title={document.title}
                    category={document.category}
                    htmlText={document.htmlText}
                />
            </section>
        </main>
    );
}