import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password and create the user
        const hashedPassword = await bycrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        // Check email
        const user = await User.findOne
            ({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Return token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get logged-in user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Update user skills and interests
export const updateUserSkills = async (req, res) => {
    try{
        const { skills, interests } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.skills = skills || user.skills;
        user.interests = interests || user.interests;

        await user.save();

        res.json({ 
            message: "User skills and interests updated successfully",
            updatedUser: user,
         });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};