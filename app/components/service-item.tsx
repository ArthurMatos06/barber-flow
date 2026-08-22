import Image from "next/image"
import { Barbershop } from "../generated/prisma/client"
import { Card, CardContent } from "./ui/card"
import ReserveBarber from "./reserveService"

interface ServiceProps {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  barbershopId: string
}

interface ReserveBarberProps {
  variant?: "default" | "secondary" | "outline"
  service: ServiceProps
  barbershop: Pick<Barbershop, "name">
}
export default function ServiceItem({
  service,
  barbershop,
}: ReserveBarberProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        {/* Imagem */}
        <div className="relative h-27.5 w-27.5 shrink-0 overflow-hidden rounded-xl">
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

            <ReserveBarber
              variant="default"
              service={service}
              barbershop={barbershop}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
