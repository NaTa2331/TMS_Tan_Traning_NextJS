'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingPage from './loading';
import styles from '@/styles/ListItem.module.css';
import { FaBoxOpen, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast'; 

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

type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
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

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchTerm = searchParams.get('search') || '';
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleApiError = (error: string) => {
    toast.error(error);
    setIsLoading(false);
  };

  const loadItems = useCallback(async (page: number, search?: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', itemsPerPage.toString());
      if (search) params.set('search', search);
  
      // Parallel fetching with error handling
      const [itemsRes, usersRes] = await Promise.all([
        fetch(`/api/listitem?${params.toString()}`),
        fetch(`/api/users`)
      ]);

      if (!itemsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const itemsData: ApiResponse<Item[]> = await itemsRes.json();
      const usersData: ApiResponse<User[]> = await usersRes.json();

      if (!itemsData.success || !usersData.success) {
        throw new Error(itemsData.error || usersData.error || 'Failed to fetch data');
      }

      setItems(itemsData.data || []);
      setUsers(usersData.data || []);
      const total = itemsRes.headers.get('X-Total-Count');
      setTotalItems(total ? parseInt(total) : 0);

      // Update URL
      router.push(`?${params.toString()}`);
    } catch (err) {
      handleApiError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage, router]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      if (!newTitle.trim() || !newDesc.trim()) {
        throw new Error('Title and description are required');
      }

      const response = await fetch('/api/listitem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          userId: users[0]?.id // Assuming first user as default
        }),
      });

      const result: ApiResponse<Item> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create item');
      }

      setNewTitle('');
      setNewDesc('');
      loadItems(currentPage, searchTerm);
      toast.success('Item created successfully');
    } catch (err) {
      handleApiError(err instanceof Error ? err.message : 'Failed to create item');
    }
  };

  const handleUpdateItem = async (item: Item) => {
    try {
      setIsLoading(true);

      if (!item.title.trim() || !item.description.trim()) {
        throw new Error('Title and description are required');
      }

      const response = await fetch('/api/listitem', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      const result: ApiResponse<Item> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update item');
      }

      setEditingItem(null);
      loadItems(currentPage, searchTerm);
      toast.success('Item updated successfully');
    } catch (err) {
      handleApiError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/listitem?id=${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<null> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete item');
      }

      loadItems(currentPage, searchTerm);
      toast.success('Item deleted successfully');
    } catch (err) {
      handleApiError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  useEffect(() => {
    loadItems(currentPage);
    setLocalSearchTerm(searchTerm);
  }, [currentPage, loadItems, searchTerm]);

  return (
    <div className={styles.container}>
      {/* Render loading page if data is being fetched */}
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Search items..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              disabled={isLoading}
            />
            <button onClick={() => loadItems(1, localSearchTerm)} disabled={isLoading}>
              <FaSearch />
            </button>
          </div>

          <h1 className={styles.heading}>📦 List of Items</h1>
          <div className={styles.formSection}>
            <input style={{margin: '10px'}}
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input style={{margin: '10px'}}
              type="text"
              placeholder="Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <button style={{margin: '10px', backgroundColor: '#4CAF50', color: 'white' }}
              onClick={handleCreateItem}
            >
              Add Item
            </button>
          </div>

          <div className={`${styles.grid} ${items.length === 1 ? styles['single-item'] : ''}`}>
            {items.map(item => (
              <div key={item.id} className={styles.card}>
                {editingItem?.id === item.id ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    />
                    <div className={styles.editButtons}>
                      <button onClick={() => handleUpdateItem(editingItem)}>Save</button>
                      <button onClick={() => setEditingItem(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.iconWrapper}>
                      <FaBoxOpen className={styles.icon} />
                    </div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDesc}>{item.description}</p>
                    <p className={styles.cardUser}>
                      👤 Creator: {users.find(user => user.id === item.userId)?.name || 'Unknown User'}
                    </p>
                    <div className={styles.actionButtons}>
                      <div>
                        <button
                          onClick={() => setEditingItem(item)}
                          className={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
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
        </>
      )}
    </div>
  );
}