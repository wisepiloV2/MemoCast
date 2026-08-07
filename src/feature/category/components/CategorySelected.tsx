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
      />

      {isOpen && query.trim() !== "" && (
        <ul className={styles.dropdown}>
          {isLoading && <li className={styles.itemLoading}>Buscando...</li>}

          {!isLoading && results.map((cat) => (
            <li 
              key={cat.id} 
              onClick={() => handleSelect(cat.name)}
              className={styles.item}
            >
              {cat.name}
            </li>
          ))}

          {!isLoading && !exactMatchExists && (
            <li 
              onClick={handleCreateNew}
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