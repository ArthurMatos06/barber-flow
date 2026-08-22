import { db } from "../_lib/prisma"
import BarberShopItem from "../components/barberShop-item"
import Header from "../components/header"
import Search from "../components/search"
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
        {/* Grid responsivo: 2 colunas no mobile e 5 colunas a partir de md.
            Antes usávamos ShowOnDesktop/ShowOnMobile (JS) para trocar o grid,
            o que causava hydration mismatch. Agora é só CSS responsivo. */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {barbershops.map((barberShop) => (
            <BarberShopItem key={barberShop.id} barberShop={barberShop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarberShopsPage
