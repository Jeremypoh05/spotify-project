import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

// retrieves a list of songs from a Supabase database.
const getSongsByUserId = async (): Promise<Song[]> => { //returns a Promise of an array of Song objects (Promise<Song[]>).
  const supabase = createServerComponentClient({ //passes the cookies object as a configuration option to the client. 
    cookies: cookies //This allows the client to access the necessary cookies for authentication.
  });

 const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }  

  const { data, error } = await supabase
   .from('songs')
   .select('*')
   .eq('user_id', sessionData.session?.user.id)
   .order('created_at', { ascending: false })
  //.eq = equal
  
  // If an error occurs during the database query, the error variable will be populated
  if (error) {
    console.log(error.message);
  }

  //If the query is successful and no error occurs, the function returns the retrieved data as an array of Song objects. 
  //The data variable is cast as any to handle any potential inconsistencies in the data format. 
  //By casting data as any (data as any), it allows the code to bypass TypeScript type checking and return the value of data as-is.
  // If data is null or undefined, it will evaluate to a falsy value, and the || [] part of the code will return an empty array []
  //ensures that even if there is an error or no data is returned from the database, the function will always return an array (either containing the retrieved data or an empty array) instead of null or undefined
  return (data as any) || [];
};

export default getSongsByUserId;