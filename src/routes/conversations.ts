import { Router } from 'express';
import { Conversation } from '../models/Conversation';
import { User } from '../models/User';

const router = Router();

router.get('/api/conversations/:id', async (request, response) => {
  const conversationId = parseInt(request.params.id);
  const queryResult = await Conversation.findOne(conversationId, { relations: ['messages', 'participants'] });

  if (!queryResult) {
    const res: API.JSONResponse<API.ConversationResponse> = {
      data: null,
      error: {code: 404, message: "Could not find conversation with that id"},
    }
    return response.status(404).json(res);
  }

  const conversation: API.ConversationResponse = {
    conversation: queryResult,
  };

  const res: API.JSONResponse<API.ConversationResponse> = {
    data: conversation,
    error: null,
  }

  return response.json(res);
});

router.get('/api/conversations', async (request, response) => {
  const userId = parseInt(request.query.userId as string);
  if (!userId) {
    const res: API.JSONResponse<API.UserConversationResponse> = {
      data: null,
      error: {code: 404, message: "Invalid query parameters"},
    }
    return response.status(404).json(res);
  }

  const userData = await User.findOne(userId, { relations: ['conversations'] });
  if (!userData) {
    const res: API.JSONResponse<API.UserConversationResponse> = {
      data: null,
      error: {code: 404, message: "Could not find user with that id"},
    }
    return response.status(404).json(res);
  }

  const conversations: API.UserConversationResponse = {
    conversations: userData.conversations,
  }

  const res: API.JSONResponse<API.UserConversationResponse> = {
    data: conversations,
    error: null,
  }

  return response.json(res);
});

export default router;
