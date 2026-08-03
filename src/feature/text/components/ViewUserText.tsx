import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../db/dbDexie";
import { ViewText } from "../../../component/ViewText/ViewText";

export function ViewUserText() {
    // Recuperamos el primer documento de la base de datos
    // toCollection().first() toma el registro más antiguo (el primero que se subió)
    const primerDocumento = useLiveQuery(
        () => db.documentos.toCollection().first()
    );

    // 1. Estado de carga: useLiveQuery devuelve 'undefined' mientras lee la base de datos
    if (primerDocumento === undefined) {
        return <p>Cargando documento...</p>; 
    }

    // 2. Estado vacío: si terminó de leer pero no encontró nada, devuelve 'undefined' o 'null'
    if (!primerDocumento) {
        return <p>No hay ningún documento guardado todavía.</p>;
    }

    // 3. Estado de éxito: Pasamos los datos de Dexie a tu componente
    return (
        <ViewText 
            title={primerDocumento.title}
            category={primerDocumento.category}
            htmlText={primerDocumento.htmlText}
        />
    );
}