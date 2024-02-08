const express = require('express');
const winston = require('winston');
const mongoose = require('mongoose');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');
const specs = require('./config/swaggerConfig');
const passportConfig = require('./config/passportConfig');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const passport = require('passport');
const http = require('http');
const exphbs  = require('express-handlebars');

const app = express(); 

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configuración para el entorno de desarrollo y producción
const developmentLogger = winston.createLogger({
    level: 'debug', 
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
});

const productionLogger = winston.createLogger({
    level: 'info', 
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'errors.log', level: 'error' }), 
    ],
});

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Configuración de Passport
passportConfig(app, passport);

// Configuración de vistas
app.engine('handlebars', handlebars());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Configuración de Express para usar JSON y sesiones
app.use(express.json());

app.use(
    session({
        secret: 'secreto',
        resave: true,
        saveUninitialized: true,
    })
);

//configuracion de la base de datos
mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        http.createServer(app).listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Configuración de rutas
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const mockingRoutes = require('./routes/mockingRoutes');

app.use('/api', mockingRoutes);
app.use('/users', userRoutes);
app.use('/password', passwordRoutes);

// Carga middlewares
const adminMiddleware = require('./middlewares/adminMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const policesMiddleware = require('./middlewares/policesMiddleware');

// Uso middlewares
app.use(loggerMiddleware);
app.use(policesMiddleware);
app.use(authMiddleware);
app.use(adminMiddleware);


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});