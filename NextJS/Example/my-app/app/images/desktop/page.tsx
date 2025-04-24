import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/NextScreen.module.css';

export default function DesktopImagePage() {
  return (
    <div className={styles.container}>
      <h1>Desktop Image View</h1>
      
      <div className={styles.imageContainer}>
        <Image
          className={styles.desktopImage}
          src="/desktop.jpg"
          alt="Desktop Banner"
          width={1200}
          height={400}
        />
      </div>

      <Link href="/images" className={styles.backButton}>
        Back to Images
      </Link>
    </div>
  );
}