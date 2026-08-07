import './Data.css'; 
import { CategorySelected } from '../../category';

interface DataProps {
    title: string;
    onTitleChange: (title: string) => void;
    category: string;
    onCategoryChange: (category: string) => void;
}

export function Data({ title, onTitleChange, category, onCategoryChange }: DataProps) {

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
                <CategorySelected 
                    value={category}
                    onChange={(selectedCategory) => onCategoryChange(selectedCategory)}
                />
            </div>
        </>
    );
}