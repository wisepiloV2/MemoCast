import { SearchInput } from "../../../component/SearchInput/SearchInput";
import { useCategorySelected } from "../hook/useCategorySelected";
import styles from "./CategorySelected.module.css";

interface CategorySelectedProps {
  value: string;
  onChange: (categoryName: string) => void;
}

export function CategorySelected({ value, onChange }: CategorySelectedProps) {
  const {
    query, setQuery,
    isOpen, setIsOpen,
    results,
    isLoading,
    isSaving,
    exactMatchExists,
    handleSelect,
    handleCreateNew,
  } = useCategorySelected({ value, onChange });

  return (
    <div className={styles.container}>
      <SearchInput
        placeholder="Search or create a category..."
        query={query}
        setQuery={(newQuery) => {
          setQuery(newQuery);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <ul className={styles.dropdown}>
          {isLoading && <li className={styles.itemLoading}>Searching...</li>}

          {!isLoading && results.map((cat) => (
            <li 
              key={cat.id} 
              onClick={() => {
                handleSelect(cat.name);
                setIsOpen(false); 
              }}
              className={styles.item}
            >
              {cat.name}
            </li>
          ))}

          {!isLoading && query.trim() !== "" && !exactMatchExists && (
            <li 
              onClick={() => {
                handleCreateNew();
                setIsOpen(false);
              }}
              className={`${styles.item} ${styles.itemCreate}`}
            >
              {isSaving ? "Creating..." : `+ Create new category "${query}"`}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}