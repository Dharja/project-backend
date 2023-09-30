const UserRepository = require('../models/userModel');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    // Método para registrar un nuevo usuario
    async registerUser(user) {
        return this.userRepository.create(user);
    }

    // Método para buscar un usuario por correo electrónico
    async findUserByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
}

module.exports = UserService;
