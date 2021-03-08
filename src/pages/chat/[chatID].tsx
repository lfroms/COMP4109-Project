import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Chat() {

  const router = useRouter();
  const { chatId } = router.query;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { data: 'Message 1' },
    { data: 'Message 2' },
    { data: 'Message 3' },
  ]);

  const messageInput = (
    <input
      id="msgInput"
      type="text"
      onChange={elem => setMessage(elem.currentTarget.value)}
      placeholder="Type a message..."
      value={message}
    />
  );

  const sendButton = <button onClick={sendMessage}>Send</button>;

  function sendMessage() {
    messages.push({ data: message });
    setMessages(messages);
    setMessage('');
  }

  return (
    <div>
      <h1>Welcome to a Chatroom {chatId}!</h1>
      {messages.map((message, index) => (
        <p key={`message-${index}`}>{message.data}</p>
      ))}
      {messageInput}
      {sendButton}
    </div>
  );
}
