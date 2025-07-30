const express= require("express");
const router= express.Router();
const protect= require("../middleware/authMiddleware");
const {getRoomMessages,sendMessage}= require("../controllers/messageController");

router.post("/send",protect,sendMessage);
router.get("/:roomId",protect,getRoomMessages);

module.exports= router;