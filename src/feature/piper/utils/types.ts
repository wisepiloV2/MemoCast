export interface CatalogVoice {
    name: string;
    voiceId: string;
}

export type VoiceCatalog =
    Record<string, CatalogVoice>;
