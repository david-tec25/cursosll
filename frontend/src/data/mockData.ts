import { Student, Course, Teacher, ScheduleItem, RecentActivityItem } from '../types';

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_COURSES: Course[] = [];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    name: 'Ing. Liliana Silvestre Castillo',
    title: 'Ing. en Química',
    specialty: 'Química General, Inorgánica, Orgánica y Matemáticas',
    email: 'llcursoschapademota@gmail.com',
    phone: '55-1414-8765',
    avatar: '/liliana_silvestre.jpg',
    subjects: ['Química', 'Ciencias Naturales', 'Experimentos de Laboratorio', 'Matemáticas'],
    room: 'Lab Química',
    username: 'liliana.silvestre',
    tempPassword: 'lisi26*',
  },
  {
    id: 't-2',
    name: 'Mtra. Liliana Martínez Palacios',
    title: 'Maestra en Ciencias de la Educación',
    specialty: 'Preparación para examen de admisión & Taller de Tareas',
    email: 'llcursoschapademota@gmail.com',
    phone: '55-4713-0833',
    avatar: '/liliana_palacios.jpg',
    subjects: ['Taller de tareas', 'Inglés', 'Comprensión Lectora'],
    room: 'Aula Multiusos',
    username: 'liliana.martinez',
    tempPassword: 'lima26*pa',
  },
  {
    id: 't-4',
    name: 'Dr. Roberto Sánchez',
    title: 'Doctor en Física',
    specialty: 'Física Avanzada & Termodinámica',
    email: 'llcursoschapademota@gmail.com',
    phone: '55-9988-7711',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subjects: ['Física Avanzada', 'Mecánica Cuántica'],
    room: 'Aula 302',
    username: 'roberto.sanchez',
    tempPassword: 'roberto123',
  },
  {
    id: 't-5',
    name: 'Mtra. Elena Gómez',
    title: 'Mtra. en Matemáticas Aplicadas',
    specialty: 'Cálculo Integral y Diferencial',
    email: 'llcursoschapademota@gmail.com',
    phone: '55-8877-6622',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    subjects: ['Cálculo Integral', 'Álgebra Lineal'],
    room: 'Lab B',
    username: 'elena.gomez',
    tempPassword: 'elena123',
  },
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [];

export const INITIAL_ACTIVITIES: RecentActivityItem[] = [
  {
    id: 'act-2',
    user: 'Juan Pérez',
    userInitials: 'JP',
    action: 'Credenciales enviadas',
    dateTime: 'Hoy, 09:15 AM',
    status: 'Completado',
    type: 'credencial',
  },
  {
    id: 'act-3',
    user: 'Luis Martínez',
    userInitials: 'LM',
    action: 'Pago de mensualidad',
    dateTime: 'Ayer, 16:30 PM',
    status: 'Pendiente',
    type: 'pago',
  },
  {
    id: 'act-4',
    user: 'Clase: Matemáticas',
    userInitials: 'CM',
    action: 'Actualización de temario',
    dateTime: 'Ayer, 14:00 PM',
    status: 'Completado',
    type: 'curso',
  },
];

export const DEFAULT_WHATSAPP_TEMPLATE = `¡Hola {nombre_alumno}! 👋

Bienvenido a la plataforma de Impulso Académico L&L. Nos alegra tenerte con nosotros.

Construimos las bases de tu éxito, y para empezar, aquí tienes tus credenciales de acceso:

👤 *Usuario:* {usuario}
🔑 *Contraseña:* {password}

Puedes acceder a tu portal desde este enlace:
🔗 {enlace_acceso}

Si tienes alguna duda, responde a este mensaje. ¡Mucho éxito en tus clases!`;
