import Dexie, { type Table } from 'dexie';

// Definimos la forma de nuestros datos
export interface Documento {
    id?: number; 
    title: string;
    category: string;
    htmlText: string;
    createdAt: Date;
}

export interface AudioArchivo {
    id?: number;
    documentoId: number; 
    audioBlob: Blob;   
}

export class dbDexie extends Dexie {
    documentos!: Table<Documento, number>;
    audios!: Table<AudioArchivo, number>;

    constructor() {
        super('MiAppLocalDB');
        
        this.version(1).stores({
            documentos: '++id, category, createdAt',
            audios: '++id, documentoId'
        });
    }
}

export const db = new dbDexie();