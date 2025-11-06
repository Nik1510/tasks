import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide the username"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please provide the password"]
    },
    email:{
        type:String,
        required:[true,"Please provide the email"],
        unique: true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,
})

// check it is present or not 
const User = mongoose.models.TaskUser || mongoose.model("TaskUser",userSchema)

export default User;