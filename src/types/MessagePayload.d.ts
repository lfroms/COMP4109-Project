interface MessagePayload {
  senderId: string;
  data: string;
}

interface EncryptedPayload {
  m: string;
  iv: string;
}
