import { useCallback } from "react"
import { Circle, Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { compareDesc } from "date-fns"
import { allPosts } from "contentlayer/generated"
import { useRouter } from "next/navigation"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"

interface SearchWithCommandProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchWithCommand: React.FC<SearchWithCommandProps> = ({ open, setOpen }) => {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const { setTheme } = useTheme()
  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  const router = useRouter()

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden" />
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Post">
          {posts.map(({ url, title }) => (
            <CommandItem
              key={url}
              value={title}
              onSelect={() => {
                runCommand(() => router.push(url))
              }}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center">
                <Circle className="h-3 w-3" />
              </div>
              {title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun />
            Light
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon />
            Dark
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop />
            System
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default SearchWithCommand
