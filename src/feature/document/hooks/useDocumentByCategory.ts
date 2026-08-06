import { useLiveQuery } from "dexie-react-hooks";
import { documentService } from "../service/documentService";

export const useDocumentsByCategory = (category: string) => {
  const documents = useLiveQuery(
    async () => {
      if (!category) return [];
      return await documentService.getAllByCategory(category);
    },
    [category]
  );

  return { 
    documents: documents ?? [], 
    isLoading: documents === undefined 
  };
};