import React, { useState, useEffect } from 'react';
import { Student, Course } from '../types';
import { Search, BookOpen, Check, AlertCircle, Sparkles, User, CheckCircle2 } from 'lucide-react';

interface CourseAssignerProps {
  students: Student[];
  courses: Course[];
  onAssignCourse: (studentId: string, courseId: string, totalSessions?: number) => Promise<void>;
  onRemoveCourse: (studentId: string, courseId: string) => Promise<void>;
}

export const CourseAssigner: React.FC<CourseAssignerProps> = ({
  students,
  courses,
  onAssignCourse,
  onRemoveCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    students.length > 0 ? students[0] : null
  );
  const [localAssignedIds, setLocalAssignedIds] = useState<string[]>([]);
  const [localSessions, setLocalSessions] = useState<{[courseId: string]: number}>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.folio.includes(searchQuery)
  );

  // If selected student is not in the filtered list but we have filtered results, select the first one
  const activeStudent = selectedStudent && students.some(s => s.id === selectedStudent.id)
    ? students.find(s => s.id === selectedStudent.id)!
    : (filteredStudents.length > 0 ? filteredStudents[0] : null);

  // Sync local checked IDs when active student changes
  useEffect(() => {
    if (activeStudent) {
      setLocalAssignedIds(activeStudent.courseIds || []);
      const sessionsMap: {[courseId: string]: number} = {};
      activeStudent.enrollments?.forEach(e => {
        sessionsMap[e.courseId] = e.totalSessions;
      });
      setLocalSessions(sessionsMap);
    } else {
      setLocalAssignedIds([]);
      setLocalSessions({});
    }
  }, [activeStudent]);

  const handleToggleCourse = async (courseId: string) => {
    if (!activeStudent) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const isAssigned = localAssignedIds.includes(courseId);

    // Toggle locally instantly for snappy feedback
    if (isAssigned) {
      setLocalAssignedIds(prev => prev.filter(id => id !== courseId));
    } else {
      setLocalAssignedIds(prev => [...prev, courseId]);
    }

    try {
      if (isAssigned) {
        await onRemoveCourse(activeStudent.id, courseId);
        showToast(`Curso "${course.name}" desasignado con éxito`, 'success');
      } else {
        await onAssignCourse(activeStudent.id, courseId, localSessions[courseId] || 8);
        showToast(`Curso "${course.name}" asignado con éxito`, 'success');
      }
    } catch (err) {
      // Revert local state on error
      if (isAssigned) {
        setLocalAssignedIds(prev => [...prev, courseId]);
      } else {
        setLocalAssignedIds(prev => prev.filter(id => id !== courseId));
      }
      showToast('Error al actualizar la asignación', 'error');
    }
  };

  const handleSessionsChange = (courseId: string, val: number) => {
    setLocalSessions(prev => ({
      ...prev,
      [courseId]: isNaN(val) ? 8 : val
    }));
  };

  const handleSaveSessions = async (courseId: string) => {
    if (!activeStudent) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    try {
      await onAssignCourse(activeStudent.id, courseId, localSessions[courseId] || 8);
      showToast(`Sesiones de "${course.name}" actualizadas con éxito`, 'success');
    } catch (err) {
      showToast('Error al actualizar las sesiones', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs min-h-[500px]">
      {/* Toast Alert Inside Panel */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[10000] p-4 rounded-2xl shadow-2xl flex items-center justify-between border animate-slide-down bg-white dark:bg-gray-900 w-80 sm:w-96 ${
          toast.type === 'success' 
            ? 'text-brand-teal border-brand-teal/30' 
            : 'text-[#ee3a43] border-[#ee3a43]/30'
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#ee3a43] shrink-0" />
            )}
            <span className="font-bold text-sm leading-snug">{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 ml-3 shrink-0">✕</button>
        </div>
      )}

      {/* Left Column: Student Selector List */}
      <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-850 pb-6 lg:pb-0 lg:pr-6 flex flex-col space-y-4">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Seleccionar Alumno</h3>
          <p className="text-xs text-gray-400">Busca e inscribe materias por alumno</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar alumno..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-1 max-h-[400px] pr-1 custom-scrollbar">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => {
              const isSelected = activeStudent?.id === s.id;
              const count = s.courseIds?.length || 0;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-red-light text-brand-red font-bold shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-gray-850 text-slate-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-brand-red text-white' : 'bg-slate-100 dark:bg-gray-800'
                    }`}>
                      {s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-extrabold truncate">{s.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold truncate">{s.level}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold shrink-0 ${
                    isSelected 
                      ? 'bg-brand-red text-white' 
                      : 'bg-slate-100 dark:bg-gray-800 text-slate-500'
                  }`}>
                    {count} {count === 1 ? 'curso' : 'cursos'}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-center text-gray-400 font-bold py-8">No se encontraron alumnos.</p>
          )}
        </div>
      </div>

      {/* Right Column: Course Assignment Panel */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        {activeStudent ? (
          <>
            {/* Student Info Card */}
            <div className="bg-[#f8fafc] dark:bg-gray-850 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-brand-teal-light text-brand-teal flex items-center justify-center font-extrabold shrink-0 shadow-2xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-snug">{activeStudent.name}</h4>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{activeStudent.level} | Folio: #{activeStudent.folio}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white dark:bg-gray-800 px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-3xs">
                <Sparkles className="w-4 h-4 text-brand-teal" />
                <span className="text-xs font-bold text-slate-650 dark:text-gray-300">
                  {localAssignedIds.length} Asignados
                </span>
              </div>
            </div>

            {/* Courses List */}
            <div className="flex-1 flex flex-col space-y-3">
              <div>
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Talleres y Asesorías Disponibles</h3>
                <p className="text-[11px] text-gray-400">Selecciona o desmarca para inscribir al alumno de forma inmediata</p>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                {courses.length > 0 ? (
                  courses.map((course) => {
                    const isAssigned = localAssignedIds.includes(course.id);
                    return (
                      <div
                        key={course.id}
                        className={`flex flex-col p-4 rounded-2xl border transition-all ${
                          isAssigned
                            ? 'bg-brand-teal/5 border-brand-teal text-brand-teal shadow-3xs'
                            : 'bg-[#f7f9fb] dark:bg-gray-850 border-gray-200 dark:border-gray-850 hover:bg-slate-100 text-slate-700 dark:text-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => handleToggleCourse(course.id)}>
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs font-bold truncate">{course.name}</span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                              Docente: {course.teacher} | Aula: {course.room} | Horario: {course.timeSlot}
                            </span>
                          </div>

                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                            isAssigned
                              ? 'bg-brand-teal text-white'
                              : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                          }`}>
                            {isAssigned && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                        </div>

                        {isAssigned && (
                          <div className="mt-2.5 pt-2.5 border-t border-brand-teal/20 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">Sesiones:</span>
                              <input
                                type="number"
                                min={1}
                                value={localSessions[course.id] || 8}
                                onChange={(e) => handleSessionsChange(course.id, parseInt(e.target.value))}
                                onClick={(e) => e.stopPropagation()}
                                className="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
                              />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveSessions(course.id);
                              }}
                              className="px-2.5 py-1 bg-brand-teal hover:bg-brand-teal-hover text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Guardar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center gap-2.5 p-4 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>No hay cursos registrados en el sistema. Registra cursos primero en el Catálogo.</span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <BookOpen className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm text-gray-400 font-bold">Por favor, selecciona un alumno de la lista para gestionar sus inscripciones.</p>
          </div>
        )}
      </div>
    </div>
  );
};
