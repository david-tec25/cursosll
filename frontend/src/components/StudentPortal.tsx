import React, { useState } from 'react';
import { Course, NavigationTab, Student, ScheduleItem } from '../types';
import { Mail, Phone, MapPin, Calendar, BookOpen, User, Shield, Info, X } from 'lucide-react';

interface StudentPortalProps {
  student: Student | undefined;
  courses: Course[];
  setActiveTab: (tab: NavigationTab) => void;
  scheduleItems?: ScheduleItem[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ student, courses, setActiveTab, scheduleItems }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const getAssignedDays = (courseName: string) => {
    if (!scheduleItems) return 'No asignados';
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const matched = scheduleItems.filter(
      (item) => item.title.toLowerCase() === courseName.toLowerCase()
    );
    if (matched.length === 0) return 'Por definir';
    
    const uniqueDays = Array.from(
      new Set(matched.map((item) => item.dayIndex).sort((a, b) => a - b))
    ) as number[];
    return uniqueDays.map((index) => days[index]).join(', ');
  };

  // Only active courses
  const activeCourses = courses.filter(c => c.status === 'Activo');

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary-hover p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
            Portal Estudiantil
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-3 mb-1">
            ¡Hola, {student?.name || 'Alumno'}! 👋
          </h2>
          <p className="text-white/80 text-sm max-w-xl">
            Bienvenido a tu panel personal. Aquí puedes revisar tus cursos activos y consultar tus datos institucionales.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Courses Section (Spans 2 columns on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-brand-dark dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-primary" />
              <span>Cursos Activos ({activeCourses.length})</span>
            </h3>
          </div>

          {/* Selected Course Details Grid */}
          {selectedCourse && (
            <div className="bg-[#f8fafc] dark:bg-gray-800/40 border-2 border-brand-primary/30 p-5 rounded-2xl animate-fade-in space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-gray-700">
                <h4 className="font-extrabold text-sm text-brand-primary dark:text-brand-teal flex items-center gap-1.5 uppercase tracking-wider">
                  <Info className="w-4.5 h-4.5" />
                  <span>Detalles del Curso Seleccionado</span>
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200/50">
                  {selectedCourse.status}
                </span>
              </div>

              {/* Grid Layout containing details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Detail 1: Nombre */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-2xs">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nombre del Curso</p>
                  <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1">{selectedCourse.name}</p>
                </div>

                {/* Detail 2: Maestro */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-2xs">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Docente / Maestro</p>
                  <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1">{selectedCourse.teacher}</p>
                </div>

                {/* Detail 3: Días Asignados */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-2xs">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Días Asignados</p>
                  <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1">
                    {getAssignedDays(selectedCourse.name)}
                  </p>
                </div>

                {/* Detail 4: Horario */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-2xs">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Horario Asignado</p>
                  <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1">{selectedCourse.timeSlot || 'Por definir'}</p>
                </div>

                {/* Detail 5: Aula */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-750 shadow-2xs">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aula Asignada</p>
                  <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1">{selectedCourse.room || 'No asignada'}</p>
                </div>
              </div>

              {/* Action button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cerrar Detalles</span>
                </button>
              </div>
            </div>
          )}

          {activeCourses.length > 0 ? (
            <div className="space-y-3">
              {activeCourses.map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => setSelectedCourse(course)}
                  className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-brand-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                  title="Haga clic para ver detalles del curso"
                >
                  {/* Left part: Icon & Title & Teacher */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-red-light text-brand-red flex items-center justify-center font-bold shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-gray-900 dark:text-white tracking-tight">{course.name}</h4>
                      <p className="text-xs text-gray-505 font-semibold">Docente: {course.teacher}</p>
                    </div>
                  </div>

                  {/* Middle part: Classroom & Schedule */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-gray-650 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                      <span>Aula: <strong className="font-bold text-gray-800 dark:text-white">{course.room || 'No asignada'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>Horario: <strong className="font-bold text-gray-800 dark:text-white">{course.timeSlot || 'Por definir'}</strong></span>
                    </div>
                  </div>

                  {/* Right part: Status badge */}
                  <div className="flex items-center shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200/50">
                      {course.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-gray-850 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-bold">No tienes materias activas en este período.</p>
              <p className="text-xs text-gray-400 mt-1">Comunícate con el administrador para inscribir tus cursos.</p>
            </div>
          )}
        </div>

        {/* Personal Information Section (Spans 1 column) */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg text-brand-dark dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-brand-teal" />
            <span>Información Personal</span>
          </h3>

          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-6">
            {/* Student Avatar / Initials */}
            <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-850 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-red-light text-brand-red font-black text-lg flex items-center justify-center shadow-xs">
                {student?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AL'}
              </div>
              <div>
                <h4 className="font-black text-base text-gray-900 dark:text-white tracking-tight">{student?.name || 'Nombre del Alumno'}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 dark:bg-gray-850 text-slate-650 dark:text-gray-300 uppercase">
                    Folio: #{student?.folio || '0000'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-brand-red-light text-brand-red uppercase">
                    {student?.level || 'Nivel'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-gray-850 text-gray-450 flex items-center justify-center shrink-0 border border-gray-150/40">
                  <Mail className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Correo Electrónico</p>
                  <p className="text-sm font-bold text-gray-750 dark:text-gray-250 mt-0.5 break-all">{student?.email || 'No registrado'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-gray-850 text-gray-450 flex items-center justify-center shrink-0 border border-gray-150/40">
                  <Phone className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Teléfono de Contacto</p>
                  <p className="text-sm font-bold text-gray-750 dark:text-gray-250 mt-0.5">{student?.phone || 'No registrado'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-gray-850 text-gray-450 flex items-center justify-center shrink-0 border border-gray-150/40">
                  <Shield className="w-4 h-4 text-brand-teal" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado de Inscripción</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-sm font-extrabold text-gray-750 dark:text-gray-250">{student?.status || 'Activo'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-gray-850 text-gray-450 flex items-center justify-center shrink-0 border border-gray-150/40">
                  <Info className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Usuario de Acceso</p>
                  <p className="text-sm font-mono font-bold text-brand-primary dark:text-brand-teal mt-0.5">@{student?.username || 'sin_usuario'}</p>
                </div>
              </div>
            </div>

            {/* Note/Notice */}
            <div className="bg-slate-50 dark:bg-gray-850/80 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl text-[11px] text-gray-500 leading-relaxed">
              <strong>Nota:</strong> Si requieres actualizar tu correo, teléfono o inscribir una nueva materia, contacta a la coordinación escolar de <strong>Impulso Académico L&L</strong>.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
