import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { DocumentCard, useSearchDocuments } from '../../feature/document';
import { useDocumentMutations } from '../../feature/document'; 
import { SearchInput } from '../../component/SearchInput/SearchInput';
import { Button } from '../../component/Button/Button';
import { MainLayout } from '../../component/layout/MainLayout';

const IconSettings = () => (
  <svg 
    width={24} 
    height={24} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: 'block' }} 
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
    />
  </svg>
);

export function HomePage() {
  const { results, isLoading, searchDocuments } = useSearchDocuments();
  const { deleteDocument } = useDocumentMutations();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    searchDocuments(query, 6);
  }, [query, searchDocuments]); 

  const handleDeleteDocument = async (id: number) => {
    try {
      await deleteDocument(id); 
      searchDocuments(query, 6);
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
    }
  };

  return (
    <MainLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My documents</h1>
          <p className={styles.subtitle}>
            Manage your local files
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant='primary' onClick={() => navigate('/categories')}>
            Categories
          </Button>
          <Button variant='primary' onClick={() => navigate('/editor')}>
            + New Document
          </Button>
          <Button variant='ghost' onClick={() => navigate('/settings')}>
            <IconSettings />
          </Button>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <SearchInput 
          query={query}
          setQuery={setQuery}
          placeholder="Search by title..." 
        />
      </div>

      <div className={styles.grid}>
        {isLoading ? (
          <p className={styles.emptyState}>Loading documents...</p>
        ) : results.length === 0 ? (
          <p className={styles.emptyState}>No documents found.</p>
        ) : (
          results.map(doc => (
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
