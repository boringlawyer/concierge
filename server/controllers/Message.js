const models = require('../models');

const {Message} = models;

const findByConversation = (convoId) => {
    let searchTerm = {
        convo: convoId
    }
    return Message.MessageModel.find(searchTerm, (err, docs) => {
        if (err || !docs) {
            console.log(err);
            return;
        }
        let messages = docs;
        let sortedMessages = messages.sort((a, b) => {a.createdAt - b.createdAt});
        return sortedMessages;
    });
}

module.exports.findByConversation = findByConversation;