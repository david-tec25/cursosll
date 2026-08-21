import { Student, Course, Teacher, ScheduleItem, RecentActivityItem } from '../types.js';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'st-1',
    name: 'Ana García López',
    email: 'ana.garcia@email.com',
    phone: '5512345678',
    folio: '84920',
    level: 'Media Superior',
    status: 'Pendiente',
    username: 'ana.garcial.ms',
    tempPassword: 'IA-9824-ms!',
    registeredAt: 'Hoy, 10:24 AM',
  },
  {
    id: 'st-2',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    phone: '5587654321',
    folio: '84919',
    level: 'Nivel Superior',
    status: 'Activo',
    username: 'carlos.m.ns',
    tempPassword: 'IA-7731-ns!',
    registeredAt: 'Hace 10 min',
  },
  {
    id: 'st-3',
    name: 'María Fernanda Ruíz',
    email: 'm.fernanda@email.com',
    phone: '5544332211',
    folio: '84918',
    level: 'Básica',
    status: 'Enviado',
    username: 'm.fernanda.b',
    tempPassword: 'IA-5512-b!',
    registeredAt: 'Hace 45 min',
  },
  {
    id: 'st-4',
    name: 'Luis Torres',
    email: 'luis.torres@email.com',
    phone: '5566778899',
    folio: '84917',
    level: 'Media Superior',
    status: 'Pendiente',
    username: 'luis.torres.ms',
    tempPassword: 'IA-3390-ms!',
    registeredAt: 'Hace 2 horas',
  },
  {
    id: 'st-5',
    name: 'Juan López',
    email: 'juan.lopez@email.com',
    phone: '5599887766',
    folio: '84916',
    level: 'Básica',
    status: 'Activo',
    username: 'juan.lopez.b',
    tempPassword: 'IA-1102-b!',
    registeredAt: 'Ayer, 16:30 PM',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-1',
    name: 'Física Avanzada',
    teacher: 'Dr. Roberto Sánchez',
    level: 'Media Superior',
    progress: 75,
    status: 'Activo',
    room: 'Aula 302',
    timeSlot: '10:00 AM',
    iconName: 'science',
    description: 'Principios de mecánica, termodinámica y óptica para bachillerato y examen de admisión.',
  },
  {
    id: 'c-2',
    name: 'Cálculo Integral',
    teacher: 'Mtra. Elena Gómez',
    level: 'Media Superior',
    progress: 40,
    status: 'Activo',
    room: 'Lab B',
    timeSlot: '13:30 PM',
    iconName: 'calculate',
    description: 'Métodos de integración, aplicaciones del cálculo diferencial e integral.',
  },
  {
    id: 'c-3',
    name: 'Matemáticas Avanzadas',
    teacher: 'Prof. A. Ramírez',
    level: 'Nivel Superior',
    progress: 90,
    status: 'Activo',
    room: 'Aula 101',
    timeSlot: '08:00 AM',
    iconName: 'functions',
    description: 'Álgebra lineal, ecuaciones diferenciales y geometría analítica.',
  },
  {
    id: 'c-4',
    name: 'Programación Web & Bases de Datos',
    teacher: 'Lic. Victor David Maya Arce',
    level: 'Nivel Superior',
    progress: 60,
    status: 'Activo',
    room: 'Lab Computación',
    timeSlot: '16:00 PM',
    iconName: 'code',
    description: 'Desarrollo web moderno con HTML, CSS, JavaScript, React y diseño de bases de datos.',
  },
  {
    id: 'c-5',
    name: 'Química General e Inorgánica',
    teacher: 'Liliana Silvestre Castillo',
    level: 'Básica',
    progress: 85,
    status: 'Activo',
    room: 'Lab Química',
    timeSlot: '11:00 AM',
    iconName: 'flask',
    description: 'Estructura atómica, enlaces químicos, estequiometría y tabla periódica.',
  },
  {
    id: 'c-6',
    name: 'Taller de Tareas y Asesorías',
    teacher: 'Mtra. Liliana Martínez Palacios',
    level: 'Básica',
    progress: 50,
    status: 'Activo',
    room: 'Aula Multiusos',
    timeSlot: '15:00 PM',
    iconName: 'book',
    description: 'Refuerzo escolar personalizado para educación básica y media superior.',
  },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    name: 'Liliana Silvestre Castillo',
    title: 'Lic. en Química',
    specialty: 'Química General, Inorgánica y Orgánica',
    email: 'llcursoschapademota@gmail.com',
    phone: '55-1414-8765',
    avatar: '/liliana_silvestre.jpg',
    subjects: ['Química', 'Ciencias Naturales', 'Experimentos de Laboratorio'],
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
  },
  {
    id: 't-3',
    name: 'Lic. Victor David Maya Arce',
    title: 'Lic. en Informática',
    specialty: 'Programación Web, Bases de Datos & Herramientas Digitales',
    email: 'llcursoschapademota@gmail.com',
    phone: '55-1414-8765',
    avatar: '/victor_david.jpg',
    subjects: ['Programación Web', 'Bases de Datos', 'Uso de Dispositivos Electrónicos'],
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
  },
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    title: 'Matemáticas Avanzadas',
    teacher: 'Prof. A. Ramírez',
    dayIndex: 0, // Lunes
    startTime: '08:00',
    durationHours: 1.5,
    room: 'Aula 101',
    colorTheme: 'navy',
  },
  {
    id: 'sch-2',
    title: 'Física Cuántica',
    teacher: 'Prof. M. Silva',
    dayIndex: 1, // Martes
    startTime: '09:00',
    durationHours: 2.0,
    room: 'Individual - Lab 3',
    hasConflict: true,
    conflictDetails: 'Conflicto de Aula: Solapamiento en Lab 3 con taller práctico.',
    colorTheme: 'error',
  },
  {
    id: 'sch-3',
    title: 'Taller de Diseño & Web',
    teacher: 'Prof. L. Torres',
    dayIndex: 2, // Miércoles
    startTime: '10:00',
    durationHours: 1.5,
    room: 'Estudio B',
    colorTheme: 'lime',
  },
  {
    id: 'sch-4',
    title: 'Química General',
    teacher: 'Liliana Silvestre Castillo',
    dayIndex: 3, // Jueves
    startTime: '08:30',
    durationHours: 1.5,
    room: 'Lab Química',
    colorTheme: 'blue',
  },
  {
    id: 'sch-5',
    title: 'Programación Web',
    teacher: 'Lic. Victor David Maya Arce',
    dayIndex: 4, // Viernes
    startTime: '10:00',
    durationHours: 2.0,
    room: 'Lab A',
    colorTheme: 'navy',
  },
  {
    id: 'sch-6',
    title: 'Preparación Examen Admisión',
    teacher: 'Mtra. Liliana Martínez Palacios',
    dayIndex: 5, // Sábado
    startTime: '09:00',
    durationHours: 3.0,
    room: 'Auditorio Chapa de Mota',
    colorTheme: 'lime',
  },
];

export const INITIAL_ACTIVITIES: RecentActivityItem[] = [
  {
    id: 'act-1',
    user: 'Ana García',
    userInitials: 'AG',
    action: 'Registro en sistema',
    dateTime: 'Hoy, 10:24 AM',
    status: 'Completado',
    type: 'registro',
  },
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
