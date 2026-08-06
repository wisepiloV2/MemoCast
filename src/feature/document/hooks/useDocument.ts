import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/dbDexie';

export function useDocument(id: string | undefined) {
    const document = useLiveQuery(
        () => id ? db.documents.get(Number(id)) : undefined, 
        [id]
    );

    const isLoading = id ? (document === undefined) : false;
    const error = (!isLoading && !document) ? "Document not found" : null;

    return { document, isLoading, error };
}