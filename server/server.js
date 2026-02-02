import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authroutes.js';
import userRouter from './routes/userroutes.js';


const app=express();
const PORT=process.env.PORT || 4000
connectDB();

// const allowedOrigins = ['http://localhost:5173'];
    



app.use(express.json());
// Allow client origin so cookies work (e.g. 5173, 5174, 3000)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // same-origin or non-browser
    if (allowedOrigins.includes(origin)) return cb(null, origin);
    return cb(null, allowedOrigins[0]); // fallback for dev
  },
  credentials: true
}));
app.use(cookieParser());

// Api endpoints
app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});