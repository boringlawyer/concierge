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
      socket.emit('loadMsgs', res.messages);
    });
    socket.on('message', (message) => {
      currentConversation.addMessage(message, socket.handshake.query.clientUsername).then(() => {
        const finalMessage = message;
        finalMessage.senderName = socket.handshake.query.clientUsername;
        io.to(room).emit('updateMsgs', finalMessage);
      });
      // messages.push(message);
    });
  });
};

module.exports = socketManager;
