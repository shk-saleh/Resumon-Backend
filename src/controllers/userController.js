import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// auth token 

const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "30d"});     // gen a token for user sessions
    return token;
}

// register controller
export const register = async (req, res) =>{
    
    try{

        const {name, email, password} = req.body;
        console.log(req.body);
                
        // In case user try to register with already registered mail
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPass = await bcrypt.hash(password, 10);         // contains hash password
        const newUser = await User.create({
            name, email, password: hashedPass
        })

        console.log(newUser);

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token: generateToken(newUser._id),
        });

    }
    catch (err){
        return res.status(500).json({message: 'server error', error: err.message});
    }
};


// login controller
export const login = async (req, res) =>{
    
    try{

        const {email, password} = req.body;
        
        const user = await User.findOne({email});
        if(!user || !user.comparePass(password)){
            return res.status(400).json({message: 'Invalid user and password'});
        }

        return res.status(201).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: generateToken(user._id),
        });

    }
    catch (err){
        return res.status(500).json({message: 'server error', error: err.message});
    }
};


// getUser controller
export const getUser = async (req, res) =>{
    
    try{

        const userId = req.userId;
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: 'No user found!'});
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    }
    catch (err){
        return res.status(500).json({message: 'server error', error: err.message});
    }
};
