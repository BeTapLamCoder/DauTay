const authController = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareController");



const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh",authController.requestRefreshToken);
//log out
router.post("/logout",middlewareController.verifyToken ,authController.userLogout);
module.exports = router;