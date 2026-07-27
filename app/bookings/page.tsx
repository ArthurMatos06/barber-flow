import { getServerSession } from "next-auth"
import Header from "../components/header"
import { authOptions } from "../_lib/auth"
import { notFound } from "next/navigation"
import { db } from "../_lib/prisma"
import BookingItem from "../components/booking-item"

const Bookings = async () => {
  const Session = await getServerSession(authOptions)
  if (!Session?.user) {
    //TODO: show pop-up of login
    return notFound()
  }
  const concludedBookings = await db.booking.findMany({
    where: {
      userId: Session.user.id,
      date: {
        lt: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
  })

  const ConfirmedBookings = await db.booking.findMany({
    where: {
      userId: Session.user.id,
      date: {
        gte: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })
  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        <h1 className="text-xl font-bold">Agendamentos</h1>
        {ConfirmedBookings.length > 0 && (
          <>
            <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
              Confirmados
            </h2>
            {ConfirmedBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}
        {concludedBookings.length > 0 && (
          <>
            <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
              Finalizados
            </h2>
            {concludedBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default Bookings
