const fs = require('fs/promises');
const path = require('path');
const userModel = require('../dao/models/userModel');

class UserManager {

    #users = [];

    constructor(filename) {
        this.filename = filename;
        this.filepath = path.join(__dirname, '../data',this.filename);
    };

    #readFile = async () => {
        const data = await fs.readFile(this.filepath, 'utf-8');
        this.#users = JSON.parse(data);
    };

    #writeFile = async() => {
        const data = JSON.stringify(this.#users, null, 2);
        await fs.writeFile(this.filepath, data);
    };

    async getAllUsers() {
        await this.#readFile();
        return this.#users;
    };

    async getUserById(id) {
        await this.#readFile();
        return this.#users.find(p => p.id == id);
    };

    async createUser(user) {
        await this.#readFile();
        const id = (this.#users[this.#users.length - 1]?.id || 0) + 1;
        const newUser = {
        ...user,
        id
        };

        this.#users.push(newUser);
        await this.#writeFile();
        return newUser;
    };

    async saveUser(id, user) {
        await this.#readFile();
        const existing = await this.getById(id);
            if (!existing) {
            return
            };
            const {
                email,
                firstname,
                lastname,
                username
            } = user;

        existing.email = email;
        existing.firstname = firstname;
        existing.lastname = lastname;
        existing.username = username;

        await this.#writeFile();
    };

    async deleteUser(id) {
        await this.#readFile();

        /// operadores
        this.#users = this.#users.filter(p => p.id != id);
        await this.#writeFile();
    };
};

module.exports = UserManager;