import { useNavigate, useParams } from 'react-router-dom';
import { DocumentCard, useDocumentMutations, useSearchDocuments } from '../../feature/document';
import { useEffect, useState } from 'react';
import { SearchInput } from '../../component/SearchInput/SearchInput';
import { MainLayout } from '../../component/layout/MainLayout';
import { Button } from '../../component/Button/Button';
import styles from './DocumentsPage.module.css';

const IconBack = () => (
  <svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export function DocumentsPage(){
  const { category } = useParams(); 
  const {
    results,
    isLoading,
    searchDocumentInCategory,
  } = useSearchDocuments();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { deleteDocument } = useDocumentMutations();

  useEffect(() => {
    searchDocumentInCategory(category!, query);
  }, [query, searchDocumentInCategory]);

  const handleDeleteDocument = async (id: number) => {
    try {
      await deleteDocument(id); 
      searchDocumentInCategory(category!, query);
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
    }
  };
  return (
    <MainLayout>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            <IconBack />
          </Button>

          <div>
            <h1 className={styles.title}>{category} Documents</h1>
            <p className={styles.subtitle}>Manage your documents</p>
          </div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <SearchInput
          query={query}
          setQuery={setQuery}
          placeholder="Search document..."
        />
      </div>

      <div className={styles.listContainer}>
        {isLoading ? (
          <p className={styles.emptyState}>Loading categories...</p>
        ) : results.length === 0 ? (
          <p className={styles.emptyState}>No categories found.</p>
        ) : (
          results.map((doc) => (
            <DocumentCard  
              key={doc.id}
              id={doc.id!} 
              category={doc.category}
              title={doc.title}
              onDelete={handleDeleteDocument}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}
