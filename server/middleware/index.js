const models = require('../models');

const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/app');
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

const requiresValidConversation = (req, res, next) => {
  models.Conversation.ConversationModel.findById(req.params.conversationId, (err, doc) => {
    if (err || !doc) {
      return res.status(404).render('error', {message: 'That conversation does not exist'});
    }
    return next();
  });
};

const requiresAdmin = (req, res, next) => {
  if (req.session.account.isAdmin) {
    return next();
  }

  return res.status(404).render('error', {message: 'You have to be an admin to access this page'});
};

const requiresOwnerOrAdmin = (req, res, next) => {
  models.Conversation.ConversationModel.findById(req.params.conversationId, (err, doc) => {
    if (doc.owner._id.toString() === req.session.account._id || req.session.account.isAdmin) {
      return next();
    }

    return res.status(403).render('error', {message: 'You do not have permission'});
  });
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bybassSecure;
}

module.exports.requiresValidConversation = requiresValidConversation;
module.exports.requiresAdmin = requiresAdmin;
module.exports.requiresOwnerOrAdmin = requiresOwnerOrAdmin;
