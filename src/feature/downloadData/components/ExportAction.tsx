import { Button } from "../../../component/Button/Button";
import { useExportButton } from "../hooks/useExportButton";
import styles from "./BackupActions.module.css";

export function ExportAction() {
    const {
        exportBackup,
        isExporting,
        error,
    } = useExportButton();

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Export data</h3>
            
            <p className={styles.description}>
                Download all your documents, categories, and audio files in a ZIP file. 
                Keep it in a safe place to avoid losing your information.
            </p>

            <Button
                type="button"
                onClick={exportBackup}
                disabled={isExporting}
            >
                {isExporting ? "Exporting..." : "Export"}
            </Button>

            {error && (
                <p role="alert" className={styles.error}> {error}</p>
            )}
        </div>
    );
}