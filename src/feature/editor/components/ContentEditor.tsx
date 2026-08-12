import Editor from 'react-simple-wysiwyg';
import { useFormContext, Controller } from 'react-hook-form';
import styles from './ContentEditor.module.css';

export function ContentEditor() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={styles.group}>
      <Controller
        name="htmlText" 
        control={control}
        rules={{ required: 'Document content cannot be empty' }}
        render={({ field: { value, onChange } }) => (
          <div className={styles.editorWrapper}>
            <Editor 
              value={value} 
              onChange={(e) => onChange(e.target.value)} 
            />
          </div>
        )}
      />
      {errors.htmlText && (
        <span className={styles.errorText}>{errors.htmlText.message as string}</span>
      )}
    </div>

  );
}
