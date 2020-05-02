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

// finds the conversation object with owner (owner)
ConversationSchema.statics.findByOwner = (owner, callback) => {
  const search = {
    owner,
  };
  return ConversationModel.find(search).exec(callback);
};

// a method for every Conversation object to create a message that is owned by this conversation
// returns the id of the new message
// with help from https://mongoosejs.com/docs/api.html#schema_Schema-method
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
    return saveConverationPromise.then(() => {
      return newMessage._id.toString();
    })
  });
});

ConversationModel = mongoose.model('Conversation', ConversationSchema);

module.exports.ConversationModel = ConversationModel;
module.exports.ConversationSchema = ConversationSchema;
