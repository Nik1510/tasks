import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/userModel";
import {connect} from "@/app/dbConfig/dbConfig";


connect();
export async function GET(req: Request) {
  try {
    // await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
    const user = await User.findById(decoded.userId).select(
      "username email isVerified profilePic"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
