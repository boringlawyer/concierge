const models = require('../models');

const { Conversation } = models;

const sendMessage = (req, res) => {
  req.body.message = `${req.body.message}`;
  if (!req.body.message || req.body.message === '') {
    res.status(400).json({ error: 'No message' });
    return;
  }
  const newMessage = new models.Message.MessageModel({
    text: req.body.message,
    owner: req.session.account._id,
    convo: req.session.convo._id,
  });
  newMessage.save().then(() => {

  });
};

const createConversation = (req, res) => {
  const convoData = {
    title: req.body.title,
    owner: req.session.account._id,
  };

  const newConvo = new models.Conversation.ConversationModel(convoData);

  const newConvoPromise = newConvo.save();

  newConvoPromise.then(() => {
    res.json({ success: true });
  });

  newConvoPromise.catch((e) => {
    res.status(400).json({ error: 'An error occurred' });
  });
};

const getConversations = (req, res) => Conversation.ConversationModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    return res.status(400).json({ error: 'An error occurred' });
  }
  return res.json({ convos: docs });
});

const chatPage = (req, res) => {
  return res.render('chat');
}

module.exports.sendMessage = sendMessage;
module.exports.createConversation = createConversation;
module.exports.getConversations = getConversations;
module.exports.chatPage = chatPage;