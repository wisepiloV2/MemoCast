import { useState } from "react";
import { documentService } from "../service/documentService";
import { type Document } from "../../../db/types";

export function useSearchDocuments(){
    const [results, setResults] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function searchDocuments(searchTerm: string, limit: number = 6) {
        setIsLoading(true);
        try {
            // Llamamos a la nueva función del servicio pasándole el límite
            const data = await documentService.search(searchTerm, limit);
            setResults(data);
        } finally {
            setIsLoading(false);
        }
    };

    async function searchDocumentInCategory(category: string, searchTerm: string){
        setIsLoading(true);
        try {
            const data = await documentService.searchWithinCategory(category, searchTerm);
            setResults(data);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        results,
        isLoading,
        searchDocuments,
        searchDocumentInCategory
    };
};