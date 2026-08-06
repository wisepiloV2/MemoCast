import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { DocumentCard, useSearchDocument } from '../../feature/document';
import { SearchInput } from '../../component/SearchInput/SearchInput';
import { Button } from '../../component/Button/Button';
import { MainLayout } from '../../component/layout/MainLayout';

export function HomePage() {
    const { query, setQuery, searchResults } = useSearchDocument();
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My documents</h1>
                    <p className={styles.subtitle}>
                        Manage your local files
                    </p>
                </div>
                <Button variant='primary' onClick={() => navigate("/editor")}>+ New Document</Button>
            </div>

            <div className={styles.searchContainer}>
                <SearchInput 
                    query={query}
                    setQuery={setQuery}
                    placeholder="Search by title or category..." 
                />
            </div>

            <div className={styles.grid}>
                {searchResults === undefined ? (
                    <p className={styles.emptyState}>Loading documents...</p>
                ) : searchResults.length === 0 ? (
                    <p className={styles.emptyState}>No documents found.</p>
                ) : (
                    searchResults.map(doc => (
                        <DocumentCard  
                            id={doc.id}
                            key={doc.id}
                            category={doc.category}
                            title={doc.title}
                        />
                    ))
                )}
            </div>
        </MainLayout>
    );
}