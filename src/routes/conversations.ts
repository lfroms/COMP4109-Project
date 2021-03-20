import { Router } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from 'models/Message';
import { User } from 'models/User';

const router = Router();

router.get('/api/test', (request, response) => {
  console.log(request.params.id);
  return response.json({
    response: 'Convo',
    requestHeaders: request.headers,
  });
});

router.get('/api/conversations/:id', async (request, response) => {
  const conversation = await Conversation.findOne(parseInt(request.params.id), { relations: ['messages', 'participants']});
  if (!conversation) {
    return;
  }

  const conversationData: ConversationData = { id: conversation.id, participants: conversation.participants, messages: conversation.messages };

  return response.json(conversationData);
});

router.get('/api/conversations?userId=<id>', (request, response) => {
  return response.json({
    response: 'conversationId',
    requestHeaders: request.headers,
  });
});

export default router;
