import { useState } from "react";
import { db } from "../../../db/dbDexie"; 

export function useDocumentCard(id: number, title: string) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar "${title}"?`);
            
        if (confirmar) {
            try {
                await db.documents.delete(id);
                    
                // Para cuando agregue los audios:
                // const audiosDelDoc = await db.audios.where('documentoId').equals(id).toArray();
                // for (const audio of audiosDelDoc) {
                //     if(audio.id) await db.audios.delete(audio.id);
                // }
    
                console.log(`Documento ${id} eliminado con éxito`);
            } catch (error) {
                console.error("Error eliminando el documento:", error);
                alert("Hubo un error al eliminar el documento.");
            }
        }
            
        setIsModalOpen(false);
    };

    return {
        isModalOpen, 
        setIsModalOpen,
        handleDelete
    };
}