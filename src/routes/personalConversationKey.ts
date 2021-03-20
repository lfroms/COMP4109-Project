import { Router } from 'express';
import { PersonalConversationKey } from '../models/PersonalConversationKey';

const router = Router();

router.get('/api/personalConversationKey', async (request, response) => {
  const userId = parseInt(request.query.userId as string);
  const conversationId = parseInt(request.query.conversationId as string);
  if (!userId || !conversationId) {
    return response.json('Invalid query parameters');
  }

  const personalConversationKey = await PersonalConversationKey.findOne({
    where: {
      userId: userId,
      conversationId: conversationId,
    }
  });
  if (!personalConversationKey) {
    return response.json('Invalid UserId');
  }

  const personalConversationKeyData: PersonalConversationKeyData = {
    userId: personalConversationKey.user.id,
    conversationId: personalConversationKey.conversation.id,
    value: personalConversationKey.value
  }

  return response.json(personalConversationKeyData);
});

export default router;
