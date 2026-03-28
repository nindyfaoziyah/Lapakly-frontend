import { useState } from 'react'
import styles from './ChatInput.module.css'

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <div className={styles.container}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ketik pesan..."
        className={styles.input}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend()
        }}
      />
      <button onClick={handleSend} className={styles.button}>
        Kirim
      </button>
    </div>
  )
}

export default ChatInput