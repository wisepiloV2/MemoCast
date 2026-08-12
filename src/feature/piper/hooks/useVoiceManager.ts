import { useEffect, useState } from "react";
import { voiceService } from "../service/voiceService";
import { useDownloadVoice } from "./useDownloadVoice";
import type { VoiceMeta } from "../../../db/types";
import voicesData from "../utils/availbleVoices.json";

type VoiceCatalog = Record<string,
    {
        name: string;
        voiceId: string;
    }
>;

const catalog = voicesData as VoiceCatalog;

export function useVoiceManager() {
    const [installedVoices, setInstalledVoices] = useState<VoiceMeta[]>([]);
    const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);

    const {
        downloadVoice,
        deleteVoice,
        isDownloading,
    } = useDownloadVoice();

    const loadInstalled = async () => {
        const installed = await voiceService.getAllMeta();
        setInstalledVoices(installed);

        if (installed.length > 0 && !selectedVoiceId) {
            setSelectedVoiceId(installed[0].id);
        }
    };

    useEffect(() => {
        loadInstalled();
    }, []);

    const handleInstall = async (catalogId: string) => {
        const voiceConfig = catalog[catalogId];

        if (!voiceConfig) {
            return;
        }

        const success = await downloadVoice(
            voiceConfig.voiceId,
            voiceConfig.name
        );

        if (success) {
            await loadInstalled();
        }
    };

    const handleDelete = async (voiceId: string) => {
        const success = await deleteVoice(voiceId);

        if (success) {
            await loadInstalled();
            if (selectedVoiceId === voiceId) {
                setSelectedVoiceId(null);
            }
        }
    };

    const availableVoices = Object.entries(catalog)
        .filter(([_, voiceConfig]) => !installedVoices
            .some((installed) => installed.id === voiceConfig.voiceId)
        );

    return {
        installedVoices,
        availableVoices,
        selectedVoiceId,
        setSelectedVoiceId,
        handleInstall,
        handleDelete,
        isDownloading,
    };
}