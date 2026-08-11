import Dexie, { type Table } from 'dexie';
import { type Document, type Category, type VoiceMeta, type VoiceData } from './types';

export class dbDexie extends Dexie {
    documents!: Table<Document, number>;
    categories!: Table<Category, number>;
    voices!: Table<VoiceMeta, string>; 
    voice_data!: Table<VoiceData, string>; 

    constructor() {
        super('LocalDB');
        
        this.version(1).stores({
            documents: '++id, category, createdAt',
            categories: '++id, &name',
            voices: 'id, name',     
            voice_data: 'id' 
        });
    }
}

export const db = new dbDexie();