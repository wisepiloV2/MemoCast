import styles from './SearchInput.module.css'

interface SearchInputProps {
    query : string;
    setQuery : ( query : string ) => void;
    placeholder : string; 
}

export function SearchInput({query, setQuery, placeholder} : SearchInputProps){
    return (
        <input 
            type="text" 
            className={styles.input}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}