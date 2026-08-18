import { useState } from "react";
import { importDb, type ImportMode } from "../services/importDb";

export function useImportButton() {
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const importBackup = async (file: File, mode: ImportMode) => {
        if (isImporting) return;

        try {
            setIsImporting(true);
            setError(null);
            setSuccess(false);

            await importDb(file, mode);

            setSuccess(true);

        } catch (error) {
            console.error("Error importing backup:", error);
            setError(error instanceof Error ? error.message : "Failed to import the database.");
        } finally {
            setIsImporting(false);
        }
    };

    return {
        importBackup,
        isImporting,
        error,
        success,
    };
}