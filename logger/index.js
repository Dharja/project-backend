const config = require('../config/config');
const winston = require('winston');

// Configurar niveles y colores personalizados
winston.addColors({
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    debug: 'white',
});

const logger = winston.createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    },
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
    ),
    transports: [
        // Consola
        new winston.transports.Console({
        level: config.CONSOLE_LOG_LEVEL || 'info', // Nivel predeterminado si no se define en la configuración
        }),
        // Archivo
        new winston.transports.File({
        filename: './logs/error.log',
        level: config.FILE_LOG_LEVEL || 'error', // Nivel predeterminado si no se define en la configuración
        }),
    ],
});

module.exports = logger;
