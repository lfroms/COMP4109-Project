import { Router } from 'express';
import { Conversation } from '../models/Conversation';
import { User } from '../models/User';

const router = Router();

router.get('/api/conversations/:id', async (request, response) => {
  const conversationId = parseInt(request.params.id);
  const conversation = await Conversation.findOne(conversationId, { relations: ['messages', 'participants'] });
  if (!conversation) {
    return response.json('Invalid ConversationId');
  }

  const conversationData: ConversationData = {
    id: conversation.id,
    participants: conversation.participants,
    messages: conversation.messages,
  };

  return response.json(conversationData);
});

router.get('/api/conversations', async (request, response) => {
  const userId = parseInt(request.query.userId as string);
  if (!userId) {
    return response.json('Invalid query parameters');
  }

  const userData = await User.findOne(userId, { relations: ['conversations'] });
  if (!userData) {
    return response.json('Invalid UserId');
  }

  const userConversationData: UserConversationData = {
    id: userData.id,
    name: userData.name,
    conversations: userData.conversations,
  }

  return response.json(userConversationData);
});

export default router;
