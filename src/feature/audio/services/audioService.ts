import { db } from "../../../db/dbDexie";
import { type AudioDocument } from "../../../db/types";

export const audioService = {
  async save(audioDocument: AudioDocument): Promise<number> {
    return db.audioDocuments.put(audioDocument);
  },

  async getByDocumentId(
    idDocument: number
  ): Promise<AudioDocument | undefined> {
    return db.audioDocuments.get(idDocument);
  },

  async delete(idDocument: number): Promise<void> {
    await db.audioDocuments.delete(idDocument);
  },

  async exists(idDocument: number): Promise<boolean> {
    return db.audioDocuments
      .where("idDocument")
      .equals(idDocument)
      .count()
      .then((count) => count > 0);
  },
};