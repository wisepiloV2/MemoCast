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
        userCategories,
        htmlText, setHtmlText,
        isPreviewOpen, setIsPreviewOpen,
        handleSubmit,
    } = useMainEditor(documentId);

    return (
        <>
        <form onSubmit={handleSubmit} className="main-editor-container">
            <h2 className="main-editor-title">
                {isEditing ? "Edit Record" : "Create New Record"}
            </h2>
            
            <div className="main-editor-content">
                <Data 
                    title={title}
                    onTitleChange={setTitle}
                    category={category}
                    onCategoryChange={setCategory}
                    categories={userCategories}
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
                <button type="submit" className="main-editor-submit-btn">
                    {isEditing ? "Update Record" : "Save Record"}
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