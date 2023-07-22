"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

interface LikeButtonProps {
    songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
    songId
}) => {

    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const authModal = useAuthModal();
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(false); //initialize isLiked is false

    //fetch data from the liked_songs table in the Supabase database and check whether the current song is liked by the current user.
    useEffect(() => {
        //ensure that there is a logged-in user (user?.id is truthy) before attempting to fetch data from the database.
        //If there is no user logged in(!user?.id), the effect returns early.
        if (!user?.id) {
            setIsLiked(false);
            return;
        }

        const fetchData = async () => {
            const { data, error } = await supabaseClient
                //selects all columns (*) from the 'liked_songs' table where the user_id(database) matches the current user's ID and the song_id(database) matches the songId prop.
                .from('liked_songs')
                .select('*')
                .eq('user_id', user.id)
                .eq('song_id', songId)
                .single();

            //If the API call is successful and the data is returned, 
            //it means the current song is liked by the user, so the isLiked state is set to true.
            if (!error && data) {
                setIsLiked(true);
            }
        };

        fetchData();
    }, [songId, supabaseClient, user?.id]); // triggered when the component is mounted and
    //whenever the values of its dependencies (songId, supabaseClient, and user?.id) change

    /*
    the useEffect hook will run whenever the songId prop changes (provided by the parent component), and it will run once when the component 
    is mounted for the first time (due to the absence of a dependency array) to fetch the initial like status from the database. 
    Additionally, if the user object changes (e.g., due to user authentication changes), it will also trigger the 
    useEffect hook to run again with the updated user?.id value.
    */

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart

    // handle the like/unlike action when the user clicks the like button.
    const handleLike = async () => {
        // If there is no user logged in (!user), the authentication modal is opened to prompt the user to log in.
        if (!user) {
            return authModal.doOpen(); //ask user to login
        }

        //If the song is already liked 
        if (isLiked) {
            const { error } = await supabaseClient
                //deleted from the database using the delete method
                .from('liked_songs')
                .delete()
                .eq('user_id', user.id)
                .eq('song_id', songId)

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(false);
                toast.success('Deleted Likes!');
            }
        } else {
            const { error } = await supabaseClient
                //inserted into the database with the song_id and user_id values.
                .from('liked_songs')
                .insert({
                    song_id: songId,
                    user_id: user.id
                });

            if (error) {
                toast.error(error.message)
            } else {
                setIsLiked(true);
                toast.success('Liked!');
            }
        }

        router.refresh();
    }

    return (
        <button
            onClick={handleLike}
            className="
                hover:opacity-70
                transition
            "
        >
            <Icon color={isLiked ? '#22c55e' : 'white'} size={26} />
        </button>
    );
}

export default LikeButton;