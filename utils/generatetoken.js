import jwt from 'jsonwebtoken'; 

const generateToken = (userid,res) => {
    const token = jwt.sign({userid},process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
  
    res.cookie("jwt",token,{
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure:process.env.NODE_ENV==="development", // Set to true in production
        sameSite: 'strict' // Helps prevent CSRF attacks
    })
    return token;
    
}

export default generateToken;
