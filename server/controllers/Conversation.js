const models = require('../models');
const { Conversation } = models;

const sendMessage = (req, res) => {
    req.body.message = `${req.body.message}`;
    if (!req.body.message || req.body.message === '') {
        res.status(400).json({error: "No message"});
        return;
    }
    const newMessage = new models.Message.MessageModel({
        text: req.body.message
    });
    newMessage.save().then(() => {
        
    })
}