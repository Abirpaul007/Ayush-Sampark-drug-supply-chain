import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      isEmailVerified?: boolean;
      isVerified?: boolean;
      name?: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    isEmailVerified?: boolean;
    isVerified?: boolean;
    name?: string;
    role?: string;

  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    isEmailVerified?: boolean;
    isVerified?: boolean;
    name?: string;
    role?: string;

  }
}