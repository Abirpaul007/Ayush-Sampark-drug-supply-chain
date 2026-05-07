import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import {User} from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

   const mailOptions = {
    from: `Ayush Sampark <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Verification Code',
    html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
        <div style="text-align: center;">
          <img src="https://raw.githubusercontent.com/subhradeep09/Drugs-Supply-Chain/49817e3a93478543d271ae99e3194b041fb18b02/logo.png" alt="Ayush Sampark Logo" style="width: 180px; margin-bottom: 10px;" />
        </div>

        <h2 style="color: #2c3e50; text-align: center;">Email Verification</h2>
        <p style="font-size: 16px; color: #333;">Dear user,</p>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering with <strong>Ayush Sampark</strong>. Please use the following OTP to verify your email address:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #eaf6ff; color: #007bff; font-size: 32px; font-weight: bold; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #555;">
          This OTP is valid for the next 2 minutes. If you did not request this, please ignore this email.
        </p>

        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          &copy; ${new Date().getFullYear()} Ayush Sampark. All rights reserved.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role, organization } = await req.json();
    await dbConnect();

    let user = await User.findOne({ email });

    if (user) {
      // If user already exists but is not verified, update OTP
      if (!user.isEmailVerified) {
        user.otp = generateOTP();
        user.otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        await sendEmail(email, user.otp);
        return NextResponse.json({ success: true, message: 'OTP resent to existing user' }, { status: 200 });
      }
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      organization,
      otp,
      otpExpiration,
      isEmailVerified: false,
    });

    await newUser.save();
    await sendEmail(email, otp);

    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );

    response.cookies.set("just-registered", email, {
      httpOnly: true,
      maxAge: 5 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error('Error in /api/auth/send-otp:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
