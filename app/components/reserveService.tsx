"use client"
import { ptBR } from "date-fns/locale"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Barbershop, Booking } from "../generated/prisma/client"
import { format, isPast, isToday, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"
import { Dialog } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
interface ServiceProps {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  barbershopId: string
}

interface ReserveBarberProps {
  variant?: "default" | "secondary" | "outline"
  service: ServiceProps
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

interface getTimeListProps {
  bookings: Booking[]
  selectedDay: Date
}

const getTimeList = ({ bookings, selectedDay }: getTimeListProps) => {
  const timeList = TIME_LIST.filter((time) => {
    const Hour = Number(time.split(":")[0])
    const Minutes = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(
      set(new Date(), { hours: Hour, minutes: Minutes }),
    )
    //se o tempo estiver no passado e ele for HOJE ele esconde.
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }
    //se o horario já foi reservado.
    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === Hour &&
        booking.date.getMinutes() === Minutes,
    )
    if (hasBookingOnCurrentTime) {
      return false
    }
    return true
  })
  return timeList
}

const ReserveBarber = ({
  variant,
  service,
  barbershop,
}: ReserveBarberProps) => {
  const { data } = useSession()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, SetdayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setbookingSheetIsOpen] = useState(false)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)

  // Extraída pra fora do useEffect: assim conseguimos chamar essa mesma
  // busca de novo manualmente depois de criar uma reserva, sem depender
  // de selectedDay/service.id mudarem (o que só acontece trocando de dia).
  const fetchDayBookings = async (day: Date) => {
    setIsLoadingBookings(true)
    try {
      const bookings = await getBookings({
        date: day,
        serviceId: service.id,
      })
      SetdayBookings(bookings)
    } finally {
      setIsLoadingBookings(false)
    }
  }

  useEffect(() => {
    if (!selectedDay) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- padrão legítimo: setIsLoadingBookings(true) roda antes do await dentro de fetchDayBookings, pra mostrar o estado de carregamento
    fetchDayBookings(selectedDay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, service.id])

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    SetdayBookings([])
    setbookingSheetIsOpen(false)
  }
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

      // Aguardamos a Server Action terminar antes de seguir. Sem esse
      // await, o código continuava (fechando o sheet e mostrando "sucesso")
      // mesmo que a criação da reserva ainda estivesse em andamento ou
      // tivesse falhado no servidor — e o catch abaixo nunca era acionado.
      await createBooking({
        serviceId: service.id,
        date: newDate,
      })

      // Rebusca os horários ocupados do dia selecionado, agora que
      // acabamos de criar uma nova reserva. Sem isso, o horário que
      // acabamos de reservar continuava aparecendo como disponível
      // (o useEffect só roda de novo se o dia ou o serviço mudarem).
      await fetchDayBookings(selectedDay)

      setSelectedTime(undefined)
      setbookingSheetIsOpen(false)
      toast.success("Reserva criada com sucesso!")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar reserva"
      toast.error(message)
    }
  }

  const handleBookingClick = () => {
    if (data?.user) {
      return setbookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      bookings: dayBookings,
      selectedDay,
    })
  }, [dayBookings, selectedDay])

  return (
    <>
      <Sheet
        open={bookingSheetIsOpen}
        onOpenChange={handleBookingSheetOpenChange}
      >
        <Button
          variant={variant}
          size="sm"
          onClick={() => handleBookingClick()}
        >
          Reservar
        </Button>

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
              disabled={{ before: new Date() }}
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
              {isLoadingBookings ? (
                <p className="text-sm text-gray-400">Carregando horários...</p>
              ) : timeList.length > 0 ? (
                timeList.map((time) => (
                  <Button
                    key={time}
                    className="shrink-0 rounded-full"
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))
              ) : (
                <p className="text-xs text-gray-400">
                  Não há horários disponíveis para este dia
                </p>
              )}
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
                <Button type="submit" onClick={handleCreateBooking}>
                  confirmar
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)} //lembrar o que é openchange e pq ta passando um open como parametro de um state
      >
        <SignInDialog />
      </Dialog>
    </>
  )
}

export default ReserveBarber
