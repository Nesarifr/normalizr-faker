import knex from "knex";

export class ContenedorMysql {
    constructor(options, tableName){
        this.database=  knex(options);
        this.tableName=tableName;
    }
    async save(element){
        try {
            console.log(element);
            const [newid]= await this.database.from(this.tableName).insert(element);
            console.log(element);
            return newid
        } catch (error) {
            return {error: error}
        }
    }

    async getById(id){
        try {
            const element = await this.database.from(this.tableName).where("id",id)
            if(element.length){
                return {error: error}
            }
            const returnElement = element.map(elem=>({...elem}))
            return returnElement
        } catch (error) {
            return {error: error}
        }
    }

    async getAll(){
        try {
            const data = await this.database.from(this.tableName).select("*");
            if (data.length) {
                const dataReturn = data.map(elem=>({...elem}))
                return dataReturn
            } else {
                return {error: "No hay productos, ingrese un nuevo producto por favor, gracias."}
            }
        } catch (error) {
            return {error: error}
        }
    }

    async deletedById(id){
        try {
            if (!tableExist) {
                return {error: error}
            }
            const element = await this.database.from(this.tableName).where("id",id)
            console.log(element);
            if(element.length){
                return {error: error}
            }
            await this.database.from(this.tableName).where("id",id).del()
            return { msj: "Se borro exitosamente"}
        } catch (error) {
            return {error: error}
        }
    }

    async actualizaByID(id , actualizacion){

        try {
            console.log("ingresa al actualziar");
            const element = await this.database.from(this.tableName).where("id",id)
            console.log(element);
            if(product.length){
                return {error: error}
            }
            console.log(actualizacion);
            const newtitle=actualizacion.title
            const newPrice=actualizacion.price
            const newUrl = actualizacion.thumbnail
            await this.database.from(this.tableName).where("id",id).update({
                title: newtitle,
                price: newPrice,
                thumbnail: newUrl
            })
            let deleteElement= await this.database.from(this.tableName).where("id",id)
            let deleteE= deleteElement[0]
            return deleteE
        } catch (error) {
            return {error: error}
        }
        
    }

}