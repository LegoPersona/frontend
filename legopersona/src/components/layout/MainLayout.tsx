import type { ReactNode } from 'react'

import Navbar from '@/components/layout/Navbar'

type MainLayoutProps = {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default MainLayout
