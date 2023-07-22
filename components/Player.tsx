"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSong from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
    //Access the usePlayer custom hook:
    //usePlayer hook provides the player state and actions (e.g., ids, activeId, setId, setIds, reset). It is used 
    //to manage the current player state, such as the list of song IDs and the currently active song ID.
    const player = usePlayer();
    //Fetch song data using useGetSongById:
    const { song } = useGetSongById(player.activeId);
    /*
    used to load the URL of the fetched song for playback. The song value is asserted 
    as non-null using song! since useLoadSong requires a non-null song value. 
    The exclamation mark ! asserts that song is not nullable.
    */
    const songUrl = useLoadSong(song!); // tells TypeScript to treat the value of song as non-null and non-undefined

    //to avoid there is a black box under (render to empty content)
    //protection we don't load the player
    if (!song || !songUrl || !player.activeId) {
        return null;
    } 

    return ( 
        <div
            className="
                fixed
                bottom-0
                bg-black
                w-full
                py-2
                h-[80px]
                px-4 
            "
        >
            <PlayerContent
                // whenever the key changes, it completly destroys the element that was using and render as a completly new element
                //hence since we're going to enable users to skip the next song, we want to ensure the next player
                //component is practically destroyed before loading the new song. (our custom hook not support dynamic URL changes) 
                key={songUrl}
                song={song}
                songUrl={songUrl}
            />
        </div>
     );
}
 
export default Player;