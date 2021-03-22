namespace API {
  export interface JSONError {
    code: number;
    message: string;
  }

  export interface JSONResponse<T> {
    data: T | null;
    error: JSONError | null;
  }

  export interface User {
    // to do
  }

  export interface Message {
    // to do
  }

  export interface Conversation {
    id: number;
    participants: User[];
    messages: Message[];
  }

  export interface PersonalConversationKey {
    key: string;
  }

  export interface ConversationResponse {
    conversation: Conversation;
  }

  export interface UserConversationResponse {
    conversations: Conversation[];
  }

  export interface PersonalConversationKeyResponse {
    personalConversationKey: PersonalConversationKey;
  }
}


