import { MainLayout } from '../../component/layout/MainLayout';
import { Button } from '../../component/Button/Button';
import styles from './EditorPage.module.css'; 
import { FormProvider } from 'react-hook-form';
import { BasicInfoFields, ContentEditor, useDocumentForm } from '../../feature/editor';
import { useNavigate } from 'react-router-dom';

export function EditorPage() {
  const navigate = useNavigate();
  const {
    methods,
    onSubmit, 
    isLoadingData,
    isSaving,
    isEditing,
  } = useDocumentForm();

  if (isLoadingData) {
    return (
      <MainLayout>
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading document...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className={styles.form}>

            <BasicInfoFields />
            <ContentEditor />
                        
            <div className={styles.formActions}>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : (isEditing ? 'Update document' : 'Save document')}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </MainLayout>
  );
}
