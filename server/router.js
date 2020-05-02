const controllers = require('./controllers');
const middleware = require('./middleware');

const router = (app) => {
  app.get('/getToken', middleware.requiresSecure, controllers.Account.getToken);
  app.get('/login', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.loginPage);
  app.post('/login', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.login);
  app.post('/changePassword', middleware.requiresSecure, middleware.requiresLogin, controllers.Account.changePassword);
  app.post('/signup', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.signup);
  app.get('/logout', middleware.requiresLogin, controllers.Account.logout);
  app.get('/app', middleware.requiresLogin, (req, res) => res.render('app', { csrfToken: req.csrfToken() }));
  app.get('/', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.loginPage);
  app.post('/createConversation', middleware.requiresLogin, controllers.Conversation.createConversation);
  app.get('/getConversations', middleware.requiresLogin, controllers.Conversation.getConversations);
  app.get('/chat/:conversationId', middleware.requiresLogin, middleware.requiresValidConversation, middleware.requiresOwnerOrAdmin, controllers.Conversation.chatPage);
  app.get('/admin', middleware.requiresLogin, middleware.requiresAdmin, controllers.Account.adminPage);
  app.get('/getUsers', middleware.requiresLogin, middleware.requiresAdmin, controllers.Account.getUsersAndConversations);
  app.get('/*', (req, res) => { res.status(404).render('error', { message: 'Page not found' }); });
};

module.exports = router;
