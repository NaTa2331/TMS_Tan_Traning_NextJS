'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import styles from '@/styles/DashboardUser.module.css';


interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/login');
    }

    fetchUsers();
  }, [session?.user?.id, router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/dashboard/user/api/list');

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Users</h1>
        
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.usersList}>
            {users.map((user) => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    <FaUser className={styles.icon} />
                  </div>
                  <div className={styles.userDetails}>
                    <div className={styles.userName}>
                      <FaUser className={styles.icon} /> {user.name}
                    </div>
                    <div className={styles.userEmail}>
                      <FaEnvelope className={styles.icon} /> {user.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}