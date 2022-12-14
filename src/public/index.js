const socketCliente = io();
/* ------------------------- variables de productos ------------------------- */
const formNewProduct = document.querySelector(`#newProduct`)
const title = document.getElementById('title')
const price = document.getElementById('price')
const thumbnail = document.getElementById('thumbnail')
const productoTable = document.querySelector('.productos-handlebars')


/* ------------------------ creo usuario para el chat ----------------------- */
let user;

Swal.fire({
    title: 'Formulario perfil',
    html: `<input type="text" id="email" class="swal2-input" placeholder="Correo">
    <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
    <input type="text" id="apellido" class="swal2-input" placeholder="Apellido">
    <input type="number" id="edad" class="swal2-input" placeholder="Edad">
    <input type="url" id="avatar" class="swal2-input" placeholder="Avatar">`,
    confirmButtonText: 'Iniciar',
    focusConfirm: false,
    preConfirm: () => {
        const email = Swal.getPopup().querySelector('#email').value;
        const nombre = Swal.getPopup().querySelector('#nombre').value;
        const apellido = Swal.getPopup().querySelector("#apellido").value;
        const edad = Swal.getPopup().querySelector("#edad").value;
        const avatar = Swal.getPopup().querySelector("#avatar").value;
        if (!email || !nombre || !apellido || !edad ) {
            Swal.showValidationMessage(`Pro favor complete el formulario`);
        }
        return { email, nombre, apellido, edad, avatar}
    },
    allowOutsideClick: false
}).then((result) => {
    Swal.fire(`
        Email: ${result.value.email}
        Nombre: ${result.value.nombre}
        Apellido: ${result.value.apellido}
    `.trim());
    user = result.value;
    renderUsuarioMsj(user)
});
/* --------------- render de tablas en el template handlebars --------------- */
function renderTable( products){
    return fetch('./views/partials/tables.hbs')
    .then(resp =>resp.text())
    .then(table =>{
        const template = Handlebars.compile(table)
        const htmlProductos = template ({productos:products})
        return htmlProductos
    })
}
/* --------------------------- carga de productos --------------------------- */
formNewProduct.addEventListener('submit', event =>{
    event.preventDefault()
    const newProducto = {
        title: title.value,
        price: price.value,
        thumbnail: thumbnail.value
    }
    socketCliente.emit('newProduct',newProducto)
})
/* --------------------------- render de productos -------------------------- */
socketCliente.on('refreshTable', async  (productosAll)=>{
    const html = await renderTable(productosAll)
    productoTable.innerHTML = html
});


/* --------------------------- variables del chat --------------------------- */
const chatMsj = document.querySelector('#enviarMsj')
const msjUsuario = document.querySelector('#id')
const mostrarMsj = document.querySelector('.mostrarMsj')
const historialMsj = document.querySelector('.mensajeRecibido')

/* --------------- render de chatsUsuario en el template handlebars --------------- */
function renderUsuarioMsj( user){
    return fetch('./views/partials/chat.hbs')
    .then(resp =>resp.text())
    .then( lista =>{
        const template = Handlebars.compile(lista)
        const htmlusuarioMsj= template ({user})
        chatMsj.innerHTML=htmlusuarioMsj
    })
}

/* --------------- render de chats en el template handlebars --------------- */
function renderMsjs( msjs){
    const normMsjs = normalizr.denormalize(msjs.result, chatSchema, msjs.entities);
    const comp =comprensionData(msjs, normMsjs).toFixed(2)
    const variables = {msjs: normMsjs.chat, comp: comp}
    if(normMsjs.chat.length>1 ) {
        console.log("ingresa aca");
        return fetch('./views/partials/mensajes.hbs')
            .then(resp =>resp.text())
            .then( lista =>{
                const template = Handlebars.compile(lista)
                const htmlMsjs = template (variables)
                console.log(htmlMsjs);
                return htmlMsjs
            })}
    else{  
        return fetch('./views/partials/mensajes.hbs')
            .then(resp =>resp.text())
            .then( lista =>{
                const template = Handlebars.compile(lista)
                const htmlMsjs = template ({})
                return htmlMsjs
    })}
}
/* ------------------------------- mostrat todos los msj ------------------------------- */
socketCliente.on('allMensajes', async mensajes =>{
    const html = await renderMsjs(mensajes)
    mostrarMsj.innerHTML = html
})
/* ------------------------------- mandar msj por chat ------------------------------- */
chatMsj.addEventListener('submit', event =>{
    const mensajeUsuario = document.querySelector('#msj')
    event.preventDefault()
    const newMsjChat = {
        author: user,
        text: mensajeUsuario.value,
        fecyHora: new Date().toLocaleString()
    }

    socketCliente.emit('newMsjChat',newMsjChat)
    chatMsj.reset();
})
/* --------------------------- render de mensajes -------------------------- */
socketCliente.on('refreshChat', async  (msjsAll)=>{
    const html = await renderMsjs(msjsAll)
    mostrarMsj.innerHTML = html
});

/* --------------------------- DESNORMALIZAR -------------------------- */
const authorSchema =  new normalizr.schema.Entity("autores", {}, {idAttribute: "email"});
const mensajesSchema = new normalizr.schema.Entity("mensajes", {author: authorSchema});
//objeto global
const chatSchema = new normalizr.schema.Entity("chat", {
    chat: [mensajesSchema]
})

/* -------------------------- compresion realizada -------------------------- */
const comprensionData= (data, normalizada)=>{
    const dataStr = JSON.stringify(data, null, 2);
    const normaStr = JSON.stringify(normalizada, null, 2)
    const porcentaje = dataStr.length/normaStr.length
    return porcentaje*100
}
