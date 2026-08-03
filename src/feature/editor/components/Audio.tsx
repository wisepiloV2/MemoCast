import { useState, type ChangeEvent } from "react";
import './Audio.css'

//Por ahora un diseño basico luego lo creare correctamente
export function Audio(){
    const [audioFile, setAudioFile] = useState<File | null>(null);
    
    const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          setAudioFile(e.target.files[0]);
        }
    };

    return (
        <div className="form-group audio-form-container">
            <label className="form-label">Archivo de Audio</label>
            
            <input 
                type="file" 
                accept="audio/*" 
                onChange={handleAudioChange} 
                className="file-input"
            />
            
            {audioFile && (
                <div className="audio-file-badge">
                    <span className="audio-icon">🎵</span> 
                    <span className="audio-filename">{audioFile.name}</span>
                </div>
            )}
        </div>
    );
}