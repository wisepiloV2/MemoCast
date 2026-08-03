import Editor from 'react-simple-wysiwyg';
import './EditorForm.css';

interface EditorFormProps {
    html: string;
    onHtmlChange: (newHtml: string) => void;
}

export function EditorForm({ html, onHtmlChange }: EditorFormProps) {
    return (
        <div className="editor-section-container">
            <label className="editor-section-label">Contenido</label>
            <Editor 
                value={html} 
                onChange={(e) => onHtmlChange(e.target.value)} 
            />
        </div>
    );
}