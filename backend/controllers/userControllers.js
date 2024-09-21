const User = require("../models/user");

const userController = {
    //get all user
    getAllUser: async(req,res)=>{
        try{
            const user = await User.find();
            return res.status(200).json(user);
        }catch(err){
            return res.status(500).json(err);
        }
    },
    deleteUser: async(req,res)=>{
        try{
            const user = await User.findById(req.params.id);
            return res.status(200).json("Delete successfully")
        }catch(err){
            return res.status(500).json(err);
        }
    }
}
module.exports = userController;