import { useState } from 'react';

export function useDocumentCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const openModal = () => setIsModalOpen(true);
    
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsConfirmingDelete(false), 200); 
  };

  return { 
    isModalOpen, 
    isConfirmingDelete,
    setIsConfirmingDelete,
    openModal,
    closeModal,
  };
}
