"use client"
import { format, isFuture } from "date-fns"
import { Prisma } from "../generated/prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import PhoneItem from "./phone-item"
import { Button } from "./ui/button"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { deleteBooking } from "../_actions/delete-booking"

interface BookingProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barbershop: true
        }
      }
    }
  }>
}
//TODO: receber agendamentos como props e mapear eles, para cada agendamento renderizar um card
const BookingItem = ({ booking }: BookingProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false)

  const handleCancelClick = () => {
    setIsSheetOpen(false)
    setIsCancelAlertOpen(true)
  }

  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id)
      toast.success("Reserva cancelada com sucesso!")
    } catch {
      toast.error("Erro ao cancelar reserva.Tente novamente")
    }
    setIsCancelAlertOpen(false)
  }
  const { service } = booking
  const barbershop = service.barbershop
  const isconfirmed = isFuture(booking.date)
  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger className="w-full" onClick={() => setIsSheetOpen(true)}>
          <Card className="w-[90vw] max-w-md shrink-0 p-0">
            <CardContent className="flex justify-between p-0">
              {/*esquerda*/}
              <div className="flex flex-col gap-2 py-5 pl-5">
                <Badge
                  className="w-fit"
                  variant={isconfirmed ? "default" : "secondary"}
                >
                  {isconfirmed ? "Confirmado" : "Finalizado"}
                </Badge>
                <h3 className="font-semibold">{service.name}</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={barbershop.imageUrl} />
                  </Avatar>
                  <p className="text-sm">{barbershop.name}</p>
                </div>
              </div>
              {/*direita*/}
              <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                <p className="text-sm capitalize">
                  {format(booking.date, "MMMM", { locale: ptBR })}
                </p>
                <p className="text-2xl">
                  {format(booking.date, "dd", { locale: ptBR })}
                </p>
                <p className="text-sm">
                  {format(booking.date, "HH:mm", { locale: ptBR })}
                </p>
              </div>
            </CardContent>
          </Card>
        </SheetTrigger>
        {/* TODO: ajustar para 90% da tela */}
        <SheetContent side="right" className="w-[90%] max-w-[90%] px-3">
          <SheetHeader>
            <SheetTitle className="text-left">
              Informações da Reserva
            </SheetTitle>
          </SheetHeader>
          <div className="relative mt-6 flex h-45 w-full items-end">
            <Image
              alt={`Mapa da barbearia ${barbershop.name}`}
              src="/map.png"
              fill
              className="rounded-xl object-cover"
            />

            <Card className="z-50 mx-5 mb-3 w-full rounded-xl">
              <CardContent className="flex items-center gap-3 px-5 py-3">
                <Avatar>
                  <AvatarImage src={barbershop.imageUrl} />
                </Avatar>
                <div>
                  <h3 className="font-bold">{barbershop.name}</h3>
                  <p className="text-xs">{barbershop.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Badge
              className="w-fit"
              variant={isconfirmed ? "default" : "secondary"}
            >
              {isconfirmed ? "Confirmado" : "Finalizado"}
            </Badge>
            <Card className="mt-3 mb-6">
              <CardContent className="space-y-2 p-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">{service.name}</h2>
                  <p className="text-sm font-bold">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(service.price))}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-400">Data</h2>
                  <p className="text-sm">
                    {format(booking.date, "d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-400">Horario</h2>
                  <p className="text-sm">
                    {format(booking.date, "HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-400">Barbearia</h2>
                  <p className="text-sm">{barbershop.name}</p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-3">
              {barbershop.phones.map((phone) => (
                <PhoneItem key={phone} phone={phone} />
              ))}
              {/* code smell
           {barbershop.phones.map((phone,index)=> <PhoneItem key={index} phone={phone}/>)}
           */}
            </div>
          </div>
          <SheetFooter className="mt-6">
            <div className="flex items-center gap-3">
              <SheetClose
                render={
                  <Button variant="outline" className="flex-1">
                    voltar
                  </Button>
                }
              />
              {isconfirmed && (
                <Button variant="destructive" onClick={handleCancelClick}>
                  Cancelar Reserva
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Cancelar reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação vai cancelar permanentemente sua reserva. Você pode
              reagendar depois se quiser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Voltar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleCancelBooking}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default BookingItem
