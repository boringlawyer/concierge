const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let MessageModel = {};

const convertId = mongoose.Types.ObjectId;

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
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
