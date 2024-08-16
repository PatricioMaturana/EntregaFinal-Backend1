import express from 'express';
import persistenciaDatos from '../../utils/persistenciaDatos.js';
import { io } from '../../app.js';
import Carro from '../../models/Carro.js'; 
import Producto from '../../models/Producto.js';  

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('metodo GETTTT')
    try {
        const products = await persistenciaDatos.cargarProductos();
      //  res.render('home', { products });

 //       try {
            // Obtener todos los productos en estado pendiente en el carrito
            const itemsCarro = await Carro.find({ estado: 'pendiente' }).populate('producto');
    
            // Mapear los items del carro para incluir los detalles del producto
            const carroConDetalles = itemsCarro.map(item => ({
                _id: item._id,
                cantidad: item.cantidad,
                producto: {
                    _id: item.producto._id,
                    title: item.producto.title,
                    price: item.producto.price,
                    imagen: item.producto.imagen,
                    code: item.producto.code
                }
            }));
    
             // Renderizar la página con los productos y el carrito
        res.render('home', { products, itemsCarro: carroConDetalles });

    } catch (error) {
        res.status(500).send('Error al cargar los datos');
    }
});

/////////////////////

router.post('/api/carro', async (req, res) => {
    const { productId } = req.body;
    try {
        const itemCarro = await Carro.findOne({ producto: productId, estado: 'pendiente' });
        const product = await Producto.findById(itemCarro.producto);

        if (itemCarro) {
            itemCarro.cantidad += 1;
            console.log('Itemcarro CAntidad:  ',itemCarro.cantidad)
            await itemCarro.save();
        } else {
            itemCarro = new Carro({ producto: productId, cantidad: 1 });
            await itemCarro.save();
        }

           // Añadir los detalles del producto a itemCarro
          const carroConDetalles = 
            {
                ...itemCarro.toObject(),
                producto: {
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    imagen: product.imagen,
                    code: product.code
                } 
            }
        //console.log(carroConDetalles.producto)
        // Emitir un evento a todos los clientes conectados para actualizar el carro
        io.emit('actualizarCarro', carroConDetalles);
        res.json(carroConDetalles);
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir el producto al carro' });
    }
});

router.post('/api/carro/pagar', async (req, res) => {
    try {
        await Carro.updateMany({ estado: 'pendiente' }, { estado: 'pagado' });

        // Emitir un evento para notificar que la compra ha sido pagada
        io.emit('compraPagada');

        res.json({ message: 'Compra realizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar el pago' });
    }
});


////////////////////



router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await persistenciaDatos.cargarProductos();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al cargar los datos');
    }
});

// API Routes
router.post('/api/products', async (req, res) => {
    let { title, description, code, price, stock, category, imagen } = req.body;

    try {
        const newProduct = await persistenciaDatos.crearProducto({ title, description, code, price, stock, category, imagen });
        io.emit('newProduct', newProduct);
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el producto' });
    }
});

router.delete('/api/products/:id', async (req, res) => {
    const idProducto = req.params.id;
    try {
        await persistenciaDatos.eliminarProducto(idProducto);
        io.emit('deleteProduct', idProducto);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;
