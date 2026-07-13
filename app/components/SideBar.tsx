import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import Link from "next/link"
import { CalendarIcon, HomeIcon, LogOutIcon } from "lucide-react"
import { quickSearchOptions } from "../_constants/quickSearch"
import Image from "next/image"

const Sidebar = () => {
  return (
    <SheetContent className="overflow-y-auto p-6">
      <SheetHeader className="p-0">
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center gap-3 border-b border-solid py-5">
        <Avatar>
          <AvatarImage src="https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </Avatar>

        <div>
          <p className="font-bold">Arthur Matos</p>
          <p className="text-xs">Arthurteste@gmail.com</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-b pb-6">
        <SheetClose
          render={
            <Button className="justify-start gap-2" variant="ghost">
              <Link href="/" className="flex w-full items-center gap-2">
                <HomeIcon size={18} />
                Início
              </Link>
            </Button>
          }
        ></SheetClose>

        <Button variant="ghost" className="justify-start gap-2">
          <CalendarIcon size={18} />
          Agendamentos
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-b pb-6">
        {quickSearchOptions.map((option) => (
          <Button
            key={option.title}
            className="justify-start gap-2"
            variant="ghost"
          >
            <Image
              src={option.imageUrl}
              height={18}
              width={18}
              alt={option.title}
            />
            {option.title}
          </Button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-b pb-6">
        <Button variant="ghost" className="justify-start gap-2">
          <LogOutIcon size={18} />
          Sair da conta
        </Button>
      </div>
    </SheetContent>
  )
}

export default Sidebar
