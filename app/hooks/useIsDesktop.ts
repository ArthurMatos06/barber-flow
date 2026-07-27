"use client"

import { useEffect, useState } from "react"

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(min-width: 768px)").matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")

    function handleChange(e: MediaQueryListEvent) {
      setIsDesktop(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return isDesktop
}
