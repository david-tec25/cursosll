import React from 'react';
import { 
  Calculator, Atom, FlaskConical, Laptop, Smartphone, Wifi, Languages, BookOpen, 
  Target, Code, Database, GraduationCap, Users, Heart, Phone, MapPin, 
  Award, Sparkles, MessageCircle, ExternalLink
} from 'lucide-react';

export const BrochureView: React.FC = () => {
  const subjects = [
    { name: 'Matemáticas', icon: Calculator },
    { name: 'Física', icon: Atom },
    { name: 'Química', icon: FlaskConical },
    { name: 'Computación', icon: Laptop },
    { name: 'Herramientas digitales', icon: Smartphone },
    { name: 'Uso de dispositivos electrónicos', icon: Wifi },
    { name: 'Inglés', icon: Languages },
    { name: 'Taller de tareas', icon: BookOpen },
    { name: 'Preparación para examen de admisión', icon: Target },
    { name: 'Programación Web', icon: Code },
    { name: 'Bases de Datos', icon: Database },
  ];

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent('¡Hola! Me gustaría solicitar información sobre los horarios y costos de las asesorías de Impulso Académico L&L en Chapa de Mota.');
    window.open(`https://wa.me/525514148765?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-16">
      {/* Outer Poster Card with rich blue/lime styling matching Image 1 */}
      <div className="bg-gradient-to-b from-[#eaf2ff] via-[#f7f9fb] to-brand-dark-surface rounded-3xl p-6 sm:p-10 border-4 border-brand-dark-surface shadow-2xl space-y-8 text-brand-dark-surface relative overflow-hidden">
        
        {/* Top Decorative Circles */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-brand-red-light pb-6">
          <div className="bg-brand-dark-surface text-brand-red px-6 py-3 rounded-full text-center sm:text-left border-2 border-brand-red shadow-md">
            <p className="font-extrabold text-sm sm:text-base italic">Más que asesorías,</p>
            <p className="text-xs text-white">construimos tu futuro <Heart className="w-3.5 h-3.5 inline text-red-400 fill-current" /></p>
          </div>

          <div className="bg-brand-teal text-white px-6 py-3 rounded-full text-center border-2 border-brand-red shadow-md">
            <p className="font-extrabold text-xs uppercase tracking-wider">DOS DOCENTES UN MISMO</p>
            <p className="font-black text-sm text-brand-red">COMPROMISO ❤️</p>
          </div>
        </div>

        {/* Central Logo & Title Section */}
        <div className="text-center space-y-2 py-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-dark-surface text-brand-red rounded-2xl shadow-xl mb-2">
            <GraduationCap className="w-12 h-12 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-dark-surface tracking-tight uppercase">
            IMPULSO ACADÉMICO <span className="text-brand-teal">L&L</span>
          </h1>
          <p className="text-lg sm:text-2xl font-bold italic text-gray-700">
            Construimos las bases de tu éxito
          </p>
        </div>

        {/* Banner: INSCRIPCIONES ABIERTAS */}
        <div className="bg-gradient-to-r from-brand-teal via-brand-red-hover to-brand-teal text-brand-dark py-3.5 px-6 rounded-2xl text-center shadow-lg border-2 border-white transform hover:scale-[1.01] transition-transform">
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-wider flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 animate-spin" />
            ¡INSCRIPCIONES ABIERTAS!
            <Sparkles className="w-6 h-6 animate-spin" />
          </h2>
        </div>

        {/* 3 Columns Layout: Asesorías, Atención Para, Instructores */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-brand-red-light/50 shadow-md">
          {/* Column 1: Asesorías y Talleres (Spans 5 cols) */}
          <div className="md:col-span-5 bg-brand-dark-surface text-white p-5 rounded-2xl space-y-4">
            <h3 className="font-black text-center text-sm uppercase tracking-wider bg-brand-red text-white py-1.5 rounded-lg shadow-xs">
              ASESORÍAS Y TALLERES
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              {subjects.map((sub) => {
                const Icon = sub.icon;
                return (
                  <li key={sub.name} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <Icon className="w-4 h-4 text-brand-red shrink-0" />
                    <span className="text-slate-100">{sub.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: Atención Para & Modalidad (Spans 3 cols) */}
          <div className="md:col-span-3 space-y-6 flex flex-col justify-between">
            <div className="bg-[#f2f4f6] p-4 rounded-2xl border text-center space-y-3">
              <h4 className="font-extrabold text-xs text-brand-teal uppercase tracking-wider">ATENCIÓN PARA</h4>
              
              <div className="space-y-2 text-xs font-bold text-brand-dark-surface">
                <div className="p-2 bg-white rounded-xl shadow-xs border">Educación Básica</div>
                <div className="p-2 bg-white rounded-xl shadow-xs border">Media Superior</div>
                <div className="p-2 bg-white rounded-xl shadow-xs border">Nivel Superior</div>
              </div>
            </div>

            <div className="bg-brand-red-light p-4 rounded-2xl border border-brand-red-light text-center space-y-1">
              <p className="font-extrabold text-xs text-brand-dark-surface uppercase">Modalidad</p>
              <p className="text-xs font-semibold text-brand-red">Individual o en grupos pequeños</p>
              <Users className="w-5 h-5 mx-auto text-brand-dark-surface mt-1" />
            </div>
          </div>

          {/* Column 3: Instructores (Spans 4 cols) */}
          <div className="md:col-span-4 bg-brand-dark-surface text-white p-5 rounded-2xl space-y-4">
            <h3 className="font-black text-center text-xs uppercase tracking-wider text-brand-red">
              DOCENTES E INSTRUCTORES
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-white/10 rounded-xl border border-white/10">
                <p className="text-brand-red font-bold text-[10px] uppercase">Impartido por Química</p>
                <p className="font-bold text-sm text-white">Liliana Silvestre Castillo</p>
              </div>

              <div className="p-2.5 bg-white/10 rounded-xl border border-white/10">
                <p className="text-brand-red font-bold text-[10px] uppercase">Asesorías & Examen Admisión</p>
                <p className="font-bold text-sm text-white">Mtra. Liliana Martínez Palacios</p>
              </div>

              <div className="p-2.5 bg-white/10 rounded-xl border border-white/10">
                <p className="text-brand-red font-bold text-[10px] uppercase">Programación Impartida por</p>
                <p className="font-bold text-sm text-white">Lic. Victor David Maya Arce</p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-white text-xs font-bold">
          <div className="bg-brand-teal p-3 rounded-xl border border-brand-red shadow-xs">💡 Más conocimiento</div>
          <div className="bg-brand-teal p-3 rounded-xl border border-brand-red shadow-xs">⭐ Más confianza</div>
          <div className="bg-brand-teal p-3 rounded-xl border border-brand-red shadow-xs">🏆 Mejores resultados</div>
          <div className="bg-brand-teal p-3 rounded-xl border border-brand-red shadow-xs">📈 Más cerca de tus metas</div>
        </div>

        {/* Contact Footer Banner */}
        <div className="bg-brand-dark text-white p-6 rounded-2xl border-2 border-brand-red space-y-4 text-center">
          <p className="text-amber-300 font-extrabold text-sm sm:text-base italic">
            "Tu esfuerzo hoy, tu éxito siempre" ❤️
          </p>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-brand-red">¡CONTÁCTANOS!</h3>
            <p className="text-xs text-gray-300">Pregunta por horarios y costos personalizados.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="bg-[#25D366] hover:bg-[#1ebd59] text-black font-extrabold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>55-1414-8765 | 55-4713-0833</span>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-800 flex items-center justify-center gap-2 text-xs text-gray-400 font-semibold">
            <MapPin className="w-4 h-4 text-brand-red" />
            <span>BIBLIOTECA DIGITAL, CASA DE CULTURA, CHAPA DE MOTA.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
