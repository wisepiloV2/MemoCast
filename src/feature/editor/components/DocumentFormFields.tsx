import { useFormContext, Controller } from 'react-hook-form';
import { CategorySelected } from '../../category';
import { DocumentFormEditor } from './DocumentFormEditor';
import styles from "./DocumentFormFields.module.css";

export function DocumentFormFields() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className={styles.container}>
      
      <div className={styles.group}>
        <label className={styles.label}>Título del documento</label>
        <input 
          type="text" 
          className={styles.input}
          placeholder="Escribe un título..."
          {...register("title", { required: "El título es obligatorio" })}
        />
        {errors.title && (
          <span className={styles.errorText}>{errors.title.message as string}</span>
        )}
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Categoría</label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Selecciona o crea una categoría" }}
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
          rules={{ required: "El contenido del documento no puede estar vacío" }}
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