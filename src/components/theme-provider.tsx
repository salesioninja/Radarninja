"use client"

/**
 * LÓGICA DE UI: theme-provider.tsx
 * 
 * Por que um ThemeProvider isolado?
 * R: O App Router do Next.js requer que Providers do React Context (como next-themes)
 * sejam Client Components ("use client"). Isolamos isso para manter o `layout.tsx` como Server Component,
 * garantindo melhor performance e SEO enquanto gerenciamos o estado do Dark Mode proativamente.
 */

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
