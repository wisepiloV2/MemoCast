import { useEffect, useRef, useState } from "react";
import { TtsSession } from "@realtimex/piper-tts-web";

export function usePiper(voiceId: string | null) {
    const sessionRef = useRef<TtsSession | null>(null);

    const [ready, setReady] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!voiceId) {
            sessionRef.current = null;
            setReady(false);
            setError(null);
            return;
        }

        let mounted = true;

        async function init() {
            try {
                setReady(false);
                setError(null);
                const session = await TtsSession.create({ voiceId });
                await session.init( true, "local"  );
                if (!mounted) { return; }
                sessionRef.current = session;
                setReady(true);
            } catch (err) {
                console.error("Error to start Piper:", err);
                if (!mounted) { return; }
                sessionRef.current = null;
                setReady(false);
                setError(err instanceof Error ? err.message : "Error started voice");
            }
        }
        init();
        return () => { mounted = false; sessionRef.current = null; };

    }, [voiceId]);

    // Función auxiliar para trocear el texto de forma segura por oraciones
    const splitTextIntoChunks = (text: string, maxLength: number = 200): string[] => {
        const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
        const chunks: string[] = [];
        let currentChunk = "";

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length > maxLength) {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += sentence;
            }
        }
        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks;
    };

    /* Modificamos synthesize para que soporte textos largos dividiéndolos en chunks y uniendo los Blobs resultantes */
    const synthesize = async (text: string): Promise<Blob> => {
        const session = sessionRef.current;
        if (!session) {
            throw new Error("Piper is not ready.");
        }

        const chunks = splitTextIntoChunks(text, 250);
        const audioBlobs: Blob[] = [];

        for (const chunk of chunks) {
            if (!chunk.trim()) continue;
            const wavBlob = await session.predict(chunk);
            audioBlobs.push(wavBlob);
        }

        // Devolvemos todos los fragmentos unidos en un único Blob de tipo audio/wav
        return new Blob(audioBlobs, { type: "audio/wav" });
    };

    return {
        ready,
        error,
        synthesize,
    };
}
