'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/styles/ListItem.module.css';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get('searchTerm') || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(`/listitem?searchTerm=${input}&page=1`);
    }, 500);
  
    return () => clearTimeout(timeout);
  }, [input, router]);

  return (
    <input
      type="text"
      placeholder="Search items..."
      value={input}
      className={styles.searchInput}
      onChange={(e) => setInput(e.target.value)}
    />
  );
}
