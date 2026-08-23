import { describe, it, expect, vi, beforeEach } from "vitest"

// ============================================================
// MOCKS
// ============================================================
// Um teste UNITÁRIO não deve depender de banco de dados real,
// rede, ou sessão de usuário de verdade. A gente "engana" o
// módulo, substituindo suas funções por versões falsas (mocks)
// que a gente controla 100% dentro do teste.
//
// vi.mock precisa ficar no topo do arquivo (hoisting do Vitest
// move ele pra cima de qualquer import automaticamente).
// ============================================================

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}))

vi.mock("../_lib/prisma", () => ({
  db: {
    barbershopService: {
      findUnique: vi.fn(),
    },
    booking: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}))

vi.mock("../_lib/auth", () => ({
  authOptions: {},
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

// Importamos DEPOIS dos mocks, porque o create-booking.ts
// importa esses módulos e precisa receber as versões mockadas.
import { createBooking } from "./create-booking"
import { getServerSession } from "next-auth"
import { db } from "../_lib/prisma"

// Helper pra deixar os testes mais legíveis: cria uma "sessão falsa"
function fakeSession(userId = "user-123") {
  return { user: { id: userId } }
}

describe("createBooking", () => {
  // beforeEach roda ANTES de cada teste (it), garantindo que um
  // teste não "vaze" configuração de mock pro próximo.
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // --------------------------------------------------------
  // ARRANGE: preparamos os dados/mocks
  // ACT: chamamos a função que queremos testar
  // ASSERT: verificamos se o resultado é o esperado
  // --------------------------------------------------------

  it("lança erro se o usuário não estiver autenticado", async () => {
    // Arrange
    vi.mocked(getServerSession).mockResolvedValue(null)

    // Act + Assert
    await expect(
      createBooking({
        serviceId: "550e8400-e29b-41d4-a716-446655440000",
        date: new Date(Date.now() + 86_400_000), // amanhã
      }),
    ).rejects.toThrow("Usuário não autenticado!")
  })

  it("lança erro se a data for no passado", async () => {
    // Arrange
    vi.mocked(getServerSession).mockResolvedValue(fakeSession())
    vi.mocked(db.barbershopService.findUnique).mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      barbershopId: "shop-1",
    } as never)

    // Act + Assert
    await expect(
      createBooking({
        serviceId: "550e8400-e29b-41d4-a716-446655440000",
        date: new Date("2020-01-01"), // data claramente passada
      }),
    ).rejects.toThrow("Não é possível agendar em uma data passada")
  })

  it("lança erro se o serviço não existir", async () => {
    // Arrange
    vi.mocked(getServerSession).mockResolvedValue(fakeSession())
    vi.mocked(db.barbershopService.findUnique).mockResolvedValue(null)

    // Act + Assert
    await expect(
      createBooking({
        serviceId: "550e8400-e29b-41d4-a716-446655440000",
        date: new Date(Date.now() + 86_400_000),
      }),
    ).rejects.toThrow("Serviço não encontrado")
  })

  it("cria a reserva com sucesso quando os dados são válidos", async () => {
    // Arrange
    vi.mocked(getServerSession).mockResolvedValue(fakeSession("user-abc"))
    vi.mocked(db.barbershopService.findUnique).mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      barbershopId: "shop-1",
    } as never)
    // Nenhum booking conflitante encontrado na barbearia nesse horário
    vi.mocked(db.booking.findFirst).mockResolvedValue(null)
    vi.mocked(db.booking.create).mockResolvedValue({} as never)

    const futureDate = new Date(Date.now() + 86_400_000)

    // Act
    await createBooking({
      serviceId: "550e8400-e29b-41d4-a716-446655440000",
      date: futureDate,
    })

    // Assert: confirmamos que db.booking.create foi chamado
    // com os dados certos, incluindo o userId vindo da sessão.
    expect(db.booking.create).toHaveBeenCalledWith({
      data: {
        serviceId: "550e8400-e29b-41d4-a716-446655440000",
        date: futureDate,
        userId: "user-abc",
      },
    })
  })

  it("lança erro se já existir uma reserva na mesma barbearia nesse horário", async () => {
    // Arrange
    vi.mocked(getServerSession).mockResolvedValue(fakeSession("user-abc"))
    vi.mocked(db.barbershopService.findUnique).mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      barbershopId: "shop-1",
    } as never)
    // Simula um booking já existente na mesma barbearia nesse horário,
    // mesmo que seja de OUTRO serviço (ex: corte às 14h já ocupa a vaga
    // pro serviço de barba às 14h, na mesma barbearia).
    vi.mocked(db.booking.findFirst).mockResolvedValue({
      id: "existing-booking",
    } as never)

    // Act + Assert
    await expect(
      createBooking({
        serviceId: "550e8400-e29b-41d4-a716-446655440000",
        date: new Date(Date.now() + 86_400_000),
      }),
    ).rejects.toThrow("Esse horário já foi reservado. Escolha outro.")

    // Garantimos que, tendo achado conflito, NUNCA chegamos a tentar criar
    expect(db.booking.create).not.toHaveBeenCalled()
  })
})
