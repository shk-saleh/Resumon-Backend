import express from 'express'
import { getUser, googleAuth, login, register, waitlist } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';


const userRouter = express.Router();    // we just need a Router from the express so we import that only

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/waitlist', waitlist);
userRouter.post('/google', googleAuth);
userRouter.get('/getuser', protect , getUser);     // we want that whenever user access detail from frontend it verify the token using protected middleware

export default userRouter;