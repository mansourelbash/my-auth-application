const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

/**
 * @swagger
 * /api/message/messages:
 *   post:
 *     summary: Send a message
 *     description: Send a message from one user to another
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *               receiverId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.post('/messages', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  const message = await Message.create({ senderId, receiverId, content });
  res.status(201).json(message);
});

/**
 * @swagger
 * /api/message/messages:
 *   get:
 *     summary: Get messages between users
 *     description: Retrieve messages sent between two users
 *     tags: [Messages]
 *     parameters:
 *       - name: user1Id
 *         in: query
 *         required: true
 *         description: ID of the first user
 *         schema:
 *           type: string
 *       - name: user2Id
 *         in: query
 *         required: true
 *         description: ID of the second user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get('/messages', async (req, res) => {
  console.log(req)
  const { user1Id, user2Id } = req.query;
  const messages = await Message.find({
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id },
    ],
  });
  res.json(messages);
});

/**
 * @swagger
 * /api/message/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     description: Delete a specific message by ID
 *     tags: [Messages]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the message to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
router.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
});

/**
 * @swagger
 * /api/message/conversations/{userId}:
 *   get:
 *     summary: Get all conversations for a specific user
 *     description: Retrieve all unique conversations for a specific user
 *     tags: [Messages]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve conversations for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of unique conversations (other user IDs)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/conversations/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find all unique receiver IDs for messages sent by the user
      const conversations = await Message.distinct('receiverId', { senderId: userId });
      
      // Find all unique sender IDs for messages received by the user
      const receivedConversations = await Message.distinct('senderId', { receiverId: userId });
  
      // Combine both arrays to get unique conversation IDs
      const uniqueUserIds = [...new Set([...conversations, ...receivedConversations])];
  
      // Fetch messages for each unique user
      const conversationDetails = await Promise.all(uniqueUserIds.map(async (otherUserId) => {
        const messages = await Message.find({
          $or: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        });
  
        return {
          userId: otherUserId,
          messages,
        };
      }));
  
      res.status(200).json(conversationDetails);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving conversations', error });
    }
  });
  
  

module.exports = router;
