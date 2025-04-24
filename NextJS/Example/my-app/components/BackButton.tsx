// components/BackButton.tsx
import Link from 'next/link';
import styles from '@/styles/BackButton.module.css';

interface BackButtonProps {
  href: string;
  text?: string;
}

export default function BackButton({ href, text = 'Back' }: BackButtonProps) {
  return (
    <Link href={href} className={styles.backButton}>
      {text}
    </Link>
  );
}