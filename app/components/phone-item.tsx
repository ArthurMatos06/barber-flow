"use client"
import { SmartphoneIcon } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface PhoneItemProps {
  phone: string
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopyPhoneClick = (phone: string) => {
    navigator.clipboard.writeText(phone)
    toast.success("Tefone copiado com sucesso")
  }
  return (
    <div key={phone} className="flex justify-between">
      {/* esquerda */}
      <div className="flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
      </div>
      {/* direita */}
      <Button variant="outline" onClick={() => handleCopyPhoneClick(phone)}>
        copiar
      </Button>
    </div>
  )
}

export default PhoneItem
