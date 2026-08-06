import { db } from "../../../db/dbDexie";
import { type Document } from "../../../db/types";

export const documentService = {
  getAll: async () => {
    return await db.documents.toArray();
  },

  getById: async (id: number) => {
    return await db.documents.get(id);
  },

  getAllByCategory: async (category: string) => {
    return await db.documents
      .where("category")
      .equals(category)
      .toArray();
  },

  getAllCategories: async () => {
    return await db.categories.toArray();
  },
  
  create: async (documentData: Document) => {
    return await db.documents.add(documentData);
  },
  
  delete: async (id: number) => {
    return await db.documents.delete(id);
  },
  
  update: async (id: number, documentData: Partial<Document>) => {
    return await db.documents.update(id, documentData);
  },
};