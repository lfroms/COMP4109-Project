import { Router } from 'express';
import { Message } from '../models/Message';

const router = Router();

interface Request {
  conversationId: string;
}

type MessagesResponse = API.JSONResponse<API.MessagesResponse>;

router.get<any, MessagesResponse, any, Request>('/api/messages', async (request, response) => {
  const { conversationId } = request.query;

  const messages = await Message.find({
    where: { conversation: {id: conversationId} },
    relations: [ 'sender' ],
  });

  if (!messages) {
    return response.status(404).json({
      data: null,
      error: {
        code: 404,
        message: `Could not find messages with conversation id ${conversationId}`,
      },
    });
  }

  const parsedMessages = messages.map(message => {
    const encryptedPayload = JSON.parse(message.content) as EncryptedPayload;

    const encryptedMessage: EncryptedMessagePayload = {
      senderId: message.sender.id,
      data: encryptedPayload,
      mac: message.hmac,
    };

    return encryptedMessage;
  });

  return response.json({
    data: {
      messages: parsedMessages,
    },
    error: null,
  });
});

export default router;
