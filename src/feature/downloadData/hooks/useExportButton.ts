import { useState } from "react";
import { exportDb } from "../services/exportDb";

export function useExportButton() {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportBackup = async () => {
        if (isExporting) return;

        try {
            setIsExporting(true);
            setError(null);

            await exportDb();

        } catch (error) {
            console.error("Error exporting backup:", error);
            setError("Failed to export the database. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return {
        exportBackup,
        isExporting,
        error,
    };
}