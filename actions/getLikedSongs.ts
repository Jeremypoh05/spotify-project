import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

// retrieves a list of songs from a Supabase database.
const getLikedSongs = async (): Promise<Song[]> => { //returns a Promise of an array of Song objects (Promise<Song[]>).
  const supabase = createServerComponentClient({ //passes the cookies object as a configuration option to the client. 
    cookies: cookies //This allows the client to access the necessary cookies for authentication.
  });

  const {
    data: {
      session
    }
  } = await supabase.auth.getSession();

  const { data, error } = await supabase 
  //ses the select('*') method to retrieve all columns of the songs table. 
  //The order('created_at', { ascending: false }) method is used to order the results by the "created_at" column in descending order.
    .from('liked_songs')
    .select('*, songs(*)')
    .eq('user_id', session?.user?.id)
    .order('created_at', { ascending: false })

  // If an error occurs during the database query, the error variable will be populated
  if (error) {
    console.log(error.message);
    return [];
  }

  if (!data) {
    return [];
  }
  //If the query is successful and no error occurs, the function returns the retrieved data as an array of Song objects. 
  //The data variable is cast as any to handle any potential inconsistencies in the data format. 
  //By casting data as any (data as any), it allows the code to bypass TypeScript type checking and return the value of data as-is.
  // If data is null or undefined, it will evaluate to a falsy value, and the || [] part of the code will return an empty array []
  //ensures that even if there is an error or no data is returned from the database, the function will always return an array (either containing the retrieved data or an empty array) instead of null or undefined
  return data.map((item) => ({
    ...item.songs
  }));
};

export default getLikedSongs;