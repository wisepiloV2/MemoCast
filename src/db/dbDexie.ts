import Dexie, { type Table } from 'dexie';

export interface Document {
    id?: number; 
    title: string;
    category: string;
    htmlText: string;
    createdAt: Date;
}

export interface AudioFile {
    id?: number;
    documentId: number;
    audioBlob: Blob;
}

export interface Category {
    id?: number;
    name: string;
}

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