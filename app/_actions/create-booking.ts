"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import z from "zod"
import { Prisma } from "../generated/prisma/client"

const createBookingSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.date(),
})

interface CreateBookingParams {
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado!")
  }

  const { serviceId, date } = createBookingSchema.parse(params)

  const service = await db.barbershopService.findUnique({
    where: { id: serviceId },
  })
  if (!service) {
    throw new Error("Serviço não encontrado")
  }

  if (date < new Date()) {
    throw new Error("Não é possível agendar em uma data passada")
  }

  // Verificação a nível de BARBEARIA: o @@unique([date, serviceId]) do
  // schema só impede o MESMO serviço de ser reservado duas vezes no
  // mesmo horário. Ele não impede que DOIS SERVIÇOS DIFERENTES da
  // mesma barbearia colidam no mesmo horário (ex: corte e barba com
  // o mesmo barbeiro/agenda compartilhada). Por isso checamos aqui
  // manualmente, além de deixar a constraint do banco como rede de
  // segurança contra race conditions do próprio serviço.
  const bookingExists = await db.booking.findFirst({
    where: {
      date,
      service: {
        barbershopId: service.barbershopId,
      },
    },
  })

  if (bookingExists) {
    throw new Error("Esse horário já foi reservado. Escolha outro.")
  }

  try {
    await db.booking.create({
      data: {
        serviceId,
        date,
        userId: session.user.id,
      },
    })
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Esse horário já foi reservado. Escolha outro.")
    }

    throw error
  }

  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
