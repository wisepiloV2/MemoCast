import { useLiveQuery } from "dexie-react-hooks";
import { documentService } from "../service/documentService";

export const useDocumentById = (id: number | undefined) => {
  const document = useLiveQuery(
    async () => {
      if (!id) return null;
      
      const data = await documentService.getById(id);
      
      return data ?? null;
    },
    [id]
  );

  const isLoading = Boolean(id) && document === undefined;

  return { document, isLoading };
};