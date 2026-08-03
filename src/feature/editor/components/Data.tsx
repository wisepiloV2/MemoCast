import './Data.css'; 
import { OptionsDropdown } from "../../../component/DropdownSearch/OptionsDropdown";

interface DataProps {
    title: string;
    onTitleChange: (title: string) => void;
    categoria: string;
    categorias: string[];
    onCategoriaChange: (categoria: string) => void;
}

export function Data({ title, onTitleChange, categoria, onCategoriaChange, categorias }: DataProps) {

    return (
        <>
            <div className="data-section-group">
                <label className="data-section-label">Título</label>
                <input 
                    type="text" 
                    className="data-section-input"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Ingresa un título..."
                />
            </div>
            
            <div className="data-section-group">
                <label className="data-section-label">Categoría</label>
                <OptionsDropdown 
                    initialOptions={categorias}
                    value={categoria}
                    onChange={onCategoriaChange}
                />
            </div>
        </>
    );
}