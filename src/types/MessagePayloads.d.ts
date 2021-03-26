interface MessagePayload {
  senderId: number;
}

interface EncryptedPayload {
  m: string;
  iv: string;
}

interface EncryptedMessagePayload extends MessagePayload {
  data: EncryptedPayload;
  hmac: string;
  conversationId: number;
}

interface DecryptedMessagePayload extends MessagePayload {
  text: string;
  verified?: boolean;
}
