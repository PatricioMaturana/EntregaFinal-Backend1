//import notificacionToastify from '../../utils/alertas.js'; 
//import alertaPopUp from '../../utils/alertas.js'; 
//import { notificacionToastify, alertaPopUp } from '../utils/alertas.js';  // Ajusta la ruta si es necesario
const socket = io();  // Establecer la conexión con el servidor

document.addEventListener('DOMContentLoaded', () => {
    // Código para manejar el clic en "Comprar"
    document.querySelectorAll('.btnComprar').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.id;

            try {
                const response = await axios.post('/api/carro', { productId });
                console.log('Producto añadido al carro:', response.data);
                
                // Mostrar notificación Toastify al agregar al carro
          //       notificacionToastify('Producto añadido al carrito');

                socket.emit('productoAñadido', response.data);
            } catch (error) {
                console.error('Error al añadir al carro:', error);
            }
        });
    });

    document.getElementById('id-btnPagar').addEventListener('click', async () => {
        try {
            const response = await axios.post('/api/carro/pagar');
            console.log(response.data.message);
            
            // Mostrar alerta Swal al realizar el pago
        //alertaPopUp('success', 'Pago realizado', 'Tu compra ha sido procesada exitosamente');

            // Emitir un evento al servidor para notificar que la compra ha sido pagada
            socket.emit('compraPagada');
        } catch (error) {
            console.error('Error al realizar el pago:', error);
        //    alertaPopUp('error', 'Error de pago', 'Hubo un problema al procesar tu pago');
        }
    });

    // Escuchar el evento `actualizarCarro` del servidor
    socket.on('actualizarCarro', (itemCarro) => {
        // Actualizar el DOM aquí con la nueva información del carro

        // Por ejemplo, podrías añadir un nuevo elemento al carrito:
        const itemsCarrito = document.getElementById('itemsCarrito');
        const nuevoItem = document.createElement('div');
        nuevoItem.classList.add('CarritoDetalle');
        nuevoItem.innerHTML = `
            <div class="carritoImagen">   
                <img src="${itemCarro.producto.imagen}" width="40px" alt="${itemCarro.producto.title}">
                <p><h2 class="h2Carrito">${itemCarro.producto.title}</h2></p>
                <p><h2 class="h2Carrito">${itemCarro.producto.price}</h2></p>
            </div>
            <div class="selectorCantidad">                                    
                <p><i class="fa-solid fa-minus restaCantidad" id="resta-${itemCarro.producto._id}"></i></p>
                <div class="carritoCantidadItem"><input class="valorCantidad" id="inp-${itemCarro.producto._id}" type="text" value="${itemCarro.cantidad}" disabled></div>
                <p><i class="fa-solid fa-plus sumaCantidad" id="suma-${itemCarro.producto._id}"></i></p>
                <p><i class="fa-solid fa-trash btn-eliminar" id="eliminar-${itemCarro.producto._id}"></i></p>
            </div>
        `;

        itemsCarrito.appendChild(nuevoItem);

        // También podrías actualizar el total, etc.
        actualizarTotalCarrito();
    });

    // Escuchar el evento `compraPagada` del servidor
    socket.on('compraPagada', () => {
        console.log('Compra pagada');
        // Aquí puedes limpiar el carrito o mostrar un mensaje de confirmación
    });
});

function actualizarTotalCarrito() {
    let total = 0;
    document.querySelectorAll('.h2Carrito').forEach(item => {
        total += parseFloat(item.textContent.replace('$', '')); // O usa tu lógica para calcular el total
    });
    document.querySelector('.precioTotal').textContent = `$${total.toFixed(2)}`;
}
