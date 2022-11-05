# nodeJS-SQL
Utilizacion de MariaDB y SQLlite3 con Express

## :scroll: Consigna:

Tomando como base las clases Contenedor en memoria y en archivos, desarrollar un nuevo contenedor con idénticos métodos pero que funcione sobre bases de datos, utilizando Knex para la conexión. Esta clase debe recibir en su constructor el objeto de configuración de Knex y el nombre de la tabla sobre la cual trabajará:
- cambiar la persistencia de los mensajes de filesystem a base de datos SQLite3.
- cambiar la persistencia de los productos de memoria a base de datos MariaDB.

Desarrollar también un script que utilizando knex cree las tablas necesarias para la persistencia en cuestión (tabla mensajes en sqlite3 y tabla productos en mariaDb).


# Ejecucion y pruebas:

## Ejecucion:
Una vez clonado el repositorio e instalado los modulos, habria que ejecutar el Script "npm run create" para que cree las bases de datos.

Adjunto informacion de las configuraciones de las bases de datos aqui:

<pre><code>{
    optionsMariaDB = {
    client: "mysql",
    connection: {
        host:"127.0.0.1",
        user: "root",
        password: "",
        database: "ch_product_db"
        }
    }
}</code></pre>

<pre><code>{
    optionsSqliteDB = {
    client:"sqlite3",
    connection:{
        filename: path.join(__dirname,"../DB/chatDB.sqlite")
         },
    useNullAsDefault: true
  }
}</code></pre>

Una vez creada las bases de datos e iniciado  XAMPP con los puertos de MySQL:3306, se deberia ejecutar el script "npm run dev" para poder visualizar la pagina en el puerto "http://localhost:3000"

# 💻 Metodos de pruebas:

El chat se relacionara con la base de datos SQLite3, escribiendo el mensaje con mail, automaticamente lo cargara y renderizara debajo.
Esta base de datos estara dentro de la carpeta "DB".

La carga de productos se relaciona con la base de datos MariaDB.
- Para la creacion de productos, la pagina de inicio posee un formulario para la tarea.
- Para la busqueda, modificacion y eliminacion de productos se debera accerder a la pagina administrador atraves del boton en la parte superior derecha.
    - Se pueden probar casos en los que no exista el producto, es decir con ID que no exista en la base de datos.
Una vez ahi se podra realizar las pruebas de las ruta GET, PUT y DELETE, rutas contenidas en el router.

### :computer: Herramientas utilizadas:
:ballot_box_with_check: Express
:ballot_box_with_check: XAMPP
:ballot_box_with_check: VScode
:ballot_box_with_check: Handlebars
:ballot_box_with_check: MariaDB
:ballot_box_with_check: SQLite
