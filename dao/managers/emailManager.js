//emailManager
const fs = require('fs/promises');
const path = require('path');
const userModel = require('../dao/models/userModel');

class EmailManager {
    constructor(filename) {
        this.filename = filename;
        this.filepath = path.join(__dirname, '../data',this.filename);
    };

    async sendEmail(email, subject, message) {
        await sendEmail(email, subject, message);
    };
}

module.exports = EmailManager;
