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

    async findByEmail(email){

        try{
            var result = await knex.select(["id", "email","password", "role", "name"]).where({email: email}).table("users") //Select retorna com informaçoes que eu deixo aparecer
            
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

    async update(id,email,name,role){
       var user  = await this.findById(id)
       if (user != undefined){

            var editUser = {}
            // validação de edição de e-mail
            if(email != undefined){
                if(email != user.email){
                   var result = await this.findEmail(email)
                   if(result == false){
                        editUser.email = email
                   }else{
                    return{status: false,err:"O e-mail já está cadastrado"}
                   }
                }else{
                    return{status: false,err:"E-mail atual, sem alteração."}
                }
            }

            if(name != undefined){
                editUser.name = name
            }

            if(role != undefined){
                editUser.role = role
            }
            try{
                await knex.update(editUser).where({id: id}).table("users")
                return{status: true}
            }catch(err){
                return{status:false, err: err}
            }

       }else{
           return{status: false,err:"O usuario não existe!"}
       }
    }

    //Deleção

    async delete(id){
        var user = await this.findById(id)
        if (user != undefined){
            try{
                await knex.delete().where({id:id}).table("users")
                return {status: true}
            }catch(err){
                return{status: false, err: err}
            }
            
        }else{
            return{status: false, err: "O usuário não existe, portanto não poder deletado."}
        }
    }

    async changePassword(newPassword,id,token){
        var hash = await bcrypt.hash(newPassword, 10)
        await knex.update({password: hash}).where({id: id}).table("users")
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")        
        
    }

    

}

module.exports = new User()