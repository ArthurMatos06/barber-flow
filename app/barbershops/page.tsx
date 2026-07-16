import { db } from "../_lib/prisma"
import BarberShopItem from "../components/barberShop-item"
import Header from "../components/header"
import Search from "../components/search"

interface BarberShopsPageProps {
  searchParams: Promise<{
    search?: string
  }>
}
//relembrar o que é uma Promisse
const BarberShopsPage = async ({ searchParams }: BarberShopsPageProps) => {
  const params = await searchParams
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: params?.search,
        mode: "insensitive",
      },
    },
  })
  return (
    <div>
      <Header />
      <div className="my-6 px-5">
        <Search />
      </div>
      <div className="px-5">
        <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
          Resultados para &quot;{params.search}&quot;
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {barbershops.map((barberShop) => (
            <BarberShopItem key={barberShop.id} barberShop={barberShop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarberShopsPage
