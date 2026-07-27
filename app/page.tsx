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
import ShowOnMobile from "./components/ShowOnMobile"
import ShowOnDesktop from "./components/ShowOnDesktop"

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
        <>
          {session?.user ? (
            <h2 className="text-xl font-bold capitalize md:text-4xl">
              Olá {session.user.name}
            </h2>
          ) : (
            <h2 className="text-xl font-bold md:text-3xl">Olá Visitante</h2>
          )}
          <p className="md: text-sm text-gray-400 md:text-base">
            {format(new Date(), "EEEE, dd 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </>
        {/* Busca */}
        <ShowOnMobile>
          <div className="mt-6">
            <Search />
          </div>
        </ShowOnMobile>
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
        </div>
        {/*Banner*/}
        <ShowOnMobile>
          <div className="relative mt-6 h-37.5 w-full">
            <Image
              alt="Agende nos melhores com fsw barber"
              src="/banner-01.png"
              fill
              className="rounded-xl object-cover"
            />
          </div>
        </ShowOnMobile>
        <ShowOnDesktop>
          <div className="relative mt-6 aspect-1936/544 w-full">
            <Image
              alt="Agende nos melhores com fsw barber"
              src="/deskbanner.png"
              fill
              className="rounded-xl object-cover"
            />
          </div>
        </ShowOnDesktop>
        {/*Agendamento*/}
        {session?.user && (
          <>
            <h1 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase md:text-xl">
              Agendamentos
            </h1>
          </>
        )}
        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
        {/*Recomendados*/}
        <ShowOnMobile>
          <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
            Recomendados para você
          </h2>
        </ShowOnMobile>
        <ShowOnDesktop>
          <p className="text-primary mt-10 text-sm font-semibold uppercase">
            destaques
          </p>
          <h1 className="mt-1 mb-3 text-2xl font-bold text-white uppercase">
            Recomendados para você
          </h1>
        </ShowOnDesktop>

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
