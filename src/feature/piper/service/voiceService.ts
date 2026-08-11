import { db } from "../../../db/dbDexie";
import type { VoiceMeta, VoiceData } from "../../../db/types";

export const voiceService = {
    getAllMeta: async () => {
        return await db.voices.toArray();
    },

    getVoiceData: async (id: string) => {
        return await db.voice_data.get(id);
    },

    save: async (meta: VoiceMeta, data: VoiceData) => {
        return await db.transaction('rw', db.voices, db.voice_data, async () => {
            await db.voices.put(meta);
            await db.voice_data.put(data);
        });
    },

    delete: async (id: string) => {
        return await db.transaction('rw', db.voices, db.voice_data, async () => {
            await db.voices.delete(id);
            await db.voice_data.delete(id);
        });
    }
}