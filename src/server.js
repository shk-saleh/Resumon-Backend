import express from "express";
import cors from "cors";
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import userRouter from "./routes/userRoutes.js";

dotenv.config();
await connectDB();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/resumes', resumeRouter); 

app.get('/', (req, res) => {
    res.send("hello");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});