import Dexie, { type Table } from 'dexie';
import { type Document, type AudioFile, type Category } from './types';

export class dbDexie extends Dexie {
    documents!: Table<Document, number>;
    audioFiles!: Table<AudioFile, number>;
    categories!: Table<Category, number>;

    constructor() {
        super('LocalDB');
        this.version(2).stores({
            documents: '++id, category, createdAt',
            audioFiles: '++id, documentId',
            categories: '++id, &name' 
        });
    }
}

export const db = new dbDexie();