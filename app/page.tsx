import Header from "./components/header"
import BarberShopItem from "./components/barberShop-item"
import { Button } from "./components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import { quickSearchOptions } from "./constants/search"
import BookingItem from "./components/booking-item"
import Search from "./components/search"
const page = async () => {
  //chamando banco de dados
  const barberShops = await db.barbershop.findMany({})
  const PopularBarberShops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  return (
    <div>
      {/* Header */}

      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">OLÁ, USUARIO</h2>
        <p>domingo, 07 de julho.</p>

        <div className="mt-6">
          <Search />
        </div>

        {/*Busca Rápida*/}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button key={option.label} className="gap-2" variant="secondary">
              <Image
                src={option.imageUrl}
                alt={option.label}
                width={16}
                height={16}
              />
              {option.label}
            </Button>
          ))}
        </div>
        {/*Imagem*/}
        <div className="relative mt-6 h-37.5 w-full">
          <Image
            alt="Agende nos melhores com fsw barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        {/*Agendamento*/}
        <BookingItem />
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
