import React, { useState } from 'react';
import { useConnectToSocketOnce } from 'hooks';
import { useRouter } from 'next/router';

export default function Chat() {
  useConnectToSocketOnce();

  const router = useRouter();
  const { chatID } = router.query;

  const [count, setCount] = useState(3);
  const [message, setMessage] = useState('');
  const [conversationText, updateConversation] = useState([
    { id: 1, data: 'Message 1' },
    { id: 2, data: 'Message 2' },
    { id: 3, data: 'Message 3' }
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
    conversationText.push({ id: count, data: message });
    updateConversation(conversationText);
    setMessage('');
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Welcome to a Chatroom {chatID}!</h1>
      <div id={'conversation' + { chatID }}>
        {conversationText.map(text => (
          <p key={text.id}>{text.data}</p>
        ))}
      </div>
      {messageInput}
      {sendButton}
    </div>
  );
}
