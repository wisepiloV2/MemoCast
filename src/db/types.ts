export interface Document {
    id?: number;
    title: string;
    category: string;
    htmlNote: string;
    htmlText: string;
    createdAt: Date;
}

export interface Category {
    id?: number;
    name: string;
}

export interface AudioDocument {
    idDocument : number;
    audio: Blob
}
