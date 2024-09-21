const jwt = require("jsonwebtoken");

const middlewareController = {
    //verifytoken
    verifyToken: (req,res,next)=>{
        const token = req.headers.token;
        if(token){
            //Bearer 123456
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY,(err,user)  =>{
                if(err){
                    return res.status(403).json("Token is not valid")
                }
                req.user = user;
                next();
            });

        }
        else{
            res.status(401).json("You're not authenticated");
        }
    },
    verifyTokenAndAdmin: (req,res,next)=>{
        middlewareController.verifyToken(req,res,()=>{
            if( req.user.id == req.params.id|| req.user.admin){
                next();
            }
            else{
                return res.status(403).json("You're not allowed to delete other")
            }
        });
    }
}
module.exports = middlewareController;