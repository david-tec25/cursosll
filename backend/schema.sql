DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS recent_activities;
DROP TABLE IF EXISTS schedule_items;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS whatsapp_template;

-- Create tables
CREATE TABLE students (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  folio VARCHAR(20) NOT NULL,
  level VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  username VARCHAR(50) UNIQUE,
  temp_password VARCHAR(50),
  registered_at VARCHAR(50) NOT NULL,
  avatar VARCHAR(255)
);

CREATE TABLE courses (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  teacher VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  progress INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  room VARCHAR(50) NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE teachers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  avatar VARCHAR(255) NOT NULL,
  subjects TEXT[] NOT NULL,
  room VARCHAR(50),
  username VARCHAR(50) UNIQUE,
  temp_password VARCHAR(50)
);

CREATE TABLE schedule_items (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  teacher VARCHAR(100) NOT NULL,
  day_index INTEGER NOT NULL,
  start_time VARCHAR(20) NOT NULL,
  duration_hours DOUBLE PRECISION NOT NULL,
  room VARCHAR(50) NOT NULL,
  has_conflict BOOLEAN DEFAULT FALSE,
  conflict_details TEXT,
  color_theme VARCHAR(20),
  week_start_date VARCHAR(50) DEFAULT '2026-08-17'
);

CREATE TABLE recent_activities (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  user_initials VARCHAR(10) NOT NULL,
  action VARCHAR(255) NOT NULL,
  date_time VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL
);

CREATE TABLE whatsapp_template (
  id SERIAL PRIMARY KEY,
  message_text TEXT NOT NULL
);

CREATE TABLE student_courses (
  student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
  course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, course_id)
);





-- Insert Initial Teachers
INSERT INTO teachers (id, name, title, specialty, email, phone, avatar, subjects, room, username, temp_password) VALUES
('t-1', 'Ing. Liliana Silvestre Castillo', 'Ing. en Química', 'Química General, Inorgánica, Orgánica y Matemáticas', 'llcursoschapademota@gmail.com', '55-1414-8765', '/liliana_silvestre.jpg', ARRAY['Química', 'Ciencias Naturales', 'Experimentos de Laboratorio', 'Matemáticas'], 'Lab Química', 'liliana.silvestre', 'liliana123'),
('t-2', 'Mtra. Liliana Martínez Palacios', 'Maestra en Ciencias de la Educación', 'Preparación para examen de admisión, Computación & Taller de Tareas', 'llcursoschapademota@gmail.com', '55-4713-0833', '/liliana_palacios.jpg', ARRAY['Taller de tareas', 'Inglés', 'Comprensión Lectora', 'Computación Básica'], 'Aula Multiusos', 'liliana.martinez', 'martinez123');

-- Insert Initial Students
INSERT INTO students (id, name, email, phone, folio, level, status, username, temp_password, registered_at, avatar) VALUES
('st-1', 'Ana García López', 'ana.garcia@email.com', '5512345678', '84920', 'Media Superior', 'Pendiente', 'ana.garcial.ms', 'IA-9824-ms!', 'Hoy, 10:24 AM', NULL),
('st-2', 'Carlos Mendoza', 'carlos.mendoza@email.com', '5587654321', '84919', 'Nivel Superior', 'Activo', 'carlos.m.ns', 'IA-7731-ns!', 'Hace 10 min', NULL),
('st-3', 'María Fernanda Ruíz', 'm.fernanda@email.com', '5544332211', '84918', 'Básica', 'Enviado', 'm.fernanda.b', 'IA-5512-b!', 'Hace 45 min', NULL),
('st-4', 'Luis Torres', 'luis.torres@email.com', '5566778899', '84917', 'Media Superior', 'Pendiente', 'luis.torres.ms', 'IA-3390-ms!', 'Hace 2 horas', NULL),
('st-5', 'Juan López', 'juan.lopez@email.com', '5599887766', '84916', 'Básica', 'Activo', 'juan.lopez.b', 'IA-1102-b!', 'Ayer, 16:30 PM', NULL);

-- Insert Initial Courses
INSERT INTO courses (id, name, teacher, level, progress, status, room, time_slot, icon_name, description) VALUES
('c-1', 'Física Avanzada', 'Dr. Roberto Sánchez', 'Media Superior', 75, 'Activo', 'Aula 302', '10:00 AM', 'science', 'Principios de mecánica, termodinámica y óptica para bachillerato y examen de admisión.'),
('c-2', 'Cálculo Integral', 'Mtra. Elena Gómez', 'Media Superior', 40, 'Activo', 'Lab B', '13:30 PM', 'calculate', 'Métodos de integración, aplicaciones del cálculo diferencial e integral.'),
('c-3', 'Matemáticas Avanzadas', 'Prof. A. Ramírez', 'Nivel Superior', 90, 'Activo', 'Aula 101', '08:00 AM', 'functions', 'Álgebra lineal, ecuaciones diferenciales y geometría analítica.'),
('c-5', 'Química General e Inorgánica', 'Liliana Silvestre Castillo', 'Básica', 85, 'Activo', 'Lab Química', '11:00 AM', 'flask', 'Estructura atómica, enlaces químicos, estequiometría y tabla periódica.'),
('c-6', 'Taller de Tareas y Asesorías', 'Liliana Silvestre Castillo', 'Básica', 50, 'Activo', 'Aula Multiusos', '15:00 PM', 'book', 'Refuerzo escolar personalizado para educación básica y media superior.');

-- Insert Student Courses (Enrolled in courses)
INSERT INTO student_courses (student_id, course_id) VALUES
('st-1', 'c-1'),
('st-1', 'c-2'),
('st-2', 'c-3'),
('st-5', 'c-5');

-- Insert Initial Recent Activities
INSERT INTO recent_activities (id, username, user_initials, action, date_time, status, type) VALUES
('act-1', 'Ana García', 'AG', 'Registro en sistema', 'Hoy, 10:24 AM', 'Completado', 'registro'),
('act-2', 'Juan Pérez', 'JP', 'Credenciales enviadas', 'Hoy, 09:15 AM', 'Completado', 'credencial'),
('act-3', 'Luis Martínez', 'LM', 'Pago de mensualidad', 'Ayer, 16:30 PM', 'Pendiente', 'pago'),
('act-4', 'Clase: Matemáticas', 'CM', 'Actualización de temario', 'Ayer, 14:00 PM', 'Completado', 'curso');

-- Insert default WhatsApp Template
INSERT INTO whatsapp_template (message_text) VALUES (
'¡Hola {nombre_alumno}! 👋

Bienvenido a la plataforma de Impulso Académico L&L. Nos alegra tenerte con nosotros.

Construimos las bases de tu éxito, y para empezar, aquí tienes tus credenciales de acceso:

👤 *Usuario:* {usuario}
🔑 *Contraseña:* {password}

Puedes acceder a tu portal desde este enlace:
🔗 {enlace_acceso}

Si tienes alguna duda, responde a este mensaje. ¡Mucho éxito en tus clases!'
);

-- Insert Initial Schedule Items
INSERT INTO schedule_items (id, title, teacher, day_index, start_time, duration_hours, room, has_conflict, conflict_details, color_theme) VALUES
('sch-1', 'Matemáticas Avanzadas', 'Prof. A. Ramírez', 0, '08:00', 1.5, 'Aula 101', FALSE, NULL, 'navy'),
('sch-2', 'Física Cuántica', 'Prof. M. Silva', 1, '09:00', 2.0, 'Individual - Lab 3', TRUE, 'Conflicto de Aula: Solapamiento en Lab 3 con taller práctico.', 'error'),
('sch-3', 'Taller de Diseño & Web', 'Prof. L. Torres', 2, '10:00', 1.5, 'Estudio B', FALSE, NULL, 'lime'),
('sch-4', 'Química General', 'Liliana Silvestre Castillo', 3, '08:30', 1.5, 'Lab Química', FALSE, NULL, 'blue'),
('sch-6', 'Preparación Examen Admisión', 'Mtra. Liliana Martínez Palacios', 5, '09:00', 3.0, 'Auditorio Chapa de Mota', FALSE, NULL, 'lime');
