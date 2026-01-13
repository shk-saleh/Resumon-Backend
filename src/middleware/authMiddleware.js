import jwt from "jsonwebtoken";

const protect =  async (req, res, next) =>{
   
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized user!"});
    }

    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = { _id: decoded.userId };
        next();
    }
    catch(err){
        res.status(401).json({message: "Unauthorized user!"});
    }

}

export default protect;