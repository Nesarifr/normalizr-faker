import express from 'express';
import * as HttpServer from 'http';
import * as IoServer from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import routerProducts  from './router/productos.js';
/* ------------------- import de clase contenedora y otros ------------------ */
import {verificarRequest} from './src/components/utils.js'
import { ContenedorMysql } from './src/components/contenedorMysql.js';
import { optionsMariaDB } from './src/config/mysqlconfig.js';
import { optionsSqliteDB } from './src/config/mysqlconfig.js';

/* --------------------------- constantes globales -------------------------- */

const chatSqlite = new ContenedorMysql(optionsSqliteDB, 'chats')
const productsMysql = new ContenedorMysql(optionsMariaDB, 'products')
/* ------------------- constantes necesarias del servidor ------------------- */
const app = express();
const httpServer = new HttpServer.createServer(app); 
//io: servidor de Websocket
const io = new IoServer.Server(httpServer); //conectamos con el servidor principal Http
const __filename = fileURLToPath(import.meta.url); 
// ^^^ Esta es una variable especial que contiene toda la meta información relativa al módulo, de forma que podremos acceder al contexto del módulo.
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3000;

/* ------------------------------- configuracion del servidor ------------------------------- */
app.use(express.static(__dirname + '/src/public')) 
app.use(express.json());
app.use(express.urlencoded({extended: true}))

/* ------------------- rutas /api/productos ------------------- */
app.use('/api/productos', routerProducts );

/* ---------------------- definicion motor de plantilla --------------------- */
app.engine('hbs', engine({extname: 'hbs'}))
app.set('views', __dirname+'/src/public/views') //ubicacion de templates
app.set('view engine', 'hbs') // definitar motor para express

/* -------------------- Se crea el servidor y se enciende ------------------- */
httpServer.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));

/* --------- GET '/' -> devuelve todos los productos, conecto con handlebars --------- */
app.get('/', async (req, res)=>{
    try{
        const productosAll = await productsMysql.getAll()
        if ( productosAll){
            res.render('home', {productos : productosAll})
        }  else res.render('partials/error', {productos: {error: 'No existe una lista de productos todavia'}})  
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
});

/* ---------------------- Websocket --------------------- */
io.on('connection', async (socket)=>{
    //productos iniciales / ya guardados
    socket.emit('allProducts', await productsMysql.getAll())
    //nuevo producto
    socket.on('newProduct', async newProducto =>{
        newProducto.price = parseFloat(newProducto.price);
        await productsMysql.save(newProducto)
        const productosAll = await productsMysql.getAll()
        io.sockets.emit('refreshTable', productosAll)
        }
    )

    //mensajes hasta el inicio
    socket.emit('allMensajes', await chatSqlite.getAll())
    //nuevo msj
    socket.on('newMsjChat', async newMsjChat =>{
        await chatSqlite.save(newMsjChat);
        const msjsAll = await chatSqlite.getAll();
        io.sockets.emit('refreshChat', msjsAll )
    })

})




