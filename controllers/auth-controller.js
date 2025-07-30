const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
       const existingUser = await User.findOne({ email });
       if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPass });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: "Error in Registration",
            error: error.message
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            {
                 return res.status(500).json({ message: "Invalid Credentials" })
            };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: "Invalid Credentials" })
        };

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: ("1d") });

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token
        })
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }


}