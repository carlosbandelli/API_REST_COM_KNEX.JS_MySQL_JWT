var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController")

router.get('/', HomeController.index);
router.post('/user', UserController.create)//cadastro de usuario
router.get("/user", UserController.index) // Busca de usuarios
router.get("/user/:id",UserController.findUser) // Busca de usuario especifico
router.put("/user",UserController.edit)//edição de usuario

module.exports = router;