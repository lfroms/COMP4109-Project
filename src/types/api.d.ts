interface ConversationData {
  id: number;
  participants: User[];
  messages: Message[];
}

interface UserConversationData {
  id: number;
  name: string;
  conversations: Conversation[];
}

interface PersonalConversationKeyData {
  userId: number;
  conversationId: number;
  value: string;
}
