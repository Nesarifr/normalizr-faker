import {optionsSqliteDB} from '../config/mysqlconfig.js';
import knex from 'knex';

const database=knex(optionsSqliteDB, 'chats')

const algo = [
    { mail: 'asfasfas', msj: '12412412', fecyHora: '5/11/2022, 13:06:18' },
    { mail: 'asfasfas', msj: '12412412', fecyHora: '5/11/2022, 13:06:18' }
]

const insertdata = () =>{
    database.from('chats').insert(algo)
    .then(()=>console.log('data added'))
    .catch(err=>console.log(err))
    .finally(()=>database.destroy())
}


insertdata()
