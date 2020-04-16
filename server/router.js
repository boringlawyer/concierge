const controllers = require('./controllers');
const middleware = require('./middleware');

const router = (app) => {
  app.get('/getToken', middleware.requiresSecure, controllers.Account.getToken);
  app.get('/login', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.loginPage);
  app.post('/login', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.login);
  app.post('/signup', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.signup);
  app.get('/logout', middleware.requiresLogin, controllers.Account.logout);
  app.get('/maker', middleware.requiresLogin, controllers.Domo.makerPage);
  app.get('/', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.loginPage);
  app.post('/createConversation', middleware.requiresLogin, controllers.Conversation.createConversation);
  app.get('/getConversations', middleware.requiresLogin, controllers.Conversation.getConversations);
  app.get('/chat/:conversationId', middleware.requiresLogin, middleware.requiresValidConversation, controllers.Conversation.chatPage);
  app.get('/admin', middleware.requiresLogin, middleware.requiresAdmin, controllers.Account.adminPage);
};

module.exports = router;
