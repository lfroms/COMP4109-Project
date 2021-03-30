import { Router } from 'express';
import { authenticate } from '../middleware';
import { Message } from '../models/Message';

const router = Router();

router.get('/api/messages', authenticate);

interface Request {
  conversationId?: string;
}

type MessagesResponse = API.JSONResponse<API.MessagesResponse>;

router.get<any, MessagesResponse, any, Request>('/api/messages', async (request, response) => {
  const { conversationId } = request.query;

  if (!conversationId) {
    return response.status(400).json({
      data: null,
      error: {
        code: 400,
        message: 'Malformed query parameters',
      },
    });
  }

  const messages = await Message.find({
    where: { conversation: { id: conversationId } },
    relations: ['sender'],
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

  const parsedMessages = messages
    .map(message => {
      const encryptedPayload = JSON.parse(message.content) as EncryptedPayload;

      const encryptedMessage: EncryptedMessagePayload = {
        id: message.id,
        conversationId: parseInt(conversationId),
        senderId: message.sender.id,
        data: encryptedPayload,
        hmac: message.hmac,
      };

      return encryptedMessage;
    })
    .reverse();

  return response.json({
    data: {
      messages: parsedMessages,
    },
    error: null,
  });
});

export default router;
