var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
var AdminAuth = require("../middleware/AdminAuth")
const PasswordToken = require("../models/PasswordToken");

router.get('/', HomeController.index);
router.post('/user', UserController.create)//cadastro de usuario
router.get("/user",AdminAuth, UserController.index) // Busca de usuarios
router.get("/user/:id", AdminAuth,UserController.findUser) // Busca de usuario especifico
router.put("/user", AdminAuth,UserController.edit)//edição de usuario
router.delete("/user/:id", AdminAuth,UserController.remove)// deleção de usuario
router.post("/recoverpassword",UserController.recoverPassword)// Recuperação de senha
router.post("/changepassword",UserController.changePassword)// Alteração de senha
router.post("/login", UserController.login)


module.exports = router;