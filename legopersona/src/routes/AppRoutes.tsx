import { Navigate, Route, Routes } from 'react-router-dom'

import AuthPage from '@/pages/auth/AuthPage'
import CommunityPage from '@/pages/community/CommunityPage'
import CreatePage from '@/pages/create/CreatePage'
import HomePage from '@/pages/home/HomePage'
import ProfilePage from '@/pages/profile/ProfilePage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
