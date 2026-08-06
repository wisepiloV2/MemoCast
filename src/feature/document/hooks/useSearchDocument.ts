import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "../../../db/dbDexie";

export function useSearchDocument(){
    const [query, setQuery] = useState("");
    const searchResults = useLiveQuery(
        () => {
            if (!query) {
                return db.documents.orderBy('createdAt').reverse().limit(10).toArray();
            }
    
            const lowerQuery = query.toLowerCase();
            return db.documents.filter(doc => 
                doc.title.toLowerCase().includes(lowerQuery) || 
                doc.category.toLowerCase().includes(lowerQuery)
            ).reverse().toArray();
        },
        [query] 
    );
    return {
        query, setQuery,
        searchResults
    }
}