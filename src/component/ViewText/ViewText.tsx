import './ViewText.css';

interface ViewTextProps {
    title: string;
    category: string;
    htmlText: string;
}

export function ViewText({ title, category, htmlText }: ViewTextProps) {
    return (
        <div className="text-view-container">
            <h1 className="text-view-title">{title || 'Sin título'}</h1>
            <h4 className="text-view-category">{category || 'Sin categoría'}</h4>
            <div 
                className="text-view-content"
                dangerouslySetInnerHTML={{ __html: htmlText }}
            />
        </div>
    );
}