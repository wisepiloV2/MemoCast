import { Data } from './Data';
import { EditorForm } from './EditorForm';
import { useMainEditor } from '../hooks/useMainEditor';
import './MainEditor.css';
import { Modal } from '../../../component/Modal/Modal';
import { ViewText } from '../../../component/ViewText/ViewText';

export function MainEditor() {
    const {
        title,
        setTitle,
        category,
        setCategory,
        categories ,
        htmlText,
        setHtmlText,
        isPreviewOpen,
        setIsPreviewOpen,
        handleSubmit
    }= useMainEditor();

    return (
        <>
        <form onSubmit={handleSubmit} className="main-editor-container">
            <h2 className="main-editor-title">Crear Nuevo Registro</h2>
            
            <div className="main-editor-content">
                <Data 
                    title={title}
                    onTitleChange={setTitle}
                    categoria={category}
                    onCategoriaChange={setCategory}
                    categorias={categories}
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
                    Guardar Registro
                </button>
            </div>
        </form>

        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
            <ViewText 
                    title={title}
                    category={category}
                    htmlText={htmlText}
            />
        </Modal>
        </>
    );
}