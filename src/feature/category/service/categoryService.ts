import { db } from '../../../db/dbDexie';

export const categoryService = {
  searchByName: async (searchTerm: string) => {
    if (!searchTerm.trim()) return await db.categories.toArray();
    return await db.categories
      .where('name')
      .startsWithIgnoreCase(searchTerm.trim())
      .toArray();
  },

  create: async (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error('El nombre de la categoría no puede estar vacío');
    return await db.categories.add({ name: cleanName });
  },

  update: async (id: number, name: string) => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error('El nombre de la categoría no puede estar vacío');
    return await db.categories.update(id, { name: cleanName });
  },

  delete: async (id: number) => {
    return await db.categories.delete(id);
  },
};
