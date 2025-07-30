const jwt= require("jsonwebtoken");
const User=require("../models/user");



const protect = async (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
           return res.status(400).json({message:"Unauthorised Access"});
        }

        const token =authHeader.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded:", decoded);
        req.user= await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports= protect;
