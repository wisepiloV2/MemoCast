import { Data } from './Data';
import { EditorForm } from './EditorForm';
import { useMainEditor } from '../hooks/useMainEditor';
import './MainEditor.css';
import { Modal } from '../../../component/Modal/Modal';
import { DocumentContent } from '../../document';

interface MainEditorProps {
    documentId?: number;
}

export function MainEditor({ documentId }: MainEditorProps) {
    const isEditing = Boolean(documentId);

    const {
        title, setTitle,
        category, setCategory,
        htmlText, setHtmlText,
        isPreviewOpen, setIsPreviewOpen,
        handleSubmit,
        isLoading, 
        document,  
        isSaving,
        error 
    } = useMainEditor(documentId);

    if (isLoading) {
        return <div className="main-editor-container">Cargando editor...</div>;
    }

    if (isEditing && !document) {
        return (
            <div className="main-editor-container">
                <h2>Error 404</h2>
                <p>El documento que intentas editar no existe o fue eliminado.</p>
            </div>
        );
    }

    return (
        <>
        <form onSubmit={handleSubmit} className="main-editor-container">
            <h2 className="main-editor-title">
                {isEditing ? "Edit Record" : "Create New Record"}
            </h2>
            
            {error && (
                <div 
                    className="main-editor-error" 
                    style={{ 
                        color: 'var(--accent-error)', 
                        backgroundColor: 'var(--error-hover-bg)', 
                        border: '1px solid var(--accent-error)',
                        padding: '12px', 
                        borderRadius: 'var(--btn-radius)', 
                        marginBottom: '1rem',
                        fontWeight: '500'
                    }}
                >
                    {error}
                </div>
            )}
            
            <div className="main-editor-content">
                <Data 
                    title={title}
                    onTitleChange={setTitle}
                    category={category}
                    onCategoryChange={setCategory}
                />

                <EditorForm 
                    html={htmlText}
                    onHtmlChange={setHtmlText}
                />
            </div>

            <div className="main-editor-footer">
                <button 
                    type="button" 
                    className="main-editor-preview-btn"
                    onClick={() => setIsPreviewOpen(true)}
                >
                    Preview
                </button>
                
                <button 
                    type="submit" 
                    className="main-editor-submit-btn"
                    disabled={isSaving} 
                >
                    {isSaving 
                        ? "Guardando..." 
                        : isEditing ? "Update Record" : "Save Record"
                    }
                </button>
            </div>
        </form>

        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
            <DocumentContent 
                    title={title}
                    category={category}
                    htmlText={htmlText}
            />
        </Modal>
        </>
    );
}