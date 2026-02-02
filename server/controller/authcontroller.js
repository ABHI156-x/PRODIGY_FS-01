import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/usermodel.js";
import transporter from "../config/nodemailer.js";


export const Register= async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.json({success:false , message : "Missing Details"})
    }

    try{
        const UserExist= await UserModel.findOne({email});

        if(UserExist){
            return res.json({success:false , message :"User already exists"});

        }

        const hashPass = await bcrypt.hash(password,10);

        const User = new UserModel({
            name,
            email,
            password:hashPass
        });

        await User.save();

        const token = jwt.sign({id: User._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',
            maxAge:7*24*60*60*1000
        });

        return res.json({success:true , message: "User logged in"});

    } catch(error){
        return res.json({success:false , message : error.message})  
    }

}

export const Login= async(req,res)=>{
    const {email,password}=req.body; 
    if(!email || !password){
        return res.json({success:false , message : "Missing Details"})
    }
    try{
        const user= await UserModel.findOne({email});

        if(!user){
            return res.json({success:false , message :"User does not exists"});
        }
        const isMatch= await bcrypt.compare(password,user.password);
         if(!isMatch){
            return res.json({success:false , message : 'Invalid password'});
            
         }
          const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

            res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',
            maxAge:7*24*60*60*1000
        });

        // Send login notification email in background – don't fail login if email fails
        const mailoptions={
            from:process.env.SENDER_EMAIL,
            to: user.email,
            subject:"Login Notification",
            text:`Hello ${user.name},\n\nYou have successfully logged in to your account.\n\nIf you did not initiate this login, please contact our support team immediately.\n\nBest regards,\nYour Company Name`
        };
        transporter.sendMail(mailoptions).catch((err) => {
            console.error('Login notification email failed:', err?.message || err);
        });

        return res.json({success:true});        

    } catch(error){
        return res.json({success:false , message : error.message})
    }
}   


export const Logout= async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',
        });

        return res.json({success:true , message: "User logged out"});
    } catch(error){
        return res.json({success:false , message : error.message})  
    }
}

export const sendverifyotp = async(req,res)=>{
    try{
        const userId = req.userId;

        const user =await UserModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false , message :"Account already verified"});

        }

        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        console.log("📩 VERIFY EMAIL OTP:", otp);


        user.verifyOtp=otp;
        user.verifyOtpExpiredAt= Date.now() + 10*60*1000; //10 minutes
        
        
        await user.save();

        const mailoptions={
            from:process.env.SENDER_EMAIL,
            to: user.email,
            subject:"Account Verification OTP",
            text:`Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nBest regards,\nYour Company Name`
        };

        try {
            await transporter.sendMail(mailoptions);
        } catch (mailErr) {
            console.error("Verification email failed:", mailErr?.message || mailErr);
            console.log("--- Dev fallback: OTP for", user.email, "is", otp, "---");
        }

        return res.json({success:true , message :"OTP sent to your email"});


    } catch(error){
        return res.json({success:false , message : error.message})
    }
}

export const verifyemail = async(req,res)=>{
    const userId = req.userId;
    const { otp } = req.body;

    if(!userId || !otp){
        return res.json ({success: false,message:"Missing Details"});

    }
    try{
        const user=await UserModel.findById(userId);

        if(!user){
            return res.json({success:false , message:"User not found"});

        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false , message:"Invalid OTP"});
        }

        if(user.verifyOtpExpiredAt < Date.now()){
            return res.json({success:false , message:"OTP Expired"})
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpiredAt=0;

        await user.save();
        return res.json({success:true , message:"Email Verified Successfully"});
        

    }catch(error){
        return res.json({success:false , message:error.message});
    }
}

export const isauthenticated= async(req,res)=>{
    try{
        return res.json({success:true , message:"User is Authenticated"});
    } catch(error){
        return res.json({success:false , message:error.message});
    }
}

export const sendresetotp= async(req,res)=>{
    const{email}=req.body;

    if(!email){
        return res.json({success:false, message:"Email is required"});
    }
        try{
            const user= await UserModel.findOne({email});
            if(!user){
                return res.json({success:false , message:"User not found"});    
            }

            const otp=Math.floor(100000 + Math.random() * 900000).toString();
            console.log("🔑 RESET PASSWORD OTP:", otp);

            user.resetotp=otp;
            user.resetotpExpiredAt= Date.now() +10*60*1000;
            
            await user.save();

            const mailoptions={
                from:process.env.SENDER_EMAIL,
                to: user.email,
                subject:"Password Reset OTP",
                text:`Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nBest regards,\nYour Company Name`
            };

            try {
                await transporter.sendMail(mailoptions);
            } catch (mailErr) {
                console.error("Reset OTP email failed:", mailErr?.message || mailErr);
                console.log("--- Dev fallback: Reset OTP for", user.email, "is", otp, "---");
            }

            return res.json({success:true , message:"Reset OTP sent to your email"});
        
    }catch(error){
        return res.json({success:false , message:error.message});
    }
}


export const resetpassword= async(req,res)=>{
    const{email , otp , newpassword}=req.body;

    if(!email || !otp || !newpassword){
        return res.json({success:false , message:"Missing Details"});
    }
    try{

     const user = await UserModel.findOne({
        email,
     });
     if(!user){
        return res.json({success:false , message :  "User not found"});
     }

     if(user.resetotp === "" || user.resetotp != otp){
        return res.json({success:false , message:"Invalid OTP"});
     }

        if(user.resetotpExpiredAt < Date.now()){
            return res.json({success:false , message:"OTP Expired"});
        }

        const hashPass= await bcrypt.hash(newpassword , 10);
        user.password= hashPass;
        user.resetotp='';
        user.resetotpExpiredAt=0;
        await user.save();
        return res.json({success:true , message:"Password Reset Successfully"});



    }catch(error){
        return res.json({success:false , message:error.message});
    }
}