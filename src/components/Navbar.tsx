// @ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import { useRecoilState } from 'recoil'
import { tokenAtom } from '@/store/atoms/atoms'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"
import Content from "./Content"

const frameworks = [
    {
        value: "image",
        label: "image",
    },
    {
        value: "video",
        label: "video",
    },
    {
        value: "audio",
        label: "audio",
    },
    {
        value: "article",
        label: "article",
    },
    {
        value: "figma",
        label: "figma",
    },
    {
        value: "tweet",
        label: "tweet"
    },
    {
        value: "code",
        label: "code"
    }
]

const url = import.meta.env.VITE_CREATE_CONTENT_ENDPOINT

const Navbar = () => {
    const navigate = useNavigate()
    const [token, setToken] = useRecoilState(tokenAtom)
    const [link, setLink] = useState('')
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('');

    function handleLogOut() {
        localStorage.removeItem("token")
        setToken('')
        navigate("/signin")
    }

    function handleTags(e: any) {
        const value = e.target.value;
        setInputValue(value);
        if (value.includes(" ")) {
            const newTags = value
                .trim() 
                .split(" ") 
                .filter((tag : any) => tag !== ""); 

            setTags([...tags, ...newTags]);
            setInputValue(""); 
        }
    }

    function handleSubmit () {
        console.log(link, title, tags, value)
        setIsLoading(true)
        axios.post(url, {
            token,
            link, 
            linkType: value,
            title,
            tags
          })
          .then(function (response) {
           toast("Content Added");
           setTitle('')
           setLink('')
           setTags([])
            setValue('')
          })
          .catch(function (error) {
            setError(error.response.data.message);
          });
        setIsLoading(false)
    }

    return (
        <>
        <Toaster />
            <div>
                <div className='relative font-bold text-4xl top-9 flex justify-between'>
                    <div className='flex gap-8'>
                        <p>All Notes</p>
                        <Popover>
                            <PopoverTrigger>
                                <Avatar className='hover:border hover:border-b-slate-400 hover:cursor-pointer'>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className='bg-black border-[#26262A] text-white text-center hover:cursor-pointer' onClick={handleLogOut}>Logout</PopoverContent>
                        </Popover>
                    </div>
                    <Dialog>
                        <DialogTrigger><Button className='mr-10'>Add Content</Button></DialogTrigger>
                        <DialogContent className="text-white">
                            <DialogHeader>
                                <DialogTitle className='text-white mb-3'>Add content</DialogTitle>
                                <div className="text-white space-y-3">
                                    <Input onChange={(e) => setLink(e.target.value)} className="border-[#26262A] focus:border-white" placeholder="Paste Link" type="url" />
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between bg-black border-[#26262A] hover:bg-black"
                                            >
                                                {value
                                                    ? frameworks.find((framework) => framework.value === value)?.label
                                                    : "Select Type..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <Command className="bg-black text-white">
                                                <CommandInput className="bg-black text-white" placeholder="Search Types..." />
                                                <CommandList className="w-full text-white bg-black">

                                                    <CommandGroup>
                                                        {frameworks.map((framework) => (
                                                            <CommandItem
                                                                key={framework.value}
                                                                value={framework.value}
                                                                onSelect={(currentValue) => {
                                                                    setValue(currentValue === value ? "" : currentValue)
                                                                    setOpen(false)
                                                                }}
                                                                className="text-white"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        value === framework.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {framework.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <Input onChange={(e) => setTitle(e.target.value)} className="border-[#26262A] focus:border-white" placeholder="Title" />
                                    <Input value={inputValue} onChange={handleTags} className="border-[#26262A] focus:border-white" placeholder="Tags" />
                                    <Button disabled={isLoading} className="bg-black w-full" onClick={handleSubmit}>Submit</Button>
                                    <p className="text-center text-red-500">{error}</p>
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                <Content />
            </div>
        </>
    )
}

export default Navbar