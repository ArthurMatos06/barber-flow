import Image from "next/image"
import { BarbershopService } from "../generated/prisma/client"
import { Card, CardContent } from "./ui/card"
import ReserveBarber from "./reserveService"

interface ServiceItemProps {
  service: BarbershopService
}
export default function ServiceItem({ service }: ServiceItemProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        {/* Imagem */}
        <div className="relative h-[110px] w-[110px] shrink-0 overflow-hidden rounded-xl">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold">{service.name}</h3>

            <p className="mt-2 line-clamp-2 text-sm text-gray-400">
              {service.description}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-primary font-bold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>

            <ReserveBarber variant="outline" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
