const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: 'user',
    },
    documents: [
        {
            name: String,
            reference: String,
        },
    ],
    last_connection: Date,

});

// Antes de guardar un usuario en la base de datos, hasheamos la contraseña
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Definir el modelo User
const User = mongoose.model('User', userSchema);


// UserRepository
class UserRepository {
    // Método para encontrar un usuario por su ID
    async findById(userId) {
        return User.findById(userId);
    }

    // Método para encontrar un usuario por su correo electrónico
    async findByEmail(email) {
        return User.findOne({ email });
    }

    // Método para encontrar todos los usuarios
    async findAll() {
        return User.find();
    }

    // Método para crear un nuevo usuario
    async create(user) {
        return User.create(user);
    }
}

module.exports = { User, UserRepository };

async function addIsAdminToUsers() {
    try {
        const result = await User.updateMany({}, { isAdmin: false });
        console.log(`Se han actualizado ${result.nModified} usuarios.`);
    } catch (error) {
        console.error('Error al actualizar usuarios:', error);
    }
}

addIsAdminToUsers();