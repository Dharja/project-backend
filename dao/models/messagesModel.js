const mongoose = require('mongoose');

const messageSchema = new schema({
    user: String,
    message: String,
    datetime: String,
});

const Message = model('Message', messageSchema);

module.exports = Message;
