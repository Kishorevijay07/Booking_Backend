import User from "./../model/auth.model.js";
import bcrypt from "bcryptjs";
import generatetoken from "../utils/generatetoken.js";

export const register = async (req, res) => {
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({email});

        if (existingUser) {
            console.log("user exist ")
            return res.status(400).json({message: "User already exists"});
            console.log("user exist ")
        }
        
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedpassword
        });
        const token=generatetoken(newUser._id,res);
        await newUser.save();
        console.log(newUser)  

        res.status(201).json({message: "User registered successfully",user:newUser,token:token});
        

    } catch (error) {
        console.error("Error in Register",error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => { 
    
    try {
        const {email,password} = req.body;
        
        if (!email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid password"});
        }   
        const token=generatetoken(user._id,res);
        res.status(200).json({message: "Login successful", user , token:token});
    }
    catch (error) {
        console.error("Error in Login",error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        console.error("Error in Logout", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getme=async(req,res)=>{
    try {
        console.log(req.user?.userid)
        const user = await User.findById(req.user?.userid);
        if(!user){
            return res.status(404).json({error:"User not Found"})
        }
        console.log(user)
        res.status(200).json(user);

    } catch (error) {
        console.error("Error in Logout", error);    
        res.status(500).json({message: "Internal server error"});   
    }
}