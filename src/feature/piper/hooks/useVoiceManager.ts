import { useEffect, useState } from 'react';
import { voiceService } from '../service/voiceService';
import { useDownloadVoice } from './useDownloadVoice';
import type { VoiceMeta } from '../../../db/types';
import voicesData from '../utils/availbleVoices.json';

type VoiceCatalog = Record<string, {
    name: string;
    voiceId: string;
    modelUrl: string;
    configUrl: string;
}>;

const catalog = voicesData as VoiceCatalog;

export function useVoiceManager() {
    const [installedVoices, setInstalledVoices] = useState<VoiceMeta[]>([]);
    const { downloadVoice, isDownloading } = useDownloadVoice();

    const loadInstalled = async () => {
        const installed = await voiceService.getAllMeta();
        setInstalledVoices(installed);
    };

    useEffect(() => {
        loadInstalled();
    }, []);

    const handleInstall = async (id: string) => {
        const voiceConfig = catalog[id]; 
        
        if (!voiceConfig) return;

        const success = await downloadVoice(
            id, 
            voiceConfig.name,
            voiceConfig.modelUrl,
            voiceConfig.configUrl
        );

        if (success) {
            await loadInstalled();
        }
    };

    const handleDelete = async (id: string) => {
        await voiceService.delete(id); 
        await loadInstalled(); 
    };

    const availableVoices = Object.entries(catalog).filter(
        ([id, _]) => !installedVoices.some((installed) => installed.id === id)
    );

    return {
        installedVoices,
        availableVoices,
        handleInstall,
        handleDelete,
        isDownloading
    };
}