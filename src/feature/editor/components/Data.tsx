import './Data.css'; 
import { OptionsDropdown } from "../../../component/DropdownSearch/OptionsDropdown";

interface DataProps {
    title: string;
    onTitleChange: (title: string) => void;
    category: string;
    categories: string[];
    onCategoryChange: (category: string) => void;
}

export function Data({ title, onTitleChange, category, onCategoryChange, categories }: DataProps) {

    return (
        <>
            <div className="data-section-group">
                <label className="data-section-label">Title</label>
                <input 
                    type="text" 
                    className="data-section-input"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Enter a title..."
                />
            </div>
            
            <div className="data-section-group">
                <label className="data-section-label">Category</label>
                <OptionsDropdown 
                    initialOptions={categories}
                    value={category}
                    onChange={onCategoryChange}
                    allowCreate={true}
                />
            </div>
        </>
    );
}