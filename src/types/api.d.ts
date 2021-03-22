declare namespace API {
  export interface JSONError {
    code: number;
    message: string;
  }

  export interface JSONResponse<T> {
    data: T | null;
    error: JSONError | null;
  }

  //export interface User {}

  //export interface Message {}

  export interface Conversation {
    id: number;
    participants: User[];
    messages: Message[];
  }

  export interface ConversationResponse {
    conversation: Conversation;
  }

  export interface UserConversationResponse {
    conversations: Conversation[];
  }

  export interface PersonalConversationKeyResponse {
    personalConversationKey: string;
  }
}
