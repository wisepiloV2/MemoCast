import { useEffect, useState } from 'react';
import { MainLayout } from '../../component/layout/MainLayout';
import { SearchInput } from '../../component/SearchInput/SearchInput';
import { CategoryCard } from '../../feature/category';
import { useSearchCategory } from '../../feature/category/hook/useSearchCategory';
import styles from './CategoriesPage.module.css';
import { Button } from '../../component/Button/Button';
import { useNavigate } from 'react-router-dom';

const IconBack = () => (
  <svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export function CategoriesPage() {
  const {
    results,
    isLoading,
    searchCategory,
  } = useSearchCategory();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    searchCategory(query);
  }, [query, searchCategory]);

  const refreshCategories = () => {
    searchCategory(query);
  };

  return (
    <MainLayout>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className={styles.backButton}
          >
            <IconBack />
          </Button>

          <div>
            <h1 className={styles.title}>My Categories</h1>
            <p className={styles.subtitle}>
              Manage your categories
            </p>
          </div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <SearchInput
          query={query}
          setQuery={setQuery}
          placeholder="Search category..."
        />
      </div>

      <div className={styles.listContainer}>
        {isLoading ? (
          <p className={styles.emptyState}>
            Loading categories...
          </p>
        ) : results.length === 0 ? (
          <p className={styles.emptyState}>
            No categories found.
          </p>
        ) : (
          results.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id!}
              category={cat.name}
              onCategoryChange={refreshCategories}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}
