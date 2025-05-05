'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import RegisterForm from './RegisterForm';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
      callbackUrl: '/'
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleGoogleSignIn = () => signIn('google', { callbackUrl: '/' });
  const handleGitHubSignIn = () => signIn('github', { callbackUrl: '/' });

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '2rem',
        borderRadius: '12px',
        background: '#ffffff',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}
    >
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
        Đăng nhập
      </h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            placeholder="Nhập email"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Mật khẩu:
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            minLength={6}
            placeholder="Nhập mật khẩu"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={handleRegister}
            style={{
              color: '#0070f3',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Đăng ký
          </button>
        </p>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
        >
          Đăng nhập
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            background: '#fff',
            color: '#000',
            border: '1px solid #ddd',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: '20px', height: '20px' }}
          />
          Đăng nhập bằng Google
        </button>

        <button
          type="button"
          onClick={handleGitHubSignIn}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            background: '#fff',
            color: '#000',
            border: '1px solid #ddd',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub"
            style={{ width: '20px', height: '20px' }}
          />
          Đăng nhập bằng GitHub
        </button>
      </form>
    </div>
  );
}
