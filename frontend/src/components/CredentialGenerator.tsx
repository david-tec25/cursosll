import React, { useState } from 'react';
import { Student, AcademicLevel } from '../types';
import { Search, CheckCircle2, RefreshCw, Send, MessageSquare, Clock, Check, AlertCircle } from 'lucide-react';

interface CredentialGeneratorProps {
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudentCredentials: (
    studentId: string, 
    username: string, 
    tempPassword: string, 
    status: Student['status']
  ) => Promise<boolean>;
}

export const CredentialGenerator: React.FC<CredentialGeneratorProps> = ({
  students,
  onUpdateStudentCredentials,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    students.length > 0 ? students[0] : null
  );
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>(selectedStudent?.level || 'Media Superior');
  const [suggestedUser, setSuggestedUser] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.folio.includes(searchQuery)
  );

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setAcademicLevel(student.level);
    if (student.username) {
      setSuggestedUser(student.username);
      setTempPassword(student.tempPassword || '');
    } else {
      const suffix = student.level === 'Básica' ? 'b' : student.level === 'Media Superior' ? 'ms' : 'ns';
      const cleanName = student.name.toLowerCase().replace(/[^a-z]/g, '.').substring(0, 12);
      setSuggestedUser(`${cleanName}.${suffix}`);
      generateNewPassword(suffix);
    }
  };

  const generateNewPassword = (suffix?: string) => {
    const s = suffix || (academicLevel === 'Básica' ? 'b' : academicLevel === 'Media Superior' ? 'ms' : 'ns');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setTempPassword(`IA-${randomNum}-${s}!`);
  };

  React.useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      handleSelectStudent(students[0]);
    }
  }, [students]);

  const handleSendEmail = async () => {
    if (!selectedStudent) {
      alert('Por favor, selecciona un alumno de la lista antes de generar y enviar las credenciales.');
      return;
    }
    try {
      const success = await onUpdateStudentCredentials(selectedStudent.id, suggestedUser, tempPassword, 'Enviado');
      if (success) {
        showNotification(`Credenciales enviadas por correo con éxito a ${selectedStudent.email}`, 'success');
        alert(`Credenciales enviadas por correo con éxito a ${selectedStudent.email}`);
      } else {
        showNotification(`Error: No se pudieron enviar las credenciales por correo a ${selectedStudent.email}`, 'error');
        alert(`Error: No se pudieron enviar las credenciales por correo a ${selectedStudent.email}`);
      }
    } catch (err) {
      showNotification(`Error al intentar enviar las credenciales por correo`, 'error');
      alert(`Error al intentar enviar las credenciales por correo`);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!selectedStudent) return;
    const success = await onUpdateStudentCredentials(selectedStudent.id, suggestedUser, tempPassword, 'Activo');
    if (success) {
      const encodedMsg = encodeURIComponent(
        `¡Hola ${selectedStudent.name}! 👋\n\nBienvenido a Impulso Académico L&L.\nTus credenciales de acceso son:\n👤 Usuario: ${suggestedUser}\n🔑 Contraseña: ${tempPassword}\n🔗 Portal: https://portal.impulsoacademico.com`
      );
      window.open(`https://wa.me/52${selectedStudent.phone}?text=${encodedMsg}`, '_blank');
      showNotification(`Redirigiendo a WhatsApp Web para enviar credenciales a ${selectedStudent.name}...`, 'success');
    } else {
      showNotification(`Error al registrar el envío de credenciales`, 'error');
    }
  };

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-[9999] p-4 rounded-2xl shadow-2xl flex items-center justify-between border animate-slide-down bg-white dark:bg-gray-900 w-80 sm:w-96 ${
          toastType === 'success' 
            ? 'text-[#005cbb] border-[#005cbb]/30' 
            : 'text-[#ee3a43] border-[#ee3a43]/30'
        }`}>
          <div className="flex items-center gap-3">
            {toastType === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#005cbb] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#ee3a43] shrink-0" />
            )}
            <span className="font-bold text-sm leading-snug">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-gray-600 ml-3 shrink-0">✕</button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark-surface dark:text-white tracking-tight mb-2">
          Generación de Credenciales de Acceso
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
          Administre y genere accesos seguros para los alumnos que han completado su proceso de inscripción. El sistema enviará automáticamente las credenciales temporales.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Config (Spans 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Search Applicant Panel */}
          <div className="bg-white/90 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm backdrop-blur-md">
            <h3 className="text-lg font-extrabold text-brand-dark-surface dark:text-white mb-4">
              1. Buscar Solicitud
            </h3>
            
            <div className="relative mb-4">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, correo o folio de solicitud..."
                className="w-full pl-11 pr-4 py-3 bg-[#f7f9fb] dark:bg-gray-800 border border-[#c6c6d0] dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-dark-surface focus:ring-2 focus:ring-brand-dark-surface/20 transition-all"
              />
            </div>

            {/* Results list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredStudents.map((st) => {
                const isSelected = selectedStudent?.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => handleSelectStudent(st)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#f2f4f6] dark:bg-gray-800 border-brand-dark-surface shadow-xs' 
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#b7c5f8] text-brand-dark-surface font-extrabold flex items-center justify-center text-sm">
                        {st.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{st.name}</p>
                        <p className="text-xs text-gray-500">{st.email} • Folio: {st.folio}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-teal" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Configure Access Form */}
          <div className="bg-white/90 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm backdrop-blur-md space-y-6">
            <h3 className="text-lg font-extrabold text-brand-dark-surface dark:text-white">
              2. Configurar Acceso
            </h3>

            {/* Nivel Académico */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Nivel Académico
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Básica', 'Media Superior', 'Nivel Superior'] as AcademicLevel[]).map((level) => (
                  <label
                    key={level}
                    onClick={() => {
                      setAcademicLevel(level);
                      const suffix = level === 'Básica' ? 'b' : level === 'Media Superior' ? 'ms' : 'ns';
                      generateNewPassword(suffix);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      academicLevel === level
                        ? 'bg-brand-red-light/30 dark:bg-brand-red/20/40 border-brand-dark-surface dark:border-brand-teal font-bold text-gray-900 dark:text-white shadow-xs'
                        : 'bg-[#f7f9fb] dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="nivel"
                      checked={academicLevel === level}
                      onChange={() => {}}
                      className="text-brand-dark-surface focus:ring-brand-dark-surface"
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* User & Password Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Usuario Sugerido
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={suggestedUser}
                    onChange={(e) => setSuggestedUser(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f2f4f6] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-brand-dark-surface"
                  />
                  <button
                    onClick={() => {
                      const suffix = academicLevel === 'Básica' ? 'b' : academicLevel === 'Media Superior' ? 'ms' : 'ns';
                      const cleanName = selectedStudent ? selectedStudent.name.toLowerCase().replace(/[^a-z]/g, '.').substring(0, 10) : 'user';
                      setSuggestedUser(`${cleanName}.${Math.floor(Math.random()*90 + 10)}.${suffix}`);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark-surface p-1.5"
                    title="Regenerar usuario"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña Temporal
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f2f4f6] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-mono font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-brand-dark-surface"
                  />
                  <button
                    onClick={() => generateNewPassword()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark-surface p-1.5"
                    title="Regenerar contraseña"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSendEmail}
                className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Generar y Enviar por Correo</span>
              </button>

              <button
                onClick={handleSendWhatsApp}
                className="flex-1 border-2 border-brand-teal text-brand-teal dark:text-brand-red hover:bg-brand-teal hover:text-white py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: History (Spans 5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white/90 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm backdrop-blur-md h-full flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-lg text-brand-dark-surface dark:text-white">Historial Reciente</h3>
                <span className="text-xs font-bold text-brand-teal dark:text-brand-red">Actualizado hoy</span>
              </div>

              <div className="space-y-3">
                {students.map((st) => (
                  <div key={st.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800/60 flex flex-col gap-2 hover:border-brand-dark-surface transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{st.name}</p>
                        <p className="text-xs text-gray-500">{st.level} • {st.registeredAt}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        st.status === 'Activo' ? 'bg-brand-red-light text-brand-red' :
                        st.status === 'Enviado' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {st.status}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-[#f2f4f6] dark:bg-gray-900 p-2 rounded-lg flex items-center justify-between">
                      <span>User: {st.username}</span>
                      <button 
                        onClick={() => handleSelectStudent(st)}
                        className="text-[10px] text-brand-primary dark:text-brand-teal font-extrabold hover:underline cursor-pointer"
                      >
                        Cargar datos
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
