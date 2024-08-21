//import notificacionToastify from '../../utils/alertas.js'; 
//import alertaPopUp from '../../utils/alertas.js'; 
//import { notificacionToastify, alertaPopUp } from '../utils/alertas.js';  
const socket = io();  // Establecer la conexión con el servidor

document.addEventListener('DOMContentLoaded', () => {
    // Código para manejar el clic en "Comprar"
    document.querySelectorAll('.btnComprar').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.id;
    
            try {
                const response = await fetch('/api/carro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });
    
                if (!response.ok) {
                    throw new Error('Error al añadir el producto al carro');
                }
    
                const data = await response.json();
                console.log('Producto añadido al carro:', data);
    
                socket.emit('productoAñadido', data); 
            } catch (error) {
                console.error('Error al añadir al carro:', error);
            }
        });
    });
    

   
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', async (event) => {
            const itemId = event.target.id.split('-')[1];
            if (!itemId) {
                console.error('No se pudo obtener el ID del artículo para eliminar');
                return;
            }
            try {
                const response = await fetch(`/api/carro/${itemId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el artículo del carro');
                }

                const data = await response.json();
                console.log('Articulo eliminado del carro:', data);

                // Eliminar del DOM
                const itemRemover = document.getElementById(`product-${itemId}`);
                if (itemRemover) {
                    itemRemover.remove();
                }
                actualizarTotalCarrito();
                socket.emit('productoEliminado', data);
            } catch (error) {
                console.error('Error al eliminar el artículo del carro:', error);
            }
        });
    });


    document.getElementById('id-btnPagar').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/carro/pagar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al realizar el pago');
            }

            const data = await response.json();
            console.log(data.message);

            socket.emit('compraPagada');
        } catch (error) {
            console.error('Error al realizar el pago:', error);
        }
    });

    
    socket.on('actualizarCarro', (itemCarro) => {
        const itemsCarrito = document.getElementById('itemsCarrito');
        let itemExistente = document.getElementById(`product-${itemCarro.producto._id}`);
        
       
        if (itemExistente) {
            console.log('El producto ya está en el carrito');
            return;
        }
    
        const nuevoItem = document.createElement('div');
        nuevoItem.classList.add('CarritoDetalle');
        nuevoItem.id = `product-${itemCarro.producto._id}`;
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
    
        actualizarTotalCarrito();
    });
    

    socket.on('compraPagada', () => {
        console.log('Compra pagada');
    });

    socket.on('carroActualizado', (itemCarro) => {
        const itemToRemove = document.getElementById(`product-${itemCarro._id}`);
        if (itemToRemove) {
            itemToRemove.remove();
        }
        actualizarTotalCarrito();
    });
});

function actualizarTotalCarrito() {
    let total = 0;
    document.querySelectorAll('.h2Carrito').forEach(item => {
        total += parseFloat(item.textContent.replace('$', '')); 
    });
    document.querySelector('.precioTotal').textContent = `$${total.toFixed(2)}`;
}


/*
// Función para mostrar notificaciones con Toastify
function notificacionToastify(text) {
    Toastify({
        text: text,
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}*/