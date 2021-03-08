import React, { useState } from 'react';
import { useConnectToSocketOnce } from 'hooks';
import { useRouter } from 'next/router';

export default function Chat() {
  useConnectToSocketOnce();

  const router = useRouter();
  const { chatID } = router.query;

  const [message, setMessage] = useState('');
  const [conversationText, updateConversation] = useState(['Message 1', 'Message 2', 'Message 3']);

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
    conversationText.push(message);
    updateConversation(conversationText);
    setMessage('');
  }

  return (
    <div>
      <h1>Welcome to a Chatroom {chatID}!</h1>
      <div id={"conversation" + { chatID }}>
        {conversationText.map((text) => <p>{text}</p>)}
      </div>
      {messageInput}
      {sendButton}
    </div>
  );
}
