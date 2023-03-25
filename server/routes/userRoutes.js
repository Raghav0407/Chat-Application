const { register, setAvatar, getAllUsers } = require("../controllers/userController");
const {login,logOut } =require("../controllers/userController");
const router=require("express").Router();

router.post("/register",register);
router.post("/login",login);
router.post("/setavatar/:id",setAvatar);
router.get("/allUsers/:id",getAllUsers)
router.get("/logout/:id",logOut);
module.exports =router;