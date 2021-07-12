var knex = require("../database/connection")
var bcrypt = require("bcrypt")

class User{
    //Busca de  todos os usuarios
    async findAll(){

        try{
            var result = await knex.select(["id", "email", "role", "name"]).table("users") // Select retorna a informações que eu deixar
            return result
        }catch(err){
            console.log(err)
            return []
        }
        

    }
    //Busca de usuario pelo id
    async findById(id){

        try{
            var result = await knex.select(["id", "email", "role", "name"]).where({id:id}).table("users") //Select retorna com informaçoes que eu deixo aparecer
            
            if(result.length > 0){
                return result[0]
            }else{
                return undefined
            }
            
            
        }catch(err){
            console.log(err)
            return undefined
        }

    }

    async new(email,password,name){
        // Inserção de Banco de dados
        try{
            var hash = await bcrypt.hash(password, 10) 
            await knex.insert({email,password: hash,name,role: 0}).table("users")
        }catch(err){
            console.log(err)
        }

    }
    // validação de e-mail, verificar se já existe no Banco de dados
    async findEmail(email){
        try{
           var result =  await knex.select("*").from("users").where({email: email})
           
           if(result.length > 0){
               return true
           }else{
               return false
           }
           
        }catch(err){
            console.log(err)
            return false
        }
        
    }

}

module.exports = new User()