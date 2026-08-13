import { db } from '../../../db/dbDexie';

export const categoryService = {
  searchByName: async (searchTerm: string, limit: number) => {
    if (!searchTerm.trim()) return await db.categories.limit(limit).toArray();
    return await db.categories
      .where('name')
      .startsWithIgnoreCase(searchTerm.trim())
      .limit(limit)
      .toArray();
  },

  create: async (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error('Category name cannot be empty.');
    return await db.categories.add({ name: cleanName });
  },

  update: async (id: number, newName: string) => {
    return await db.transaction('rw', db.categories, db.documents, async () => {
      const category = await db.categories.get(id);
      if (!category) return;

      const oldName = category.name;

      await db.documents
        .where('category')
        .equals(oldName)
        .modify({ category: newName });

      await db.categories.update(id, { name: newName });
    });
  },

  delete: async (id: number) => {
    return await db.transaction('rw', db.categories, db.documents, async () => {
      const categoryToDelete = await db.categories.get(id);
      
      if (!categoryToDelete) return; 

      await db.documents
        .where('category')
        .equals(categoryToDelete.name) 
        .delete();

      await db.categories.delete(id);
    });
  },
};
