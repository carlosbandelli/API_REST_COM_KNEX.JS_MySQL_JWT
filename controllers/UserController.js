var User = require("../models/User")
var PasswordToken = require("../models/PasswordToken")
var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

var secret = "carlos"

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

    async remove(req,res){
        var id = req.params.id

        var result = await User.delete(id)

        if(result.status){
            res.status(200)
            res.send("Tudo Ok!")
        }else{
            res.status(405)
            res.send(result.err)
        }
    }

    async recoverPassword(req,res){
        var email = req.body.email
        var result = await PasswordToken.create(email)
        if(result.status){            
            res.status(200)
            res.send("" + result.token)// send só funciona com string e não com numeros então convertemos para string
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async changePassword(req, res){
        var token = req.body.token
        var password = req.body.password
        var isTokenValid = await PasswordToken.validate(token)
        if(isTokenValid.status){
            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada")

        }else{
            res.status(406)
            res.send("Token inválido!")
        }

    }

    async login(req,res){
        var {email, password} = req.body

        var user = await User.findByEmail(email)

        if(user != undefined){

          var resultado = await bcrypt.compare(password, user.password)

            if(resultado){

                var token = jwt.sign({ email: user.email, role: user.role }, secret)

                res.status(200)
                res.json({token: token})

            }else{
                res.status(406)
                res.send("Senha incorreta")
            }

        }else{

            res.json({status: false})

        }
    }

}

module.exports = new UserController()