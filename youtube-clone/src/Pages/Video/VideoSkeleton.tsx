import styles from './VideoSkeleton.module.css'

export const VideoSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail} />
      <div className={styles.info}>
        <div className={styles.avatar} />
        <div className={styles.details}>
          <div className={styles.title} />
          <div className={styles.channel} />
          <div className={styles.stats} />
        </div>
      </div>
    </div>
  )
}