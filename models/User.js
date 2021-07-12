var knex = require("../database/connection")
var bcrypt = require("bcrypt")

class User{

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
            await Knex.select("*").from("users").where({email: email})
            console.log(result)
        }catch(err){
            console.log(err)
            return false
        }
        
    }

}

module.exports = new User()