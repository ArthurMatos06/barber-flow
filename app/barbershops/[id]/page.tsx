import { db } from "@/app/_lib/prisma"
import { Button } from "@/app/components/ui/button"
import { ChevronLeftIcon, MenuIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
  })

  // Evita os erros de null
  if (!barbershop) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-xl font-bold">Barbearia não encontrada.</h1>
      </div>
    )
  }

  return (
    <div>
      {/* Imagem */}
      <div className="relative h-[250px] w-full">
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

        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4"
        >
          <MenuIcon />
        </Button>
      </div>
    </div>
  )
}
