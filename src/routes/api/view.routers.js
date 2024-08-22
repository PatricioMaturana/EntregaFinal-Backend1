import express from 'express';
import persistenciaDatos from '../../utils/persistenciaDatos.js';
import { io } from '../../app.js';
import Carro from '../../models/Carro.js'; 
import Producto from '../../models/Producto.js';  

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await persistenciaDatos.cargarProductos();
            const itemsCarro = await Carro.find({ estado: 'pendiente' }).populate('producto');
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
           
        res.render('home', { products, itemsCarro: carroConDetalles });

    } catch (error) {
        res.status(500).send('Error al cargar los datos:', error);
    }
});

router.post('/api/carro', async (req, res) => {
    const { productId } = req.body;
    console.log('Producto ID recibido:', productId);

    try {;
        let itemCarro = await Carro.findOne({ producto: productId, estado: 'pendiente' }).populate('producto');
        if (itemCarro) {
            console.log('Producto ya en el carro');
        } else {
            itemCarro = new Carro({ producto: productId, cantidad: 1 });
            await itemCarro.save();
        
            const product = await Producto.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const carroConDetalles = {
                ...itemCarro.toObject(),
                producto: {
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    imagen: product.imagen,
                    code: product.code
                }
            };
            io.emit('actualizarCarro', carroConDetalles);
            res.json(carroConDetalles);
        }       
    } catch (error) {
        console.error('Error al añadir el producto al carro:', error);
        res.status(500).json({ error: 'Error al añadir el producto al carro' });
    }
});


/////////////////////

router.post('/api/carro/pagar', async (req, res) => {
    try {
        await Carro.updateMany({ estado: 'pendiente' }, { estado: 'pagado' });

        io.emit('compraPagada');

        res.json({ message: 'Compra realizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar el pago' });
    }
});

////////////////////
/*
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
    console.log('Router view: ',idProducto);
    try {
        await persistenciaDatos.eliminarProducto(idProducto);
        io.emit('deleteProduct', idProducto);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});*/
//////////////////////////////////////////////////////////////////////////////
router.delete('/api/carro/:id', async (req, res) => {
    const id = req.params.id;
    console.log('Producto ID ELIMINAR:', id);
    try {
        await persistenciaDatos.eliminarProductoCarro(id);
        io.emit('carroActualizado', id);       
        res.json({ message: 'Producto eliminado del carro' });
        //>>>>>>>>>>>>>>>>>>
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carro' });
    }
});
//////////////////////////////////////////////////////////////////////////////
export default router;
