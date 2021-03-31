import { useEffect, useRef, useState } from 'react';
import { SocketEvent, StorageKey } from 'types';
import { useAuthenticatedFetch, useKeyStore, useSocketContext, useUserSession } from 'hooks';
import {
  AsymmetricEncryptionService,
  MessageAuthenticationService,
  PrivateKeyTransportService,
  SymmetricEncryptionService,
} from 'services';

export default function useConversation(conversationId: string) {
  const socket = useSocketContext();
  const [messages, setMessages] = useState<DecryptedMessagePayload[]>([]);
  const [encryptedMessages, setEncryptedMessages] = useState<EncryptedMessagePayload[]>([]);
  const [participants, setParticipants] = useState<API.User[]>([]);
  const { userId } = useUserSession();
  const authenticatedFetch = useAuthenticatedFetch();
  const symmetricEncryptionServiceRef = useRef<SymmetricEncryptionService>();
  const messageAuthenticationServiceRef = useRef<MessageAuthenticationService>();
  const { value: privateKey } = useKeyStore(StorageKey.PRIVATE_KEY);
  const [sharedSecret, setSharedSecret] = useState<string | undefined>();

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    socket.on(SocketEvent.MESSAGE, async (message: EncryptedMessagePayload) => {
      if (!symmetricEncryptionServiceRef.current) {
        return;
      }

      // Don't display messages from other conversations.
      if (message.conversationId !== parseInt(conversationId)) {
        return;
      }

      setEncryptedMessages(previousMessages => [...previousMessages, message]);

      const decryptedMessage: DecryptedMessagePayload = {
        ...message,
        verified: await messageAuthenticationServiceRef.current?.verify(
          message.hmac,
          message.data.m
        ),
        text: await symmetricEncryptionServiceRef.current.decrypt(message.data),
      };

      setMessages(previousMessages => [...previousMessages, decryptedMessage]);
    });

    return () => {
      socket.removeListener(SocketEvent.MESSAGE);
    };
  }, [conversationId]);

  async function fetchPersonalConversationKey() {
    const response = await authenticatedFetch<API.PersonalConversationKeyResponse>(
      `/api/personal-conversation-key?userId=${userId}&conversationId=${conversationId}`,
      'GET'
    );

    if (!response.data?.personalConversationKey) {
      console.error('Could not fetch personal conversation key for this conversation.');

      return;
    }

    const { personalConversationKey, hmacKey } = response.data;

    const importedPrivateKey = await PrivateKeyTransportService.createCryptoKeyFromPem(privateKey);
    const asymmetricService = new AsymmetricEncryptionService();

    const decryptedSymmetricKey = await asymmetricService.decrypt(
      personalConversationKey,
      importedPrivateKey
    );
    const decryptedHmacKey = await asymmetricService.decrypt(hmacKey, importedPrivateKey);

    const sharedSecretAsCryptoKey = await SymmetricEncryptionService.createCryptoKeyFromString(
      decryptedSymmetricKey
    );
    const hmacAsCryptoKey = await MessageAuthenticationService.createCryptoKeyFromString(
      decryptedHmacKey
    );

    setSharedSecret(decryptedSymmetricKey);

    symmetricEncryptionServiceRef.current = new SymmetricEncryptionService(sharedSecretAsCryptoKey);
    messageAuthenticationServiceRef.current = new MessageAuthenticationService(hmacAsCryptoKey);
  }

  async function fetchMessages() {
    const response = await authenticatedFetch<API.MessagesResponse>(
      `/api/messages?conversationId=${conversationId}`,
      'GET'
    );

    if (!response.data) {
      return;
    }

    setEncryptedMessages(response.data.messages);

    const decryptedMessageList = response.data.messages.map(async message => {
      if (
        !symmetricEncryptionServiceRef.current ||
        !messageAuthenticationServiceRef.current ||
        !userId
      ) {
        return;
      }

      const decryptedMessage: DecryptedMessagePayload = {
        id: message.id,
        senderId: message.senderId,
        verified: await messageAuthenticationServiceRef.current.verify(
          message.hmac,
          message.data.m
        ),
        text: await symmetricEncryptionServiceRef.current.decrypt(message.data),
      };

      return decryptedMessage;
    });

    const decryptedMessages = await Promise.all(decryptedMessageList);

    setMessages(decryptedMessages.filter(Boolean) as DecryptedMessagePayload[]);
  }

  async function fetchParticipants() {
    const response = await authenticatedFetch<API.ConversationResponse>(
      `/api/conversations/${conversationId}`,
      'GET'
    );

    setParticipants(response.data?.conversation.participants ?? []);
  }

  async function fetchData() {
    if (!conversationId) {
      return;
    }

    setMessages([]);
    fetchParticipants();
    await fetchPersonalConversationKey();
    await fetchMessages();
  }

  useEffect(() => {
    fetchData();
  }, [conversationId]);

  async function sendMessage(message: DecryptedMessagePayload) {
    if (!symmetricEncryptionServiceRef.current) {
      console.warn('Message not sent because symmetric encryption service was not yet configured.');

      return;
    }

    if (!messageAuthenticationServiceRef.current) {
      console.warn(
        'Message not sent because Message Authentication service was not yet configured.'
      );

      return;
    }
    const data = await symmetricEncryptionServiceRef.current.encrypt(message.text);
    const encryptedMessage: EncryptedMessagePayload = {
      senderId: message.senderId,
      data,
      hmac: await messageAuthenticationServiceRef.current.sign(data.m),
      conversationId: parseInt(conversationId),
    };

    socket.emit(SocketEvent.MESSAGE, encryptedMessage);
  }

  return { messages, encryptedMessages, sendMessage, sharedSecret, participants };
}
