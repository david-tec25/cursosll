import React, { useState } from 'react';
import { Student, AcademicLevel, Course } from '../types';
import { CredentialGenerator } from './CredentialGenerator';
import { CourseAssignmentModal } from './CourseAssignmentModal';
import { CourseAssigner } from './CourseAssigner';
import { EditStudentModal } from './EditStudentModal';
import { 
  Search, 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  CreditCard,
  UserCheck,
  X,
  Copy,
  Trash2,
  Pencil
} from 'lucide-react';

interface StudentsDashboardProps {
  students: Student[];
  courses: Course[];
  onOpenNewModal: () => void;
  onUpdateStudentCredentials: (
    studentId: string, 
    username: string, 
    tempPassword: string, 
    status: Student['status']
  ) => Promise<boolean>;
  onAssignCourse: (studentId: string, courseId: string) => Promise<void>;
  onRemoveCourse: (studentId: string, courseId: string) => Promise<void>;
  onDeleteStudent: (studentId: string) => Promise<void>;
  onUpdateStudent: (updatedStudent: Student) => Promise<boolean>;
}

export const StudentsDashboard: React.FC<StudentsDashboardProps> = ({
  students,
  courses,
  onOpenNewModal,
  onUpdateStudentCredentials,
  onAssignCourse,
  onRemoveCourse,
  onDeleteStudent,
  onUpdateStudent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'assign' | 'credentials'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<AcademicLevel | 'Todos'>('Todos');
  const [credentialFilter, setCredentialFilter] = useState<'todos' | 'con' | 'sin'>('todos');
  
  const [selectedStudentForCourses, setSelectedStudentForCourses] = useState<Student | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [viewingCredentialsStudent, setViewingCredentialsStudent] = useState<Student | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleCopyCredentials = (student: Student) => {
    const text = `Usuario: ${student.username}\nContraseña: ${student.tempPassword}`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.folio.includes(searchQuery);
    
    const matchesLevel = levelFilter === 'Todos' || s.level === levelFilter;
    
    const hasCredentials = !!s.username;
    const matchesCredentials = credentialFilter === 'todos' || 
                               (credentialFilter === 'con' && hasCredentials) ||
                               (credentialFilter === 'sin' && !hasCredentials);
                               
    return matchesSearch && matchesLevel && matchesCredentials;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sub-tab Navigation Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 rounded-2xl shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
            activeSubTab === 'directory'
              ? 'bg-brand-red text-white border-brand-red shadow-sm'
              : 'bg-transparent text-slate-700 dark:text-gray-200 border-transparent hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Directorio de Alumnos</span>
        </button>
        <button
          onClick={() => setActiveSubTab('assign')}
          className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
            activeSubTab === 'assign'
              ? 'bg-brand-red text-white border-brand-red shadow-sm'
              : 'bg-transparent text-slate-700 dark:text-gray-200 border-transparent hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Asignar Cursos</span>
        </button>
        <button
          onClick={() => setActiveSubTab('credentials')}
          className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
            activeSubTab === 'credentials'
              ? 'bg-brand-red text-white border-brand-red shadow-sm'
              : 'bg-transparent text-slate-700 dark:text-gray-200 border-transparent hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Generar Credenciales</span>
        </button>
      </div>

      {activeSubTab === 'directory' ? (
        <div className="space-y-6">
          {/* Filters & Actions Bar */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, correo o folio..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-teal text-slate-800 dark:text-white"
                />
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Level Filter */}
                <div className="flex gap-1.5 bg-slate-50 dark:bg-gray-800/50 p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-xs font-bold">
                  {(['Todos', 'Básica', 'Media Superior', 'Nivel Superior'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        levelFilter === lvl
                          ? 'bg-white dark:bg-gray-700 text-brand-red shadow-2xs font-extrabold'
                          : 'text-slate-500 hover:text-brand-red'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {/* Credentials status filter */}
                <div className="flex gap-1.5 bg-slate-50 dark:bg-gray-800/50 p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-xs font-bold">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'con', label: 'Con Acceso' },
                    { id: 'sin', label: 'Sin Acceso' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setCredentialFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        credentialFilter === f.id
                          ? 'bg-white dark:bg-gray-700 text-brand-teal shadow-2xs font-extrabold'
                          : 'text-slate-500 hover:text-brand-teal'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* "+ Agregar Alumno" Action Button */}
              <button
                onClick={onOpenNewModal}
                className="w-full lg:w-auto bg-brand-red hover:bg-brand-red-hover text-white py-3 px-5 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2.5 shadow-md shadow-brand-red/10 cursor-pointer self-stretch lg:self-auto"
              >
                <UserPlus className="w-4 h-4 stroke-[3]" />
                <span>Nuevo Alumno</span>
              </button>
            </div>
          </div>

          {/* Directory Table / Grid */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-gray-800/50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-150 dark:border-gray-800">
                    <th className="p-4 pl-6">Folio</th>
                    <th className="p-4">Alumno</th>
                    <th className="p-4">Nivel Académico</th>
                    <th className="p-4">Acceso / Credenciales</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right pr-6">Cursos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => {
                      const hasCredentials = !!s.username;
                      const assignedCoursesCount = s.courseIds?.length || 0;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          {/* Folio */}
                          <td className="p-4 pl-6 font-mono font-bold text-slate-400">
                            #{s.folio}
                          </td>

                          {/* Student profile info */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-brand-red-light text-brand-red font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-800 dark:text-slate-100">{s.name}</p>
                                <p className="text-[10px] text-gray-400">Registrado: {s.registeredAt}</p>
                              </div>
                            </div>
                          </td>

                          {/* Level */}
                          <td className="p-4">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-650 dark:text-gray-300 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                              {s.level}
                            </span>
                          </td>

                          {/* Credentials status */}
                          <td className="p-4">
                            {hasCredentials ? (
                              <button 
                                onClick={() => setViewingCredentialsStudent(s)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-900/30 hover:bg-green-100 hover:border-green-300 dark:hover:bg-green-950/50 transition-all cursor-pointer shadow-2xs"
                                title="Ver credenciales"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Con Acceso</span>
                              </button>
                            ) : (
                              <button 
                                onClick={() => setActiveSubTab('credentials')}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-250/50 dark:border-amber-900/30 hover:bg-amber-100 hover:border-amber-300 dark:hover:bg-amber-950/50 transition-all cursor-pointer shadow-2xs"
                                title="Generar credenciales"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Sin Acceso</span>
                              </button>
                            )}
                          </td>

                          {/* Contact information */}
                          <td className="p-4">
                            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{s.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{s.phone}</span>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              s.status === 'Activo' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300' 
                                : s.status === 'Enviado' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300' 
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                            }`}>
                              {s.status}
                            </span>
                          </td>

                          {/* Action to Assign Courses & Delete */}
                          <td className="p-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedStudentForCourses(s);
                                  setIsAssignmentModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f1f5f9] hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shadow-3xs"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-brand-teal" />
                                <span>Asignar ({assignedCoursesCount})</span>
                              </button>

                              <button
                                onClick={() => setEditingStudent(s)}
                                className="inline-flex items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 text-blue-650 dark:text-blue-400 rounded-xl border border-blue-200/50 dark:border-blue-900/30 transition-all cursor-pointer shadow-3xs"
                                title="Modificar Datos"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente al alumno "${s.name}" y todo su historial de la base de datos?`)) {
                                    onDeleteStudent(s.id);
                                  }
                                }}
                                className="inline-flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-650 dark:text-red-400 rounded-xl border border-red-200/50 dark:border-red-900/30 transition-all cursor-pointer shadow-3xs"
                                title="Eliminar Alumno"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-450 font-bold">
                        No se encontraron alumnos que coincidan con la búsqueda o filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'assign' ? (
        <CourseAssigner
          students={students}
          courses={courses}
          onAssignCourse={onAssignCourse}
          onRemoveCourse={onRemoveCourse}
        />
      ) : (
        <CredentialGenerator
          students={students}
          onAddStudent={() => {}}
          onUpdateStudentCredentials={onUpdateStudentCredentials}
        />
      )}

      {/* Course Assignment Modal */}
      <CourseAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setSelectedStudentForCourses(null);
        }}
        student={selectedStudentForCourses}
        courses={courses}
        onAssignCourse={onAssignCourse}
        onRemoveCourse={onRemoveCourse}
      />

      {/* Credentials Viewer Modal */}
      {viewingCredentialsStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-905 rounded-3xl p-6 max-w-md w-full border border-gray-150 dark:border-gray-800 shadow-2xl relative animate-fade-in text-brand-dark dark:text-white">
            <button
              onClick={() => setViewingCredentialsStudent(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Credenciales de Acceso</h3>
                <p className="text-xs text-gray-500">{viewingCredentialsStudent.name}</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-150 dark:border-gray-800 font-mono text-xs mb-5">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400 font-sans font-bold">Usuario:</span>
                <span className="font-bold text-gray-800 dark:text-gray-250 selection:bg-brand-red selection:text-white">{viewingCredentialsStudent.username}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-gray-200/50 dark:border-gray-700/50">
                <span className="text-gray-400 font-sans font-bold">Contraseña:</span>
                <span className="font-bold text-gray-800 dark:text-gray-250 selection:bg-brand-red selection:text-white">{viewingCredentialsStudent.tempPassword}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleCopyCredentials(viewingCredentialsStudent)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-gray-700 dark:text-gray-205"
              >
                {copiedText ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Datos</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setViewingCredentialsStudent(null)}
                className="flex-1 py-2.5 bg-brand-primary text-white hover:bg-brand-primary-hover rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {editingStudent && (
        <EditStudentModal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          student={editingStudent}
          onUpdateStudent={onUpdateStudent}
        />
      )}
    </div>
  );
};
