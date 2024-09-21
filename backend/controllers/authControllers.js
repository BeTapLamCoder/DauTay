const { register } = require("module");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const user = require("../models/user");
const jwt = require("jsonwebtoken");


let refreshtokens = [];
const authController = {
    //register
    registerUser: async(req,res)=>{
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            const user = await newUser.save();
            return res.status(200).json(user);
        }
        catch(err){
            return res.status(500).json(err);
        }
    },

    //generate access token
    generateAccessToken: (user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
        process.env.JWT_ACCESS_KEY,
        {expiresIn: "20s"}
    );
    },
    generateRefreshToken: (user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "365d"}
    )
    },
    loginUser: async(req,res)=>{
        try{
            const user = await User.findOne({username: req.body.username});
            if(!user){
                return res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password,
            )
            if(!validPassword){
                return res.status(404).json("wrong password");
            }
            if(user && validPassword){
               const accessToken = authController.generateAccessToken(user);
            const refreshToken = authController.generateRefreshToken(user);
            refreshtokens.push(refreshToken)
            res.cookie("refreshToken", refreshToken,{
                httpOnly: true,
                secure: false,
                path:"/",
                sameSite:"strict",
            })
            const {password, ...others} = user._doc;

                return res.status(200).json({...others,accessToken});
            }
        }catch(err){
            return res.status(500).json(err);
        }
    },
    requestRefreshToken: async(req,res)=>{
        //take refresh token form user
        const refreshToken = req.cookies.refreshToken;
        res.status(200).json(refreshToken);
        if(!refreshToken){
            return res.status(401).json("You're not authenticated");
            
        }
        if(!refreshtokens.includes(refreshToken)){
            return res.status(403).json("Refresh token is not valid")
        }
        jwt.verify(refreshToken,process.env.JWT_REFRESH_KEY,(err,user)=>{
            if(err){
                console.log(err);
            }
            refreshToken = refreshtokens.filter((token)=>token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshtokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken,{
                httpOnly: true,
                secure: false,
                path:"/",
                sameSite:"strict",
            });
            return res.status(200).json({accessToken: newAccessToken});
        })
    },
    //LOGOUT
    userLogout: async(req,res)=>{
        res.clearCookie("refreshToken");
        refreshtokens = refreshtokens.filter(token => token !== req.cookies.refreshToken);
        return res.status(200).json("Logged out !");
    }
}

//store token dung local storage
//de bi tan cong boi xss
//2. HTTPONLY cookies
//CSRF -> SAMESITE
//3. Redux store -> acctoken va 2. de lua refrtoken
//cach ngan chan bff pattern (backend for frontend)

module.exports = authController;