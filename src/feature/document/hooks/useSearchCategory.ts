//import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
//import { db } from "../../../db/dbDexie";

export function useSearchCategory(){
    const [query, setQuery] = useState("");
    return {
        query, setQuery,
        //searchResults
    }
}