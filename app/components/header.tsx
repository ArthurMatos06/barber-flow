import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import MobileMenu from "./MobileMenu"
export default function Header() {
  return (
    <>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-5">
          <Image alt="FSW Barber" src="/logo.png" height={18} width={120} />
          <MobileMenu variant="secondary" />
        </CardContent>
      </Card>
    </>
  )
}
