import JSZip from "jszip";
import { saveAs } from "file-saver";
import { serviceDb } from "./serviceDb";

export async function exportDb(fileName: string = "documentsZip.zip"){
    try {
        const { documents, categories, audios } = await serviceDb.getData();

        const zip = new JSZip();

        zip.file("categories.json", JSON.stringify(categories));
        zip.file("documents.json", JSON.stringify(documents));

        const carpetaAudios = zip.folder("audios");
        if (carpetaAudios) {
            audios.forEach(audioDoc => {
                carpetaAudios.file(`audio_${audioDoc.idDocument}.blob`, audioDoc.audio);
            });
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, fileName);

        return true;
    } catch (error) {
        console.error("Error exporting data:", error);
        throw error;
    }
}
