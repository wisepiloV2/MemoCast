import Editor from 'react-simple-wysiwyg';
import styles from './EditorForm.module.css';

interface EditorFormProps {
    html: string;
    onHtmlChange: (newHtml: string) => void;
}

export function EditorForm({ html, onHtmlChange }: EditorFormProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Content</label>
            <div className={styles.editorWrapper}>
                <Editor 
                    value={html} 
                    onChange={(e) => onHtmlChange(e.target.value)} 
                />
            </div>
        </div>
    );
}