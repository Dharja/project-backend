# Proyecto Final Back-End

## Descripción
Este repositorio aloja el código de un servidor en Node.js y Express, creado para gestionar productos y carritos de compra en un e-commerce. El servidor, que opera en el puerto 8080, cuenta con dos grupos de rutas principales: /products y /carts, implementadas con el router de Express.

## Rutas de /api/products
1. `GET /`: Recupera todos los productos.
2. `GET /pid`: Recupera el producto con el ID especificado.
3. `POST /`: Agrega un nuevo producto.
4. `PUT /pid`: Edita un producto específico.
5. `DELETE /pid`: Elimina un producto específico.

## Rutas de /api/carts
1. `POST /`: Crea un nuevo carrito.
2. `GET /cid`: Recupera el carrito con el ID especificado.
3. `POST /cid/products/id`: Agrega un producto al carrito.

## Funcionalidades Adicionales
- **WebSocket**: Se implementa para facilitar la interacción en tiempo real entre cliente y servidor.
- **Handlebars y WebSocket**: Configuración para trabajar con estas tecnologías.
- **Mongoose y MongoDB**: Integración para la persistencia de datos y creación de una base de datos en Atlas con colecciones: "carts", "chatmessages", "products".
- **Paginación, Ordenamiento, Populaciones y Búsqueda**: Mejoras en la gestión de productos y carritos.
- **Sistema de Login**: Se establece un sistema completo con router, motor de plantillas Handlebars, y sesiones guardadas en MongoConnect.
- **Edición del Login**: Implementación de hash de contraseñas y autenticación de Passport, incluyendo autenticación mediante GitHub.
- **Reestructuración del Servidor**: Se organiza por capas con el patrón de diseño MVC y se crea un Singleton para la conexión a la Base de Datos.
- **Mejoras en la Arquitectura del Servidor**: Utilización de Factory para cambiar entre el uso de MongoDB y File, implementación del patrón Repository y middleware de autorización.
- **Nuevo Modelo ORDER**: Permite la creación de tickets para las órdenes de compra.
- **Implementación de Funciones de Compra Completa**: Se agrega una ruta /:cid/purchase para finalizar el proceso de compra, actualizando el stock y enviando un correo con el ticket de compra.
- **Agregado de Mocking y Manejo de Errores**: Se incorpora una ruta para generar productos de prueba y un CustomError para gestionar errores comunes.
- **Implementación de Logger**: Definición de niveles, colores y creación de loggers para desarrollo y producción.
- **Documentación del Proyecto con Swagger**: Se documentan los módulos de productos y carritos.
- **Módulos de Testing con Mocha, Chai y Supertest**: Se crean módulos de testing para garantizar el correcto funcionamiento de la aplicación.
- **Manejo de Documentos e Imágenes con Multer**: Se añade la posibilidad de que los usuarios suban imágenes o documentos.
- **Últimas Modificaciones del Proyecto**: Mejoras en las vistas, eliminación automática de usuarios inactivos, y envío de correo al eliminar productos de usuarios Premium.