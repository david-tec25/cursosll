import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Search, Bell, HelpCircle, Menu, Check, X, ArrowRight, UserCheck } from 'lucide-react';

interface HeaderProps {
  userRole: 'admin' | 'student' | 'teacher' | null;
  studentName?: string;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  studentName,
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Nueva solicitud de credencial', text: 'Ana García López solicitó acceso.', time: 'Hace 5m', unread: true },
    { id: '2', title: 'Conflicto de horario detectado', text: 'Aula 302 con solapamiento el Martes 09:00.', time: 'Hace 15m', unread: true },
    { id: '3', title: 'Mensaje de WhatsApp enviado', text: 'Credenciales enviadas a Juan Pérez.', time: 'Hace 1h', unread: false },
  ]);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard de Administrador';
      case 'teacher-dashboard':
        return 'Dashboard del Docente';
      case 'student-portal':
        return 'Resumen General del Alumno';
      case 'students':
        return 'Gestión y Directorio de Alumnos';
      case 'whatsapp':
        return 'Configuración de Plantilla WhatsApp';
      case 'schedule':
        return 'Gestión de Horarios y Aulas';
      case 'courses':
        return 'Catálogo de Cursos y Asesorías';
      case 'teachers':
        return 'Directorio de Docentes';
      case 'brochure':
        return 'Folleto Informativo Impulso Académico';
      case 'settings':
        return 'Configuración de la Plataforma';
      default:
        return 'Impulso Académico L&L';
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#f7f9fb] dark:bg-[#191c1e] border-b border-[#e0e3e5] dark:border-gray-800 shadow-xs flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenMobileMenu}
          className="md:hidden text-[#191c1e] dark:text-white p-2 rounded-lg hover:bg-[#e0e3e5]/50 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-extrabold text-lg sm:text-xl text-brand-dark dark:text-white tracking-tight truncate max-w-[200px] sm:max-w-none">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search input */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en el sistema..."
            className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs sm:text-sm bg-white dark:bg-gray-800 border border-[#c6c6d0] dark:border-gray-700 text-[#191c1e] dark:text-white focus:outline-none focus:border-brand-dark-surface focus:ring-1 focus:ring-brand-dark-surface transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>



        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-teal hover:bg-[#e0e3e5]/50 rounded-full transition-colors relative"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-teal font-semibold hover:underline">
                    Marcar leídas
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors ${n.unread ? 'bg-[#f2f4f6] dark:bg-gray-800 border-l-4 border-brand-teal' : 'opacity-70'}`}>
                    <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Dialog */}
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-teal hover:bg-[#e0e3e5]/50 rounded-full transition-colors hidden sm:block"
          title="Ayuda e información"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile avatar */}
        <div 
          onClick={() => setActiveTab('student-portal')}
          className="flex items-center gap-2 cursor-pointer group"
          title={userRole === 'student' ? `Ver perfil de ${studentName || 'Alumno'}` : "Ver perfil de Administrador"}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-brand-red shadow-xs group-hover:scale-105 transition-transform">
            <img
              src="/liliana_palacios.jpg"
              alt="Administrador / Alumno"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 text-brand-dark-surface">
              <div className="w-10 h-10 rounded-full bg-brand-red/30 flex items-center justify-center font-bold">
                💡
              </div>
              <div>
                <h3 className="font-bold text-lg">Impulso Académico L&L</h3>
                <p className="text-xs text-gray-500">Manual de uso rápido</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>📍 <strong>Dashboard:</strong> Vista general de métricas, distribución por nivel y registros.</p>
              <p>🔑 <strong>Credenciales:</strong> Genera usuario/password y envía notificación por correo o WhatsApp Web.</p>
              <p>💬 <strong>WhatsApp Editor:</strong> Personaliza la plantilla interactiva con variables dinámicas y vista previa en vivo.</p>
              <p>📅 <strong>Horarios:</strong> Gestiona la grilla semanal y resuelve alertas de conflicto de aula.</p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
