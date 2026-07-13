import { db } from "@/app/_lib/prisma"
import PhoneItem from "@/app/components/phone-item"
import ServiceItem from "@/app/components/service-item"
import SideBar from "@/app/components/sidebar-Sheet"
import { Button } from "@/app/components/ui/button"
import { Sheet, SheetTrigger } from "@/app/components/ui/sheet"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function BarbershopPage({ params }: Props) {
  const { id } = await params

  const barbershop = await db.barbershop.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
    },
  })

  // Evita os erros de null
  if (!barbershop) {
    return notFound()
  }

  return (
    <div>
      {/* Imagem e icones dentro dela*/}
      <div className="relative h-62.5 w-full">
        <Image
          alt={barbershop.name}
          src={barbershop.imageUrl}
          fill
          className="object-cover"
        />

        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 left-4"
        >
          <Link href="/">
            <ChevronLeftIcon />
          </Link>
        </Button>

        <Sheet>
          <SheetTrigger>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SideBar />
        </Sheet>
      </div>
      {/* nome e avaliações */}
      <div className="border-b border-solid p-5">
        <h1 className="mb-6 text-xl font-bold">{barbershop.name}</h1>
        <div className="mb-3 flex items-center gap-1">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-muted-foreground text-sm">{barbershop?.address}</p>
        </div>
        <div className="flex items-center gap-1">
          <StarIcon className="fill-primary text-primary" size={18} />
          <p className="text-muted-foreground text-sm">5,0 (138 avaliações)</p>
        </div>
      </div>
      {/* descrição */}
      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase">Sobre nós</h2>
        <p className="text-justify text-sm">{barbershop?.description}</p>
      </div>

      {/* servicos */}
      <div className="space-y-3 p-5">
        <h2 className="mb-2 text-xs font-bold text-gray-400 uppercase">
          Servicos
        </h2>
        <div className="space-y-3">
          {barbershop.services.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </div>
      </div>
      {/* Contato */}
      <div className="space-y-3 p-5">
        {barbershop.phones.map((phone) => (
          <PhoneItem phone={phone} key={phone} />
        ))}
      </div>
    </div>
  )
}
