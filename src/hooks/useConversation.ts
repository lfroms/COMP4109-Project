import { useEffect, useRef, useState } from 'react';
import { SocketEvent, StorageKey } from 'types';
import { useKeyStore, useSocketContext, useUserSession } from 'hooks';
import {
  AsymmetricEncryptionService,
  PrivateKeyTransportService,
  SymmetricEncryptionService,
} from 'services';
import messageAuthenticationService from '../services/messageAuthenticationService.';

export default function useConversation(
  conversationId: string
): [DecryptedMessagePayload[], (m: DecryptedMessagePayload) => void] {
  const socket = useSocketContext();
  const [messages, setMessages] = useState<DecryptedMessagePayload[]>([]);
  const { userId } = useUserSession();
  const symmetricEncryptionServiceRef = useRef<SymmetricEncryptionService>();
  const messageAuthenticationServiceRef = useRef<messageAuthenticationService>();
  const { value: privateKey } = useKeyStore(StorageKey.PRIVATE_KEY);

  useEffect(() => {
    socket.on(SocketEvent.MESSAGE, async (message: EncryptedMessagePayload) => {
      if (!symmetricEncryptionServiceRef.current) {
        return;
      }
      const decryptedMessage: DecryptedMessagePayload = {
        ...message,
        verified: await messageAuthenticationServiceRef.current?.verify(
          message.mac,
          message.data.m
        ),
        text: await symmetricEncryptionServiceRef.current.decrypt(message.data),
      };

      setMessages(previousMessages => [...previousMessages, decryptedMessage]);
    });
  }, []);

  async function fetchPersonalConversationKey() {
    const response = await fetch(
      `/api/personal-conversation-key?userId=${userId}&conversationId=${conversationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const jsonResponse = (await response.json()) as API.JSONResponse<API.PersonalConversationKeyResponse>;

    if (!jsonResponse.data?.personalConversationKey) {
      console.error('Could not fetch personal conversation key for this conversation.');

      return;
    }

    const { personalConversationKey, hmacKey } = jsonResponse.data;

    const importedPrivateKey = await PrivateKeyTransportService.createCryptoKeyFromPem(privateKey);

    const asymmetricService = new AsymmetricEncryptionService();
    const decryptedKey = await asymmetricService.decrypt(
      personalConversationKey,
      importedPrivateKey
    );

    const sharedSecretAsCryptoKey = await SymmetricEncryptionService.createCryptoKeyFromString(
      decryptedKey
    );
    const hmacAsCryptoKey = await messageAuthenticationService.createCryptoKeyFromString(hmacKey);
    symmetricEncryptionServiceRef.current = new SymmetricEncryptionService(sharedSecretAsCryptoKey);
    messageAuthenticationServiceRef.current = new messageAuthenticationService(hmacAsCryptoKey);
  }

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    setMessages([]);
    fetchPersonalConversationKey();
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
      mac: await messageAuthenticationServiceRef.current.sign(data.m),
    };

    socket.emit(SocketEvent.MESSAGE, encryptedMessage, conversationId);
  }

  return [messages, sendMessage];
}
