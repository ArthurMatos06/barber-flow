import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Button } from "./ui/button"
import Link from "next/link"
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react"
import { quickSearchOptions } from "../_constants/quickSearch"
import Image from "next/image"

type SidebarProps = {
  onLogin: () => void
}
const Sidebar = ({ onLogin }: SidebarProps) => {
  return (
    <SheetContent className="overflow-y-auto p-6">
      <SheetHeader className="p-0">
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        <h2 className="font-bold">Olá, faça seu login!</h2>

        <Button size="icon" onClick={onLogin}>
          <LogInIcon />
        </Button>
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
