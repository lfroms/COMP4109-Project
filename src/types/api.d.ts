declare namespace API {
  // GENERAL
  export interface JSONError {
    code: number;
    message: string;
  }

  export interface JSONResponse<T> {
    data: T | null;
    error: JSONError | null;
  }

  // USERS

  export interface User {
    id: number;
    name: string;
    publicKey: string;
  }

  export interface UserResponse {
    user: User;
  }

  export interface UsersResponse {
    users: User[];
  }

  // MESSAGES

  export interface Message {
    content: string;
    hmac: string;
  }

  export interface MessagesResponse {
    messages: EncryptedMessagePayload[];
  }

  // CONVERSATIONS

  export interface Conversation {
    id: number;
    participants: User[];
    messages: Message[];
  }

  export interface ConversationResponse {
    conversation: Conversation;
  }

  export interface ConversationsResponse {
    conversations: Conversation[];
  }

  // PERSONAL CONVERSATION KEY

  export interface PersonalConversationKeyResponse {
    personalConversationKey: string;
    hmacKey: string;
  }

  // REGISTRATION

  export interface RegistrationRequestBody {
    name: string;
    password: string;
    publicKey: string;
  }
}
