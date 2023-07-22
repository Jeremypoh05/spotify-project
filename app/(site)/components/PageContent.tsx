"use client";

import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";

interface PageContentProps {
    pageContentSongs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({
    pageContentSongs
}) => {
    const onPlay = useOnPlay(pageContentSongs);//passed the argument of songs

    if (pageContentSongs.length === 0) {
        return (
            <div className="mt-4 text-neutral-400">
                No songs available.
            </div>
        )
    }

    return (
        <div
            className="
                grid 
                grid-cols-2 
                sm:grid-cols-3 
                md:grid-cols-3 
                lg:grid-cols-4 
                xl:grid-cols-5 
                2xl:grid-cols-8 
                gap-4 
                mt-4
            "
        >
            {pageContentSongs.map((item) => (
                <SongItem
                    onClick={(id: string) => {onPlay(id)}}
                    key={item.id}
                    data={item}
                />
            ))}
        </div>
    );
}

export default PageContent;