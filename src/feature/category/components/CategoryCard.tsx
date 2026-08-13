import { Link } from 'react-router-dom';
import { Modal } from '../../../component/Modal/Modal';
import { Button } from '../../../component/Button/Button';
import styles from './CategoryCard.module.css';
import { useCategoryCard } from '../hook/useCategoryCard';

interface CategoryCardProps {
  id: number;
  category: string;
  onCategoryChange?: () => void;
}

export function CategoryCard({ id, category, onCategoryChange }: CategoryCardProps) {
  const {
    isModalOpen,
    modalView,
    setModalView,
    categoryName,
    setCategoryName,
    isLoading,
    openModal,
    closeModal,
    handleUpdate,
    handleDelete,
  } = useCategoryCard(id, category, onCategoryChange);

  return (
    <>
      <div className={styles.categoryCardWrapper}>
        <Link
          to={`/documents/${category}`}
          className={styles.categoryCardLink}
        >
          <h3 className={styles.categoryCardTitle}>{category}</h3>
        </Link>

        <Button
          variant="ghost"
          className={styles.categoryCardOptionsBtn}
          onClick={openModal}
        >
          ⋮
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalView === 'options' && (
          <>
            <h2 className={styles.optionsModalTitle}>
              Category Options
            </h2>

            <div className={styles.optionsModalActions}>
              <Button
                variant="primary"
                onClick={() => setModalView('edit')}
              >
                Change Name
              </Button>

              <Button
                variant="danger"
                onClick={() => setModalView('delete')}
              >
                Delete Category
              </Button>
            </div>
          </>
        )}

        {modalView === 'edit' && (
          <>
            <h2 className={styles.optionsModalTitle}>
              Edit Category Name
            </h2>

            <form
              className={styles.optionsModalActions}
              onSubmit={handleUpdate}
            >
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className={styles.categoryInput}
                autoFocus
                placeholder="Category name"
                disabled={isLoading}
              />

              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                variant="secondary"
                type="button"
                onClick={() => setModalView('options')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </form>
          </>
        )}

        {modalView === 'delete' && (
          <>
            <h2 className={styles.optionsModalTitle}>
              Delete Category?
            </h2>

            <p className={styles.confirmText}>
              Are you sure you want to delete the category{' '}
              <strong>"{category}"</strong>? This action cannot be undone
              and deletes all documents in this category.
            </p>

            <div className={styles.optionsModalActions}>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Yes, delete it'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => setModalView('options')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
