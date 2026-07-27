"use client"

import { useIsDesktop } from "@/app/hooks/useIsDesktop"

export default function ShowOnMobile({
  children,
}: {
  children: React.ReactNode
}) {
  const isDesktop = useIsDesktop()
  if (isDesktop) return null
  return <>{children}</>
}
