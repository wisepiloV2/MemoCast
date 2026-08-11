export interface CatalogVoice {
    name: string;
    voiceId: string;
    modelUrl: string;
    configUrl: string;
}

export type VoiceCatalog = Record<string, CatalogVoice>;