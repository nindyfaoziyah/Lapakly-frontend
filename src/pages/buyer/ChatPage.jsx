import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import chatService from '../../services/chat.service'
import { useAuthContext } from '../../context/AuthContext'
import styles from './ChatPage.module.css'
import toast from 'react-hot-toast'
import ChatBubble from '../../components/chat/ChatBubble'
import ChatInput from '../../components/chat/ChatInput'

const ChatPage = () => {
    const { user } = useAuthContext()
    const location = useLocation()
    const navigate = useNavigate()

    const urlStoreId = new URLSearchParams(location.search).get('store')
    const storeId = urlStoreId || 'umum'

    const [messages, setMessages] = useState([])
    const [prevCount, setPrevCount] = useState(0)

    const bottomRef = useRef(null)

    const fetchMessages = async () => {
        if (!storeId) return

        const res = await chatService.getMessages(storeId)
        const newMessages = res.messages || []

        if (newMessages.length > prevCount) {
            const lastMsg = newMessages[newMessages.length - 1]
            if (lastMsg?.sender !== user?.role) {
                toast.success(`💬 ${lastMsg.text}`)
            }
        }

        setPrevCount(newMessages.length)
        setMessages(newMessages)
    }

    useEffect(() => {
        fetchMessages()

        const interval = setInterval(fetchMessages, 2000)
        return () => clearInterval(interval)
    }, [storeId])

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'mock_chat_messages') {
                fetchMessages()
            }
        }

        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [storeId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (textToSend) => {
        if (!textToSend.trim()) return

        await chatService.sendMessage({
            store_id: storeId,
            text: textToSend,
            sender: user?.role || 'buyer',
        })

        fetchMessages()
    }

    const contacts = [
        { id: 'umum', name: 'Toko Umum', preview: 'Halo kak, barang ready?' },
        { id: '1', name: 'Toko Baju Indah', preview: 'Pesanan sudah dikirim' },
        { id: '2', name: 'Kedai Pak Budi', preview: 'Sama-sama kak.' },
        { id: '3', name: 'Elektronik Murah', preview: 'Barang garansi resmi ya.' },
    ]

    return (
        <div className={styles.page}>
            <div className={styles.desktopLayout}>
                <div className={styles.desktopMain}>
                    
                    {/* SIDEBAR DAFTAR CHAT (HANYA DESKTOP) */}
                    <div className={styles.sidebar}>
                        <div className={styles.sidebarTitle}>💬 Daftar Pesan</div>
                        <div className={styles.contactList}>
                            {contacts.map(contact => (
                                <div 
                                    key={contact.id} 
                                    className={`${styles.contactItem} ${storeId === contact.id ? styles.active : ''}`}
                                    onClick={() => navigate(`/chat?store=${contact.id}`)}
                                >
                                    <div className={styles.contactAvatar}>
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div className={styles.contactInfo}>
                                        <div className={styles.contactName}>{contact.name}</div>
                                        <div className={styles.contactPreview}>{contact.preview}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AREA CHAT UTAMA */}
                    <div className={styles.chatArea}>
                        <div className={styles.header}>
                            Kamar Obrolan: Toko {storeId}
                        </div>

                        <div className={styles.chatContainer}>
                            {messages.length === 0 ? (
                                <p className={styles.empty}>Belum ada pesan di ruang ini</p>
                            ) : (
                                messages.map((m) => (
                                    <ChatBubble key={m.id} message={m} />
                                ))
                            )}

                            {/* anchor scroll */}
                            <div ref={bottomRef} />
                        </div>

                        <ChatInput onSend={handleSend} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ChatPage