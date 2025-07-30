const express=require("express");
const route=express.Router();
const protect=require("../middleware/authMiddleware");

route.get("/me",protect,(req,res)=>{
    res.status(200).json({
    message: "You are authorized",
    user: req.user,
    })
})

module.exports=route;