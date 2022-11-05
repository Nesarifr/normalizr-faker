import { optionsSqliteDB } from '../config/mysqlconfig.js';
import knex from 'knex';

const database=knex(optionsSqliteDB, 'chats')

const selectdata = () =>{
    database.from('chats').select('*')
    .then((result)=>{
        const chats = result.map(elm=>({...elm}))
        console.log(chats);
    })
    .catch(err=>console.log(err))
    .finally(()=>database.destroy())
}


selectdata()