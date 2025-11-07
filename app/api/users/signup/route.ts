import { connect } from '@/app/dbConfig/dbConfig'
import User from '@/app/models/userModel'
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/app/helpers/sendEmail';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password, email } = reqBody;

    if (!username || !password || !email) {
      return NextResponse.json({ message: "Please enter all the fields" });
    }

    const user = await User.findOne({ 
      $or:[{email},{username}],
    });;
    if (user) {
      if(user.username===username){
        return NextResponse.json({
          message:"Username already exists",
        },{
          status:500
        })
      }
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password: hashPassword,
      verifyToken,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // send email verification
    await sendVerificationEmail(email, username, verifyToken);

    return NextResponse.json({
      message: "User created successfully. Verification email sent.",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
