import { db } from "../../../db/dbDexie";
import type { AudioDocument, Document, Category } from "../../../db/types";

export const serviceDb = {
    getData: async () => {
        const [documents, categories, audios] = await Promise.all([
            db.documents.toArray(),
            db.categories.toArray(),
            db.audioDocuments.toArray()
        ]);

        return { documents, categories, audios };
    },

    replaceDb: async (documents: Document[], audios: AudioDocument[], categories: Category[]) => {
        return db.transaction('rw', db.documents, db.categories, db.audioDocuments, async () => {
            await db.documents.clear();
            await db.categories.clear();
            await db.audioDocuments.clear();

            if (categories.length > 0) await db.categories.bulkAdd(categories);
            if (documents.length > 0) await db.documents.bulkAdd(documents);
            if (audios.length > 0) await db.audioDocuments.bulkAdd(audios);
        });
    },

    mergeDb: async (documents: Document[], audios: AudioDocument[], categories: Category[]) => {
        return db.transaction('rw', db.documents, db.categories, db.audioDocuments, async () => {
            
            for (const cat of categories) {
                const existe = await db.categories.where('name').equals(cat.name).first();
                if (!existe) {
                    delete cat.id; 
                    await db.categories.add(cat); 
                }
            }

            for (const doc of documents) {
                const idViejo = doc.id;          
                delete doc.id; 
                const idNuevo = await db.documents.add(doc) as number;
                if (idViejo !== undefined) {
                    const audioAsociado = audios.find(a => a.idDocument === idViejo);
                    
                    if (audioAsociado) {
                        await db.audioDocuments.add({
                            idDocument: idNuevo,
                            audio: audioAsociado.audio
                        });
                    }
                }
            }
        });
    }
}