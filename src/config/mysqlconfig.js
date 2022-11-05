import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename)


export const optionsMariaDB = {
    //configuracion gestor de base de datos
    client: "mysql",
    //informacion de la base de dato
    connection: {
        host:"127.0.0.1",
        user: "root",
        password: "",
        database: "ch_product_db"
    }
}

export const optionsSqliteDB = {
    client:"sqlite3",
    connection:{
        filename: path.join(__dirname,"../DB/chatDB.sqlite")
    },
    useNullAsDefault: true
}