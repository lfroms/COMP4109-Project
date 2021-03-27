interface MessagePayload {
  senderId: number;
}

interface EncryptedPayload {
  m: string;
  iv: string;
}

interface EncryptedMessagePayload extends MessagePayload {
  id?: number;
  conversationId: number;
  data: EncryptedPayload;
  hmac: string;
}

interface DecryptedMessagePayload extends MessagePayload {
  text: string;
  verified?: boolean;
}
