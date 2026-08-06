import { StarIcon } from "lucide-react"
import { Barbershop } from "../generated/prisma/client"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import Link from "next/link"
import ShowOnMobile from "../components/ShowOnMobile"
import ShowOnDesktop from "../components/ShowOnDesktop"

interface BarberShopItemProps {
  barberShop: Barbershop
}

const BarberShopItem = ({ barberShop }: BarberShopItemProps) => {
  //dps colocar um props class name para poder resolver o problema de size na pagina barbershops
  return (
    <>
      <ShowOnMobile>
        <Card className="w-full min-w-41.75 rounded-2xl border bg-black/20 backdrop-blur-sm">
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
                className="border-gray/05 absolute top-2 left-2 space-x-1 bg-black/30 backdrop-blur-xs"
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
              <Link
                href={`/barbershops/${barberShop.id}`}
                className="mt-3 block"
              >
                <Button variant="secondary" className="w-full">
                  Reservar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </ShowOnMobile>
      <ShowOnDesktop>
        <Card className="border-gray/20 w-full min-w-70 rounded-2xl border bg-black/20 backdrop-blur-sm">
          <CardContent className="p-0 px-3 pt-2">
            {/* Imagem */}
            <div className="relative h-56 w-full">
              <Image
                fill
                alt={barberShop.name}
                sizes="100vw"
                className="rounded-2xl object-cover"
                src={barberShop.imageUrl}
              />

              <Badge
                className="absolute top-3 left-3 space-x-1 bg-black/30 backdrop-blur-xs"
                variant="secondary"
              >
                <StarIcon size={14} className="fill-primary text-primary" />
                <p className="text-sm font-semibold">5,0</p>
              </Badge>
            </div>

            {/* Texto */}
            <div className="px-2 py-4">
              <h3 className="truncate text-lg font-semibold">
                {barberShop.name}
              </h3>

              <p className="mt-1 truncate text-base text-gray-400">
                {barberShop.description}
              </p>

              <Link
                href={`/barbershops/${barberShop.id}`}
                className="mt-4 block"
              >
                <Button className="h-11 w-full">Reservar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </ShowOnDesktop>
    </>
  )
}
export default BarberShopItem
