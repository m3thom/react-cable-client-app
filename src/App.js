import { useEffect, useState } from "react";
import { createConsumer } from "@rails/actioncable"
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    let actionCableRef

    const initSocket = () => {
      // Default to Rails action cable.
      // actionCableRef = createConsumer('ws://localhost:3000/cable')
      // Default to anycable.
      actionCableRef = createConsumer('ws://localhost:8080/cable')
      actionCableRef.subscriptions.create(
        { channel: 'MessagesChannel' },
        {
          received: message => {
            setMessages((messages) => [...messages, message])
          }
        }
      )
    }

    initSocket()

    return () => actionCableRef?.disconnect()
  }, [])

  useEffect(() => {
    const fetchMessages = () => {
      fetch('http://localhost:3000/messages')
        .then(res => res.json())
        .then(messages => setMessages(messages))
    }
    fetchMessages()
  }, [])

  const handleMessageSubmit = async () => {
    const messageObj = {
      message: {
        content: input
      }
    }
    const fetchObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageObj)
    }
    await fetch('http://localhost:3000/messages', fetchObj)

    setInput('')
  }

  return (
    <div className="App">
      <h2>Messages</h2>
      <ul>
        {
          messages.map((message, i) =>
            <li key={i}>{message.content}</li>)
        }
      </ul>

      <input
        value={input}
        placeholder="Enter Message"
        onChange={e => setInput(e.target.value)}
      />

      <button onClick={handleMessageSubmit}>
        Submit
      </button>
    </div>
  );
}

export default App;
