import * as tts from '@realtimex/piper-tts-web';
import { useState, useEffect, useCallback } from 'react';

const catalog = {
    "es-Male": {
        id: "es_MX-ald-medium",
        description: "Spanish (México) - Male",
        name: "Spanish(M)"
    },
    "us-Female": {
        id: "en_US-hfc_female-medium", 
        description: "English (US) - Female", 
        name: "English(F)"
    },
    "us-Male": {
        id: "en_US-ryan-high",        
        description: "English (US) - Male",    
        name: "English(M)"             
    }
};

export function useTtsMutations() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [installedIds, setInstalledIds] = useState<string[]>([]);

    const checkInstalled = useCallback(async () => {
        try {
            const stored = await tts.stored();
            setInstalledIds(stored);
        } catch (error) {
            console.error("Error reading TTS cache:", error);
        }
    }, []);

    useEffect(() => {
        checkInstalled();
    }, [checkInstalled]);

    const availableVoices = Object.entries(catalog).map(([key, voice]) => ({
        ...voice, 
        key, 
        isInstalled: installedIds.includes(voice.id) 
    }));

    const installedVoices = availableVoices
        .filter(voice => voice.isInstalled)
        .map(voice => ({
            id: voice.id,
            name: voice.name,
            description: voice.description
        }));

    async function downloadById(id: string) {
        setIsProcessing(true);
        try {
            await tts.download(id);
            await new Promise(resolve => setTimeout(resolve, 100)); 
            await checkInstalled();
        } catch (err) {
            throw new Error('Download failed:', { cause: err });
        } finally {
            setIsProcessing(false);
        }
    }

    async function deleteById(id: string) {
        setIsProcessing(true);
        try {
            await tts.remove(id);
            await checkInstalled(); 
        } catch (err) {
            throw new Error('Delete failed:', { cause: err });
        } finally {
            setIsProcessing(false); 
        }
    }

    async function deleteAll() {
        setIsProcessing(true);
        try {
            await tts.flush();
            await checkInstalled(); 
        } catch (err) {
            throw new Error('Delete all failed:', { cause: err });
        } finally {
            setIsProcessing(false); 
        }
    }

    return {
        isProcessing,
        availableVoices, 
        installedVoices, 
        downloadById,
        deleteById,
        deleteAll
    };
}