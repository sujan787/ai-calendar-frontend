import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/", req.url));

  let loginUser = null;
console.log(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/google/login_user`)
  try {
    loginUser = (
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/google/login_user`,
        { headers: { auth_token: token }, withCredentials: true }
      )
    ).data;
  } catch (error: any) {
    console.log(error.message);
  }

  if (!loginUser) return NextResponse.redirect(new URL("/", req.url));

  let calendarStatus = false

  try {
    calendarStatus = (
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/google/calendar_status`,
        { headers: { auth_token: token }, withCredentials: true }
      )
    ).data.status;
  } catch (error: any) {
    console.log(error.message);
  }

  if (!calendarStatus) return NextResponse.redirect(new URL("/calendar", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
