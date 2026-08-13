import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../src/db/dbDexie'; 
import { documentService } from '../../src/feature/document/service/documentService';
import { type Document } from '../../src/db/types'; 

describe('Document Service', () => {
  beforeEach(async () => {
    await db.documents.clear();
    await db.categories.clear();
  });

  const createBaseDocument = (title: string, category: string): Document => ({
    title,
    category,
    htmlText: '<p>Content</p>',
    createdAt: new Date(),
  });

  // ==========================================
  // CREATE
  // ==========================================
  describe('create()', () => {
    it('🟢 Should create a document correctly and return its ID', async () => {
      const doc = createBaseDocument('My first document', 'Notes');
      
      const id = await documentService.create(doc);
      
      expect(id).toBeDefined();
      expect(typeof id).toBe('number');

      const savedDoc = await db.documents.get(id);
      expect(savedDoc?.title).toBe('My first document');
    });

    it('🔴 Should throw an error if the title is empty or whitespace only', async () => {
      const doc = createBaseDocument('   ', 'Notes');
      
      await expect(documentService.create(doc)).rejects.toThrow('Document title is required');
    });

    it('🔴 Should throw an error if the category is empty', async () => {
      const doc = createBaseDocument('Valid Title', '   ');
      
      await expect(documentService.create(doc)).rejects.toThrow('The document must have a category');
    });
  });

  // ==========================================
  // GET BY ID
  // ==========================================
  describe('getById()', () => {
    it('🟢 Should retrieve the document if it exists', async () => {
      const id = await db.documents.add(createBaseDocument('Doc to find', 'Test'));
      
      const result = await documentService.getById(id);
      
      expect(result).toBeDefined();
      expect(result?.title).toBe('Doc to find');
    });

    it('🔴 Should return undefined if the ID does not exist', async () => {
      const result = await documentService.getById(9999);
      
      expect(result).toBeUndefined();
    });
  });

  // ==========================================
  // GET ALL BY CATEGORY
  // ==========================================
  describe('getAllByCategory()', () => {
    it('🟢 Should return only documents belonging to the requested category', async () => {
      await db.documents.bulkAdd([
        createBaseDocument('Doc 1', 'Work'),
        createBaseDocument('Doc 2', 'Work'),
        createBaseDocument('Doc 3', 'Personal'),
      ]);

      const result = await documentService.getAllByCategory('Work');
      
      expect(result).toHaveLength(2);
      expect(result.every(doc => doc.category === 'Work')).toBe(true);
    });

    it('🔴 Should return an empty array if the category has no documents', async () => {
      const result = await documentService.getAllByCategory('Nonexistent Category');
      
      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // UPDATE
  // ==========================================
  describe('update()', () => {
    it('🟢 Should update specific fields of a document', async () => {
      const id = await db.documents.add(createBaseDocument('Original Title', 'Notes'));
      
      await documentService.update(id, { 
        title: 'Updated Title', 
        htmlText: '<p>New Content</p>', 
      });

      const updatedDoc = await db.documents.get(id);
      expect(updatedDoc?.title).toBe('Updated Title');
      expect(updatedDoc?.htmlText).toBe('<p>New Content</p>');
      expect(updatedDoc?.category).toBe('Notes');
    });

    it('🔴 Should throw an error if attempting to update with an empty title', async () => {
      const id = await db.documents.add(createBaseDocument('Original Title', 'Notes'));
      
      await expect(documentService.update(id, { title: '   ' })).rejects.toThrow('Title cannot be empty');
    });
  });

  // ==========================================
  // DELETE
  // ==========================================
  describe('delete()', () => {
    it('🟢 Should delete an existing document', async () => {
      const id = await db.documents.add(createBaseDocument('Doc to delete', 'Notes'));
      
      await documentService.delete(id);
      
      const doc = await db.documents.get(id);
      expect(doc).toBeUndefined();
    });
  });

  // ==========================================
  // SEARCH
  // ==========================================
  describe('search()', () => {
    beforeEach(async () => {
      await db.documents.bulkAdd([
        createBaseDocument('Chicken recipe', 'Cooking'),
        createBaseDocument('MEETING notes', 'Work'),
        createBaseDocument('Baked chicken', 'Cooking'),
      ]);
    });

    it('🟢 Should find documents ignoring case sensitivity', async () => {
      const result = await documentService.search('CHIcken', 10);
      
      expect(result).toHaveLength(2);
      expect(result.some(d => d.title === 'Chicken recipe')).toBe(true);
      expect(result.some(d => d.title === 'Baked chicken')).toBe(true);
    });

    it('🟢 Should respect the result limit', async () => {
      const result = await documentService.search('chicken', 1);
      
      expect(result).toHaveLength(1);
    });

    it('🔴 Should return up to "limit" documents if the search term is empty', async () => {
      const result = await documentService.search('   ', 2);
      
      expect(result).toHaveLength(2);
    });

    it('🔴 Should return an empty array if there are no matches', async () => {
      const result = await documentService.search('astronaut', 10);
      
      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // SEARCH WITH CATEGORY
  // ==========================================
  describe('searchWithCategory()', () => {
    beforeEach(async () => {
      await db.documents.bulkAdd([
        createBaseDocument('Learn React', 'Programming'),
        createBaseDocument('Learn Node', 'Programming'),
        createBaseDocument('Learn Cooking', 'Cooking'),
      ]);
    });

    it('🟢 Should search only within the specified category', async () => {
      const result = await documentService.searchWithCategory('Programming', 'learn', 10);
      
      expect(result).toHaveLength(2); 
      expect(result.every(d => d.category === 'Programming')).toBe(true);
    });

    it('🟢 Should respect the result limit', async () => {
      const result = await documentService.searchWithCategory('Programming', 'learn', 1);
      
      expect(result).toHaveLength(1); 
    });

    it('🔴 Should return up to "limit" documents in the category if the term is empty', async () => {
      const result = await documentService.searchWithCategory('Programming', '  ', 10);
      
      expect(result).toHaveLength(2);
    });

    it('🔴 Should NOT find matches if they belong to another category', async () => {
      const result = await documentService.searchWithCategory('Programming', 'cooking', 10);
      
      expect(result).toEqual([]);
    });
  });
});
