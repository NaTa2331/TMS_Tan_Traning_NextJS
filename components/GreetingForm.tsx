// /components/GreetingForm.tsx

'use client';

import { SetStateAction, useState } from 'react';
import styles from '../styles/GreetingForm.module.css'; 
import { useRouter } from 'next/navigation';

function GreetingForm() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);
  const router = useRouter();
  function handleChange(e: { target: { value: SetStateAction<string>; }; }) {
    setName(e.target.value);
  }

  function handleGreet() {
    if (name.trim() !== '') {
      setGreeting(`Hello, ${name}! Have a good day!`);
      setHasGreeted(true)
    } else {
      setGreeting('Please input your name before start!');
      setHasGreeted(false)
    }
  }

  function handleSkip() {
    router.push('/login');
  }

  return (
    <div className={styles.formBox}>
      <h1 className={styles.title}>Welcome to TMS 💻</h1>
      <p>Enter your name to start</p>

      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Enter your name..."
        className={styles['input-box']}
      />

      <button onClick={handleGreet} className={styles['greet-button']}>
        Hiii!
      </button>

      {greeting && (
        <div>
          <p className={styles['greeting-text']}>{greeting}</p>
          {hasGreeted && (
            <button onClick={handleSkip} className={styles['skip-button']}>
              Skip to Next Screen
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default GreetingForm;
