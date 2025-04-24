import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/NextScreen.module.css';

export default function MobileImagePage() {
  return (
    <div className={styles.container}>
      <h1>Mobile Image View</h1>
      
      <div className={styles.imageContainer}>
        <Image
          className={styles.mobileImage}
          src="/mobile.jpg"
          alt="Mobile Banner"
          width={400}
          height={300}
        />
      </div>

      <Link href="/images" className={styles.backButton}>
        Back to Images
      </Link>
    </div>
  );
}