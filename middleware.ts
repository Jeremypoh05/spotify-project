// -----------The reason for these codes is for authentication ------------- //
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs' //This function is used to create a Supabase client specifically for server-side authentication.
import { NextRequest, NextResponse } from 'next/server' //These types are used for defining the request and response objects in Next.js server-side functions.

export async function middleware(req: NextRequest) { //This exports an asynchronous function called middleware that takes a NextRequest object as a parameter. This function acts as a middleware function to handle server-side authentication.
  const res = NextResponse.next(); //This initializes the res variable as a NextResponse object using the NextResponse.next() method.
  //This creates a Supabase client specifically for server-side authentication by calling the createMiddlewareClient function and passing in the req (request) and res (response) objects. 
  //This allows the Supabase client to access the necessary information for authentication.
  const supabase = createMiddlewareClient({ req, res }); 
  //This makes an asynchronous call to the getSession method of the auth object in the Supabase client. 
  //This retrieves the user session and performs the necessary authentication checks.
  await supabase.auth.getSession();
  // This returns the res (response) object, which contains the updated response based on the authentication checks performed by Supabase
  return res;
};