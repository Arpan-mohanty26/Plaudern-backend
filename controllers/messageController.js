const Message = require("../models/message");
require("../models/user"); 


exports.sendMessage = async (req, res) => {
    try {
        const { content, roomId } = req.body;
        const message = await Message.create({
            content,
            sender: req.user._id,
            room: roomId
        });
        await message.populate("sender", "name email");
        await message.populate("room");
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
}


exports.getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
       const messages= await Message.find({ room: roomId })
            .populate("sender", "name email")
            .sort({ createdAt: 1 });

        res.status(201).json(messages)
    } catch (error) {
        res.status(401).json({message:"error retrieving messages"});
    }
}