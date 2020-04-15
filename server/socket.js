const models = require('./models');

const socket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected');
        const room = `${socket.handshake.query.conversationId}`;
        socket.join(room);
        let currentConversation;
        models.Conversation.ConversationModel.findById(room, (err, res) => {
            currentConversation = res;
            socket.emit('loadMsgs', res.messages.map((m) => 
                m.text
            ));
        });
        socket.on('message', (message) => {
            console.log(message);
            currentConversation.addMessage(message).then(() => {
            io.to(room).emit('updateMsgs', message);
        });
        // messages.push(message);
      });

    })
}

module.exports = socket;
