import { NextResponse,NextRequest } from "next/server";
import {connect} from '@/app/dbConfig/dbConfig'
import User from "@/app/models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

connect(); // first connect to the database

export async function POST(request:NextRequest){
    try {
        const {email,password} = await request.json();
        if(!email || !password){
            return NextResponse.json({error:"Enter the all the required feilds"})
        }

        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error:"Please signup"},{status:500});
        }

        // if the user is found check the password

        console.log("User exists");
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword){
            return NextResponse.json({error:"Invalid Password"},{status:400})
        }
        console.log(user);

        // create token data
        const tokenData = {
            id:user._id,
            username:user.username,
            email:user.email
        }

        // creating token
        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"});

        // response 
        const response = NextResponse.json({
            message:"Login Successfull",
            success:true,
        })
        response.cookies.set("token",token,{
            httpOnly:true
        })
        return response

    } catch (error:any) {
        return NextResponse.json({
            message:error.message
        },{status:500})
    }
}