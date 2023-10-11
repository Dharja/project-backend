const logger = require('./logger');

// Para registrar un error
logger.error('Ocurrió un error:', error);

// Para mensajes de depuración
logger.debug('Variable x:', x);

// Para registros informativos
logger.info('El servidor ha iniciado en el puerto 3000');

// Para advertencias
logger.warning('Advertencia: el archivo no se ha encontrado');

// Para registros HTTP
logger.http('Solicitud GET a /productos');
