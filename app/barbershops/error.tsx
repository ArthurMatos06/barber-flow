"use client"

import { Button } from "@/app/components/ui/button"
import { useEffect } from "react"

// error.tsx PRECISA ser Client Component ("use client" no topo).
// O Next.js passa automaticamente duas props:
// - error: o erro que foi lançado durante a renderização
// - reset: função que tenta renderizar a rota de novo (sem recarregar a página)
export default function BarbershopsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Aqui, no futuro, você pode mandar isso pra um serviço de log
    // (Sentry, LogRocket, etc). Por enquanto, log no console já ajuda
    // a debugar em produção.
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-5 py-20 text-center">
      <h2 className="text-lg font-semibold">
        Não foi possível carregar as barbearias
      </h2>
      <p className="text-sm text-gray-400">
        Algo deu errado ao buscar os dados. Tente novamente.
      </p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  )
}
