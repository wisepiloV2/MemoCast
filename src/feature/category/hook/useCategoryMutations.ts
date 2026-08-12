import { useState } from 'react';
import { categoryService } from '../service/categoryService'; 

export function useCategoryMutations() {
  const [isSaving, setIsSaving] = useState(false);

  async function createCategory(name: string){
    setIsSaving(true);
    try {
      return await categoryService.create(name);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Error creating category', { cause: error });
    } finally {
      setIsSaving(false);
    }
  };

  async function updateCategory(id: number, name: string){
    setIsSaving(true);
    try {
      await categoryService.update(id, name);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Error updating category', { cause: error });
    } finally {
      setIsSaving(false);
    }
  };

  async function deleteCategory(id: number){
    setIsSaving(true);
    try {
      await categoryService.delete(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Error deleting category', { cause: error });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    isSaving,
  };
}
