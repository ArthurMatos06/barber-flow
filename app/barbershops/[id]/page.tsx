import { db } from "@/app/_lib/prisma"
import Header from "@/app/components/header"
import MobileMenu from "@/app/components/MobileMenu"
import PhoneItem from "@/app/components/phone-item"
import ServiceItem from "@/app/components/service-item"
import { Button } from "@/app/components/ui/button"
import { ChevronLeftIcon, MapPinIcon, StarIcon } from "lucide-react"
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

  if (!barbershop) {
    return notFound()
  }

  const services = barbershop.services.map((service) => ({
    ...service,
    price: Number(service.price),
  }))

  return (
    <>
      {/* ================= LAYOUT MOBILE =================
          Visível apenas abaixo de md (md:hidden). Layout em coluna única,
          com imagem no topo e seções empilhadas. Usamos classe CSS em vez
          do antigo componente ShowOnMobile para não gerar hydration mismatch. */}
      <div className="md:hidden">
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

            <MobileMenu
              variant="secondary"
              className="absolute top-4 right-4"
            />
          </div>
          {/* nome e avaliações */}
          <div className="border-b border-solid p-5">
            <h1 className="mb-6 text-xl font-bold">{barbershop.name}</h1>
            <div className="mb-3 flex items-center gap-1">
              <MapPinIcon className="text-primary" size={18} />
              <p className="text-muted-foreground text-sm">
                {barbershop?.address}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="fill-primary text-primary" size={18} />
              <p className="text-muted-foreground text-sm">
                5,0 (138 avaliações)
              </p>
            </div>
          </div>
          {/* descrição */}
          <div className="space-y-3 border-b border-solid p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase">
              Sobre nós
            </h2>
            <p className="text-justify text-sm">{barbershop?.description}</p>
          </div>
          {/* servicos */}
          <div className="space-y-3 p-5">
            <h2 className="mb-2 text-xs font-bold text-gray-400 uppercase">
              Servicos
            </h2>
            <div className="space-y-3">
              {services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  barbershop={barbershop}
                />
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
      </div>
      {/* ================= LAYOUT DESKTOP =================
          Oculto no mobile e visível a partir de md (hidden md:block).
          Layout mais rico: hero, conteúdo em 2 colunas + sidebar fixa.
          Classe CSS substitui o antigo componente ShowOnDesktop. */}
      <div className="hidden md:block">
        <Header />
        <div className="mx-auto max-w-6xl px-8 py-8">
          {/* Hero */}
          <div className="relative mb-8 h-80 w-full overflow-hidden rounded-2xl">
            <Image
              alt={barbershop.name}
              src={barbershop.imageUrl}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

            <div className="absolute right-8 bottom-6 left-8 flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {barbershop.name}
                </h1>
                <div className="mt-2 flex items-center gap-1">
                  <MapPinIcon className="text-primary" size={18} />
                  <p className="text-sm text-white/80">{barbershop?.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <StarIcon className="fill-primary text-primary" size={18} />
                <p className="text-sm font-medium text-white">
                  5,0 <span className="text-white/70">(138 avaliações)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo principal + sidebar */}
          <div className="grid grid-cols-3 gap-10">
            {/* Coluna principal */}
            <div className="col-span-2 space-y-10">
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase">
                  Sobre nós
                </h2>
                <p className="text-muted-foreground text-justify text-sm leading-relaxed">
                  {barbershop?.description}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase">
                  Serviços
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {services.map((service) => (
                    <ServiceItem
                      key={service.id}
                      service={service}
                      barbershop={barbershop}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar fixa */}
            <aside className="col-span-1">
              <div className="sticky top-8 space-y-6 rounded-2xl border p-6">
                <div>
                  <h2 className="mb-3 text-xs font-bold text-gray-400 uppercase">
                    Contato
                  </h2>
                  <div className="space-y-3">
                    {barbershop.phones.map((phone) => (
                      <PhoneItem phone={phone} key={phone} />
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
