// /app/api/auth/resend-otp/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodborder";
import { User } from "@/lib/models/User";
import { sendOTPEmail } from "@/lib/sendOTPEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { success: false, message: "Email already verified" },
        { status: 400 }
      );
    }

    // Generate new OTP and update
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 60 min

    user.otp = newOtp;
    user.otpExpiration = expiry;
    await user.save();

    // Send new OTP via email
    const emailResponse = await sendOTPEmail(user.email, user.name, newOtp);
    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "OTP resent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}