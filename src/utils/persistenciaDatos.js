import Producto from '../models/Producto.js';

class PersistenciaDatos {

    async cargarProductos() {
        try {
            const productos = await Producto.find();
            return productos;
        } catch (error) {
            throw new Error('Error al cargar los productos desde MongoDB');
        }
    }

    async crearProducto(productoData) {
        try {
            const nuevoProducto = new Producto(productoData);
            await nuevoProducto.save();
            return nuevoProducto;
        } catch (error) {
            throw new Error('Error al crear un nuevo producto en MongoDB');
        }
    }

    async eliminarProducto(id) {
        try {
            await Producto.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error al eliminar el producto en MongoDB');
        }
    }
}

export default new PersistenciaDatos();
