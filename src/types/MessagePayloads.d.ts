interface MessagePayload {
  senderId: number;
}

interface EncryptedPayload {
  m: string;
  iv: string;
}

interface EncryptedMessagePayload extends MessagePayload {
  data: EncryptedPayload;
  mac: string;
  conversationId: number;
}

interface DecryptedMessagePayload extends MessagePayload {
  text: string;
  verified?: boolean;
}
