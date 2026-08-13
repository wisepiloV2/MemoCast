import { FormEvent, useState } from 'react';
import { categoryService } from '../service/categoryService';

type ModalView = 'options' | 'edit' | 'delete';

export function useCategoryCard(
  id: number,
  category: string,
  onCategoryChange?: () => void,
) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('options');

  const [categoryName, setCategoryName] = useState(category);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    setCategoryName(category);
    setModalView('options');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isLoading) return;

    setIsModalOpen(false);
    setModalView('options');
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newName = categoryName.trim();

    if (!newName) return;

    if (newName === category) {
      closeModal();
      return;
    }

    try {
      setIsLoading(true);

      await categoryService.update(id, newName);

      closeModal();

      onCategoryChange?.();
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await categoryService.delete(id);

      closeModal();

      onCategoryChange?.();
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isModalOpen,
    modalView,
    setModalView,

    categoryName,
    setCategoryName,

    isLoading,

    openModal,
    closeModal,

    handleUpdate,
    handleDelete,
  };
}
