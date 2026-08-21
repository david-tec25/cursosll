import React, { useState } from 'react';
import { Course, Teacher, AcademicLevel } from '../types';
import { X, BookOpen, User, MapPin, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface NewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: Course) => Promise<void>;
  teachers: Teacher[];
}

export const NewCourseModal: React.FC<NewCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
  teachers,
}) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<AcademicLevel>('Básica');
  const [teacher, setTeacher] = useState(teachers[0]?.name || '');
  const [room, setRoom] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [iconName, setIconName] = useState('book');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (teachers.length > 0 && !teacher) {
      setTeacher(teachers[0].name);
    }
  }, [teachers, teacher]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      name,
      teacher,
      level,
      progress: 0,
      status: 'Activo',
      room: room || 'Por asignar',
      timeSlot: timeSlot || 'Por definir',
      iconName,
      description,
    };

    try {
      await onAddCourse(newCourse);
      // Reset form
      setName('');
      setRoom('');
      setTimeSlot('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Agregar Nuevo Curso</h3>
              <p className="text-xs text-brand-red-light">Registra una nueva materia o asesoría</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nombre del Curso</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Introducción a la Programación"
              className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
            />
          </div>

          {/* Level and Teacher in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nivel Académico</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as AcademicLevel)}
                className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
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
                className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room and Time in one row */}
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
                  className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Horario habitual</label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="Ej. 16:00 PM, 08:30 AM"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
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
              className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
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
                placeholder="Indica un temario breve o detalles sobre el taller..."
                rows={3}
                className="w-full pl-9 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
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
              <span>{isLoading ? 'Guardando...' : 'Crear Curso'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
