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
    <Card className="border-gray/20 w-full min-w-41.75 rounded-2xl border bg-black/20 backdrop-blur-sm lg:min-w-70">
      <CardContent className="p-0 px-1 pt-1 lg:px-3 lg:pt-2">
        {/* Imagem */}
        <div className="relative h-39.75 w-full lg:h-56">
          <Image
            fill
            alt={barberShop.name}
            sizes="100vw"
            className="rounded-2xl object-cover"
            src={barberShop.imageUrl}
          />
          <Badge
            className="absolute top-2 left-2 space-x-1 bg-black/30 backdrop-blur-xs lg:top-3 lg:left-3"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <p className="text-xs font-semibold lg:text-sm">5,0</p>
          </Badge>
        </div>
        {/* Texto */}
        <div className="px-1 py-3 lg:px-2 lg:py-4">
          <h3 className="truncate font-semibold lg:text-lg">
            {barberShop.name}
          </h3>
          <p className="truncate text-sm text-gray-400 lg:mt-1 lg:text-base">
            {barberShop.description}
          </p>
          <Link
            href={`/barbershops/${barberShop.id}`}
            className="mt-3 block lg:mt-4"
          >
            <Button variant="secondary" className="w-full lg:h-11">
              Reservar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
export default BarberShopItem
