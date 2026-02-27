import styles from './Modal.module.css'
import { useEffect } from 'react'

export const MyModal = ({ children, visible, setVisible }) => {
     useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])
  
  const rootClasses = [styles.myModal]
  if (visible) {
    rootClasses.push(styles.active)
  }

  return (
    <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
      <div
        className={styles.myModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
