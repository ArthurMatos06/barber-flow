import Header from "./components/header"
import BarberShopItem from "./components/barberShop-item"
import { Button } from "./components/ui/button"
import { SearchIcon } from "lucide-react"
import { Input } from "./components/ui/input"
import Image from "next/image"
import { Card, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Avatar, AvatarImage } from "./components/ui/avatar"
import { db } from "./_lib/prisma"
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

        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        {/*Busca Rápida*/}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          <Button className="gap-2" variant="secondary">
            <Image src="/cabelo.svg" alt="Cabelo" width={16} height={16} />
            Cabelo
          </Button>
          <Button className="gap-2" variant="secondary">
            <Image src="/barba.svg" alt="Barba" width={16} height={16} />
            Barba
          </Button>
          <Button className="gap-2" variant="secondary">
            <Image
              src="/acabamento.svg"
              alt="Acabamento"
              width={16}
              height={16}
            />
            Acabamento
          </Button>
          <Button className="gap-2" variant="secondary">
            <Image
              src="/sobrancelha.svg"
              alt="Sobrancelha"
              width={16}
              height={16}
            />
            sobrancelha
          </Button>
          <Button className="gap-2" variant="secondary">
            <Image
              src="/hidratacao.svg"
              alt="Hidratação"
              width={16}
              height={16}
            />
            Hidratação
          </Button>
          <Button className="gap-2" variant="secondary">
            <Image src="/massagem.svg" alt="Massagem" width={16} height={16} />
            massagem
          </Button>
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
        <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
          Agendamentos
        </h2>
        <Card className="p-0">
          <CardContent className="flex justify-between p-0">
            {/*esquerda*/}
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge className="w-fit">Confirmado</Badge>
              <h3 className="font-semibold">Corte de Cabelo</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png" />
                </Avatar>
                <p className="text-sm">Barbearia teste</p>
              </div>
            </div>
            {/*direita*/}
            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text-sm">Agosto</p>
              <p className="text-2xl">05</p>
              <p className="text-sm">13:00</p>
            </div>
          </CardContent>
        </Card>
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
      <footer className="bg-muted/30 mt-8 border-t">
        <div className="mx-auto flex h-16 max-w-md items-center justify-center px-5">
          <p className="text-muted-foreground text-center text-sm">
            © 2026 <span className="font-semibold">Barber-Flow</span>. Todos os
            direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
export default page
