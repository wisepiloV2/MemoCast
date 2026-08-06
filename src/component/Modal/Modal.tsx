import { type ReactNode } from 'react';
import styles from './Modal.module.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div 
                className={styles.content}  
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    type="button" 
                    className={styles.btn} 
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}