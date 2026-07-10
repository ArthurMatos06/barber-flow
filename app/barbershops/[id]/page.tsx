import { db } from "@/app/_lib/prisma"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function BarbershopPage({ params }: Props) {
  const { id } = await params
  //chamando no banco de dados
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: id,
    },
  })

  return <h1>{barbershop?.name}</h1>
}
