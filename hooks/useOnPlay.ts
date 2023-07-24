import { Song } from "@/types";

import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";

const useOnPlay = (songs: Song[]) => {
    const player = usePlayer();
    const authModal = useAuthModal();
    const subscribeModal = useSubscribeModal();
    const { user, subscription } = useUser();

    const onPlay = (id: string) => {
        if (!user) {
            return authModal.doOpen();
        }

        // if (!subscription) {
        //     return subscribeModal.doOpen();
        // }

        /*
            everytimes we create on this onPlay, we're gonna play the current ID(song) that the user clicked on
            but we also(second line->map) create a playlist out of all the songs where user clicked. Hence, if user clicked the play inside 
            of liked songs section, we're gonna create a playlist of those liked songs. If we clicked the play on the library section, we're
            only gonna create a playlist of those section, as well as search section(if two songs showed up) so, only play two songs.
        */
        player.setId(id)
        player.setIds(songs.map((song) => song.id));
    };

    return onPlay;
}

export default useOnPlay;