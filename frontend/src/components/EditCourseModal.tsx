import React, { useState, useEffect } from 'react';
import { Course, Teacher, AcademicLevel, Student } from '../types';
import { X, BookOpen, User, MapPin, Clock, FileText, CheckCircle2, Search, Check } from 'lucide-react';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onEditCourse: (courseId: string, updatedCourse: Course, assignedStudentIds: string[]) => Promise<void>;
  teachers: Teacher[];
  students: Student[];
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onEditCourse,
  teachers,
  students,
}) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<AcademicLevel>('Básica');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [iconName, setIconName] = useState('book');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo');
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setName(course.name || '');
      setLevel(course.level || 'Básica');
      setTeacher(course.teacher || (teachers[0]?.name || ''));
      setRoom(course.room || '');
      setTimeSlot(course.timeSlot || '');
      setIconName(course.iconName || 'book');
      setDescription(course.description || '');
      setStatus((course.status as 'Activo' | 'Inactivo') || 'Activo');
      
      const enrolled = students
        .filter(s => s.courseIds?.includes(course.id))
        .map(s => s.id);
      setAssignedStudentIds(enrolled);
    }
  }, [course, students, teachers, isOpen]);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const updatedCourse: Course = {
      ...course,
      name,
      teacher,
      level,
      room: room || 'Por asignar',
      timeSlot: timeSlot || 'Por definir',
      iconName,
      description,
      status,
    };

    try {
      await onEditCourse(course.id, updatedCourse, assignedStudentIds);
      onClose();
    } catch (error) {
      console.error('Error modifying course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setAssignedStudentIds(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Modificar Curso</h3>
              <p className="text-xs text-brand-teal-light">Edita los detalles y gestiona alumnos inscritos</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nombre del Curso</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Introducción a la Programación"
              className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
            />
          </div>

          {/* Level, Teacher and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nivel Académico</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as AcademicLevel)}
                className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-855 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
              >
                <option value="Básica">Básica</option>
                <option value="Media Superior">Media Superior</option>
                <option value="Nivel Superior">Nivel Superior</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Docente Asignado</label>
              <select
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-855 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-855 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Room and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Aula de Clases</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Ej. Lab Computación, Aula 104"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-855 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Horario Habitual</label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="Ej. 16:00 PM, 08:30 AM"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-855 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Icono del Curso</label>
            <select
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-855 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
            >
              <option value="book">Libro (Asesoría General / Tareas)</option>
              <option value="code">Código (Desarrollo / Programación)</option>
              <option value="computer">Computadora (Cómputo / TIC)</option>
              <option value="calculate">Calculadora (Matemáticas / Cálculo)</option>
              <option value="functions">Fórmula (Matemáticas Avanzadas)</option>
              <option value="science">Átomo (Física / Ciencias)</option>
              <option value="flask">Matraz (Química)</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Descripción del Curso</label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indica un temario breve..."
                rows={2}
                className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-855 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* Student enrollment selection */}
          <div className="space-y-2 border-t border-gray-150 dark:border-gray-800 pt-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Alumnos Inscritos</label>
              <span className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full font-bold">
                {assignedStudentIds.length} Asignado{assignedStudentIds.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Student Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Buscar alumno por nombre..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-855 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
              />
            </div>

            {/* Scrollable list of students */}
            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const isChecked = assignedStudentIds.includes(student.id);
                  return (
                    <div
                      key={student.id}
                      onClick={() => handleToggleStudent(student.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-brand-teal/5 border-brand-teal/40 text-brand-teal font-extrabold shadow-3xs'
                          : 'bg-[#f7f9fb] dark:bg-gray-850 border-gray-200 dark:border-gray-800 hover:bg-slate-50 text-slate-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">{student.name}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                          Folio: #{student.folio} | {student.level}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                        isChecked
                          ? 'bg-brand-teal text-white'
                          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-[11px] text-gray-400 italic text-center py-4">No se encontraron alumnos.</div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3 border-t border-gray-150 dark:border-gray-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-hover disabled:opacity-55 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-sm shadow-brand-teal/15 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
