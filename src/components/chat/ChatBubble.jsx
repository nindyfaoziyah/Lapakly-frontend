import { useAuthContext } from '../../context/AuthContext'
import styles from './ChatBubble.module.css'

const ChatBubble = ({ message }) => {
  const { user } = useAuthContext()
  const isMe = message.sender === user?.role

  return (
    <div
      className={`${styles.bubbleWrapper} ${
        isMe ? styles.right : styles.left
      }`}
    >
      <div
        className={`${styles.bubble} ${
          isMe ? styles.me : styles.other
        }`}
      >
        {message.text}
      </div>
    </div>
  )
}

export default ChatBubble