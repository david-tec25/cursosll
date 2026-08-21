import React, { useState } from 'react';
import { Student, AcademicLevel } from '../types';
import { X, UserPlus, BookPlus, UserCheck, CheckCircle } from 'lucide-react';

interface NewRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
}

export const NewRegistrationModal: React.FC<NewRegistrationModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState<AcademicLevel>('Media Superior');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const folioNum = Math.floor(80000 + Math.random() * 9999);

    const newStudent: Student = {
      id: `st-${Date.now()}`,
      name,
      email,
      phone: phone || '55-0000-0000',
      folio: folioNum.toString(),
      level,
      status: 'Pendiente',
      registeredAt: 'Ahora mismo',
    };

    onAddStudent(newStudent);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setName('');
      setEmail('');
      setPhone('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-16 h-16 text-brand-teal mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">¡Alumno Registrado con Éxito!</h3>
            <p className="text-sm text-gray-500">Se ha creado el registro y generado el folio automático.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-dark-surface text-brand-red flex items-center justify-center font-bold">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-dark-surface dark:text-white">Nuevo Registro de Alumno</h3>
                <p className="text-xs text-gray-500">Alta rápida en el sistema de Impulso Académico</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface"
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
                    className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface"
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
                    className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface"
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
                  className="w-full px-4 py-2.5 bg-[#f7f9fb] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-dark-surface"
                >
                  <option value="Básica">Educación Básica</option>
                  <option value="Media Superior">Media Superior (Bachillerato / Prep)</option>
                  <option value="Nivel Superior">Nivel Superior (Universidad / Carrera)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                >
                  Guardar Alumno
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
