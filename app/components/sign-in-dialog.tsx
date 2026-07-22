import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import Image from "next/image"

const SignInDialog = () => {
  const handleLoginWithGoogleClick = () => signIn("google")
  return (
    <>
      <DialogContent className="w-[90%] text-center">
        <DialogHeader>
          <DialogTitle>Faça login na plataforma</DialogTitle>
          <DialogDescription>
            Conecte-se usando sua conta do Google.
          </DialogDescription>
        </DialogHeader>

        <Button
          className="gap-1 font-bold"
          variant="outline"
          onClick={handleLoginWithGoogleClick}
        >
          <Image
            src="/google.svg"
            alt="Fazer login com o google"
            width={18}
            height={18}
          />
          Google
        </Button>
      </DialogContent>
    </>
  )
}

export default SignInDialog
