import React from 'react';
import { NavigationTab } from '../types';
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  Users, 
  Calendar, 
  MessageSquareCode, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  userRole: 'admin' | 'student' | 'teacher' | null;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenNewModal: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  setActiveTab,
  onOpenNewModal,
  mobileOpen,
  setMobileOpen,
  onLogout,
}) => {
  const allMenuItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Administrador',
      icon: LayoutDashboard,
      badge: 'Principal',
    },
    {
      id: 'courses' as NavigationTab,
      label: 'Cursos y Talleres',
      icon: BookOpen,
    },
    {
      id: 'students' as NavigationTab,
      label: 'Alumnos',
      icon: UserCheck,
      badge: 'Alumnos',
    },
    {
      id: 'student-portal' as NavigationTab,
      label: 'Portal del Alumno',
      icon: GraduationCap,
      badge: 'Vista Alumno',
    },
    {
      id: 'teacher-dashboard' as NavigationTab,
      label: userRole === 'admin' ? 'Horarios por docente' : 'Dashboard Docente',
      icon: LayoutDashboard,
      badge: userRole === 'admin' ? 'Aulas' : 'Docente',
    },
    {
      id: 'teachers' as NavigationTab,
      label: 'Docentes',
      icon: Users,
    },
    {
      id: 'whatsapp' as NavigationTab,
      label: 'Plantilla WhatsApp',
      icon: MessageSquareCode,
    },
    {
      id: 'brochure' as NavigationTab,
      label: 'Folleto Informativo',
      icon: FileText,
      badge: 'Oferta',
    },
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (userRole === 'student') {
      return ['student-portal'].includes(item.id);
    }
    if (userRole === 'teacher') {
      return ['teacher-dashboard', 'schedule', 'courses', 'teachers'].includes(item.id);
    }
    // Para el administrador, quitamos el folleto informativo y el portal de alumno
    return item.id !== 'brochure' && item.id !== 'student-portal';
  });

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-white border-r border-slate-200 text-slate-800
        flex flex-col transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-brand-red/20">
              I
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-tight">Impulso Académico</h1>
              <p className="text-xs text-brand-red/80 font-medium">L&L Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navegación
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-brand-teal text-white font-semibold shadow-md shadow-brand-teal/30 translate-x-1' 
                    : 'text-slate-600 hover:text-brand-red hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-red'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive ? 'bg-brand-red text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {userRole !== 'student' && (
            <button
              onClick={() => handleNavClick('settings')}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeTab === 'settings' ? 'bg-brand-teal text-white' : 'text-slate-600 hover:text-brand-red hover:bg-slate-50'}
              `}
            >
              <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400 group-hover:text-brand-red'}`} />
              <span>Configuración</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
