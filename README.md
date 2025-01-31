# Proyecto: PROYECTO FINAL - Backend 1
Nombre del Proyecto: Carro de Compras en Línea

Descripción:
Este proyecto consiste en la implementación de un sistema de carro de compras en línea utilizando Node.js, Express, MongoDB, y Handlebars para la gestión del front-end y back-end. El sistema permite a los usuarios agregar productos a un carrito de compras, gestionar la cantidad de productos, y proceder al pago. El proyecto también integra Socket.IO para actualizaciones en tiempo real para mejorar la experiencia del usuario.

Tecnologías Utilizadas:

Node.js: Plataforma principal para el desarrollo del servidor.
Express.js: Framework para la gestión de rutas y middleware.
MongoDB con Mongoose: Base de datos NoSQL para almacenar productos y la información del carrito de compras.
Handlebars: Motor de plantillas para renderizar las vistas del front-end.
Socket.IO: Protocolo de comunicación en tiempo real para actualizar el carro de compras en múltiples sesiones.

Características Principales:

Gestión del Carrito de Compras:

Los usuarios pueden agregar productos al carrito de compras.
Si un producto ya está en el carrito en estado pendiente, no se vuelve a agregar.
La cantidad de productos en el carrito se puede incrementar al añadir nuevamente el mismo producto.
Persistencia en la Base de Datos:

Los productos en el carrito se almacenan en MongoDB.
Al cargar la página, todos los productos en estado pendiente se muestran en el carrito.
Actualización en Tiempo Real:

Con Socket.IO, cualquier actualización en el carrito se refleja en tiempo real para todos los usuarios conectados.
Cuando se agrega un producto, se emite un evento actualizarCarro para sincronizar la interfaz del usuario.
Interfaz de Usuario Reactiva:

Estructura del Proyecto:

```src
 ┣ 📂models
 ┃ ┣ 📜Carro.js
 ┃ ┗ 📜Producto.js
 ┣ 📂public
 ┃ ┣ 📂css
 ┃ ┃ ┗ 📜estilos.css
 ┃ ┣ 📂Imagen
 ┃ ┃ ┣ 📜GiordanoBruno_logo.ico
 ┃ ┃ ┣ 📜GiordanoBruno_logo.jpg
 ┃ ┃ ┣ 📜imagen_contacto.png
 ┃ ┃ ┗ 📜imagen_contacto2.jpg
 ┃ ┗ 📂js
 ┃ ┃ ┗ 📜index.js
 ┣ 📂routes
 ┃ ┗ 📂api
 ┃ ┃ ┗ 📜view.routers.js
 ┣ 📂utils
 ┃ ┣ 📜alertas.js
 ┣ 📂views
 ┃ ┣ 📂layouts
 ┃ ┃ ┗ 📜main.handlebars
 ┃ ┣ 📜home.handlebars
 ┃ ┗ 📜realTimeProducts.handlebars
 ┣ 📜app.js
 ┗ 📜utils.js
  ```

Instrucciones de Uso:

Instalar Dependencias:

Copiar código
npm install
Configurar MongoDB:

Asegúrate de tener MongoDB en funcionamiento y configura la conexión en app.js.

Iniciar el Proyecto:
npm start


Acceder a la Aplicación:

La aplicación estará disponible en http://localhost:8080.


Características Adicionales:
El proyecto es modular, permitiendo una fácil ampliación con nuevas características.

Imagen Sistema, proyecto web.
![alt text](image-1.png)

Imagen Tabla producto
![alt text](image-2.png)

Imagen Tabla carro
![alt text](image-3.png)
