"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

export const deleteBooking = async (BookingId: string) => {
  await db.booking.delete({
    where: {
      id: BookingId,
    },
  })
  revalidatePath("/bookings")
}
