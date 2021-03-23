interface MessagePayload {
  senderId: number;
}

interface EncryptedPayload {
  m: string;
  iv: string;
}

interface EncryptedMessagePayload extends MessagePayload {
  data: EncryptedPayload;
}

interface DecryptedMessagePayload extends MessagePayload {
  text: string;
}
