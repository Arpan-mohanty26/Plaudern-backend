const Room = require("../models/room");
const { findOne } = require("../models/user");

exports.createRoom = async (req, res) => {
    const { name } = req.body;
    let room = await Room.findOne({ name });
    if (room) {
        return res.status(400).json({
            message: "room already exists"
        })
    }

    room = await Room.create({
        name,
        users: [req.user._id]
    })
    res.status(201).json({ message: "room created successfully" })

}

exports.joinRoom = async (req, res) => {
    try {
        const { name } = req.body;
        const room = await Room.findOne({ name });
        if (!room) { return res.status(400).json({ message: "No Rooms found" }) };

        if (!room.users.includes(req.user._id)) {
            room.users.push(req.user._id)
            await room.save();
        }
        res.status(200).json({ message: `Joined room ${name}`, room });
    } catch (error) {
        res.status(500).json({ message: "Failed to join room", error: error.message });
    }
}



exports.getMyRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ users: req.user._id }); 
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
    }
};