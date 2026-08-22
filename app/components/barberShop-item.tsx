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

// Card de barbearia usado nas listagens (home e página de resultados).
// Usamos APENAS classes responsivas do Tailwind (breakpoint md:) para
// alternar entre o tamanho mobile e o tamanho desktop. Isso evita o
// "hydration mismatch" que acontecia quando o tamanho da tela era decidido
// via JavaScript (componentes ShowOnDesktop/ShowOnMobile + hook useIsDesktop).
const BarberShopItem = ({ barberShop }: BarberShopItemProps) => {
  return (
    // Card único e responsivo: no mobile fica compacto (min-w menor),
    // a partir de md: cresce para o tamanho desktop.
    <Card className="border-gray/20 w-full min-w-41.75 rounded-2xl border bg-black/20 backdrop-blur-sm md:min-w-70">
      <CardContent className="p-0 px-1 pt-1 md:px-3 md:pt-2">
        {/* Imagem da barbearia com a badge de avaliação sobreposta */}
        <div className="relative h-39.75 w-full md:h-56">
          <Image
            fill
            alt={barberShop.name}
            // sizes correto (sem o apóstrofo extra que gerava warning do Next)
            sizes="100vw"
            className="rounded-2xl object-cover"
            src={barberShop.imageUrl}
          />
          {/* Badge de nota, cresce levemente no desktop */}
          <Badge
            className="absolute top-2 left-2 space-x-1 bg-black/30 backdrop-blur-xs md:top-3 md:left-3"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <p className="text-xs font-semibold md:text-sm">5,0</p>
          </Badge>
        </div>
        {/* Bloco de texto: nome, descrição e botão de reserva */}
        <div className="px-1 py-3 md:px-2 md:py-4">
          <h3 className="truncate font-semibold md:text-lg">
            {barberShop.name}
          </h3>
          <p className="truncate text-sm text-gray-400 md:mt-1 md:text-base">
            {barberShop.description}
          </p>
          <Link
            href={`/barbershops/${barberShop.id}`}
            className="mt-3 block md:mt-4"
          >
            <Button variant="secondary" className="w-full md:h-11">
              Reservar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
export default BarberShopItem
