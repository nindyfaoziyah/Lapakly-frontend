import { mockChatService } from '../mocks/mockService'

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true'
const STORAGE_KEY = 'mock_chat_messages'


const getAllMessages = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}


const saveMessages = (messages) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

const chatService = {
  getMessages: async (storeId) => {
    if (IS_MOCK) return mockChatService.getMessages(storeId)

    
    const all = getAllMessages()
    const filtered = all.filter(
      (m) => String(m.store_id) === String(storeId)
    )

    return { messages: filtered }
  },

  sendMessage: async (data) => {
    if (IS_MOCK) return mockChatService.sendMessage(data)


    const all = getAllMessages()

    const newMessage = {
      id: Date.now(),
      store_id: data.store_id,
      text: data.text,
      sender: data.sender,
      created_at: new Date().toISOString(),
    }

    const updated = [...all, newMessage]
    saveMessages(updated)

    return { message: newMessage }
  },
}

export default chatService