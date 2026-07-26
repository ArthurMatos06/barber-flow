import Header from "./components/header"
import BarberShopItem from "./components/barberShop-item"
import { Button } from "./components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import { quickSearchOptions } from "./constants/search"
import BookingItem from "./components/booking-item"
import Search from "./components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { format } from "date-fns/format"
import { ptBR } from "date-fns/locale/pt-BR"
import { authOptions } from "./_lib/auth"

const page = async () => {
  //chamando banco de dados
  const session = await getServerSession(authOptions)
  const barberShops = await db.barbershop.findMany({})
  const PopularBarberShops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  const confirmedBookings = session?.user
    ? await db.booking.findMany({
        where: {
          userId: session?.user.id,
          date: {
            gte: new Date(),
          },
        },
        include: {
          service: {
            include: {
              barbershop: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      })
    : []
  return (
    <div>
      {/* Header */}

      <Header />
      <div className="p-5">
        {session?.user ? (
          <>
            <h2 className="text-xl font-bold">Olá {session.user.name}</h2>
            <p>
              {format(new Date(), "EEEE, dd 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
          </>
        ) : (
          ""
        )}

        <div className="mt-6">
          <Search />
        </div>

        {/*Busca Rápida*/}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              key={option.label}
              className="gap-2"
              variant="secondary"
              render={
                <Link href={`/barbershops?service=${option.label}`}>
                  <Image
                    src={option.imageUrl}
                    alt={option.label}
                    width={16}
                    height={16}
                  />
                  {option.label}
                </Link>
              }
            ></Button>
          ))}
          {/*Imagem*/}
        </div>
        <div className="relative mt-6 h-37.5 w-full">
          <Image
            alt="Agende nos melhores com fsw barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        {/*Agendamento*/}
        <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
          Agendamentos
        </h2>
        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
          Recomendados para você
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barberShops.map((barberShop) => (
            <BarberShopItem key={barberShop.id} barberShop={barberShop} />
          ))}
        </div>
        <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
          Barbearias Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {PopularBarberShops.map((barberShop) => (
            <BarberShopItem key={barberShop.id} barberShop={barberShop} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default page
