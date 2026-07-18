"use client"
import { ptBR } from "date-fns/locale"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Barbershop, BarbershopService } from "../generated/prisma/client"
import { format, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface ReserveBarberProps {
  variant?: "default" | "secondary" | "outline"
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

const ReserveBarber = ({
  variant,
  service,
  barbershop,
}: ReserveBarberProps) => {
  const { data } = useSession()
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }
  const handleCreateBooking = async () => {
    try {
      if (!data?.user?.id || !selectedDay || !selectedTime) return

      const hour = Number(selectedTime.split(":")[0])
      const minute = Number(selectedTime.split(":")[1])
      const newDate = set(selectedDay, {
        minutes: minute,
        hours: hour,
      })
      createBooking({
        serviceId: service.id,
        userId: data?.user.id,
        date: newDate,
      })
      toast.success("Reserva criado com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao crair reserva")
    }
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant={variant} size="sm">
            Reservar
          </Button>
        }
      ></SheetTrigger>
      <SheetContent className="px-0">
        <SheetHeader>
          <SheetTitle className="text-center">Fazer Reservas</SheetTitle>
        </SheetHeader>
        <div className="flex justify-center border-b border-solid py-5">
          <Calendar
            className="text- rounded-lg border"
            mode="single"
            selected={selectedDay}
            onSelect={handleDateSelect}
            locale={ptBR}
            classNames={{
              weekday: "w-full text-center capitalize",
              day: "text-center",
              day_button: "w-full justify-center",
              button_previous: "size-8",
              button_next: "size-8",
              month_caption: "capitalize text-center",
            }}
          />
        </div>
        {selectedDay && (
          <div className="flex w-full gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
            {TIME_LIST.map((time) => (
              <Button
                key={time}
                className="shrink-0 rounded-full"
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        )}

        {selectedTime && selectedDay && (
          <div className="p-5">
            <Card>
              <CardContent className="space-y-3 p-3">
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
                    {format(selectedDay, "d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-400">Horario</h2>
                  <p className="text-sm">{selectedTime}</p>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-400">Barbearia</h2>
                  <p className="text-sm">{barbershop.name}</p>
                </div>
              </CardContent>
            </Card>
            <SheetFooter className="px-5">
              <SheetClose
                render={
                  <Button type="submit" onClick={handleCreateBooking}>
                    confirmar
                  </Button>
                }
              ></SheetClose>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default ReserveBarber
