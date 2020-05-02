const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let MessageModel = {};


const MessageSchema = new mongoose.Schema({
  value: {
    type: String,
    required: false,
  },
  convo: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Conversation',
  },
  senderName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
});
// takes a message object and puts some of its data in a more compact object 
MessageSchema.method('toAPI', () => ({
  value: this.value,
  senderName: this.senderName,
  type: this.type,
}));

MessageModel = mongoose.model('Message', MessageSchema);

module.exports.MessageModel = MessageModel;
module.exports.MessageSchema = MessageSchema;
