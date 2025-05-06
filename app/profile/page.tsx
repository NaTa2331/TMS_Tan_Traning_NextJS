'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaList, FaGithub, FaGoogle, FaPen, FaLock } from 'react-icons/fa';
import styles from '@/styles/Profile.module.css';
import { toast } from 'react-hot-toast';

interface Item {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/login');
    }
  }, [session?.user?.id, router]);

  useEffect(() => {
    fetchUserData();
    fetchItems();
  }, [session?.user?.id]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.data);
      setNewName(data.data.name);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/listitem', {
        headers: {
          'Authorization': 'Bearer ' + session?.user?.id
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to fetch items');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(user?.name || '');
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session?.user?.id
        },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      const data = await response.json();
      setUser(data.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => {
    setIsChangingPassword(true);
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (session.user?.image?.includes('github') || session.user?.image?.includes('google')) {
      toast.error('Password change is not allowed for OAuth accounts');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session?.user?.id
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }

      toast.success('Password updated successfully');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          <img
            src={user?.image || session.user?.image || '/default-avatar.png'}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.info}>
          {isEditing ? (
            <div className={styles.editForm}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
                className={styles.nameInput}
              />
              <div className={styles.editButtons}>
                <button onClick={handleCancel} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button onClick={handleUpdate} className={styles.saveBtn}>
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.nameContainer}>
                <h1 className={styles.name}>
                  {user?.name || session.user?.name || 'User'}
                </h1>
                <FaUser className={styles.icon} />
              </div>
              
              <button onClick={handleEdit} className={styles.editBtn}>
                <FaPen className={styles.icon} /> Edit Profile
              </button>
              
              {!session.user?.image?.includes('github') && !session.user?.image?.includes('google') && (
                <button onClick={handlePasswordChange} className={styles.passwordBtn}>
                  <FaLock className={styles.icon} /> Change Password
                </button>
              )}
              
              <p className={styles.email}>{user?.email}</p>
              
              {isChangingPassword && (
                <div className={styles.passwordForm}>
                  <div className={styles.passwordField}>
                    <label htmlFor="currentPassword" className={styles.label}>Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={styles.passwordInput}
                      required
                    />
                  </div>
                  
                  <div className={styles.passwordField}>
                    <label htmlFor="newPassword" className={styles.label}>New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.passwordInput}
                      required
                    />
                  </div>
                  
                  <div className={styles.passwordField}>
                    <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.passwordInput}
                      required
                    />
                  </div>
                  
                  <div className={styles.passwordButtons}>
                    <button onClick={handlePasswordCancel} className={styles.cancelBtn}>
                      Cancel
                    </button>
                    <button onClick={handlePasswordUpdate} className={styles.saveBtn}>
                      Save
                    </button>
                  </div>
                </div>
              )}
              
              <div className={styles.providerInfo}>
                {session.user?.image?.includes('github') && (
                  <div className={styles.providerIcon}>
                    <FaGithub /> GitHub
                  </div>
                )}
                {session.user?.image?.includes('google') && (
                  <div className={styles.providerIcon}>
                    <FaGoogle /> Google
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <FaList className={styles.statIcon} />
          <h3>Total Items</h3>
          <p>{items.length}</p>
        </div>
      </div>

      <div className={styles.itemsSection}>
        <h2>My Items</h2>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.itemsGrid}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <small>
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}