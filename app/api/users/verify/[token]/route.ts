import { NextResponse } from "next/server";
import User from "@/app/models/userModel";
import { connect } from "@/app/dbConfig/dbConfig";

connect();

export async function GET(req: Request, { params }: { params: { token: string } }) {
  const { token } = params;
  const user = await User.findOne({ verifyToken: token });

  if (!user) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();

  return NextResponse.json({ message: "Email verified successfully!" });
}
