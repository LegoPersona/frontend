import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

function PageContainer({ children }: PageContainerProps) {
  return <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-28">{children}</div>
}

export default PageContainer
