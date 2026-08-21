import React, { useState } from 'react';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { Student } from '../types';

interface LoginProps {
  onLogin: (role: 'admin' | 'student' | 'teacher', username?: string) => void;
  students: Student[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, students }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      const lowerUser = username.trim().toLowerCase();
      const pass = password.trim();

      if (lowerUser === 'admin' && pass === 'll2026(*)D') {
        onLogin('admin', username.trim());
      } else {
        // Check student in the list
        const foundStudent = students.find(
          s => s.username && 
               s.username.toLowerCase() === lowerUser && 
               s.tempPassword === pass
        );
        
        if (foundStudent) {
          onLogin('student', foundStudent.username);
        } else if (lowerUser === 'liliana.silvestre' && pass === 'liliana123') {
          onLogin('teacher', 'liliana.silvestre');
        } else if (lowerUser === 'liliana.martinez' && pass === 'martinez123') {
          onLogin('teacher', 'liliana.martinez');
        } else if (lowerUser === 'victor.maya' && pass === 'victor123') {
          onLogin('teacher', 'victor.maya');
        } else if (lowerUser === 'maestro' && pass === 'maestro') {
          onLogin('teacher', 'victor.maya');
        } else {
          setError('Usuario o contraseña incorrectos. Ingresa credenciales válidas asignadas por el administrador.');
        }
      }
    }, 800);
  };



  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-red/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-teal/5 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl shadow-slate-200/60 relative z-10 flex flex-col items-center">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-brand-red/20">
            I
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-800 tracking-tight leading-tight">Impulso Académico</h1>
            <p className="text-xs text-brand-red font-semibold tracking-wider uppercase">L&L Management</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">¡Bienvenido de nuevo!</h2>
        <p className="text-slate-500 text-xs mb-8 text-center">Ingresa tus credenciales para acceder a la plataforma</p>

        {/* Error message */}
        {error && (
          <div className="w-full mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Usuario o Email</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. admin"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-brand-red text-white font-extrabold text-sm rounded-xl hover:bg-brand-red-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-red/10 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Ingresar al Sistema</span>
              </>
            )}
          </button>
        </form>


      </div>
    </div>
  );
};
