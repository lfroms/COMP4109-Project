declare namespace API {
  export interface JSONError {
    code: number;
    message: string;
  }

  export interface JSONResponse<T> {
    data: T | null;
    error: JSONError | null;
  }

  export interface User {
    id: number;
    name: string;
    publicKey: string;
  }

  export interface Message {
    content: string;
  }

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

  export interface UserResponse {
    user: User;
  }

  export interface UsersResponse {
    users: User[];
  }

  export interface PersonalConversationKeyResponse {
    personalConversationKey: string;
  }

  export interface RegistrationRequestBody {
    name: string;
    password: string;
    publicKey: string;
  }
}
