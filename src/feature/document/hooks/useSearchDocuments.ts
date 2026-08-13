import { useState, useCallback } from 'react';
import { documentService } from '../service/documentService';
import { type Document } from '../../../db/types';

export function useSearchDocuments(){
  const [results, setResults] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchDocuments = useCallback(async (searchTerm: string, limit: number = 6) => {
    setIsLoading(true);
    try {
      const data = await documentService.search(searchTerm, limit);
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  const searchDocumentInCategory = useCallback(async (category: string, searchTerm: string, limit: number = 20) => {
    setIsLoading(true);
    try {
      const data = await documentService.searchWithCategory(category, searchTerm, limit);
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    results,
    isLoading,
    searchDocuments,
    searchDocumentInCategory,
  };
};
