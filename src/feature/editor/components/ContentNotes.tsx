import Editor from 'react-simple-wysiwyg';
import { useFormContext, Controller } from 'react-hook-form';
import styles from './ContentNotes.module.css';

export function ContentNotes() {
  const { control } = useFormContext();

  return (
    <div className={styles.group}>
      <Controller
        name="htmlNote" 
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className={styles.notesWrapper}>
            <Editor 
              value={value} 
              onChange={(e) => onChange(e.target.value)} 
            />
          </div>
        )}
      />
    </div>

  );
}
