import { useEffect, useMemo, useState } from "react"
import { useSessionContext } from "@supabase/auth-helpers-react";

import { Song } from "@/types";
import { toast } from "react-hot-toast";


/*
 responsible for fetching a song by its ID from a Supabase database. It uses the useEffect hook 
 to handle the asynchronous data fetching when the id prop changes, and the useMemo hook to memoize 
 the results for efficient re-rendering.
*/

//Define the useGetSongById custom hook:
//The hook takes an optional id parameter, which is the ID of the song to fetch. 
//If the id is not provided, the hook won't perform any fetching.
const useGetSongById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState<Song | undefined>(undefined); //by default it is going to be undefined
    //to get access to the Supabase client, which allows it to make queries to the Supabase database. Perform data fetching:
    const { supabaseClient } = useSessionContext(); 
    /*the reason we not use const supabaseClient = useSupabaseClient(); because we only initialize this supabaseClient only once
    e.g when we fetch song, fetch likes, fetch url from storage, all of that has read access for everyone both authenticated or unauthenticated,
    but if we want to change something and made it only authenticated users can even see the songs which are on the page, useSessionContext() better.
    */

    // used to trigger the data fetching whenever the id or supabaseClient changes. 
    useEffect(() => {

    //If id is not provided (or is falsy), the function will return early and no fetching will occur.
      if (!id) {
        return;
      }  

      setIsLoading(true); //called to indicate that data fetching is in progress

      //perform the actual data fetching.
      const fetchSong = async () => {
        const { data, error } = await supabaseClient 
        //query the 'songs' table for the specific song with the given id.
            .from('songs')
            .select('*')
            .eq('id', id)
            .single();

            //If an error occurs during the fetching process, the isLoading state is set back to false, 
            //and an error toast is displayed using react-hot-toast.
            if (error) {
                setIsLoading(false)
                return toast.error(error.message);
            }

            //If the data is successfully fetched, the song state is updated with the fetched song, 
            //and isLoading is set back to false.
            setSong(data as Song);
            setIsLoading(false);
      }
    
      fetchSong();
    }, [id, supabaseClient]);

    //Memoize the result for re-rendering optimization:
    //ensures that the same object with isLoading and song properties is returned if their values have not changed. 
    //This memoization helps in preventing unnecessary re-renders in consuming components.
    return useMemo(() => ({
        isLoading,
        song
    }), [isLoading, song])
}

export default useGetSongById;