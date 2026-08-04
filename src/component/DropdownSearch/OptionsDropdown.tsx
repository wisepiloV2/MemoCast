import './OptionsDropdown.css'
import { useOptionsDropdown } from "./useOptionDropdown";

interface OptionsDropdownProps {
    initialOptions: string[];
    value: string;
    onChange: (value: string) => void;
    allowCreate?: boolean; 
}

export function OptionsDropdown({ 
    initialOptions, 
    value, 
    onChange, 
    allowCreate = false 
}: OptionsDropdownProps) {
    const { 
        search, setSearch, options, showDropdown, setShowDropdown, containerRef 
    } = useOptionsDropdown({ initialOptions });

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue); 
        setShowDropdown(false); 
        setSearch(""); 
    };
  
  const exactMatchExists = initialOptions.some(
      opt => opt.toLowerCase() === search.trim().toLowerCase()
  );

  return (
    <div ref={containerRef} className="dropdown-container">
      
      <input
        type="text"
        className="dropdown-input"
        value={showDropdown ? search : value}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onClick={() => setShowDropdown(true)}
        placeholder={allowCreate ? "Search or create category..." : "Search category..."}
      />

      {showDropdown && (
        <ul className="dropdown-list">
          {options.map((item, index) => (
            <li 
              key={index} 
              className={`dropdown-item ${item === value ? 'selected' : ''}`}
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}

          {allowCreate && search.trim() !== "" && !exactMatchExists && (
             <li 
                className="dropdown-item create-new"
                style={{ color: 'var(--dd-accent)', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => handleSelect(search.trim())}
             >
                + Crear "{search.trim()}"
             </li>
          )}

          {options.length === 0 && (!allowCreate || search.trim() === "") && (
            <li className="dropdown-empty">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}