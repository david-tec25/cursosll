import React, { useState, useEffect } from 'react';
import { Student, Course } from '../types';
import { X, BookOpen, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CourseAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  courses: Course[];
  onAssignCourse: (studentId: string, courseId: string) => Promise<void>;
  onRemoveCourse: (studentId: string, courseId: string) => Promise<void>;
}

export const CourseAssignmentModal: React.FC<CourseAssignmentModalProps> = ({
  isOpen,
  onClose,
  student,
  courses,
  onAssignCourse,
  onRemoveCourse,
}) => {
  const [localAssignedIds, setLocalAssignedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync local state when student updates
  useEffect(() => {
    if (student) {
      setLocalAssignedIds(student.courseIds || []);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleToggleCourse = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const isAssigned = localAssignedIds.includes(courseId);

    // Toggle locally instantly for snappy visual feedback
    if (isAssigned) {
      setLocalAssignedIds(prev => prev.filter(id => id !== courseId));
    } else {
      setLocalAssignedIds(prev => [...prev, courseId]);
    }

    try {
      if (isAssigned) {
        await onRemoveCourse(student.id, courseId);
        showToast(`Curso "${course.name}" desasignado con éxito`, 'success');
      } else {
        await onAssignCourse(student.id, courseId);
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Toast Alert Inside Modal */}
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

      <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Asignación de Cursos</h3>
              <p className="text-xs text-brand-red-light truncate max-w-[240px]">
                Alumno: {student.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-500 font-medium">
            Selecciona los cursos o talleres en los que deseas inscribir a este alumno. Los cambios se guardan automáticamente.
          </p>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {courses.length > 0 ? (
              courses.map((course) => {
                const isAssigned = localAssignedIds.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => handleToggleCourse(course.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isAssigned
                        ? 'bg-brand-teal/5 border-brand-teal text-brand-teal font-extrabold shadow-3xs'
                        : 'bg-[#f7f9fb] dark:bg-gray-850 border-gray-200 dark:border-gray-850 hover:bg-slate-100 text-slate-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold truncate">{course.name}</span>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                        {course.teacher} | {course.level}
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
                );
              })
            ) : (
              <div className="flex items-center gap-2 p-4 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No hay cursos registrados en el sistema. Agrega cursos primero en el Catálogo.</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
