import { useState, useEffect } from 'react';
import { useSearchCategory } from './useSearchCategory';
import { useCategoryMutations } from './useCategoryMutations';

interface UseCategorySelectedProps {
  value: string;
  onChange: (categoryName: string) => void;
}

export function useCategorySelected({ value, onChange }: UseCategorySelectedProps) {
  const [query, setQuery] = useState(value || '');
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value || '');
  }

  const [isOpen, setIsOpen] = useState(false);
  const { results, searchCategory, isLoading } = useSearchCategory();
  const { createCategory, isSaving } = useCategoryMutations();

  useEffect(() => {
    if (isOpen) {
      searchCategory(query);
    }
  }, [query, isOpen, searchCategory]); 

  const handleSelect = (categoryName: string) => {
    setQuery(categoryName);
    onChange(categoryName); 
    setIsOpen(false);    
  };

  const handleCreateNew = async () => {
    if (!query.trim()) return;
    try {
      await createCategory(query.trim());
      handleSelect(query.trim());
    } catch (error) {
      console.error('There was an error creating the category', error);
    }
  };

  const exactMatchExists = results.some(
    (cat) => cat.name.toLowerCase() === query.trim().toLowerCase(),
  );

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    results,
    isLoading,
    isSaving,
    exactMatchExists,
    handleSelect,
    handleCreateNew,
  };
}
