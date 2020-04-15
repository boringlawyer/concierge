const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let MessageModel = {};


const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  convo: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Conversation',
  },
});

MessageModel = mongoose.model('Message', MessageSchema);

module.exports.MessageModel = MessageModel;
module.exports.MessageSchema = MessageSchema;
