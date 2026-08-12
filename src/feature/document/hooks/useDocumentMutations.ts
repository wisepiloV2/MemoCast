import { useState } from 'react';
import { documentService } from '../service/documentService';
import { type Document } from '../../../db/types';

export function useDocumentMutations() {
  const [isSaving, setIsSaving] = useState(false);

  async function createDocument(data: Document) {
    setIsSaving(true);
    try {
      const newId = await documentService.create(data);
      return newId;
    } catch (error) {
      console.error('Error creating the document:', error);
      throw new Error('Error creating the document', { cause: error });
    } finally {
      setIsSaving(false);
    }
  }

  async function updateDocument(id: number, data: Partial<Document>) {
    setIsSaving(true);
    try {
      await documentService.update(id, data);
      return id;
    } catch (error) {
      console.error('Error updating the document:', error);
      throw new Error('Error updating the document', { cause: error });
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteDocument(id: number) {
    setIsSaving(true);
    try {
      await documentService.delete(id);
    } catch (error) {
      console.error('Error deleting the document:', error);
      throw new Error('Error deleting the document', { cause: error });
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    createDocument,
    updateDocument,
    deleteDocument,
  };
}
