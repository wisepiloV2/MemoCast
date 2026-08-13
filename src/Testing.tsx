import { useState, useEffect } from 'react';
import * as tts from '@realtimex/piper-tts-web';

function Testing() {
    // Estados para la interfaz
    const [storedVoices, setStoredVoices] = useState([]);
    const [statusText, setStatusText] = useState('Listo');
    const [isProcessing, setIsProcessing] = useState(false); // Para bloquear botones mientras trabaja

    // Identificadores de las voces a probar
    const voiceEN = 'en_US-hfc_female-medium';
    const voiceES = 'es_ES-davefx-medium';

    // Función para actualizar la lista de voces guardadas en pantalla
    const updateStoredList = async () => {
        try {
            const localVoices = await tts.stored();
            setStoredVoices(localVoices);
        } catch (error) {
            console.error("Error al leer voces guardadas:", error);
        }
    };

    // useEffect para cargar la lista al inicio
    useEffect(() => {
        updateStoredList();
    }, []);

    // Función para descargar una voz
    const handleDownload = async (voiceId) => {
        setIsProcessing(true);
        setStatusText(`Descargando ${voiceId}... Revisa la consola.`);
        
        try {
            // Pasamos un callback para ver el progreso en consola
            await tts.download(voiceId, (progress) => {
                console.log(`Progreso de descarga (${voiceId}):`, progress);
            });
            
            setStatusText(`¡Voz ${voiceId} descargada con éxito!`);
            await updateStoredList(); // Actualizamos la lista
        } catch (error) {
            console.error("Error al descargar:", error);
            setStatusText(`Error al descargar ${voiceId}.`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Función para eliminar todas las voces
    const handleDeleteAll = async () => {
        setIsProcessing(true);
        setStatusText('Eliminando todas las voces...');
        
        try {
            await tts.flush();
            setStatusText('Se han eliminado todas las voces locales.');
            await updateStoredList(); // Actualizamos la lista, debería quedar vacía
        } catch (error) {
            console.error("Error al eliminar voces:", error);
            setStatusText('Error al eliminar las voces.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
            <h2>Gestor de Voces TTS</h2>
            
            {/* Mensaje de estado */}
            <div style={{ 
                padding: '10px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <strong>Estado: </strong> {statusText}
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button 
                    onClick={() => handleDownload(voiceEN)} 
                    disabled={isProcessing}
                    style={{ padding: '10px', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                >
                    ⬇️ Instalar Inglés (US)
                </button>
                
                <button 
                    onClick={() => handleDownload(voiceES)} 
                    disabled={isProcessing}
                    style={{ padding: '10px', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                >
                    ⬇️ Instalar Español (ES)
                </button>

                <button 
                    onClick={handleDeleteAll} 
                    disabled={isProcessing}
                    style={{ padding: '10px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                >
                    🗑️ Eliminar Todas
                </button>
            </div>

            {/* Lista visual de voces guardadas */}
            <div>
                <h3>Voces en caché (OPFS):</h3>
                {storedVoices.length === 0 ? (
                    <p style={{ color: 'gray' }}>No hay voces instaladas.</p>
                ) : (
                    <ul>
                        {storedVoices.map((voice, index) => (
                            <li key={index}>✅ {voice}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export {Testing};