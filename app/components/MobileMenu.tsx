"use client"
import { useState } from "react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import Sidebar from "./SideBar"
import { MenuIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog } from "./ui/dialog"
import SignInDialog from "../components/sign-in-dialog"
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
        <SheetTrigger
          render={
            <Button size="icon-lg" variant={variant} className={className}>
              <MenuIcon />
            </Button>
          }
        ></SheetTrigger>
        <Sidebar
          onLogin={() => {
            setSheetOpen(false)
            setDialogOpen(true)
          }}
        />
      </Sheet>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <SignInDialog />
      </Dialog>
    </>
  )
}

export default MobileMenu
