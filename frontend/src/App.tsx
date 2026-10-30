import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth'
import { AdminLayout } from './components/AdminLayout'
import { CabinetLayout } from './components/CabinetLayout'
import { RequireAuth, RequireStaff } from './components/Guards'
import { PublicLayout } from './components/PublicLayout'
import { AdminBannersPage } from './pages/admin/AdminBannersPage'
import { AdminCertificatesPage } from './pages/admin/AdminCertificatesPage'
import { AdminCourseEditPage } from './pages/admin/AdminCourseEditPage'
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminEnrollmentsPage } from './pages/admin/AdminEnrollmentsPage'
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage'
import { AdminSchedulePage } from './pages/admin/AdminSchedulePage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { CabinetCertificatesPage } from './pages/cabinet/CabinetCertificatesPage'
import { CabinetCoursePage } from './pages/cabinet/CabinetCoursePage'
import { CabinetHomePage } from './pages/cabinet/CabinetHomePage'
import { CabinetLessonPage } from './pages/cabinet/CabinetLessonPage'
import { ProfilePage } from './pages/cabinet/ProfilePage'
import { AboutPage } from './pages/AboutPage'
import { ContactsPage } from './pages/ContactsPage'
import { CoursePage } from './pages/CoursePage'
import { CoursesPage } from './pages/CoursesPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SchedulePage } from './pages/SchedulePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CoursePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<CabinetLayout />}>
              <Route path="/cabinet" element={<CabinetHomePage />} />
              <Route path="/cabinet/certificates" element={<CabinetCertificatesPage />} />
              <Route path="/cabinet/profile" element={<ProfilePage />} />
              <Route path="/cabinet/courses/:id" element={<CabinetCoursePage />} />
              <Route path="/cabinet/courses/:id/lessons/:lessonId" element={<CabinetLessonPage />} />
            </Route>
          </Route>

          <Route element={<RequireStaff />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/courses/:id" element={<AdminCourseEditPage />} />
              <Route path="/admin/certificates" element={<AdminCertificatesPage />} />
              <Route path="/admin/leads" element={<AdminLeadsPage />} />
              <Route path="/admin/enrollments" element={<AdminEnrollmentsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/banners" element={<AdminBannersPage />} />
              <Route path="/admin/schedule" element={<AdminSchedulePage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
