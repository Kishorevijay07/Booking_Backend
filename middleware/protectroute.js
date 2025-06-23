import jwt from 'jsonwebtoken';
import User from "./../model/auth.model.js";

const protectroute = async (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({ message: "Unauthorized access" });
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userid);
    if(!user){
        return res.status(500).json({error:"User not found"})
    }
    
    req.user=user
    next();
}

export default protectroute;