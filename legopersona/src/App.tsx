import MainLayout from '@/components/layout/MainLayout'
import { Toaster } from '@/components/ui/toaster'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  return (
    <MainLayout>
      <AppRoutes />
      <Toaster />
    </MainLayout>
  )
}

export default App
