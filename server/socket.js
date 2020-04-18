const models = require('./models');

const socketManager = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');
    const room = `${socket.handshake.query.roomToJoin}`;
    if (room === 'undefined') {
      socket.emit('refresh');
      return;
    }
    // const room = `${socket.handshake.query.conversationId}`;
    socket.join(room);
    let currentConversation;
    models.Conversation.ConversationModel.findById(room, (err, res) => {
      if (err) {
        return;
      }
      currentConversation = res;
      socket.emit('loadMsgs', res.messages.map((m) => `${m.senderName} said: ${m.text}`));
    });
    socket.on('message', (message) => {
      console.log(message);
      console.log(socket.handshake.query.clientUsername);
      currentConversation.addMessage(message, socket.handshake.query.clientUsername).then(() => {
        io.to(room).emit('updateMsgs', `${socket.handshake.query.clientUsername} said: ${message}`);
      });
      // messages.push(message);
    });
  });
};

module.exports = socketManager;
