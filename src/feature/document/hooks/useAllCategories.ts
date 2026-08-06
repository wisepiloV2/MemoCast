import { useLiveQuery } from "dexie-react-hooks";
import { documentService } from "../service/documentService";

export const useAllCategories = () => {
  const categories = useLiveQuery(
    async () => {
      return await documentService.getAllCategories();
    },
    []
  );

  return { 
    categories: categories ?? [],
    isLoading: categories === undefined 
  };
};