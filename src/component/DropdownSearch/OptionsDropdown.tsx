import './OptionsDropdown.css'
import { useOptionsDropdown } from "./useOptionDropdown";

interface OptionsDropdownProps {
    initialOptions: string[];
    value: string;
    onChange: (value: string) => void;
}

export function OptionsDropdown({ initialOptions, value, onChange }: OptionsDropdownProps) {
    const { 
        search, setSearch, options, showDropdown, setShowDropdown, containerRef 
    } = useOptionsDropdown({ initialOptions });

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue); 
        setShowDropdown(false); 
        setSearch(""); 
    };
  
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
        placeholder="Buscar opción..."
      />

      {showDropdown && (
        <ul className="dropdown-list">
          {options.length === 0 && (
            <li className="dropdown-empty">No se encontraron resultados</li>
          )}
          
          {options.map((item, index) => (
            <li 
              key={index} 
              className={`dropdown-item ${item === value ? 'selected' : ''}`}
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}