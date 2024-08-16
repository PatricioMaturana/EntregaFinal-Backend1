import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    imagen: String
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;
