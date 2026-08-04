import { Link } from "react-router-dom";
import { Modal } from "../../../component/Modal/Modal";
import { useDocumentCard } from "../hooks/useDocumentCard";
import './DocumentCard.css';

interface DocumentCardProps {
    id: number;
    title: string;
    category: string;
}

export function DocumentCard({ id, title, category }: DocumentCardProps) {
    const { isModalOpen, setIsModalOpen, handleDelete } = useDocumentCard(id, title);
    
    return (
        <>
            <div className="document-card-wrapper">
                <Link to={`/document/${id}`} className="document-card-link">
                    <span className="text-view-category">{category || "Uncategorized"}</span>
                    <h3 className="doc-card-title">{title || "Untitled Document"}</h3>
                </Link>

                <button 
                    className="doc-card-options-btn" 
                    onClick={() => setIsModalOpen(true)}
                >
                    ⋮
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="options-modal-title">Document Options</h2>
                <div className="options-modal-actions">
                    <Link to={`/edit/${id}`} className="btn-modal-edit">
                        Edit Document
                    </Link>
                    
                    <button className="btn-modal-delete" onClick={handleDelete}>
                        Delete Document
                    </button>
                </div>
            </Modal>
        </>
    );
}