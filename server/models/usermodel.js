import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyOtp: {
        type: String,
        default:''
    },
    verifyOtpExpiredAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetotp:{
        type: String,
        default:''
    },
    resetotpExpiredAt: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const UserModel = mongoose.models.user ||  mongoose.model("User", userSchema);

export default UserModel;