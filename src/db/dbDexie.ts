import Dexie, { type Table } from 'dexie';
import { type Document, type Category, type AudioDocument } from './types';

export class dbDexie extends Dexie {
  documents!: Table<Document, number>;
  categories!: Table<Category, number>;
  audioDocuments!: Table<AudioDocument, number>;

  constructor() {
    super('LocalDB');

    this.version(2).stores({
      documents: '++id, category, createdAt',
      categories: '++id, &name',
    });

    this.version(3).stores({
      documents: '++id, category, createdAt',
      categories: '++id, &name',
      audioDocuments: 'idDocument',
    });
  }
}

export const db = new dbDexie();