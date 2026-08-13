import Dexie, { type Table } from 'dexie';
import { type Document, type Category } from './types';

export class dbDexie extends Dexie {
  documents!: Table<Document, number>;
  categories!: Table<Category, number>;

  constructor() {
    super('LocalDB');

    this.version(2).stores({
      documents: '++id, category, createdAt',
      categories: '++id, &name',
    });
  }
}

export const db = new dbDexie();
