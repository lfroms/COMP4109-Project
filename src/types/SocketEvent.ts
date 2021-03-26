export enum SocketEvent {
  MESSAGE = 'message',
  CREATE_CONVERSATION = 'conversations:create',
  NOTIFY_CONVERSATIONS = 'conversations:notify',
  SUBSCRIBE_TO_CONVERSATIONS = 'conversations:subscribe',
  REGISTER_CONNECTION = 'connections:register',
  DEREGISTER_CONNECTION = 'connections:deregister',
  DISCONNECT = 'disconnect',
}
