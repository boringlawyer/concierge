const models = require('../models');

const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }
  return next();
};
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bybassSecure = (req, res, next) => {
  next();
};

const requiresValidConversation = (req, res, next) => models.Conversation.ConversationModel.findById(req.params.conversationId, (err, dbRes) => {
  if (err || !res) {
    return res.status(404).send('Sorry! That conversation does not exist');
  }
  next();
});

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bybassSecure;
}

module.exports.requiresValidConversation = requiresValidConversation;
