import { LogInIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Button } from "../components/ui/button"

const test = () => {
  return (
    <div>
      <h1>TESTE</h1>
      <Dialog>
        <DialogTrigger render={<Button size="icon" />}>
          <LogInIcon />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faça login na plataforma</DialogTitle>
            <DialogDescription>
              Conecte-se usando sua conta do google
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default test
