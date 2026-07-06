import Header from "./components/header"
import { Button } from "./components/ui/button"
import { SearchIcon } from "lucide-react"
import { Input } from "./components/ui/input"
import Image from "next/image"
const page = () => {
  return (
    <div>
      {/* Header */}

      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">OLÁ, USUARIO</h2>
        <p>domingo, 07 de julho.</p>

        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        <div className="relative mt-6 h-37.5 w-full">
          <Image
            alt="Agende nos melhores com fsw barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </div>
  )
}
export default page
