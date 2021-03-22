import { Router } from 'express';
import { PersonalConversationKey } from '../models/PersonalConversationKey';

const router = Router();

router.get('/api/personal-conversation-key', async (request, response) => {
  const userId = parseInt(request.query.userId as string);
  const conversationId = parseInt(request.query.conversationId as string);
  if (!userId || !conversationId) {
    const res: API.JSONResponse<API.PersonalConversationKeyResponse> = {
      data: null,
      error: {
        code: 404,
        message: 'Invalid query parameters',
      },
    };

    return response.status(404).json(res);
  }

  const key = await PersonalConversationKey.findOne({
    where: {
      userId: userId,
      conversationId: conversationId,
    },
  });
  if (!key) {
    const res: API.JSONResponse<API.PersonalConversationKeyResponse> = {
      data: null,
      error: {
        code: 404,
        message: 'Could not find key with that user and conversation id pair',
      },
    };

    return response.status(404).json(res);
  }

  const personalConversationKey: API.PersonalConversationKeyResponse = {
    personalConversationKey: key.value,
  };

  const res: API.JSONResponse<API.PersonalConversationKeyResponse> = {
    data: personalConversationKey,
    error: null,
  };

  return response.json(res);
});

export default router;
