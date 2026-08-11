import { db } from "../_lib/prisma"
import BarberShopItem from "../components/barberShop-item"
import Header from "../components/header"
import Search from "../components/search"
import ShowOnDesktop from "../components/ShowOnDesktop"
import ShowOnMobile from "../components/ShowOnMobile"
//FIXME: arruamar pq quando eu mudo manualmente o parameto service ele nao aplica o grid cols desktrop
interface BarberShopsPageProps {
  searchParams: Promise<{
    service?: string
    title?: string
  }>
}
//relembrar o que é uma Promisse
const BarberShopsPage = async ({ searchParams }: BarberShopsPageProps) => {
  const params = await searchParams
  const barbershops = await db.barbershop.findMany({
    where: {
      OR: [
        params?.title
          ? {
              name: {
                contains: params.title,
                mode: "insensitive",
              },
            }
          : {},
        params?.service
          ? {
              services: {
                some: {
                  name: {
                    contains: params?.service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
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
          Resultados para &quot;{params?.service || params?.title}&quot;
        </h2>
        <ShowOnDesktop>
          <div className="grid grid-cols-5 gap-4">
            {barbershops.map((barberShop) => (
              <BarberShopItem key={barberShop.id} barberShop={barberShop} />
            ))}
          </div>
        </ShowOnDesktop>
        <ShowOnMobile>
          <div className="grid grid-cols-2 gap-4">
            {barbershops.map((barberShop) => (
              <BarberShopItem key={barberShop.id} barberShop={barberShop} />
            ))}
          </div>
        </ShowOnMobile>
      </div>
    </div>
  )
}

export default BarberShopsPage
