// /lib/sendOTPEmail.ts
import { resend } from "@/lib/resend";
import VerificationEmail from "../emails/VerificationEmail";

export async function sendOTPEmail(
    email: string,
    name: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      await resend.emails.send({
        from: 'ayushsampark@resend.com',
        to: email,
        subject: 'Mystery Message Verification Code',
        react: VerificationEmail({ name, otp: otp }),
      });
      return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return { success: false, message: 'Failed to send verification email.' };
    }
  }