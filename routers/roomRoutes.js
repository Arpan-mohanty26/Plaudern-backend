const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const{createRoom, joinRoom, getMyRooms}=require("../controllers/roomController");

router.post("/create",protect,createRoom);
router.post("/join",protect,joinRoom);
router.get("/myRooms",protect,getMyRooms);

module.exports= router;