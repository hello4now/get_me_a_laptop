// components/Loading.js
import Image from 'next/image';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <Image src="/loading_gif.gif" alt="Loading..." width={100} height={100} />
    </div>
  );
};

export default Loading;
