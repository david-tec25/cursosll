import React, { useState, useEffect } from 'react';
import { Student, AcademicLevel } from '../types';
import { X, Pencil, CheckCircle } from 'lucide-react';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onUpdateStudent: (updatedStudent: Student) => Promise<boolean>;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onUpdateStudent,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState<AcademicLevel>('Media Superior');
  const [status, setStatus] = useState<Student['status']>('Pendiente');
  const [folio, setFolio] = useState('');
  const [username, setUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setEmail(student.email || '');
      setPhone(student.phone || '');
      setLevel(student.level || 'Media Superior');
      setStatus(student.status || 'Pendiente');
      setFolio(student.folio || '');
      setUsername(student.username || '');
      setTempPassword(student.tempPassword || '');
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !folio) return;

    setIsSubmitting(true);

    const updatedStudent: Student = {
      ...student,
      name,
      email,
      phone,
      level,
      status,
      folio,
      username: username || undefined,
      tempPassword: tempPassword || undefined,
    };

    const isSuccess = await onUpdateStudent(updatedStudent);
    setIsSubmitting(false);

    if (isSuccess) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } else {
      alert('Error al actualizar los datos del alumno.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-16 h-16 text-brand-teal mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">¡Alumno Actualizado con Éxito!</h3>
            <p className="text-sm text-gray-500">Se han guardado los cambios en la base de datos.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-dark-surface text-brand-red flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-dark-surface dark:text-white">Modificar Datos del Alumno</h3>
                <p className="text-xs text-gray-500">Edición de información de registro de Impulso Académico</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Folio *
                  </label>
                  <input
                    type="text"
                    required
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Estado *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Student['status'])}
                    className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface text-slate-800 dark:text-white"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Activo">Activo</option>
                    <option value="Enviado">Enviado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Nombre Completo del Alumno *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej: Sofía Ramírez Morales"
                  className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sofia@email.com"
                    className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="5512345678"
                    className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Nivel Académico
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as AcademicLevel)}
                  className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface text-slate-800 dark:text-white"
                >
                  <option value="Básica">Educación Básica</option>
                  <option value="Media Superior">Media Superior (Bachillerato / Prep)</option>
                  <option value="Nivel Superior">Nivel Superior (Universidad / Carrera)</option>
                </select>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Credenciales de Acceso (Opcional)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-650 dark:text-gray-400 mb-1">
                      Usuario de Acceso
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Sin asignar"
                      className="w-full px-4 py-2 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-dark-surface text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-650 dark:text-gray-400 mb-1">
                      Contraseña Temporal
                    </label>
                    <input
                      type="text"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      placeholder="Sin asignar"
                      className="w-full px-4 py-2 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-dark-surface text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
