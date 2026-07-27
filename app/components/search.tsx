"use client"
import { SearchIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { type FormEvent } from "react"
import { z } from "zod"
import { useState } from "react"
//fazer por letra e carregar quando nao apertar no botao
const Search = () => {
  const [error, setError] = useState("")
  const router = useRouter()

  const formSchema = z.object({
    title: z.string().trim().min(3, "A busca deve ter pelo menos 3 caracteres"),
  })
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title")

    const result = formSchema.safeParse({
      title,
    })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setError("")

    router.push(`/barbershops?title=${result.data.title}`) //perguntar para ao char pq o routerReact é melghor que o link aqui
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            name="title"
            placeholder="Faça sua busca..."
            className="focus:border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
          />

          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <Button type="submit">
          <SearchIcon />
        </Button>
      </form>
    </>
  )
}

export default Search
