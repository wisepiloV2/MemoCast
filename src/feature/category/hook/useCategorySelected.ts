import { useState, useEffect } from "react";
import { useSearchCategory } from "./useSearchCategory";
import { useCategoryMutations } from "./useCategoryMutations";

interface UseCategorySelectedProps {
  value: string;
  onChange: (categoryName: string) => void;
}

export function useCategorySelected({ value, onChange }: UseCategorySelectedProps) {
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const { results, searchCategory, isLoading } = useSearchCategory();
  const { createCategory, isSaving } = useCategoryMutations();

  useEffect(() => {
    if (isOpen) {
      searchCategory(query);
    }
  }, [query, isOpen]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

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
      console.error("Hubo un error al crear la categoría", error);
    }
  };

  const exactMatchExists = results.some(
    (cat) => cat.name.toLowerCase() === query.trim().toLowerCase()
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