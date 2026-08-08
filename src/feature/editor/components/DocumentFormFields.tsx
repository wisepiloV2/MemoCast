import { useFormContext, Controller } from 'react-hook-form';
import { CategorySelected } from '../../category';
import { DocumentFormEditor } from './DocumentFormEditor';
import styles from "./DocumentFormFields.module.css";

export function DocumentFormFields() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className={styles.container}>
      
      <div className={styles.group}>
        <label className={styles.label}>Title</label>
        <input 
          type="text" 
          className={styles.input}
          placeholder="Write your title..."
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className={styles.errorText}>{errors.title.message as string}</span>
        )}
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Category</label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Select or create a category" }}
          render={({ field: { value, onChange } }) => (
            <CategorySelected value={value} onChange={onChange} />
          )}
        />
        {errors.category && (
          <span className={styles.errorText}>{errors.category.message as string}</span>
        )}
      </div>

      <div className={styles.group}>
        <Controller
          name="htmlText" 
          control={control}
          rules={{ required: "Document content cannot be empty" }}
          render={({ field: { value, onChange } }) => (
            <DocumentFormEditor 
              value={value || ""}
              onChange={onChange} 
            />
          )}
        />
        {errors.htmlText && (
          <span className={styles.errorText}>{errors.htmlText.message as string}</span>
        )}
      </div>
      
    </div>
  );
}