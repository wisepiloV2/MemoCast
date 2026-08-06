import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../../../component/Modal/Modal";
import { useDocumentCard } from "../hooks/useDocumentCard";
import { Button } from "../../../component/Button/Button";
import styles from './DocumentCard.module.css';

interface DocumentCardProps {
    id: number;
    title: string;
    category: string;
}

export function DocumentCard({ id, title, category }: DocumentCardProps) {
    const navigate = useNavigate(); 
    
    const { 
        isModalOpen, 
        isConfirmingDelete, 
        setIsConfirmingDelete, 
        openModal, 
        closeModal, 
        executeDelete 
    } = useDocumentCard(id);
    
    return (
        <>
            <div className={styles.documentCardWrapper}>
                <Link to={`/document/${id}`} className={styles.documentCardLink}>
                    <span className="text-view-category">{category || "Uncategorized"}</span>
                    <h3 className={styles.docCardTitle}>{title || "Untitled Document"}</h3>
                </Link>

                <Button variant="ghost" className={styles.docCardOptionsBtn} onClick={openModal}>
                    ⋮
                </Button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                
                {!isConfirmingDelete ? (
                    <>
                        <h2 className={styles.optionsModalTitle}>Document Options</h2>
                        <div className={styles.optionsModalActions}>
                            <Button variant="primary" onClick={() => navigate(`/editor/${id}`)}>
                                Edit Document
                            </Button>
                            
                            <Button variant="danger" onClick={() => setIsConfirmingDelete(true)}>
                                Delete Document
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className={styles.optionsModalTitle}>Delete Document?</h2>
                        <p className={styles.confirmText}>
                            Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
                        </p>
                        <div className={styles.optionsModalActions}>
                            <Button variant="danger" onClick={executeDelete}>
                                Yes, delete it
                            </Button>
                            
                            <Button variant="secondary" onClick={() => setIsConfirmingDelete(false)}>
                                Cancel
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
}