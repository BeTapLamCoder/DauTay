const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userControllers");

const router = require("express").Router();

//get all user
router.get("/", middlewareController.verifyToken , userController.getAllUser);
//delete user
router.delete("/:id",middlewareController.verifyTokenAndAdmin, userController.deleteUser);
module.exports = router;