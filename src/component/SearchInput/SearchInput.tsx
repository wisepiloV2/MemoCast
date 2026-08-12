import styles from './SearchInput.module.css';

interface SearchInputProps {
    query: string;
    setQuery: (query: string) => void;
    placeholder: string; 
    onFocus?: () => void; 
}

export function SearchInput({ query, setQuery, placeholder, onFocus }: SearchInputProps) {
  return (
    <input 
      type="text" 
      className={styles.input}
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={onFocus} 
    />
  );
}
