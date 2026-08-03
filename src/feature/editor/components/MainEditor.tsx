import { Data } from './Data';
import { EditorForm } from './EditorForm';
import { useMainEditor } from '../hooks/useMainEditor';
import './MainEditor.css';

export function MainEditor() {
    const {
        title,
        setTitle,
        category,
        setcategory,
        categories ,
        htmlText,
        setHtmlText,
        handleSubmit
    }= useMainEditor();

    return (
        <form onSubmit={handleSubmit} className="main-editor-container">
            <h2 className="main-editor-title">Crear Nuevo Registro</h2>
            
            <div className="main-editor-content">
                <Data 
                    title={title}
                    onTitleChange={setTitle}
                    categoria={category}
                    onCategoriaChange={setcategory}
                    categorias={categories}
                />

                <EditorForm 
                    html={htmlText}
                    onHtmlChange={setHtmlText}
                />
            </div>

            <div className="main-editor-footer">
                <button type="submit" className="main-editor-submit-btn">
                    Guardar Registro
                </button>
            </div>
        </form>
    );
}