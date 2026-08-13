import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../src/db/dbDexie'; 
import { categoryService } from '../../src/feature/category/service/categoryService'; 

describe('Category Service', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.documents.clear();
  });

  // ==========================================
  // SEARCH BY NAME
  // ==========================================
  describe('searchByName()', () => {
    beforeEach(async () => {
      await db.categories.bulkAdd([
        { name: 'Programming' },
        { name: 'Projects' },
        { name: 'Cooking' },
        { name: 'Travel' },
      ]);
    });

    it('🟢 Should find categories that start with the term, ignoring case', async () => {
      const result = await categoryService.searchByName('pro', 10);
      
      expect(result).toHaveLength(2);
      expect(result.some(c => c.name === 'Programming')).toBe(true);
      expect(result.some(c => c.name === 'Projects')).toBe(true);
    });

    it('🟢 Should respect the result limit', async () => {
      const result = await categoryService.searchByName('pro', 1);
      
      expect(result).toHaveLength(1); 
    });

    it('🔴 Should return up to "limit" categories if the term is empty', async () => {
      const result = await categoryService.searchByName('   ', 2);
      expect(result).toHaveLength(2);
    });

    it('🔴 Should return an empty array if no category starts with that text', async () => {
      // Testing with "ing" (from Cooking) to ensure it only matches prefixes
      const result = await categoryService.searchByName('ing', 10);
      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // CREATE
  // ==========================================
  describe('create()', () => {
    it('🟢 Should create a category by trimming extra spaces', async () => {
      const id = await categoryService.create('   Finance   ');
      
      expect(id).toBeDefined();
      const savedCategory = await db.categories.get(id);
      expect(savedCategory?.name).toBe('Finance'); 
    });

    it('🔴 Should throw an error if the name is empty', async () => {
      await expect(categoryService.create('')).rejects.toThrow('Category name cannot be empty.');
      await expect(categoryService.create('   ')).rejects.toThrow('Category name cannot be empty.');
    });
  });

  // ==========================================
  // UPDATE (CASCADE)
  // ==========================================
  describe('update()', () => {
    it('🟢 Should update the category AND all associated documents', async () => {
      const categoryId = await db.categories.add({ name: 'Technology' });
      
      await db.documents.bulkAdd([
        { title: 'Doc 1', category: 'Technology', htmlText: '', createdAt: new Date() },
        { title: 'Doc 2', category: 'Technology', htmlText: '', createdAt: new Date() },
        { title: 'Intruder Doc', category: 'Other', htmlText: '', createdAt: new Date() },
      ]);

      await categoryService.update(categoryId, 'Programming');

      const updatedCategory = await db.categories.get(categoryId);
      expect(updatedCategory?.name).toBe('Programming');

      const updatedDocs = await db.documents.where('category').equals('Programming').toArray();
      const oldDocs = await db.documents.where('category').equals('Technology').toArray();

      expect(updatedDocs).toHaveLength(2); 
      expect(oldDocs).toHaveLength(0);   
    });

    it('🔴 Should do nothing and not throw an error if the ID does not exist', async () => {
      await expect(categoryService.update(999, 'New name')).resolves.not.toThrow();
    });
  });

  // ==========================================
  // DELETE (CASCADE)
  // ==========================================
  describe('delete()', () => {
    it('🟢 Should delete the category AND all its associated documents', async () => {
      const categoryId = await db.categories.add({ name: 'Trash' });
      
      await db.documents.bulkAdd([
        { title: 'To delete 1', category: 'Trash', htmlText: '', createdAt: new Date() },
        { title: 'To delete 2', category: 'Trash', htmlText: '', createdAt: new Date() },
        { title: 'To save', category: 'Important', htmlText: '', createdAt: new Date() },
      ]);

      await categoryService.delete(categoryId);

      const deletedCategory = await db.categories.get(categoryId);
      expect(deletedCategory).toBeUndefined();

      const trashDocs = await db.documents.where('category').equals('Trash').toArray();
      const savedDocs = await db.documents.where('category').equals('Important').toArray();

      expect(trashDocs).toHaveLength(0); 
      expect(savedDocs).toHaveLength(1);  
      expect(await db.documents.count()).toBe(1); 
    });

    it('🔴 Should do nothing and not throw an error if the ID does not exist', async () => {
      await expect(categoryService.delete(999)).resolves.not.toThrow();
    });
  });
});
