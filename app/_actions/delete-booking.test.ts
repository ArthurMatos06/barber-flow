import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../_lib/prisma", () => ({
  db: {
    booking: {
      delete: vi.fn(),
    },
  },
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

import { deleteBooking } from "./delete-booking"
import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"

describe("deleteBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("chama db.booking.delete com o id correto", async () => {
    // Arrange
    vi.mocked(db.booking.delete).mockResolvedValue({} as never)

    // Act
    await deleteBooking("booking-123")

    // Assert
    expect(db.booking.delete).toHaveBeenCalledWith({
      where: { id: "booking-123" },
    })
  })

  it("revalida o cache da rota /bookings após deletar", async () => {
    // Arrange
    vi.mocked(db.booking.delete).mockResolvedValue({} as never)

    // Act
    await deleteBooking("booking-123")

    // Assert
    expect(revalidatePath).toHaveBeenCalledWith("/bookings")
  })

  it("propaga o erro se o delete falhar (ex: id inexistente)", async () => {
    // Arrange: simula o Prisma lançando erro (registro não encontrado)
    vi.mocked(db.booking.delete).mockRejectedValue(
      new Error("Record to delete does not exist."),
    )

    // Act + Assert
    await expect(deleteBooking("id-que-nao-existe")).rejects.toThrow(
      "Record to delete does not exist.",
    )

    // Se deu erro no delete, revalidatePath não deveria ter sido chamado
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
