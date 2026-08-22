"use server"
import { endOfDay, startOfDay } from "date-fns"
import { db } from "../_lib/prisma"

interface getBookingProps {
  serviceId: string
  date: Date
}

export const getBookings = async ({ serviceId, date }: getBookingProps) => {
  // Precisamos saber a QUAL BARBEARIA esse serviço pertence, porque o
  // horário deve ser bloqueado pra todos os serviços daquela barbearia
  // (assumindo agenda compartilhada), não só pro serviço específico que
  // o usuário está reservando agora.
  const service = await db.barbershopService.findUnique({
    where: { id: serviceId },
    select: { barbershopId: true },
  })

  if (!service) {
    return []
  }

  return await db.booking.findMany({
    where: {
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
      // Filtra pela barbearia através da relação service -> barbershop,
      // em vez de filtrar por um serviceId exato (o que deixaria
      // "vazar" horários livres entre serviços da mesma barbearia).
      service: {
        barbershopId: service.barbershopId,
      },
    },
  })
}
