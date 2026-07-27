// import Image from "next/image"
// import { Card, CardContent } from "./ui/card"
// import MobileMenu from "./MobileMenu"
// import Link from "next/link"
// //botao é height={18} width={120}
// export default function Header() {
//   return (
//     <>
//       <Card>
//         <CardContent className="flex flex-row items-center justify-between p-5">
//           <Link href={"/"}>
//             <Image alt="FSW Barber" src="/logo.png" height={18} width={120} />
//           </Link>
//           <MobileMenu variant="secondary" />
//         </CardContent>
//       </Card>
//     </>
//   )
// }

"use client"

import { FormEvent, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LogOutIcon, SearchIcon } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import MobileMenu from "./MobileMenu"
import { Dialog } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import { Badge } from "./ui/badge"
import z from "zod"

const navLinks = [
  { title: "Início", href: "/" },
  { title: "Agendamentos", href: "/bookings" },
]
//FIXME: arrumar agendamentos link desktop
export default function Header() {
  const { data } = useSession()
  const pathname = usePathname()
  const [dialogOpen, setDialogOpen] = useState(false)
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
      <Card className="rounded-none border-x-0 border-t-0">
        <CardContent className="flex flex-row items-center gap-10 p-5 md:px-12 md:py-5">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              alt="FSW Barber"
              src="/logo.png"
              height={18}
              width={120}
              className="md:h-9 md:w-60"
            />
          </Link>

          {/* //FIXME: desktop: quando nao logado nao mostrar agendamentos  */}
          {/* Navegação — só links, com estado ativo */}
          <nav className="hidden shrink-0 items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`pb-1 text-xl font-medium transition-colors ${
                    isActive
                      ? "border-primary text-primary border-b-2"
                      : "border-b-2 border-transparent text-gray-300 hover:text-white"
                  }`}
                >
                  {link.title}
                </Link>
              )
            })}
          </nav>

          {/* Espaço flexível empurra busca + conta pra direita */}
          {/* Busca — formato pill */}
          <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
            <form onSubmit={handleSubmit} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  name="title"
                  placeholder="Faça sua busca..."
                  className="focus:border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none md:h-12 md:w-96"
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              <Button type="submit" className="h-12 w-10 px-6 py-4">
                <SearchIcon width={24} height={24} />
              </Button>
            </form>

            {/* Conta */}
            {data?.user ? (
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant="secondary" className="h-15">
                  <Avatar className="bg-primary h-9 w-9">
                    <AvatarImage src={data.user.image ?? ""} />
                    <AvatarFallback className="bg-primary text-white">
                      {data.user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-bold">{data.user.name}</p>
                  <button
                    onClick={() => signOut()}
                    title="Sair da conta"
                    className="hover:text-primary text-gray-300 transition-colors"
                  >
                    <LogOutIcon size={20} />
                  </button>
                </Badge>
              </div>
            ) : (
              <Button onClick={() => setDialogOpen(true)} className="shrink-0">
                Fazer login
              </Button>
            )}
          </div>

          {/* Menu mobile — some no desktop */}
          <div className="ml-auto md:hidden">
            <MobileMenu variant="secondary" />
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <SignInDialog />
      </Dialog>
    </>
  )
}
