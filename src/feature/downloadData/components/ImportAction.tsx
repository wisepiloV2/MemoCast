import { type ChangeEvent, useRef, useState } from "react";
import { useImportButton } from "../hooks/useImportButton";
import type { ImportMode } from "../services/importDb";
import { Button } from "../../../component/Button/Button";
import styles from "./BackupActions.module.css";

export function ImportAction() {
    const {
        importBackup,
        isImporting,
        error,
        success,
    } = useImportButton();

    const inputRef = useRef<HTMLInputElement>(null);
    
    const [mode, setMode] = useState<ImportMode>("merge");

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await importBackup(file, mode);

        event.target.value = "";
    };

    const handleClick = () => {
        if (isImporting) return;
        inputRef.current?.click();
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Import data</h3>

            <p className={styles.description}>Restore your documents from a MemoCast ZIP file.</p>

            <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                    <input 
                        type="radio" 
                        name="importMode" 
                        value="merge"
                        checked={mode === "merge"}
                        onChange={() => setMode("merge")}
                        disabled={isImporting}
                    />
                    <span> <strong>Merge</strong> (Add new ones without deleting current ones)</span>
                </label>

                <label className={styles.radioLabel}>
                    <input 
                        type="radio" 
                        name="importMode" 
                        value="replace"
                        checked={mode === "replace"}
                        onChange={() => setMode("replace")}
                        disabled={isImporting}
                    />
                    <span> <strong>Replace</strong> (Delete all and restore from ZIP)</span>
                </label>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept=".zip,application/zip"
                onChange={handleFileChange}
                hidden
            />

            <Button
                type="button"
                onClick={handleClick}
                disabled={isImporting}
            >
                {isImporting ? "Importing..." : "Import"}
            </Button>

            {success && (
                <p className={styles.success}>Backup imported successfully.</p>
            )}

            {error && (
                <p role="alert" className={styles.error}>{error}</p>
            )}
        </div>
    );
}