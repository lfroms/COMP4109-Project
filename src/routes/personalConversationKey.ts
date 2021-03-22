import { Router } from 'express';
import { PersonalConversationKey } from '../models/PersonalConversationKey';

const router = Router();

interface Params {
  userId: number;
  conversationId: number;
}

type Response = API.JSONResponse<API.PersonalConversationKeyResponse>;

router.get<any, Response, any, Params>(
  '/api/personal-conversation-key',
  async (request, response) => {
    const { userId, conversationId } = request.query;

    if (!userId || !conversationId) {
      return response.status(404).json({
        data: null,
        error: {
          code: 400,
          message: 'Invalid query parameters',
        },
      });
    }

    const key = await PersonalConversationKey.findOne({
      where: { user: { id: userId }, conversation: { id: conversationId } },
    });

    if (!key) {
      return response.status(404).json({
        data: null,
        error: {
          code: 404,
          message: `Could not find key for user ${userId} and conversation ${conversationId}`,
        },
      });
    }

    return response.json({
      data: {
        personalConversationKey: key.value,
      },
      error: null,
    });
  }
);

export default router;
