export type NavigationTab = 
  | 'dashboard'
  | 'teacher-dashboard'
  | 'student-portal'
  | 'students'
  | 'whatsapp'
  | 'schedule'
  | 'courses'
  | 'teachers'
  | 'brochure'
  | 'settings';

export type AcademicLevel = 'Básica' | 'Media Superior' | 'Nivel Superior';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  folio: string;
  level: AcademicLevel;
  status: 'Activo' | 'Pendiente' | 'Enviado';
  username?: string;
  tempPassword?: string;
  registeredAt: string;
  avatar?: string;
  courseIds?: string[];
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  level: AcademicLevel;
  progress: number; // percentage 0-100
  status: 'Activo' | 'Concluido' | 'Proximamente';
  room: string;
  timeSlot: string;
  iconName: string;
  description?: string;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  specialty: string;
  email: string;
  phone: string;
  avatar: string;
  subjects: string[];
  room: string;
  username: string;
  tempPassword?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  teacher: string;
  dayIndex: number; // 0: Lun, 1: Mar, 2: Mié, 3: Jue, 4: Vie, 5: Sáb
  startTime: string; // e.g., "08:00"
  durationHours: number; // e.g., 1.5
  room: string;
  hasConflict?: boolean;
  conflictDetails?: string;
  colorTheme?: 'navy' | 'error' | 'lime' | 'blue';
  weekStartDate?: string;
}

export interface RecentActivityItem {
  id: string;
  user: string;
  userInitials: string;
  action: string;
  dateTime: string;
  status: 'Completado' | 'Pendiente' | 'Enviado' | 'Error';
  type: 'registro' | 'credencial' | 'pago' | 'curso';
}

export interface WhatsAppTemplate {
  messageText: string;
}
