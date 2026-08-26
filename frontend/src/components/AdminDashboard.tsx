import React, { useState } from 'react';
import { NavigationTab, Student, Course, Teacher, ScheduleItem } from '../types';
import { Users, GraduationCap, UserCheck, Calendar, Search, Mail, Phone, MapPin, Clock, AlertTriangle, FileText, CheckCircle, Printer } from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenNewModal: () => void;
  students: Student[];
  courses: Course[];
  teachers: Teacher[];
  scheduleItems: ScheduleItem[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setActiveTab,
  onOpenNewModal,
  students,
  courses,
  teachers,
  scheduleItems,
}) => {
  const [activeCategory, setActiveCategory] = useState<'students' | 'courses' | 'teachers' | 'schedule' | 'reports'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  // Report States
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [reportStartDate, setReportStartDate] = useState<string>('2026-08-17');
  const [reportEndDate, setReportEndDate] = useState<string>('2026-08-22');
  const [generatedReport, setGeneratedReport] = useState<{
    teacher: Teacher;
    courses: Course[];
    classes: { item: ScheduleItem; date: string; isPast: boolean }[];
    pendingCourses: Course[];
    pendingClasses: { item: ScheduleItem; date: string }[];
    totalHours: number;
  } | null>(null);

  const getClassDateStr = (weekStartDate: string, dayIndex: number): string => {
    const baseDate = new Date(weekStartDate);
    baseDate.setDate(baseDate.getDate() + dayIndex);
    return baseDate.toISOString().split('T')[0];
  };

  const handleGenerateReport = () => {
    if (!selectedTeacherId || !reportStartDate || !reportEndDate) return;
    
    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher) return;
    
    const teacherCourses = courses.filter(c => c.teacher === teacher.name);
    const teacherSchedule = scheduleItems.filter(item => item.teacher === teacher.name);
    
    const classes: { item: ScheduleItem; date: string; isPast: boolean }[] = [];
    const pendingClasses: { item: ScheduleItem; date: string }[] = [];
    let totalHours = 0;
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    teacherSchedule.forEach(item => {
      const dateStr = getClassDateStr(item.weekStartDate || '2026-08-17', item.dayIndex);
      
      if (dateStr >= reportStartDate && dateStr <= reportEndDate) {
        const isPast = dateStr < todayStr;
        classes.push({ item, date: dateStr, isPast });
        totalHours += item.durationHours;
        
        if (!isPast) {
          pendingClasses.push({ item, date: dateStr });
        }
      }
    });
    
    classes.sort((a, b) => a.date.localeCompare(b.date) || a.item.startTime.localeCompare(b.item.startTime));
    pendingClasses.sort((a, b) => a.date.localeCompare(b.date) || a.item.startTime.localeCompare(b.item.startTime));
    
    const pendingCourses = teacherCourses.filter(c => c.progress < 100);
    
    setGeneratedReport({
      teacher,
      courses: teacherCourses,
      classes,
      pendingCourses,
      pendingClasses,
      totalHours
    });
  };

  const renderReportsSection = () => {
    return (
      <div className="space-y-6">
        {/* Form Controls */}
        <div className="bg-slate-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 flex flex-col md:flex-row gap-4 items-end print:hidden">
          <div className="flex-1 space-y-1 w-full">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Docente</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-white focus:outline-none focus:border-brand-teal"
            >
              <option value="">Selecciona un docente</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 w-full md:w-44">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Fecha de Inicio</label>
            <input
              type="date"
              value={reportStartDate}
              onChange={(e) => setReportStartDate(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div className="space-y-1 w-full md:w-44">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Fecha de Fin</label>
            <input
              type="date"
              value={reportEndDate}
              onChange={(e) => setReportEndDate(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-white focus:outline-none focus:border-brand-teal"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateReport}
            className="w-full md:w-auto px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Generar Reporte
          </button>
        </div>

        {/* Generated Report Card */}
        {generatedReport ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6 print-section">
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-brand-teal/15 text-brand-teal px-2.5 py-1 rounded-full text-[10px] font-bold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Reporte de Actividades del Docente</span>
                </div>
                <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">{generatedReport.teacher.name}</h4>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Especialidad: {generatedReport.teacher.specialty}</p>
                <p className="text-[10px] text-gray-400 font-medium">Período: {reportStartDate} al {reportEndDate}</p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer print:hidden"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cursos a Cargo</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{generatedReport.courses.length}</p>
              </div>
              <div className="bg-slate-50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Clases Impartidas/Prog.</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{generatedReport.classes.length}</p>
              </div>
              <div className="bg-slate-50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Horas en Período</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{generatedReport.totalHours} hrs</p>
              </div>
            </div>

            {/* Courses section */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-1.5">Cursos Asignados</h5>
              {generatedReport.courses.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No tiene cursos asignados.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedReport.courses.map(c => (
                    <div key={c.id} className="p-3 border border-gray-150 dark:border-gray-800 rounded-xl flex justify-between items-center bg-gray-50/20 dark:bg-gray-800/10">
                      <div>
                        <p className="text-xs font-bold text-gray-850 dark:text-white">{c.name}</p>
                        <p className="text-[10px] text-gray-400">Nivel: {c.level} | Aula: {c.room}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-teal/15 text-brand-teal">
                          {c.progress}% Avance
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Classes section */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-1.5">Clases y Asesorías del Período</h5>
              {generatedReport.classes.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No se registraron clases en este período.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-150 dark:border-gray-800 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-gray-850/50 border-b border-gray-150 dark:border-gray-800 font-bold text-gray-500">
                        <th className="p-2.5 pl-4">Fecha</th>
                        <th className="p-2.5">Curso</th>
                        <th className="p-2.5">Horario</th>
                        <th className="p-2.5">Aula</th>
                        <th className="p-2.5">Duración</th>
                        <th className="p-2.5 pr-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {generatedReport.classes.map((cls, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/10">
                          <td className="p-2.5 pl-4 font-semibold text-gray-600 dark:text-gray-400">{cls.date}</td>
                          <td className="p-2.5 font-bold text-gray-855 dark:text-white">{cls.item.title}</td>
                          <td className="p-2.5 font-medium">{cls.item.startTime} hrs</td>
                          <td className="p-2.5 font-mono">{cls.item.room}</td>
                          <td className="p-2.5">{cls.item.durationHours} hrs</td>
                          <td className="p-2.5 pr-4">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              cls.isPast 
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                            }`}>
                              {cls.isPast ? 'Impartida' : 'Programada'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pending Section */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-1.5">Actividades y Pendientes</h5>
              <div className="space-y-2">
                {/* Course progress pending */}
                {generatedReport.pendingCourses.map(c => (
                  <div key={c.id} className="p-3 border border-amber-200 dark:border-amber-900/50 bg-amber-50/10 dark:bg-amber-950/5 rounded-xl flex items-center gap-2 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-bold text-gray-850 dark:text-white">Temario Incompleto en {c.name}:</span>
                      <span className="text-gray-500 ml-1">Falta cubrir el {100 - c.progress}% del temario asignado.</span>
                    </div>
                  </div>
                ))}

                {/* Upcoming classes */}
                {generatedReport.pendingClasses.map((cls, idx) => (
                  <div key={idx} className="p-3 border border-blue-200 dark:border-blue-900/50 bg-blue-50/10 dark:bg-blue-950/5 rounded-xl flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="font-bold text-gray-855 dark:text-white">Clase Pendiente por Impartir:</span>
                      <span className="text-gray-500 ml-1">{cls.item.title} el {cls.date} a las {cls.item.startTime} hrs.</span>
                    </div>
                  </div>
                ))}

                {generatedReport.pendingCourses.length === 0 && generatedReport.pendingClasses.length === 0 && (
                  <div className="p-3 border border-emerald-250 dark:border-emerald-950 bg-emerald-50/10 dark:bg-emerald-950/5 rounded-xl flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">¡Al corriente! No hay actividades ni clases pendientes para este docente en el período seleccionado.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-gray-800/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
            <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h5 className="font-bold text-sm text-gray-700 dark:text-gray-300">Genera un nuevo reporte</h5>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">Selecciona el docente y las fechas deseadas arriba para ver el listado de actividades, clases y pendientes.</p>
          </div>
        )}
      </div>
    );
  };

  // Compute classes scheduled for today
  const today = new Date().getDay(); // 0 is Sun, 1 is Mon, ..., 6 is Sat
  const dayIndexMap = [5, 0, 1, 2, 3, 4, 5]; // Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=5
  const todayIndex = dayIndexMap[today];
  const todayClasses = scheduleItems.filter(item => item.dayIndex === todayIndex);
  const classesTodayCount = todayClasses.length;

  // Filter lists based on search
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.folio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSchedule = todayClasses.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStudentsList = () => {
    if (filteredStudents.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400 font-semibold text-xs">
          No se encontraron alumnos registrados.
        </div>
      );
    }

    return (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f8fafc] dark:bg-gray-800/50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-150 dark:border-gray-800">
            <th className="p-4 pl-6">Folio</th>
            <th className="p-4">Alumno</th>
            <th className="p-4">Nivel Académico</th>
            <th className="p-4">Contacto</th>
            <th className="p-4">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm">
          {filteredStudents.map((s) => {
            const levelColors: Record<string, string> = {
              'Básica': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
              'Media Superior': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
              'Nivel Superior': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
            };
            const statusColors: Record<string, string> = {
              'Activo': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
              'Pendiente': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
              'Enviado': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
            };

            return (
              <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-4 pl-6 font-mono font-bold text-slate-400 dark:text-gray-500">
                  #{s.folio}
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${levelColors[s.level] || 'bg-gray-50 text-gray-700'}`}>
                    {s.level}
                  </span>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{s.phone}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[s.status] || 'bg-gray-50 text-gray-700'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderCoursesList = () => {
    if (filteredCourses.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400 font-semibold text-xs">
          No se encontraron talleres activos.
        </div>
      );
    }

    return (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f8fafc] dark:bg-gray-800/50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-150 dark:border-gray-800">
            <th className="p-4 pl-6">Curso / Taller</th>
            <th className="p-4">Docente</th>
            <th className="p-4">Nivel</th>
            <th className="p-4">Aula</th>
            <th className="p-4">Horario</th>
            <th className="p-4">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm">
          {filteredCourses.map((c) => {
            const levelColors: Record<string, string> = {
              'Básica': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
              'Media Superior': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
              'Nivel Superior': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
            };
            const statusColors: Record<string, string> = {
              'Activo': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
              'Concluido': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
              'Proximamente': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
            };

            return (
              <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{c.name}</div>
                  {c.description && <div className="text-xs text-gray-400 line-clamp-1">{c.description}</div>}
                </td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                  {c.teacher}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${levelColors[c.level] || 'bg-gray-50'}`}>
                    {c.level}
                  </span>
                </td>
                <td className="p-4 font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{c.room}</span>
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{c.timeSlot}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[c.status] || 'bg-gray-50'}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderTeachersList = () => {
    if (filteredTeachers.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400 font-semibold text-xs">
          No se encontraron docentes.
        </div>
      );
    }

    return (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f8fafc] dark:bg-gray-800/50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-150 dark:border-gray-800">
            <th className="p-4 pl-6">Docente</th>
            <th className="p-4">Título / Especialidad</th>
            <th className="p-4">Contacto</th>
            <th className="p-4">Materias / Temas</th>
            <th className="p-4">Aula Principal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm">
          {filteredTeachers.map((t) => {
            return (
              <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 flex items-center justify-center font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{t.name}</div>
                      <div className="text-xs text-gray-400">@{t.username}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-700 dark:text-slate-300">{t.title}</div>
                  <div className="text-xs text-gray-400">{t.specialty}</div>
                </td>
                <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate max-w-[150px]">{t.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{t.phone}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {t.subjects?.map((sub, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-semibold">
                        {sub}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{t.room}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderScheduleList = () => {
    if (filteredSchedule.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400 font-semibold text-xs">
          No hay clases programadas para el día de hoy.
        </div>
      );
    }

    return (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f8fafc] dark:bg-gray-800/50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-150 dark:border-gray-800">
            <th className="p-4 pl-6">Clase / Taller</th>
            <th className="p-4">Docente</th>
            <th className="p-4">Horario</th>
            <th className="p-4">Aula</th>
            <th className="p-4">Conflicto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm">
          {filteredSchedule.map((item) => {
            return (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-100">
                  {item.title}
                </td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                  {item.teacher}
                </td>
                <td className="p-4 font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{item.startTime} ({item.durationHours} hrs)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{item.room}</span>
                  </div>
                </td>
                <td className="p-4">
                  {item.hasConflict ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300 rounded-full text-[10px] font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{item.conflictDetails || 'Conflicto de horario'}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 rounded-full text-[10px] font-bold">
                      Sin conflicto
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const [absences, setAbsences] = useState<{
    id: number;
    studentId: string;
    courseId: string;
    classDate: string;
    studentName: string;
    studentFolio: string;
    courseName: string;
    courseTeacher: string;
  }[]>([]);

  const BACKEND_URL = import.meta.env.DEV
    ? ''
    : (import.meta.env.REACT_APP_BACKEND_URL || 'https://cursosll-backend-production.up.railway.app');

  React.useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/attendance/absences`);
        if (response.ok) {
          const data = await response.json();
          setAbsences(data);
        }
      } catch (err) {
        console.error('Error fetching absences:', err);
      }
    };
    fetchAbsences();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Attendance Absences Alerts */}
      {absences.length > 0 && (
        <div className="bg-red-50/70 dark:bg-red-950/20 border-2 border-red-200/50 dark:border-red-900/30 rounded-3xl p-5 mb-6 space-y-3">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 animate-bounce shrink-0" />
            <h3 className="font-extrabold text-sm tracking-wide uppercase">Alertas de Inasistencia</h3>
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
              {absences.length}
            </span>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {absences.slice(0, 5).map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white dark:bg-gray-900 border border-red-150/40 dark:border-red-900/10 rounded-2xl text-xs shadow-3xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="font-extrabold text-slate-800 dark:text-white">{a.studentName}</span>
                  <span className="text-gray-400 font-semibold font-mono">#{a.studentFolio}</span>
                  <span className="text-slate-600 dark:text-gray-400">faltó a <strong className="font-bold text-slate-800 dark:text-white">"{a.courseName}"</strong></span>
                </div>
                <div className="flex items-center gap-3 font-medium">
                  <span className="text-gray-400">Docente: {a.courseTeacher}</span>
                  <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/30 px-2.5 py-0.5 rounded-lg font-extrabold text-[10px]">
                    {a.classDate}
                  </span>
                </div>
              </div>
            ))}
            {absences.length > 5 && (
              <p className="text-[10px] text-gray-400 font-bold italic text-center pt-1">
                Y {absences.length - 5} alertas de inasistencia adicionales...
              </p>
            )}
          </div>
        </div>
      )}

      {/* KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 print:hidden">
        {/* KPI 1 */}
        <div 
          onClick={() => { setActiveCategory('students'); setSearchQuery(''); }}
          className={`bg-white dark:bg-gray-900 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer group border ${
            activeCategory === 'students'
              ? 'border-brand-red shadow-sm bg-red-50/10 dark:bg-red-950/10 scale-[1.02]'
              : 'border-[#e0e3e5] dark:border-gray-800 hover:border-brand-red hover:shadow-xs'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-brand-red-light dark:bg-brand-red/20 flex items-center justify-center text-brand-text dark:text-brand-red group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#45464f] uppercase tracking-wider">Total Alumnos</p>
            <h3 className="text-2xl font-extrabold text-brand-text dark:text-white">{students.length}</h3>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => { setActiveCategory('courses'); setSearchQuery(''); }}
          className={`bg-white dark:bg-gray-900 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer group border ${
            activeCategory === 'courses'
              ? 'border-brand-teal shadow-sm bg-teal-50/10 dark:bg-teal-950/10 scale-[1.02]'
              : 'border-[#e0e3e5] dark:border-gray-800 hover:border-brand-teal hover:shadow-xs'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-brand-teal-light dark:bg-brand-teal/20 flex items-center justify-center text-brand-teal dark:text-brand-teal-hover group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#45464f] uppercase tracking-wider">Talleres Activos</p>
            <h3 className="text-2xl font-extrabold text-brand-text dark:text-white">{courses.length}</h3>
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => { setActiveCategory('teachers'); setSearchQuery(''); }}
          className={`bg-white dark:bg-gray-900 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer group border ${
            activeCategory === 'teachers'
              ? 'border-violet-500 shadow-sm bg-violet-50/10 dark:bg-violet-950/10 scale-[1.02]'
              : 'border-[#e0e3e5] dark:border-gray-800 hover:border-violet-500 hover:shadow-xs'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-[#eaddff] dark:bg-violet-950/50 flex items-center justify-center text-[#21005d] dark:text-violet-300 group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#45464f] uppercase tracking-wider">Docentes</p>
            <h3 className="text-2xl font-extrabold text-brand-text dark:text-white">{teachers.length}</h3>
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => { setActiveCategory('schedule'); setSearchQuery(''); }}
          className={`bg-white dark:bg-gray-900 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer group border ${
            activeCategory === 'schedule'
              ? 'border-amber-500 shadow-sm bg-amber-50/10 dark:bg-amber-950/10 scale-[1.02]'
              : 'border-[#e0e3e5] dark:border-gray-800 hover:border-amber-500 hover:shadow-xs'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-[#ffdad6] dark:bg-red-950/50 flex items-center justify-center text-[#ba1a1a] dark:text-red-300 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#45464f] uppercase tracking-wider">Próximas Clases Hoy</p>
            <h3 className="text-2xl font-extrabold text-brand-text dark:text-white">{classesTodayCount}</h3>
          </div>
        </div>

        {/* KPI 5: Reports */}
        <div 
          onClick={() => { setActiveCategory('reports'); setSearchQuery(''); }}
          className={`bg-white dark:bg-gray-900 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer group border ${
            activeCategory === 'reports'
              ? 'border-brand-teal shadow-sm bg-teal-50/10 dark:bg-teal-950/10 scale-[1.02]'
              : 'border-[#e0e3e5] dark:border-gray-800 hover:border-brand-teal hover:shadow-xs'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-brand-teal-light dark:bg-brand-teal/20 flex items-center justify-center text-brand-teal dark:text-brand-teal-hover group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#45464f] uppercase tracking-wider">Reportes</p>
            <h3 className="text-base font-extrabold text-brand-text dark:text-white mt-1">Generar Reporte</h3>
          </div>
        </div>
      </section>

      {/* Dynamic List Section */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-6 animate-fade-in print:p-0 print:border-none print:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5 print:hidden">
          <div>
            <h3 className="text-lg font-extrabold text-brand-text dark:text-white tracking-tight flex items-center gap-2">
              {activeCategory === 'students' && <>Listado de Alumnos Registrados</>}
              {activeCategory === 'courses' && <>Catálogo de Talleres y Cursos Activos</>}
              {activeCategory === 'teachers' && <>Directorio de Docentes y Profesores</>}
              {activeCategory === 'schedule' && <>Clases y Asesorías Programadas para Hoy</>}
              {activeCategory === 'reports' && <>Generar Reporte de Actividades por Docente</>}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {activeCategory === 'students' && `Mostrando ${filteredStudents.length} de ${students.length} alumnos registrados.`}
              {activeCategory === 'courses' && `Mostrando ${filteredCourses.length} de ${courses.length} talleres registrados.`}
              {activeCategory === 'teachers' && `Mostrando ${filteredTeachers.length} de ${teachers.length} docentes registrados.`}
              {activeCategory === 'schedule' && `Mostrando ${filteredSchedule.length} de ${classesTodayCount} clases programadas hoy.`}
              {activeCategory === 'reports' && 'Selecciona un docente y un rango de fechas para consultar su desempeño, clases dictadas y tareas pendientes.'}
            </p>
          </div>

          {/* Search Input */}
          {activeCategory !== 'reports' && (
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeCategory === 'students' ? "Buscar por nombre, correo, folio..." :
                  activeCategory === 'courses' ? "Buscar por taller, docente, aula..." :
                  activeCategory === 'teachers' ? "Buscar por nombre, especialidad, correo..." :
                  "Buscar por clase, docente, aula..."
                }
                className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white transition-colors"
              />
            </div>
          )}
        </div>

        {/* Content Table / List */}
        <div className={activeCategory === 'reports' ? "" : "overflow-x-auto"}>
          {activeCategory === 'students' && renderStudentsList()}
          {activeCategory === 'courses' && renderCoursesList()}
          {activeCategory === 'teachers' && renderTeachersList()}
          {activeCategory === 'schedule' && renderScheduleList()}
          {activeCategory === 'reports' && renderReportsSection()}
        </div>
      </section>
    </div>
  );
};
