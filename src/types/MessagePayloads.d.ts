interface MessagePayload {
  id?: number;
  senderId: number;
}

interface EncryptedPayload {
  m: string;
  iv: string;
}

interface EncryptedMessagePayload extends MessagePayload {
  conversationId: number;
  data: EncryptedPayload;
  hmac: string;
}

interface DecryptedMessagePayload extends MessagePayload {
  text: string;
  verified?: boolean;
}
