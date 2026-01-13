import User from "../models/user.js";
import Waitlist from "../models/waitlist.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';


// auth token 

const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "30d"});     // gen a token for user sessions
    return token;
}

// Get client from OAuth2Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// register controller
export const register = async (req, res) =>{
    
    try{

        const {name, email, password} = req.body;
                
        // In case user try to register with already registered mail
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPass = await bcrypt.hash(password, 10);         // contains hash password
        const newUser = await User.create({
            name, email, password: hashedPass
        })

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


// waitlist controller
export const waitlist = async (req, res) =>{
    
    try{

        const { email } = req.body;
        
        const user = await Waitlist.findOne({email});

        if(user){
            return res.status(400).json({message: 'Email already added!'});
        }

        const newUser = await Waitlist.create({ email });

        return res.status(201).json({
            newUser,
            message: "Email added!",
        });

    }
    catch (err){
        return res.status(500).json({message: 'server error', error: err.message});
    }
};

// Goolgle controller
export const googleAuth = async (req, res) =>{
    
    try{

        const { credential } = req.body;

        // verify google token 
        const ticket = await client.verifyIdToken({
           idToken: credential,
           audience: process.env.GOOGLE_CLIENT_ID 
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // In case user try to register with already registered mail
        let user = await User.findOne({email});
        
        if(!user){
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture,
                authProvider: 'google',
            });
        } else if (!user.googleId) {
            // Link existing email/password user with Google
            user.googleId = googleId;
            user.avatar = picture;
            user.authProvider = 'google';
            await user.save();
        }

        return res.status(201).json({
            message: "Google Registration successful",
            user,
            token: generateToken(user._id),
        });

    }
    catch (err){
        console.log(err);
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

