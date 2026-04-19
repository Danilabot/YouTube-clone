import styles from './Modal.module.css'
import { useEffect, type ReactNode } from 'react'

interface MyModalProps {
  children: ReactNode
  visible: boolean
  setVisible: (visible: boolean) => void
  wide?: boolean
}

export const MyModal = ({ children, visible, setVisible, wide }: MyModalProps) => {
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  return (
    <div
      className={`${styles.myModal}${visible ? ` ${styles.active}` : ''}`}
      onClick={() => setVisible(false)}
    >
      <div
        className={`${styles.myModalContent}${wide ? ` ${styles.wide}` : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
