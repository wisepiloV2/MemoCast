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
