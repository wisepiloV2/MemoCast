import { db } from "../../../db/dbDexie";
import { type Document } from "../../../db/types";

export const documentService = {
  getById: async (id: number) => {
    return await db.documents.get(id);
  },

  getAllByCategory: async (category: string) => {
    return await db.documents
      .where("category")
      .equals(category)
      .toArray();
  },
  
  create: async (documentData: Document) => {
    if (!documentData.title.trim()) throw new Error("El título del documento es obligatorio");
    if (!documentData.category.trim()) throw new Error("El documento debe tener una categoría");
    
    return await db.documents.add(documentData);
  },
  
  update: async (id: number, documentData: Partial<Document>) => {
    if (documentData.title !== undefined && !documentData.title.trim()) {
      throw new Error("El título no puede quedar vacío");
    }
    
    return await db.documents.update(id, documentData);
  },

  delete: async (id: number) => {
    return await db.documents.delete(id);
  },

  search: async (searchTerm: string, limit: number) => {
    const term = searchTerm.trim().toLowerCase();
    
    if (!term) return await db.documents.limit(limit).toArray();

    return await db.documents
      .filter((doc) => doc.title.toLowerCase().includes(term))
      .limit(limit)
      .toArray();
  },

  searchWithinCategory: async (category: string, searchTerm: string) => {
    const term = searchTerm.trim().toLowerCase();
    
    const categoryCollection = db.documents.where("category").equals(category);

    if (!term) return await categoryCollection.toArray();

    return await categoryCollection
      .filter((doc) => doc.title.toLowerCase().includes(term))
      .toArray();
  }
};