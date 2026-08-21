import React from 'react';
import { Teacher } from '../types';
import { Mail, Phone, BookOpen, Award, Sparkles } from 'lucide-react';

interface TeachersViewProps {
  teachers: Teacher[];
}

export const TeachersView: React.FC<TeachersViewProps> = ({ teachers }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark-surface dark:text-white tracking-tight mb-1">
          Directorio de Docentes e Instructores
        </h2>
        <p className="text-sm text-gray-500">
          Conoce a nuestro equipo pedagógico en Impulso Académico L&L.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-brand-dark-surface transition-all"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-red shadow-md"
                />
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white leading-tight">
                    {teacher.name}
                  </h3>
                  <p className="text-xs font-bold text-brand-teal dark:text-brand-red mt-0.5">
                    {teacher.title}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 mb-4 bg-[#f8fafc] dark:bg-gray-800 p-3 rounded-xl">
                <p><strong>Especialidad:</strong> {teacher.specialty}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Asignaturas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects.map((sub) => (
                    <span key={sub} className="px-2.5 py-1 bg-brand-red-light dark:bg-brand-red/20 text-brand-text dark:text-brand-red font-bold text-[10px] rounded-lg">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1.5 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-dark-surface" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-dark-surface" />
                <span>{teacher.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
