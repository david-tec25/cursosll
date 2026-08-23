import React, { useState, useEffect } from 'react';
import { Teacher, Course, ScheduleItem, Student } from '../types';
import { 
  User, 
  BookOpen, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Users, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Phone, 
  Mail, 
  ArrowRight,
  Eye,
  EyeOff,
  X,
  Check,
  Printer,
  Trash2
} from 'lucide-react';

interface TeacherDashboardProps {
  currentUser: string | null;
  teachers: Teacher[];
  courses: Course[];
  scheduleItems: ScheduleItem[];
  students: Student[];
  onAddScheduleItem?: (newItem: ScheduleItem) => void;
  onClearSchedule?: (title: string, teacher: string, weekStartDate: string) => Promise<void>;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  teachers,
  courses,
  scheduleItems,
  students,
  onAddScheduleItem,
  onClearSchedule,
}) => {
  const [scheduleFilter, setScheduleFilter] = useState<'mine' | 'room'>('mine');
  const [dismissedConflictIds, setDismissedConflictIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('dismissed_conflicts');
    return saved ? JSON.parse(saved) : [];
  });

  const handleDismissConflict = (id: string) => {
    const updated = [...dismissedConflictIds, id];
    setDismissedConflictIds(updated);
    localStorage.setItem('dismissed_conflicts', JSON.stringify(updated));
  };

  const handleResetDismissedConflicts = () => {
    setDismissedConflictIds([]);
    localStorage.removeItem('dismissed_conflicts');
  };
  
  // Find current logged-in teacher as default
  const defaultTeacher = teachers.find(t => t.username === currentUser) || teachers[0];
  
  // State to track which teacher's dashboard we are currently showing
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(defaultTeacher?.id || 't-1');

  // Find currently active teacher
  const currentTeacher = teachers.find(t => t.id === selectedTeacherId) || defaultTeacher;

  // New scheduling states
  const [selectedCourseToSchedule, setSelectedCourseToSchedule] = useState<Course | null>(null);
  const [courseWithExistingSchedule, setCourseWithExistingSchedule] = useState<Course | null>(null);
  const [isReadOnlySchedule, setIsReadOnlySchedule] = useState(false);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string | null>(null);
  const [scheduleWeekStart, setScheduleWeekStart] = useState('2026-08-17');
  const [scheduleRoom, setScheduleRoom] = useState(currentTeacher?.room || 'Aula Multiusos');
  const [selectedDays, setSelectedDays] = useState<{[key: number]: { start: string; end: string; active: boolean }}>({
    0: { start: '09:00', end: '10:30', active: true },
    1: { start: '09:00', end: '10:30', active: false },
    2: { start: '09:00', end: '10:30', active: false },
    3: { start: '09:00', end: '10:30', active: false },
    4: { start: '09:00', end: '10:30', active: false },
    5: { start: '09:00', end: '10:30', active: false },
  });

  // Attendance states
  const [courseForAttendance, setCourseForAttendance] = useState<Course | null>(null);
  const [attendanceDate, setAttendanceDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<{[studentId: string]: boolean}>({});

  useEffect(() => {
    if (!courseForAttendance) return;
    
    const key = `attendance_${courseForAttendance.id}_${attendanceDate}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setAttendanceRecords(JSON.parse(saved));
    } else {
      const enrolled = students.filter(s => s.courseIds?.includes(courseForAttendance.id));
      const initial: {[studentId: string]: boolean} = {};
      enrolled.forEach(s => {
        initial[s.id] = true;
      });
      setAttendanceRecords(initial);
    }
  }, [courseForAttendance, attendanceDate, students]);

  const handleSaveAttendance = () => {
    if (!courseForAttendance) return;
    
    const key = `attendance_${courseForAttendance.id}_${attendanceDate}`;
    localStorage.setItem(key, JSON.stringify(attendanceRecords));
    
    alert(`Asistencia guardada con éxito para el día ${attendanceDate}`);
    setCourseForAttendance(null);
  };

  // Attendance report states
  const [showAttendanceReport, setShowAttendanceReport] = useState(false);
  const [reportCourseId, setReportCourseId] = useState<string>('');

  useEffect(() => {
    const computedFilteredCourseObj = selectedCourseFilter
      ? courses.find(c => c.name === selectedCourseFilter && c.teacher === currentTeacher?.name)
      : null;
    const computedTeacherCourses = currentTeacher 
      ? courses.filter(c => c.teacher === currentTeacher.name)
      : [];

    if (computedFilteredCourseObj) {
      setReportCourseId(computedFilteredCourseObj.id);
    } else if (computedTeacherCourses.length > 0) {
      setReportCourseId(computedTeacherCourses[0].id);
    }
  }, [selectedCourseFilter, courses, currentTeacher, showAttendanceReport]);

  const renderAttendanceReportModal = () => {
    if (!showAttendanceReport) return null;

    const courseObj = courses.find(c => c.id === reportCourseId);
    const courseName = courseObj ? courseObj.name : '';
    
    // Find all attendance records in localStorage for this course
    const attendanceKeys = Object.keys(localStorage).filter(key => key.startsWith(`attendance_${reportCourseId}_`));
    const totalClasses = attendanceKeys.length;

    const enrolledStudents = students.filter(s => s.courseIds?.includes(reportCourseId));

    const stats = enrolledStudents.map(student => {
      let presents = 0;
      let absents = 0;
      
      attendanceKeys.forEach(key => {
        try {
          const records = JSON.parse(localStorage.getItem(key) || '{}');
          const attended = records[student.id];
          if (attended === true) {
            presents++;
          } else if (attended === false) {
            absents++;
          }
        } catch (e) {
          console.error(e);
        }
      });

      const totalTaken = presents + absents;
      const rate = totalTaken > 0 ? Math.round((presents / totalTaken) * 100) : 100;

      return {
        student,
        presents,
        absents,
        rate
      };
    });

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-up text-slate-800 dark:text-white print-section">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 p-6 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Reporte de Asistencia de Alumnos</span>
              </h3>
              <p className="text-xs text-gray-500 font-bold mt-0.5">
                Resumen de asistencia e inasistencias acumuladas
                <span className="hidden print:inline ml-1 font-extrabold text-emerald-600 dark:text-emerald-400">({courseName})</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer print:hidden"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>Imprimir Reporte</span>
              </button>
              <button 
                type="button" 
                onClick={() => setShowAttendanceReport(false)} 
                className="text-gray-400 hover:text-gray-650 transition-colors cursor-pointer p-1 print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 pr-5 scrollbar-thin">
            {/* Course Selector */}
            <div className="space-y-1 bg-slate-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 print:hidden">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Seleccionar Curso</label>
              <select
                value={reportCourseId}
                onChange={(e) => setReportCourseId(e.target.value)}
                className="w-full mt-1 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                {courses.filter(c => c.teacher === currentTeacher?.name).map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                ))}
              </select>
            </div>

            {/* Attendance Stats Table */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desglose de Alumnos</h4>
                <span className="text-[10px] bg-slate-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded font-bold">
                  Clases Registradas: {totalClasses}
                </span>
              </div>

              {enrolledStudents.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-10">No hay alumnos inscritos en este curso.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-150 dark:border-gray-800 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-gray-850/50 border-b border-gray-150 dark:border-gray-800 text-[10px] uppercase font-bold text-gray-550">
                        <th className="p-3 pl-4">Alumno</th>
                        <th className="p-3">Folio</th>
                        <th className="p-3 text-center">Asistencias</th>
                        <th className="p-3 text-center">Inasistencias</th>
                        <th className="p-3 text-right pr-4">% Asistencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {stats.map((row) => (
                        <tr key={row.student.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/10">
                          <td className="p-3 pl-4">
                            <span className="font-bold text-gray-900 dark:text-white">{row.student.name}</span>
                          </td>
                          <td className="p-3 font-mono font-semibold text-gray-400">{row.student.folio}</td>
                          <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-450">{row.presents}</td>
                          <td className="p-3 text-center font-bold text-red-500 dark:text-red-450">{row.absents}</td>
                          <td className="p-3 text-right pr-4 font-extrabold">
                            <span className={`px-2 py-0.5 rounded ${
                              row.rate >= 80 
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                                : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                            }`}>
                              {row.rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-6 pt-4 flex justify-end bg-gray-50 dark:bg-gray-800/20 print:hidden">
            <button
              type="button"
              onClick={() => setShowAttendanceReport(false)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Cerrar Reporte
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (currentTeacher) {
      setScheduleRoom(currentTeacher.room || 'Aula Multiusos');
    }
  }, [currentTeacher]);

  const parseTimeToHours = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return hours + minutes / 60;
      }
    }
    const val = parseFloat(timeStr);
    return isNaN(val) ? 0 : val;
  };

  const loadExistingSchedule = (course: Course) => {
    const existing = scheduleItems.filter(
      item => item.title === course.name && item.teacher === currentTeacher.name
    );
    if (existing.length > 0) {
      if (existing[0].weekStartDate) {
        setScheduleWeekStart(existing[0].weekStartDate);
      }
      if (existing[0].room) {
        setScheduleRoom(existing[0].room);
      }
      
      const newDaysConfig: {[key: number]: { start: string; end: string; active: boolean }} = {
        0: { start: '09:00', end: '10:30', active: false },
        1: { start: '09:00', end: '10:30', active: false },
        2: { start: '09:00', end: '10:30', active: false },
        3: { start: '09:00', end: '10:30', active: false },
        4: { start: '09:00', end: '10:30', active: false },
        5: { start: '09:00', end: '10:30', active: false },
      };

      existing.forEach(item => {
        const dayIdx = item.dayIndex;
        if (dayIdx >= 0 && dayIdx <= 5) {
          const startTimeParts = item.startTime.split(':');
          let startHrs = 9;
          let startMins = 0;
          if (startTimeParts.length >= 2) {
            startHrs = parseInt(startTimeParts[0], 10);
            startMins = parseInt(startTimeParts[1], 10);
          }
          const totalStartMins = startHrs * 60 + startMins;
          const totalEndMins = totalStartMins + (item.durationHours * 60);
          const endHrs = Math.floor(totalEndMins / 60);
          const endMins = Math.round(totalEndMins % 60);
          const formattedEnd = `${String(endHrs).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

          newDaysConfig[dayIdx] = {
            start: item.startTime,
            end: formattedEnd,
            active: true
          };
        }
      });
      setSelectedDays(newDaysConfig);
    } else {
      setScheduleWeekStart('2026-08-17');
      setScheduleRoom(currentTeacher?.room || 'Aula Multiusos');
      setSelectedDays({
        0: { start: '09:00', end: '10:30', active: true },
        1: { start: '09:00', end: '10:30', active: false },
        2: { start: '09:00', end: '10:30', active: false },
        3: { start: '09:00', end: '10:30', active: false },
        4: { start: '09:00', end: '10:30', active: false },
        5: { start: '09:00', end: '10:30', active: false },
      });
    }
  };

  const handleCourseCardClick = (course: Course) => {
    const hasExisting = scheduleItems.some(
      item => item.title === course.name && item.teacher === currentTeacher.name
    );

    if (hasExisting) {
      setCourseWithExistingSchedule(course);
    } else {
      setIsReadOnlySchedule(false);
      loadExistingSchedule(course);
      setSelectedCourseToSchedule(course);
    }
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseToSchedule || !onAddScheduleItem || !currentTeacher) return;

    // Check if there is an existing schedule to clear first
    const hasExisting = scheduleItems.some(
      item => item.title === selectedCourseToSchedule.name && item.teacher === currentTeacher.name && item.weekStartDate === scheduleWeekStart
    );

    if (hasExisting && onClearSchedule) {
      await onClearSchedule(selectedCourseToSchedule.name, currentTeacher.name, scheduleWeekStart);
    }

    let hasAdded = false;
    Object.keys(selectedDays).forEach((dayIdxKey) => {
      const dayIdx = Number(dayIdxKey);
      const dayConfig = selectedDays[dayIdx];
      if (dayConfig.active) {
        const startHrs = parseTimeToHours(dayConfig.start);
        const endHrs = parseTimeToHours(dayConfig.end);
        let duration = endHrs - startHrs;
        if (duration <= 0 || isNaN(duration)) {
          duration = 1.5;
        }

        const item: ScheduleItem = {
          id: `sch-${Date.now()}-${dayIdx}`,
          title: selectedCourseToSchedule.name,
          teacher: currentTeacher.name,
          dayIndex: dayIdx,
          startTime: dayConfig.start,
          durationHours: duration,
          room: scheduleRoom,
          colorTheme: 'navy',
          weekStartDate: scheduleWeekStart,
        };
        onAddScheduleItem(item);
        hasAdded = true;
      }
    });

    if (!hasAdded) {
      alert('Por favor, selecciona al menos un día para programar la clase.');
      return;
    }

    setSelectedCourseToSchedule(null);
    setSelectedDays({
      0: { start: '09:00', end: '10:30', active: true },
      1: { start: '09:00', end: '10:30', active: false },
      2: { start: '09:00', end: '10:35', active: false },
      3: { start: '09:00', end: '10:30', active: false },
      4: { start: '09:00', end: '10:30', active: false },
      5: { start: '09:00', end: '10:30', active: false },
    });
  };

  if (!currentTeacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-bold">No se encontró información del docente.</p>
      </div>
    );
  }

  // Filter courses taught by this teacher
  const teacherCourses = courses.filter(c => c.teacher === currentTeacher.name);

  // Filter schedule items taught by this teacher
  const teacherSchedule = scheduleItems.filter(item => item.teacher === currentTeacher.name);

  // Filter schedule items located in their assigned classroom
  const roomSchedule = scheduleItems.filter(item => item.room === currentTeacher.room);

  // Detect conflicts: classes in their assigned room taught by SOMEONE ELSE
  const roomConflicts = roomSchedule.filter(item => item.teacher !== currentTeacher.name);
  const activeConflicts = roomConflicts.filter(c => !dismissedConflictIds.includes(c.id));

  // Levels taught by this teacher
  const levelsTaught = Array.from(new Set(teacherCourses.map(c => c.level)));

  // Courses taught by this teacher
  const teacherCourseIds = teacherCourses.map(c => c.id);

  // Filter students based on selected course filter if active, otherwise show all teacher's students
  const filteredCourseObj = selectedCourseFilter
    ? courses.find(c => c.name === selectedCourseFilter && c.teacher === currentTeacher.name)
    : null;

  // Students enrolled in those courses
  const assignedStudents = students.filter(s => {
    if (filteredCourseObj) {
      return s.courseIds?.includes(filteredCourseObj.id);
    }
    return s.courseIds?.some(id => teacherCourseIds.includes(id));
  });

  // Compute stats
  const totalHours = teacherSchedule.reduce((acc, curr) => acc + curr.durationHours, 0);
  const totalCourses = teacherCourses.length;
  const classroomStatus = activeConflicts.length > 0 
    ? 'Conflicto Detectado' 
    : roomSchedule.length > 0 
    ? 'En Uso' 
    : 'Disponible';

  // Schedule Grid Setup
  const days = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  
  const baseSchedules = scheduleFilter === 'mine' ? teacherSchedule : roomSchedule;
  const displayedSchedules = selectedCourseFilter
    ? baseSchedules.filter(item => item.title === selectedCourseFilter)
    : baseSchedules;

  let startHour = 8;
  let endHour = 14;

  displayedSchedules.forEach(item => {
    const startPart = parseInt(item.startTime.split(':')[0], 10);
    if (!isNaN(startPart)) {
      if (startPart < startHour) {
        startHour = startPart;
      }
      const endPart = Math.ceil(startPart + item.durationHours);
      if (endPart > endHour) {
        endHour = endPart;
      }
    }
  });

  if (startHour < 7) startHour = 7;
  if (endHour > 21) endHour = 21;

  const hours: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    hours.push(`${String(h).padStart(2, '0')}:00`);
  }

  const getShortName = (fullName: string) => {
    if (fullName.includes('Silvestre')) return 'Liliana Silvestre';
    if (fullName.includes('Martínez')) return 'Liliana Martínez';
    if (fullName.includes('Victor')) return 'Victor David Maya';
    return fullName;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Teacher Switcher Header (3 buttons, one for each primary teacher) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-3xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ver Horarios por Docente</h3>
          <p className="text-xs text-gray-400">Selecciona un docente para visualizar su horario semanal y el uso de su aula asignada</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {dismissedConflictIds.length > 0 && (
            <button
              onClick={handleResetDismissedConflicts}
              className="px-3.5 py-2 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-750 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-brand-teal" />
              <span>Restablecer Alertas ({dismissedConflictIds.length})</span>
            </button>
          )}
          {teachers.slice(0, 3).map((t) => {
            const isActive = selectedTeacherId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTeacherId(t.id)}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-250 border-slate-200 dark:border-gray-700 hover:bg-slate-100 hover:text-brand-red'
                }`}
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/20 shadow-xs"
                />
                <span className="truncate">{getShortName(t.name)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Teacher Profile Banner */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentTeacher.avatar}
            alt={currentTeacher.name}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-brand-red shadow-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold text-brand-dark dark:text-white leading-tight">
                ¡Bienvenido, {currentTeacher.name}!
              </h2>
              <span className="px-3 py-1 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-full text-xs font-bold uppercase tracking-wider">
                Docente
              </span>
            </div>
            <p className="text-sm font-bold text-brand-teal mt-0.5">{currentTeacher.title}</p>
            <p className="text-xs text-gray-500 mt-1">{currentTeacher.specialty}</p>
          </div>
        </div>

        {/* Assigned Classroom Info */}
        <div className="bg-[#f8fafc] dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-4 rounded-2xl flex items-center gap-3 w-full md:w-auto shrink-0 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center font-bold shadow-md shadow-brand-red/15 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aula Asignada</p>
            <h4 className="font-extrabold text-base text-gray-855 dark:text-white leading-tight">
              {currentTeacher.room}
            </h4>
            <span className={`text-[10px] font-bold uppercase tracking-wider inline-block mt-0.5 ${
              classroomStatus === 'Conflicto Detectado' 
                ? 'text-red-600' 
                : classroomStatus === 'En Uso' 
                ? 'text-brand-teal' 
                : 'text-gray-550'
            }`}>
              ● {classroomStatus}
            </span>
          </div>
        </div>
      </section>

      {/* Conflicts Alert Section */}
      {activeConflicts.length > 0 && (
        <section className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-start gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-red-900 dark:text-red-200">Alertas de Aula Detectadas ({activeConflicts.length})</h4>
            <p className="text-xs text-red-700 dark:text-red-300">
              Otro docente ha reservado tu aula asignada ({currentTeacher.room}) en los siguientes horarios. Por favor coordina con administración o el maestro respectivo para resolver el solapamiento.
            </p>
            <div className="mt-2 space-y-1">
              {activeConflicts.map((conflict) => (
                <div 
                  key={conflict.id} 
                  className="inline-flex items-center gap-2 text-xs font-semibold text-red-800 dark:text-red-200 bg-white/60 dark:bg-red-900/40 pl-3 pr-2 py-1 rounded-lg mr-2 mt-1.5 border border-red-200/40 dark:border-red-850/30"
                >
                  <span>
                    <strong>{conflict.title}</strong> - {conflict.teacher} (Día {conflict.dayIndex + 1}, {conflict.startTime} hrs)
                  </span>
                  
                  <div className="flex items-center gap-1 border-l border-red-200/50 dark:border-red-850/40 pl-1.5 ml-1">
                    {onClearSchedule && (
                      <button
                        onClick={async () => {
                          if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el horario de "${conflict.title}" impartido por ${conflict.teacher}?`)) {
                            await onClearSchedule(conflict.title, conflict.teacher, conflict.weekStartDate || '2026-08-17');
                          }
                        }}
                        className="p-0.5 hover:bg-red-200 dark:hover:bg-red-950/50 rounded text-red-655 dark:text-red-400 transition-colors cursor-pointer"
                        title="Eliminar Horario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDismissConflict(conflict.id)}
                      className="p-0.5 hover:bg-red-200 dark:hover:bg-red-950/50 rounded text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                      title="Ocultar esta alerta"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-brand-red-light dark:bg-brand-red/20 flex items-center justify-center text-brand-text dark:text-brand-red shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Horas de Clase</p>
            <h3 className="text-2xl font-extrabold text-brand-text dark:text-white">{totalHours} hrs</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-brand-red/30 dark:bg-[#1a2d2f] flex items-center justify-center text-brand-teal shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mis Cursos</p>
            <h3 className="text-2xl font-extrabold text-brand-text dark:text-white">{totalCourses}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-brand-red-light dark:bg-brand-red/20 flex items-center justify-center text-brand-text dark:text-brand-red shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mis Alumnos</p>
            <h3 className="text-2xl font-extrabold text-brand-text dark:text-white">{assignedStudents.length}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Niveles a Cargo</p>
            <h3 className="text-2xl font-extrabold text-brand-text dark:text-white">{levelsTaught.join(', ') || 'N/A'}</h3>
          </div>
        </div>
      </section>

      {/* Main Grid: Schedule & Courses */}
      <div className="grid grid-cols-12 gap-6">
        {/* Schedule Calendar (Spans 8 cols on desktop) */}
        <section className="col-span-12 lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-extrabold text-lg text-brand-text dark:text-white">Horario Semanal</h3>
              <p className="text-xs text-gray-500">Distribución de clases asignadas en la semana</p>
            </div>
            {/* Filter Toggle */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {selectedCourseFilter && (
                <div className="flex items-center gap-1.5 bg-brand-teal/15 text-brand-teal px-3 py-1.5 rounded-xl text-xs font-bold animate-fade-in shadow-xs">
                  <span>Curso: {selectedCourseFilter}</span>
                  <button 
                    onClick={() => setSelectedCourseFilter(null)}
                    className="hover:text-brand-red transition-colors cursor-pointer"
                    title="Quitar filtro"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1 bg-[#f2f4f6] dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => {
                    setScheduleFilter('mine');
                    setSelectedCourseFilter(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-brand-red text-white shadow-xs flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Mi Horario</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid representation */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden relative shadow-inner">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-[#f8fafc] dark:bg-gray-800/50 text-center font-bold text-[10px] text-gray-500">
              <div className="p-2.5 border-r border-gray-200 dark:border-gray-800 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
              {days.map((day) => (
                <div key={day} className="p-2.5 border-r border-gray-200 dark:border-gray-800 font-bold uppercase tracking-wider notranslate" translate="no">
                  {day}
                </div>
              ))}
            </div>

            {/* Time Grid View */}
            <div className="relative min-h-[400px]">
              {/* Background Hours lines */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {hours.map((h) => (
                  <div key={h} className="grid grid-cols-7 h-16">
                    <div className="p-1.5 text-right pr-2.5 text-[10px] font-bold text-gray-400 border-r border-gray-100 dark:border-gray-800">
                      {h}
                    </div>
                    <div className="border-r border-gray-100 dark:border-gray-800"></div>
                    <div className="border-r border-gray-100 dark:border-gray-800"></div>
                    <div className="border-r border-gray-100 dark:border-gray-800"></div>
                    <div className="border-r border-gray-100 dark:border-gray-800"></div>
                    <div className="border-r border-gray-100 dark:border-gray-800"></div>
                    <div></div>
                  </div>
                ))}
              </div>

              {/* Render items */}
              <div className="absolute top-0 left-12 right-0 bottom-0 grid grid-cols-6 pointer-events-none p-0.5">
                {displayedSchedules.map((item) => {
                  const hourNum = parseInt(item.startTime.split(':')[0]);
                  const minNum = parseInt(item.startTime.split(':')[1] || '0');
                  const topPx = (hourNum - startHour) * 64 + (minNum / 60) * 64;
                  const heightPx = item.durationHours * 64;
                  const isOwnClass = item.teacher === currentTeacher.name;

                  return (
                    <div
                      key={item.id}
                    style={{
                      gridColumnStart: item.dayIndex + 1,
                      gridColumnEnd: item.dayIndex + 2,
                      top: `${topPx}px`,
                      height: `${heightPx}px`,
                    }}
                      className={`
                        absolute left-0.5 right-0.5 p-1.5 rounded-lg border pointer-events-auto shadow-2xs
                        flex flex-col justify-between overflow-hidden text-[10px] leading-tight
                        ${!isOwnClass
                          ? 'bg-red-100 border-red-300 text-red-900 border-dashed animate-pulse'
                          : item.hasConflict
                          ? 'bg-red-50 border-red-500 text-red-955'
                          : 'bg-brand-red border-brand-red-hover text-white'
                        }
                      `}
                      title={`${item.title} - ${item.teacher} en ${item.room}`}
                    >
                      <div>
                        <h4 className="font-extrabold truncate">{item.title}</h4>
                        {!isOwnClass && (
                          <p className="text-[8px] font-bold text-red-600 truncate mt-0.5">
                            Ocupado: {item.teacher}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-medium opacity-90 mt-1">
                        <span className="shrink-0">{item.startTime}</span>
                        {isOwnClass && <span className="bg-black/10 px-1 py-0.5 rounded text-[8px]">{item.room}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* My Courses List (Spans 4 cols) */}
        <section className="col-span-12 lg:col-span-4 bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-lg tracking-tight mb-1">Mis Cursos Asignados</h3>
            <p className="text-xs text-brand-red-light">Cursos activos bajo tu docencia y seguimiento</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {teacherCourses.map((course) => (
              <div 
                key={course.id} 
                onClick={() => handleCourseCardClick(course)}
                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 hover:bg-white/10 transition-colors cursor-pointer hover:border-brand-teal group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-red/25 flex items-center justify-center text-brand-red font-bold text-sm shrink-0">
                      {course.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs leading-tight line-clamp-1">{course.name}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-brand-teal/20 text-brand-teal rounded mt-1 inline-block">
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-300 leading-relaxed line-clamp-2">
                  {course.description || 'Sin descripción del programa.'}
                </p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-gray-400">
                    <span>Avance de Temario</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-brand-teal h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>

                {/* Click action indicator */}
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[9px] text-gray-400 font-bold">Programar horario</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-teal group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}

            {teacherCourses.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">No tienes cursos asignados.</p>
            )}
          </div>
        </section>
      </div>

      {/* Students Directory Section */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-brand-text dark:text-white">Mis Alumnos Asignados</h3>
            <p className="text-xs text-gray-500">Listado de alumnos inscritos en tus cursos asignados</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const courseObj = selectedCourseFilter
                  ? courses.find(c => c.name === selectedCourseFilter && c.teacher === currentTeacher.name)
                  : null;
                const defaultCourse = courseObj || courses.find(c => c.teacher === currentTeacher.name);
                if (defaultCourse) {
                  setCourseForAttendance(defaultCourse);
                } else {
                  alert("No tienes cursos asignados para pasar lista.");
                }
              }}
              className="px-3.5 py-1.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Pasar Lista
            </button>
            <button
              type="button"
              onClick={() => setShowAttendanceReport(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Reporte de Asistencia
            </button>
            <span className="px-2.5 py-1 bg-brand-teal/10 text-brand-teal rounded-lg font-bold text-xs">
              {assignedStudents.length} Alumnos
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f4f6] dark:bg-gray-800 text-[11px] uppercase font-bold text-gray-500 rounded-lg">
                <th className="p-3 rounded-l-lg">Nombre</th>
                <th className="p-3">Folio</th>
                <th className="p-3">Nivel</th>
                <th className="p-3">Email</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3 text-right rounded-r-lg">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm">
              {assignedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 text-brand-red font-bold text-xs flex items-center justify-center shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">{student.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">@{student.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300 font-mono text-xs font-semibold">{student.folio}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 rounded font-bold text-[10px]">
                      {student.level}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-xs">{student.email}</td>
                  <td className="p-3 text-gray-500 font-medium text-xs">{student.phone}</td>
                  <td className="p-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                       student.status === 'Activo' 
                        ? 'bg-brand-red/20 text-brand-teal' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}

              {assignedStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-gray-400">
                    No hay alumnos inscritos en tus cursos asignados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Choice Modal for Existing Schedule */}
      {courseWithExistingSchedule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-up text-center text-slate-800 dark:text-white space-y-4">
            <div className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Horario Existente</h3>
              <p className="text-xs text-gray-500">
                El curso <strong className="text-gray-700 dark:text-gray-300 font-extrabold">"{courseWithExistingSchedule.name}"</strong> ya tiene un horario programado. ¿Qué deseas hacer?
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsReadOnlySchedule(false);
                  loadExistingSchedule(courseWithExistingSchedule);
                  setSelectedCourseToSchedule(courseWithExistingSchedule);
                  setCourseWithExistingSchedule(null);
                }}
                className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Modificar Horario
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCourseFilter(courseWithExistingSchedule.name);
                  setCourseWithExistingSchedule(null);
                }}
                className="w-full py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Solo Consultar Horario
              </button>
              <button
                type="button"
                onClick={() => {
                  setCourseForAttendance(courseWithExistingSchedule);
                  setCourseWithExistingSchedule(null);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Pasar Lista
              </button>
              <button
                type="button"
                onClick={() => setCourseWithExistingSchedule(null)}
                className="w-full py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to program Course Schedule */}
      {selectedCourseToSchedule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-up text-slate-800 dark:text-white">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 p-6 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  {isReadOnlySchedule ? 'Consultar Horario Semanal' : 'Programar Horario Semanal'}
                </h3>
                <p className="text-xs text-gray-500 font-bold mt-0.5">{selectedCourseToSchedule.name}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedCourseToSchedule(null)} 
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="flex-1 overflow-y-auto p-6 space-y-4 pr-5 scrollbar-thin">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Período (Lunes)</label>
                  <input
                    type="date"
                    required
                    disabled={isReadOnlySchedule}
                    value={scheduleWeekStart}
                    onChange={(e) => setScheduleWeekStart(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border rounded-xl text-sm cursor-pointer text-gray-850 dark:text-white disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Aula o Laboratorio</label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnlySchedule}
                    value={scheduleRoom}
                    onChange={(e) => setScheduleRoom(e.target.value)}
                    placeholder="ej: Aula Multiusos"
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border rounded-xl text-sm text-gray-800 dark:text-white disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Selecciona los Días de la Clase</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((dayName, index) => {
                    const isSelected = selectedDays[index]?.active;
                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={isReadOnlySchedule}
                        onClick={() => {
                          setSelectedDays(prev => ({
                            ...prev,
                            [index]: {
                              ...prev[index],
                              active: !isSelected
                            }
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-brand-red text-white shadow-xs' 
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        } ${isReadOnlySchedule ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {dayName}
                      </button>
                    );
                  })}
                </div>

                {/* Day Config Rows */}
                <div className="space-y-2">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((dayName, index) => {
                    const dayConfig = selectedDays[index];
                    if (!isReadOnlySchedule && !dayConfig?.active) return null;
                    
                    const hasSchedule = dayConfig?.active;
                    return (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 animate-fade-in">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 w-24 shrink-0">{dayName}</span>
                        
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          {hasSchedule ? (
                            <>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-500">Inicia:</span>
                                <input
                                  type="text"
                                  required
                                  disabled={isReadOnlySchedule}
                                  value={dayConfig.start}
                                  onChange={(e) => {
                                    setSelectedDays(prev => ({
                                      ...prev,
                                      [index]: {
                                        ...prev[index],
                                        start: e.target.value
                                      }
                                    }));
                                  }}
                                  placeholder="09:00"
                                  className="w-16 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-center text-gray-800 dark:text-white disabled:opacity-75 disabled:cursor-not-allowed"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-500">Termina:</span>
                                <input
                                  type="text"
                                  required
                                  disabled={isReadOnlySchedule}
                                  value={dayConfig.end}
                                  onChange={(e) => {
                                    setSelectedDays(prev => ({
                                      ...prev,
                                      [index]: {
                                        ...prev[index],
                                        end: e.target.value
                                      }
                                    }));
                                  }}
                                  placeholder="10:30"
                                  className="w-16 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-center text-gray-800 dark:text-white disabled:opacity-75 disabled:cursor-not-allowed"
                                />
                              </div>
                            </>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 italic pr-2">Sin horario asignado</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="hidden" id="submit-teacher-schedule-btn" />
            </form>

            {/* Sticky Actions Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-6 pt-4 flex gap-3 bg-gray-50 dark:bg-gray-800/20">
              {isReadOnlySchedule ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedCourseToSchedule(null)}
                    className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cerrar Consulta
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReadOnlySchedule(false)}
                    className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    Modificar Horario
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedCourseToSchedule(null)}
                    className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('submit-teacher-schedule-btn')?.click()}
                    className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    Guardar Horario
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal (Pasar Lista) */}
      {courseForAttendance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-up text-slate-800 dark:text-white">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 p-6 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Pasar Lista</span>
                </h3>
                <p className="text-xs text-gray-500 font-bold mt-0.5">Control de asistencia diaria</p>
              </div>
              <button 
                type="button" 
                onClick={() => setCourseForAttendance(null)} 
                className="text-gray-400 hover:text-gray-650 transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 pr-5 scrollbar-thin">
              {/* Course Selector */}
              <div className="space-y-1 bg-slate-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Seleccionar Curso</label>
                <select
                  value={courseForAttendance.id}
                  onChange={(e) => {
                    const selected = courses.find(c => c.id === e.target.value);
                    if (selected) {
                      setCourseForAttendance(selected);
                    }
                  }}
                  className="w-full mt-1 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {courses.filter(c => c.teacher === currentTeacher?.name).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                  ))}
                </select>
              </div>

              {/* Date Input */}
              <div className="space-y-1 bg-slate-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Fecha de Clase</label>
                <input
                  type="date"
                  required
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Enrolled Students List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alumnos del Curso</h4>
                <div className="space-y-2">
                  {students.filter(s => s.courseIds?.includes(courseForAttendance.id)).length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-6">No hay alumnos inscritos en este curso.</p>
                  ) : (
                    students.filter(s => s.courseIds?.includes(courseForAttendance.id)).map(student => {
                      const present = attendanceRecords[student.id] ?? true;
                      return (
                        <div 
                          key={student.id} 
                          onClick={() => setAttendanceRecords(prev => ({ ...prev, [student.id]: !present }))}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                            present 
                              ? 'bg-emerald-50/45 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50 shadow-xs' 
                              : 'bg-red-50/30 dark:bg-red-950/5 border-red-150 dark:border-red-900/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              present 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {student.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">{student.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">Folio: #{student.folio}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-2xs transition-all ${
                              present 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {present ? 'Asistió' : 'Falta'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-6 pt-4 flex gap-3 bg-gray-50 dark:bg-gray-800/20">
              <button
                type="button"
                onClick={() => setCourseForAttendance(null)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Guardar Asistencia
              </button>
            </div>
          </div>
        </div>
      )}

      {renderAttendanceReportModal()}
    </div>
  );
};
