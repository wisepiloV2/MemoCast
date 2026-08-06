import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { documentService } from "../service/documentService";

export const useDocumentById = (id: number | undefined) => {
  const [error, setError] = useState<Error | null>(null);

  const document = useLiveQuery(
    async () => {
      try {
        if (!id) return null;        
        setError(null); 
        return await documentService.getById(id);
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error al leer la base de datos"));
        return null;
      }
    },
    [id]
  );

  const isLoading = document === undefined && error === null;

  return { document, isLoading, error };
};