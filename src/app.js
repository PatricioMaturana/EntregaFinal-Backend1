import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import __dirname from './utils.js';
import viewrouters from './routes/api/view.routers.js';
import { Server } from 'socket.io';

// Conexión a MongoDB sin las opciones obsoletas
mongoose.connect("mongodb+srv://patriciomaturanapardo:lcHFU5nZSgo2ZiDl@cluster0.idkjagi.mongodb.net/tiendaLibros?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Conectado a MongoDB');
})
.catch((err) => {
    console.error('Error al conectar a MongoDB', err);
});

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.engine('handlebars', handlebars.engine());
app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewrouters);

const httpServer = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);

const io = new Server(httpServer);

io.on('connection', socket => {
    console.log('Cliente conectado');
});

export { io };
