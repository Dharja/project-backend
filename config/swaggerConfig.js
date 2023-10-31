const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nombre de API',
            version: '1.0.0',
            description: 'Descripción de API',
        },
    },
    apis: ['./routes/productRoutes.js', './routes/cartRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
