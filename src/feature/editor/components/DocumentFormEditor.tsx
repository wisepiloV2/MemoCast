import Editor from 'react-simple-wysiwyg';
import styles from './DocumentFormEditor.module.css';

interface EditorFormProps {
    value: string;
    onChange: (newHtml: string) => void;
}

export function DocumentFormEditor({ value, onChange }: EditorFormProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Content</label>
            <div className={styles.editorWrapper}>
                <Editor 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)} 
                />
            </div>
        </div>
    );
}