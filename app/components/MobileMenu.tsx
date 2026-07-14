"use client"
import { useState } from "react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import Sidebar from "./SideBar"
import { MenuIcon } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import Image from "next/image"
// dps aceitar um variant e um size como props no botao
type MobileMenuProps = {
  variant?: "default" | "secondary" | "outline"
  className?: string
}
const MobileMenu = ({ variant = "outline", className }: MobileMenuProps) => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger>
          <Button size="icon" variant={variant} className={className}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <Sidebar
          onLogin={() => {
            setSheetOpen(false)
            setDialogOpen(true)
          }}
        />
      </Sheet>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>Faça login na plataforma</DialogTitle>
            <DialogDescription>
              Conecte-se usando sua conta do Google.
            </DialogDescription>
          </DialogHeader>

          <Button className="gap-1 font-bold" variant="outline">
            <Image
              src="/google.svg"
              alt="Fazer login com o google"
              width={18}
              height={18}
            />
            Google
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MobileMenu
