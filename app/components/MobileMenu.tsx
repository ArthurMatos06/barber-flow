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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faça login na plataforma</DialogTitle>
            <DialogDescription>
              Conecte-se usando sua conta do Google.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MobileMenu
