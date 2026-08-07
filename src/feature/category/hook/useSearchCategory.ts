import { useState } from "react";
import { categoryService } from "../service/categoryService";
import { type Category } from "../../../db/types";

export function useSearchCategory(){
    const [results, setResults] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function searchCategory(searchTerm: string){
        setIsLoading(true);
        try{
            const data = await categoryService.searchByName(searchTerm);
            setResults(data);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        results,
        isLoading,
        searchCategory
    };
}