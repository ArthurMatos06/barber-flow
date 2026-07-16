"use client"
import { ptBR } from "date-fns/locale"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { useState } from "react"

type ReserveBarberProps = {
  variant?: "default" | "secondary" | "outline"
  //   className?: string
}

// const TIME_LIST = [
//   "08:00",
//   "08:30",
//   "09:00",
//   "09:30",
//   "10:00",
//   "10:30",
//   "11:00",
//   "11:30",
//   "12:00",
//   "12:30",
//   "13:00",
//   "13:30",
//   "14:00",
//   "14:30",
//   "15:00",
//   "15:30",
//   "16:00",
//   "16:30",
//   "17:00",
//   "17:30",
//   "18:00",
// ]

const ReserveBarber = ({ variant }: ReserveBarberProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
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
      </SheetContent>
    </Sheet>
  )
}

export default ReserveBarber
