'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/ListItem.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchTerm: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  searchTerm,
}: PaginationProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/listitem?searchTerm=${searchTerm}&page=${page}`);
  };

  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          disabled={currentPage === index + 1}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
