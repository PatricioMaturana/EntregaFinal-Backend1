import mongoose from 'mongoose';

const carroSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        default: 1
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagado'],
        default: 'pendiente'
    }
});

const Carro = mongoose.model('Carro', carroSchema);

export default Carro;
