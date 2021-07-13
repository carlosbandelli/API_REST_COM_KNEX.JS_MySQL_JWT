var User = require("../models/User")
class UserController{
    //Busca de usuarios
    async index(req,res){
        var users = await User.findAll()
        res.json(users)
    }


    async findUser(req,res){

        var id = req.params.id
        var user = await User.findById(id)
        if(user == undefined){
            res.status(404)
            res.json({})
        }else{            
            res.status(200)
            res.json(user)
        }
    } 

    async create(req,res){
     var {email, name, password} = req.body //é o corpo do postman
     
     if(email == undefined){
         res.status(400)
         res.json({err: "O e-mail é invalido!"})
         return
     }

     // validação de e-mail Junto com o models User.js
     var emailExists = await User.findEmail(email)

     if(emailExists){
         res.status(406)
         res.json({err: "O e-mail está cadastrado!"})
         return
     }     

     await User.new(email,password,name)

     res.status(200)
     res.send("Tudo Ok!")

    }

    async edit(req,res){
        var {id, name, role, email} = req.body
        var result = await User.update(id,email,name,role)
        if(result != undefined){
            if(result.status){
                res.status(200)
                res.send("Tudo Ok!")
            }else{
                res.status(406)
                res.send(result.err)
            }
        }else{
            res.status(406)
            res.send("Ocorreu um erro no servidor")
        }
    }

}

module.exports = new UserController()