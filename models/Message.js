const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' // Reference to the User model
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' // Reference to the User model
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now // Automatically set to the current date and time
    },
    read: {
      type: Boolean,
      default: false // Default value is false (message is unread)
    }
  });
  

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
