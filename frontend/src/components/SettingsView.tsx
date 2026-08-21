import React, { useState } from 'react';
import { Save, Check, Bell, Shield, Database, Smartphone, Users } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [institutionName, setInstitutionName] = useState('Impulso Académico L&L');
  const [address, setAddress] = useState('Biblioteca Digital, Casa de Cultura, Chapa de Mota');
  const [phone1, setPhone1] = useState('55-1414-8765');
  const [phone2, setPhone2] = useState('55-4713-0833');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark-surface dark:text-white tracking-tight mb-1">
          Configuración de la Plataforma
        </h2>
        <p className="text-sm text-gray-500">
          Ajustes generales del portal, números de contacto y notificaciones.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-extrabold text-base text-brand-dark-surface dark:text-white">Datos Institucionales</h3>
          {saved && (
            <span className="text-xs font-bold text-brand-teal bg-brand-red/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Cambios Guardados
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre de la Institución</label>
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Ubicación / Sede Principal</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Teléfono WhatsApp 1</label>
              <input
                type="text"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Teléfono WhatsApp 2</label>
              <input
                type="text"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={handleSave}
            className="bg-brand-red hover:bg-brand-red-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
};
