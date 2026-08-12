import { db } from '../../../db/dbDexie';
import type { VoiceMeta } from '../../../db/types';

export const voiceService = {
  getAllMeta: async () => {
    return await db.voices.toArray();
  },

  getMeta: async (id: string) => {
    return await db.voices.get(id);
  },

  save: async (meta: VoiceMeta) => {
    await db.voices.put(meta);
  },

  delete: async (id: string) => {
    await db.voices.delete(id);
  },
};
