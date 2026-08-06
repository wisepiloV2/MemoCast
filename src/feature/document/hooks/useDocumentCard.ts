import { useState } from 'react';
import { db } from "../../../db/dbDexie"; 

export function useDocumentCard(id: number) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const openModal = () => setIsModalOpen(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setIsConfirmingDelete(false), 200); 
    };

    const executeDelete = async () => {
        try {
            await db.documents.delete(id);
            closeModal();
        } catch (error) {
        }
    };

    return { 
        isModalOpen, 
        isConfirmingDelete,
        setIsConfirmingDelete,
        openModal,
        closeModal,
        executeDelete
    };
}