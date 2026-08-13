import { useState, useCallback } from 'react';
import { categoryService } from '../service/categoryService';
import { type Category } from '../../../db/types';

export function useSearchCategory(){
  const [results, setResults] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchCategory = useCallback(async (searchTerm: string, limit: number = 20) => {
    setIsLoading(true);
    try{
      const data = await categoryService.searchByName(searchTerm, limit);
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  return {
    results,
    isLoading,
    searchCategory,
  };
}
 
