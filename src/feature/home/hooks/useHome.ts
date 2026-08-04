import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "../../../db/dbDexie";

export function useHome(){
    const [searchTerm, setSearchTerm] = useState("");
    const searchResults = useLiveQuery(
        () => {
            if (!searchTerm) {
                return db.documents.orderBy('createdAt').reverse().limit(10).toArray();
            }
    
            const lowerTerm = searchTerm.toLowerCase();
            return db.documents.filter(doc => 
                doc.title.toLowerCase().includes(lowerTerm) || 
                doc.category.toLowerCase().includes(lowerTerm)
            ).reverse().toArray();
        },
        [searchTerm] 
    );
    return {
        searchTerm, setSearchTerm,
        searchResults
    }
}