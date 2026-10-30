export type Role = 'admin' | 'teacher' | 'moderator' | 'student'

export type User = {
  id: number
  name: string
  email: string
  phone: string | null
  role: Role
  role_label: string
}

export type AuthResponse = {
  token: string
  user: User
}

export type Settings = {
  phone: string | null
  email: string | null
  address: string | null
  telegram: string | null
  instagram: string | null
  hero_title: string | null
  hero_subtitle: string | null
  about: string | null
}

export type CourseCard = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  cover_url: string | null
  price: number | null
  duration_hours: number | null
  format: string | null
  level: string | null
  featured: boolean
  program: { id: number; title: string; slug: string } | null
}

export type Banner = {
  id: number
  title: string
  subtitle: string | null
  badge: string | null
  image_url: string | null
  cta_label: string | null
  cta_href: string | null
  active: boolean
  sort_order: number
}

export type ScheduleItem = {
  id: number
  title: string
  city: string
  starts_at: string
  ends_at: string | null
  hours: number | null
  spots: number | null
  course: { id: number; slug: string; title: string } | null
}

export type Testimonial = {
  id: number
  name: string
  role: string | null
  text: string
  photo_url: string | null
}

export type Faq = {
  id: number
  question: string
  answer: string
}

export type CertificateType = {
  id: number
  title: string
  subtitle: string | null
  description: string | null
  image_url: string | null
  is_state_sample: boolean
  published: boolean
  sort_order: number
}

export type IssuedCertificate = {
  id: number
  number: string | null
  issued_on: string | null
  file_url: string | null
  certificate: CertificateType
  user?: User
  course: CourseCard | null
}

export type HomeData = {
  settings: Settings
  banners: Banner[]
  courses: CourseCard[]
  schedule: ScheduleItem[]
  testimonials: Testimonial[]
  faqs: Faq[]
  certificates: CertificateType[]
}

export type PublicLesson = { id: number; title: string; duration_min: number | null }
export type PublicModule = {
  id: number
  title: string
  description: string | null
  lessons: PublicLesson[]
}

export type PublicCourse = CourseCard & {
  description: string | null
  modules: PublicModule[]
  schedule: ScheduleItem[]
}

export type CabinetCourse = CourseCard & {
  progress: { total: number; completed: number; percent: number }
}

export type CabinetLessonItem = PublicLesson & {
  has_video: boolean
  completed: boolean
}

export type CabinetCourseDetail = CourseCard & {
  description: string | null
  progress: { total: number; completed: number; percent: number }
  modules: { id: number; title: string; description: string | null; lessons: CabinetLessonItem[] }[]
}

export type LessonDetail = {
  id: number
  title: string
  content: string | null
  video_url: string | null
  image_url: string | null
  duration_min: number | null
  completed: boolean
  course: { id: number; title: string; slug: string }
  module: { id: number; title: string }
  prev_id: number | null
  next_id: number | null
}

export type Lead = {
  id: number
  name: string
  phone: string
  email: string | null
  message: string | null
  status: 'new' | 'contacted' | 'enrolled' | 'rejected'
  created_at: string
  course: CourseCard | null
}

export type Program = {
  id: number
  title: string
  slug: string
  description: string | null
  cover_url: string | null
  published: boolean
  sort_order: number
  courses_count?: number
}

export type AdminLesson = {
  id: number
  module_id: number
  title: string
  content: string | null
  video_url: string | null
  image_url: string | null
  duration_min: number | null
  sort_order: number
}

export type AdminModule = {
  id: number
  course_id: number
  title: string
  description: string | null
  sort_order: number
  lessons: AdminLesson[]
}

export type AdminCourse = CourseCard & {
  program_id: number | null
  description: string | null
  published: boolean
  sort_order: number
  modules?: AdminModule[]
  modules_count?: number
  enrollments_count?: number
}

export type Enrollment = {
  id: number
  created_at: string
  user: User
  course: CourseCard
  granted_by?: User | null
}
