const models = require('./models');
const controllers = require('./controllers');
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
      controllers.Message.findByConversation(room).then((docs) => {

        if (!docs) {
          console.log("findByConversation didn't work");
          return;
        }
        socket.emit('loadMsgs', docs);
      })
      // socket.emit('loadMsgs', res.messages);
      
    });
    socket.on('message', (message) => {
      currentConversation.addMessage(message, socket.handshake.query.clientUsername).then((messageId) => {
        const finalMessage = message;
        finalMessage.senderName = socket.handshake.query.clientUsername;
        finalMessage.id = messageId;
        io.to(room).emit('updateMsgs', finalMessage);
      });
      // messages.push(message);
    });
    socket.on('saveInput', (input) => {
      models.Message.MessageModel.findById(input.id, (err, res) => {
        let newMessage = res;
        newMessage.value = input.value;
        let messageSavePromise = newMessage.save();
        messageSavePromise.then(() => {
          io.to(room).emit('broadcastInput', input);
        })
      })
    })
  });
};

module.exports = socketManager;
