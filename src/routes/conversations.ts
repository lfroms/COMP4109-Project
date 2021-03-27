import { Router } from 'express';
import { authenticate } from '../middleware';
import { Conversation } from '../models/Conversation';
import { User } from '../models/User';

const router = Router();

router.get('/api/conversations/:id', authenticate);
router.get('/api/conversations', authenticate);

interface ConversationParams {
  id: number;
}

type ConversationResponse = API.JSONResponse<API.ConversationResponse>;
router.get<ConversationParams, ConversationResponse>(
  '/api/conversations/:id',
  async (request, response) => {
    const { id: conversationId } = request.params;

    const conversation = await Conversation.findOne(conversationId, {
      relations: ['messages', 'participants'],
    });

    if (!conversation) {
      return response.status(404).json({
        data: null,
        error: {
          code: 404,
          message: `Could not find conversation with id ${conversationId}`,
        },
      });
    }

    return response.json({
      data: {
        conversation,
      },
      error: null,
    });
  }
);

interface UserConversationsParams {
  userId: number;
}

type UserConversationsResponse = API.JSONResponse<API.ConversationsResponse>;

router.get<any, UserConversationsResponse, any, UserConversationsParams>(
  '/api/conversations',
  async (request, response) => {
    const { userId } = request.query;

    if (!userId) {
      return response.status(400).json({
        data: null,
        error: {
          code: 400,
          message: 'Invalid query parameters',
        },
      });
    }

    const user = await User.findOne(userId, { relations: ['conversations'] });

    if (!user) {
      return response.status(404).json({
        data: null,
        error: {
          code: 404,
          message: `Could not find user with id ${userId}`,
        },
      });
    }

    return response.json({
      data: {
        conversations: user.conversations,
      },
      error: null,
    });
  }
);

export default router;
