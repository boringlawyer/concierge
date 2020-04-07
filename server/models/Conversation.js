const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let ConversationModel = {};

let ConversationSchema = new mongoose.Schema({
    messages: {
        type: Array,
        required: true
    },
    owner: {
        required: true,
        type: mongoose.Schema.ObjectId,
        ref: 'Account'
    }
});

ConversationModel = mongoose.model('Conversation', ConversationSchema);

module.exports.ConversationModel = ConversationModel;
module.exports.ConversationSchema = ConversationSchema;