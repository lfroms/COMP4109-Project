interface ConversationCreatePayload {
  participantMetadata: ParticipantMetadata[];
}

interface ParticipantMetadata {
  id: number;
  personalConversationKey: string;
  hmac: string;
}

interface ConversationsSubscribePayload {
  userId: number;
}
