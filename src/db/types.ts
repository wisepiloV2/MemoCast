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