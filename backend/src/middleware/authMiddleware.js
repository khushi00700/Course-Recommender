import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const protect = async (req, res, next) => {
  let token = req.header('Authorization');

  if(!token) {
    return res.status(401).json({ message: "Access denied! No token provided" });
  }

  try{
    // Ensure token starts with 'Bearer'
    if(token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request excluding password
    req.user = await User.findById(decoded.id).select('-password');

    if(!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch(error) {
    res.status(401).json({ message: "Access denied! Invalid token" });
  }
}

export default protect;