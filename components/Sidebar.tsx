'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { HiHome } from 'react-icons/hi'
import { BiSearch } from 'react-icons/bi'

import Box from './Box'
import SidebarItem from './SidebarItem'
import Library from './Library'

import { Song } from '@/types'
import usePlayer from '@/hooks/usePlayer'
import { twMerge } from 'tailwind-merge'

interface SidebarProps {
    children: React.ReactNode; //this children is passing to the site (page)
    songs: Song[]; //doing prop drilling 
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
    const pathname = usePathname();
    const player = usePlayer();

    //all of this prop is from SidebarItem (we have initialize there), then we use this routes inside the SidebarItem component
    const routes = useMemo(
        () => [
            {
                icon: HiHome,
                label: 'Home',
                active: pathname !== '/search',
                href: '/', //active when every time we are not on /search
            },
            {
                icon: BiSearch,
                label: 'Search',
                active: pathname === '/search',
                href: '/search', //only active when we on the /search 
            },
        ],
        [pathname],
    )

    return (
        <div className={twMerge(`
            flex
            h-full
        `,
            //when the player is active, we will move up 80px the sidebar
            player.activeId && "h-[calc(100%-80px)]"
        )}>
            <div
                className="
                hidden 
                md:flex 
                flex-col 
                gap-y-2 
                bg-black 
                h-full 
                w-[300px] 
                p-2
                "
            >
                <Box className='flex flex-col gap-y-4 px-5 py-4'>
                    {/*we have initialize the routes at the top */}
                    {routes.map((item) => (
                        <SidebarItem key={item.label} {...item} />
                    ))}
                </Box>
                <Box className="overflow-y-auto h-full">
                  <Library songs={songs} />
                </Box>
            </div>
            {/* here will show the right side content(main section) */}
            <main className='h-full flex-1 overflow-y-auto py-2'>
                {children}
            </main>
        </div>
    )
}

export default Sidebar
