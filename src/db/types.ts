export interface Document {
    id?: number; 
    title: string;
    category: string;
    htmlText: string;
    createdAt: Date;
}

export interface Category {
    id?: number;
    name: string;
}

export interface VoiceMeta {
    id: string;
    name: string;
}

export interface VoiceData {
    id: string;
    onnxData: ArrayBuffer;
    configData: any;
}