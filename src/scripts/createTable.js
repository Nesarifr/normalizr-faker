import {optionsMariaDB} from '../config/mysqlconfig.js';
import { optionsSqliteDB } from '../config/mysqlconfig.js';
import knex from 'knex';

//instancia de base de datos
const databaseProduct = knex(optionsMariaDB)
const databaseChat = knex(optionsSqliteDB)

const createTable = async ()=>{

    const tableExist=await databaseProduct.schema.hasTable("products");
    if (tableExist) {
        await databaseProduct.schema.dropTable("products");
    }
    await databaseProduct.schema.createTable('products', table =>{
        table.increments('id')
        table.string('title', 30).nullable(false)
        table.integer('price').nullable(false)
        table.string('thumbnail', 100)
    })
    .then(()=> console.log('Se creo la tabla'))
    .catch((err)=> { console.log(err); throw err})
    .finally(()=>databaseProduct.destroy())

    const tableChat=await databaseChat.schema.hasTable("chats");
    if (tableChat) {
        await databaseChat.schema.dropTable("chats");
    }
    await databaseChat.schema.createTable('chats', table =>{
        table.increments('id')
        table.string('mail', 30).nullable(false)
        table.string('msj', 200).nullable(false)
        table.string('fecyHora', 50).nullable(false)
    })
    .then(()=> console.log('Se creo la tabla chat'))
    .catch((err)=> { console.log(err); throw err})
    .finally(()=>databaseChat.destroy())



}

createTable()
