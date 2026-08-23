import { Skeleton } from "@/app/components/ui/skeleton"

// Esse componente é renderizado AUTOMATICAMENTE pelo Next.js
// enquanto o Server Component de app/barbershops/page.tsx está
// buscando os dados no banco (await db.barbershop.findMany()).
// Não precisamos de useState/useEffect pra isso — é convenção de arquivo.
export default function BarbershopsLoading() {
  return (
    <div className="px-5 py-6">
      {/* Simula o campo de busca */}
      <Skeleton className="h-10 w-full" />

      <Skeleton className="mt-6 mb-3 h-4 w-40" />

      {/* Simula o grid de cards, mesmo layout do grid real */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-39.75 w-full rounded-2xl md:h-56" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
