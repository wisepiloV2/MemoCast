import { useState } from 'react';
import { voiceService } from '../service/voiceService';

export const useDownloadVoice = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downloadVoice = async (id: string, name: string, onnxUrl: string, jsonUrl: string) => {
        setIsDownloading(true);
        setError(null);

        try {
            const [onnxResponse, jsonResponse] = await Promise.all([
                fetch(onnxUrl),
                fetch(jsonUrl)
            ]);

            if (!onnxResponse.ok || !jsonResponse.ok) {
                throw new Error("Error downloading files from the network");
            }

            const meta = { id, name };
            const data = { 
                id, 
                onnxData: await onnxResponse.arrayBuffer(), 
                configData: await jsonResponse.json() 
            };

            await voiceService.save(meta, data);

            return true; 
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setError(errorMessage);
            return false;
        } finally {
            setIsDownloading(false);
        }
    };

    return {
        downloadVoice,
        isDownloading,
        error
    };
};