import React, { useState } from 'react';
import { Course, AcademicLevel } from '../types';
import { BookOpen, Search, User, MapPin, Clock, Plus, ArrowRight } from 'lucide-react';

interface CoursesViewProps {
  courses: Course[];
  onOpenNewModal: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ courses, onOpenNewModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<AcademicLevel | 'Todos'>('Todos');

  const filtered = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'Todos' || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text dark:text-white tracking-tight">
            Catálogo de Cursos y Asesorías
          </h2>
          <p className="text-sm text-gray-500">
            Administración de programas académicos, avances y asignación de aulas.
          </p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="bg-brand-red hover:bg-brand-red-hover text-white py-2.5 px-4 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nuevo Curso</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por curso o profesor..."
            className="w-full pl-9 pr-4 py-2 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-dark-surface"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['Todos', 'Básica', 'Media Superior', 'Nivel Superior'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                levelFilter === lvl
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Course List in Grid Form */}
      <div className="space-y-4">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-2xs hover:border-brand-teal hover:shadow-sm transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            {/* Left Section: Level Badge & Course Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-brand-red-light text-brand-red rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                  {course.level}
                </span>
                <span className="px-2.5 py-0.5 bg-brand-red-light text-brand-red rounded-full text-[9px] font-bold">
                  {course.status}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-brand-dark dark:text-white mb-1 group-hover:text-brand-teal transition-colors truncate">
                {course.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1 max-w-2xl">
                {course.description || 'Asesoría académica especializada y personalizada.'}
              </p>
            </div>

            {/* Middle Section: Teacher & Schedule info in a grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-[55%] shrink-0 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {/* Teacher column */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-red-light text-brand-red flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Docente</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{course.teacher}</p>
                </div>
              </div>

              {/* Classroom column */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-teal-light text-brand-teal flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Aula</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{course.room}</p>
                </div>
              </div>

              {/* Time slot column */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#eaddff] text-brand-teal flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Horario</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{course.timeSlot}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
