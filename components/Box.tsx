import { twMerge } from 'tailwind-merge'

interface BoxProps {
  children: React.ReactNode
  className?: string
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        //twMerge allow you to add additional css to the parent (Which is Sidebar.tsx that using Box component)
        `
        bg-neutral-900 
        rounded-lg 
        h-fit 
        w-full
        `,
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Box
