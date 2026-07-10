import { StarIcon } from "lucide-react"
import { Barbershop } from "../generated/prisma/client"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import Link from "next/link"

interface BarberShopItemProps {
  barberShop: Barbershop
}

const BarberShopItem = ({ barberShop }: BarberShopItemProps) => {
  return (
    <Card className="min-w-41.75 rounded-2xl">
      <CardContent className="p-0 px-1 pt-1">
        {/* {imagem} */}
        <div className="relative h-39.75 w-full">
          <Image
            fill
            alt={barberShop.name}
            sizes="'100vw"
            className="rounded-2xl object-cover"
            src={barberShop.imageUrl}
          />

          <Badge
            className="absolute top-2 left-2 space-x-1 bg-black/30 backdrop-blur-xs"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <p className="text-xs font-semibold">5,0</p>
          </Badge>
        </div>
        {/* {texto} */}
        <div className="px-1 py-3">
          <h3 className="truncate font-semibold">{barberShop.name}</h3>
          <p className="truncate text-sm text-gray-400">
            {barberShop.description}
          </p>
          <Button variant="secondary" className="mt-3 w-full">
            <Link href={`/barbershops/${barberShop.id}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default BarberShopItem
