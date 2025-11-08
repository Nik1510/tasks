import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
}

export const getDataFromToken = (request: NextRequest): string => {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as DecodedToken;
    return decoded.id;
  } catch (error: any) {
    console.error(error.message || "Invalid token");
  }
};
