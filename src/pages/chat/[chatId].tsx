import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSendMessage } from 'hooks';

export default function Chat() {
  const router = useRouter();
  const { chatId } = router.query;
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([
    { data: 'Message 1' },
    { data: 'Message 2' },
    { data: 'Message 3' },
  ]);
  const [sendNewMessage] = useSendMessage();

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
    const messageContent = { room: chatId, message: message };
    messages.push({ data: message });
    setMessages(messages);
    sendNewMessage(messageContent);
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
