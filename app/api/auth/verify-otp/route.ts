import dbConnect from "@/lib/db/mongodborder";
import {User} from "@/lib/models/User";

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { email, otp } = await request.json();
    const decodedemail = decodeURIComponent(email);
    console.log(decodedemail);
    const user = await User.findOne({ email: decodedemail });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.otp === otp;
    const isCodeNotExpired = new Date(user.otpExpiration) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
        user.isEmailVerified = true;
        await user.save();

      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}