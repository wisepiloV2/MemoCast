import { Link } from 'react-router-dom';
import './Home.css';
import { DocumentCard } from './DocumentCard';
import { useHome } from '../hooks/useHome';

export function Home() {
    const { searchTerm, setSearchTerm, searchResults} = useHome();

    return (
        <>
            <div className="home-header">
                <div>
                    <h1 className="text-view-title">My documents</h1>
                    <p style={{ color: 'var(--dd-text-muted)', marginTop: '0.5rem' }}>
                        Manage your local files
                    </p>
                </div>
                <Link to="/editor" className="btn-primary">
                    + New Document
                </Link>
            </div>

            <div className="search-container">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search by title or category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="document-grid">
                {searchResults === undefined ? (
                    <p>Loading documents...</p>
                ) : searchResults.length === 0 ? (
                    <p style={{ color: 'var(--dd-text-muted)' }}>No documents found.</p>
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
        </>
    );
}