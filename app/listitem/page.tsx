'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import styles from '@/styles/ListItem.module.css';
import { FaBoxOpen, FaSearch } from 'react-icons/fa';

type Item = {
  id: number;
  title: string;
  description: string;
  userId: number;
};

type User = {
  id: number;
  name: string;
};

export default function ListItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 9;
  let debounceTimer: NodeJS.Timeout;

  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchTerm = searchParams.get('search') || '';
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const loadItems = async (page: number, search?: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', itemsPerPage.toString());
      if (search) params.set('search', search);

      const itemsRes = await fetch(`/api/listitem?${params.toString()}`);

      if (!itemsRes.ok) {
        const errorData = await itemsRes.json();
        throw new Error(errorData.error || 'Failed to fetch items');
      }

      const itemsData = await itemsRes.json();
      setItems(itemsData.items);
      setTotalItems(Number(itemsRes.headers.get('X-Total-Count') || 0));
      
      // Update URL
      router.push(`?${params.toString()}`);
    } catch (error) {
      console.error('Error loading items:', error);
      setItems([]);
      setTotalItems(0);
      alert('Failed to load items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    debounceTimer = setTimeout(() => {
      loadItems(1, newSearchTerm);
    }, 500);
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch('/api/listitem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTitle, 
          description: newDesc,
          userId: users[0]?.id // Use first user's ID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }

      setNewTitle('');
      setNewDesc('');
      loadItems(1, searchTerm);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  useEffect(() => {
    loadItems(currentPage, searchTerm);
  }, [currentPage, searchTerm, router]);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={isLoading}
        />
        <button onClick={() => loadItems(1, searchTerm)} disabled={isLoading}>
          <FaSearch />
        </button>
      </div>

      <h1 className={styles.heading}>📦 List of Items</h1>
      <div className={styles.formSection}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <button
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </div>

      <div className={`${styles.grid} ${items.length === 1 ? styles['single-item'] : ''}`}>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          items.map(item => (
            <div key={item.id} className={styles.card}>
              <div className={styles.iconWrapper}>
                <FaBoxOpen className={styles.icon} />
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>

              {/* <div className={styles.usersSection}>
                <h3>User</h3>
                <ul>
                  {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                  ))}
                </ul>
              </div> */}

              {/* Thêm hai nút Edit và Delete ở đây */}
              <div className={styles.actionButtons}>
                <button
                  onClick={() => setEditingItem(item)}
                  className={styles.editBtn}
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    await fetch(`/api/listitem?id=${item.id}`, {
                      method: 'DELETE',
                    });
                    loadItems(currentPage, searchTerm);
                  }}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => loadItems(Math.max(1, currentPage - 1), searchTerm)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => loadItems(Math.min(totalPages, currentPage + 1), searchTerm)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
