const models = require('./models');
const controllers = require('./controllers');
const socketManager = (io) => {
  // fires event when connected to the client
  io.on('connection', (socket) => {
    console.log('User connected');
    const room = `${socket.handshake.query.roomToJoin}`;
    // if the server is down, and then is restarted when the chat page is open, it causes an error.
    // This fix ensures that when the error is caught on the server, it tells the page to refresh
    if (room === 'undefined') {
      // tells the client to refresh
      socket.emit('refresh');
      return;
    }
    // joining a room means being able to send and receive messages only from other instances in that room
    socket.join(room);
    // used as a "global" that can be used in all other events
    let currentConversation;
    // loads this conversation
    models.Conversation.ConversationModel.findById(room, (err, res) => {
      if (err) {
        return;
      }
      currentConversation = res;
      // loads the messages in this conversation
      controllers.Message.findByConversation(room).then((docs) => {

        if (!docs) {
          console.log("findByConversation didn't work");
          return;
        }
        // sends the messages to the client
        socket.emit('loadMsgs', docs);
      })
      
    });
    // fired when the client sends a message
    socket.on('message', (message) => {
      // writes the message to the database
      currentConversation.addMessage(message, socket.handshake.query.clientUsername).then((messageId) => {
        // lightly modifies the message sent with new information
        const finalMessage = message;
        finalMessage.senderName = socket.handshake.query.clientUsername;
        // the id of the message is used to update specific messages (i.e. inputs)
        finalMessage.id = messageId;
        // sends the finalMessage object to the client so it can be displayed
        io.to(room).emit('updateMsgs', finalMessage);
      });
    });
    // fired when input is saved using the "Save" button
    socket.on('saveInput', (input) => {
      // retrieves the id of the element, which is an id of a Message object, and writes the new value to the database
      models.Message.MessageModel.findById(input.id, (err, res) => {
        let newMessage = res;
        newMessage.value = input.value;
        let messageSavePromise = newMessage.save();
        // notifies all clients of the new value for the input
        messageSavePromise.then(() => {
          io.to(room).emit('broadcastInput', input);
        })
      })
    })
  });
};

module.exports = socketManager;
