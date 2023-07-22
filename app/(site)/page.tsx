import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import getSongs from "@/actions/getSongs";
import PageContent from "./components/PageContent";

export const revalidate = 0; //this page will not be cached and the data on it will always up to date.

export default async function Home() {
  const songs = await getSongs(); //retrieve the songs by calling getSongs();

  return (
    <div
      className="
      bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header>
        <div className="mb-2">
          <h1 className="
          text-white
            text-3xl
            font-semibold
          "
          >
            Welcome Back !
          </h1>
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              xl:grid-cols-3 
              2xl:grid-cols-4 
              gap-3 
              mt-4
            "
          >
            <ListItem
              image="/images/liked.png"
              name="Liked Songs"
              href="liked" //if u here write liked, then u need to create a folder name same as this(Liked)and it will direct render the page.tsx
            />
          </div>
        </div>
      </Header>
      {/* ---------------Main Content (Song Lists Starts) ----------------- */}
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Newest songs
          </h1>
        </div>
        {/* List of Songs! */}
        <div>
          {/* {songs.map((foreachSong) => <div>{foreachSong.title}</div>)} */}
          <PageContent pageContentSongs={songs} />
        </div>
      </div>
    </div>
  )
}

/* Typically like this,
<RootLayout>
  <div>Hello Spotify</div>
</RootLayout>
*/
