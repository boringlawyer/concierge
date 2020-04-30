const mongoose = require('mongoose');
const Message = require('./Message');

mongoose.Promise = global.Promise;

let ConversationModel = {};

const ConversationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    required: true,
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
  messages: {
    type: Array,
    required: true,
  },
});

ConversationSchema.statics.findByOwner = (owner, callback) => {
  const search = {
    owner,
  };
  return ConversationModel.find(search).exec(callback);
};

ConversationSchema.method('addMessage', function (message, senderName) {
  const thisConversation = this;
  const messageData = {
    value: message.value,
    convo: this._id,
    senderName,
    type: message.type,
  };

  const newMessage = new Message.MessageModel(messageData);

  const saveMessagePromise = newMessage.save();
  return saveMessagePromise.then(() => {
    thisConversation.messages.push(newMessage);
    const saveConverationPromise = thisConversation.save();
    return saveConverationPromise;
  });
});

ConversationModel = mongoose.model('Conversation', ConversationSchema);

module.exports.ConversationModel = ConversationModel;
module.exports.ConversationSchema = ConversationSchema;
