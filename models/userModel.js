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
    role: { type: String, default: 'user' },
});

// Antes de guardar un usuario en la base de datos, hasheamos la contraseña
userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


//métodos del DAO para interactuar con la base de datos
const UserDAO = {
    createUser: async (userData) => {
        try {
            return await UserModel.create(userData);
        } catch (error) {
            throw new Error('Error creating user');
        }
        },
        getUserByEmail: async (email) => {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw new Error('Error finding user by email');
        }
    },
}

const createUser = async (userDetails) => {
    try {
        const user = new User(userDetails);
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
}

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

    // Método para crear un nuevo usuario
    async create(user) {
        return User.create(user);
    }
}

module.exports = UserRepository;
module.exports = User;
module.exports = UserDAO;