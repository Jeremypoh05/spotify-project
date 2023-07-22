import { FaPlay } from "react-icons/fa";

const PlayButton = () => {
    return (
        <button
            className="
                transition 
                opacity-0 
                rounded-full 
                flex 
                items-center 
                justify-center 
                bg-green-500 
                p-4 
                drop-shadow-md 
                translate
                translate-y-1/4
                group-hover:opacity-100  
                group-hover:translate-y-0
                hover:scale-110
            "
            //we can directly use group-hover here cuz we have initialize the parent class in the SongItem.tsx (first div ->   relative, group)
        >
            <FaPlay className="text-black" />
        </button>
    );
}

export default PlayButton;