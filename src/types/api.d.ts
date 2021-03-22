namespace API {

  interface JSONError {
    code: number;
    message: string;
  }

  interface JSONResponse<T> {
    data: T | null;
    error: JSONError | null;
  }

  interface User {
    // to do
  }

  interface Message {
    // to do
  }

  interface Conversation {
    id: number;
    participants: User[];
    messages: Message[];
  }

  interface PersonalConversationKey {
    key: string;
  }

  interface ConversationResponse {
    conversation: Conversation;
  }

  interface UserConversationResponse {
    conversations: Conversation[];
  }

  interface PersonalConversationKeyResponse {
    personalConversationKey: PersonalConversationKey;
  }
}


