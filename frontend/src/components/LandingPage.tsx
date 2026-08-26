import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Student } from '../types';
import { 
  BookOpen, 
  Users, 
  Award, 
  Sparkles, 
  X, 
  ArrowRight, 
  GraduationCap, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Calculator,
  Laptop,
  Code,
  ArrowUp
} from 'lucide-react';

interface LandingPageProps {
  onLogin: (role: 'admin' | 'student' | 'teacher', username?: string) => void;
  students: Student[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, students }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'matematicas' | 'computo'>('matematicas');
  const [selectedLevel, setSelectedLevel] = useState<string>('primaria');
  const [isSyllabusExpanded, setIsSyllabusExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCourse, setContactCourse] = useState('');
  const [contactLevel, setContactLevel] = useState('');
  const [contactNotes, setContactNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const programsData = {
    matematicas: {
      title: 'Matemáticas',
      icon: 'calculate',
      levels: {
        primaria: {
          title: 'Matemáticas - Primaria',
          instructor: 'Ing. Liliana Silvestre Castillo',
          role: 'Ingeniera Química y Docente Especializada',
          avatar: '/liliana_silvestre.jpg',
          duration: '30 horas de curso básico',
          levelName: 'Básica (Primaria)',
          description: 'Construimos las bases numéricas del alumno mediante dinámicas lúdicas y resolución de problemas cotidianos de manera guiada.',
          badge: 'Bases Sólidas',
          topics: [
            'Números y conteo (unidades, decenas, centenas)',
            'Suma y resta básica de números enteros',
            'Tablas de multiplicar y división simple',
            'Introducción a las fracciones (medios, cuartos, octavos)',
            'Sistema métrico decimal (longitud, peso y capacidad)',
            'Identificación de figuras geométricas básicas (triángulo, cuadrado, círculo)',
            'Operaciones con números decimales sencillos',
            'Perímetro y área de figuras simples',
            'Concepto básico de porcentaje',
            'Resolución de problemas cotidianos de suma, resta y reparto'
          ]
        },
        secundaria: {
          title: 'Matemáticas - Secundaria',
          instructor: 'Ing. Liliana Silvestre Castillo',
          role: 'Ingeniera Química y Docente Especializada',
          avatar: '/liliana_silvestre.jpg',
          duration: '40 horas de regularización',
          levelName: 'Básica (Secundaria)',
          description: 'Preparamos al alumno en la transición hacia el pensamiento abstracto algebraico y la resolución sistemática de ecuaciones.',
          badge: 'Transición Algebraica',
          topics: [
            'Números enteros (positivos/negativos) y racionales',
            'Razones, proporciones y regla de tres',
            'Introducción al lenguaje algebraico',
            'Ecuaciones lineales de primer grado',
            'Potencias y raíces cuadradas básicas',
            'Teorema de Pitágoras y sus aplicaciones',
            'Funciones lineales y su representación gráfica',
            'Áreas y volúmenes de cuerpos geométricos (prismas, cilindros)',
            'Estadística elemental (media, mediana, moda) y probabilidad básica',
            'Sistemas de ecuaciones simultáneas de 2x2'
          ]
        },
        preparatoria: {
          title: 'Matemáticas - Preparatoria',
          instructor: 'Ing. Liliana Silvestre Castillo',
          role: 'Ingeniera Química y Docente Especializada',
          avatar: '/liliana_silvestre.jpg',
          duration: '45 horas de nivelación',
          levelName: 'Media Superior',
          description: 'Desarrollamos habilidades en geometría analítica, trigonometría y precálculo esenciales para el éxito escolar y exámenes de admisión.',
          badge: 'Pre-Universitario',
          topics: [
            'Álgebra avanzada y factorización de polinomios',
            'Geometría analítica básica (línea recta y circunferencia)',
            'Secciones cónicas (parábola, elipse, hipérbola)',
            'Trigonometría y funciones trigonométricas en triángulos rectángulos',
            'Ecuaciones de segundo grado (cuadráticas)',
            'Logaritmos y funciones exponenciales',
            'Introducción al concepto de límites y continuidad',
            'Reglas básicas de derivación y optimización',
            'Vectores en el plano bidimensional',
            'Probabilidad condicional y distribuciones estadísticas básicas'
          ]
        },
        universidad: {
          title: 'Matemáticas - Universidad',
          instructor: 'Ing. Liliana Silvestre Castillo',
          role: 'Ingeniera Química y Docente Especializada',
          avatar: '/liliana_silvestre.jpg',
          duration: '50 horas de especialización',
          levelName: 'Nivel Superior',
          description: 'Domina los conceptos de cálculo avanzado, álgebra lineal y ecuaciones diferenciales aplicadas a la ingeniería y ciencias exactas.',
          badge: 'Alto Nivel',
          topics: [
            'Cálculo diferencial e integral multivariable',
            'Álgebra lineal (espacios vectoriales, matrices y determinantes)',
            'Ecuaciones diferenciales ordinarias de primer y segundo orden',
            'Métodos numéricos y aproximaciones de funciones',
            'Series infinitas y convergencia (Taylor, Fourier)',
            'Análisis de variable compleja',
            'Optimización lineal y programación matemática',
            'Estructuras algebraicas abstractas (grupos y anillos)',
            'Probabilidad avanzada y procesos estocásticos',
            'Geometría diferencial e integración sobre variedades'
          ]
        }
      }
    },
    computo: {
      title: 'Taller de Cómputo',
      icon: 'computer',
      levels: {
        basico: {
          title: 'Taller de Cómputo - Básico',
          instructor: 'Mtra. Liliana Martínez Palacios',
          role: 'Maestra en Ciencias de la Educación y TIC',
          avatar: '/liliana_palacios.jpg',
          duration: '24 horas de fundamentos',
          levelName: 'Básica (Inicial)',
          description: 'Aprende el uso básico de la computadora, administración de archivos, navegación segura en internet y herramientas esenciales de oficina.',
          badge: 'Desde Cero',
          topics: [
            'Introducción al sistema operativo (Windows/macOS)',
            'Encendido, apagado y uso correcto del hardware',
            'Navegación web segura y uso de buscadores',
            'Gestión de archivos y carpetas',
            'Introducción a procesadores de texto (Word)',
            'Hojas de cálculo básicas (Excel básico)',
            'Correo electrónico y envío de archivos adjuntos',
            'Atajos de teclado esenciales para productividad',
            'Antivirus y seguridad básica en internet',
            'Introducción al almacenamiento en la nube (Google Drive)'
          ]
        },
        intermedio: {
          title: 'Taller de Cómputo - Intermedio',
          instructor: 'Mtra. Liliana Martínez Palacios',
          role: 'Maestra en Ciencias de la Educación y TIC',
          avatar: '/liliana_palacios.jpg',
          duration: '30 horas de aplicación práctica',
          levelName: 'Básica (Intermedio)',
          description: 'Domina herramientas avanzadas de oficina (Word, Excel) y aprende a trabajar colaborativamente con herramientas en la nube.',
          badge: 'Productividad Oficina',
          topics: [
            'Procesamiento de textos avanzados (índices, tablas)',
            'Hojas de cálculo nivel medio (fórmulas condicionales, gráficos)',
            'Presentaciones digitales de alto impacto (PowerPoint)',
            'Búsqueda avanzada y verificación de información',
            'Herramientas colaborativas online (Drive, Docs, Sheets)',
            'Seguridad digital y gestión de contraseñas',
            'Instalación y mantenimiento de aplicaciones',
            'Copias de seguridad de datos locales',
            'Compresión de archivos y formatos comunes (.zip, .pdf)',
            'Configuración de redes Wi-Fi y periféricos (impresoras)'
          ]
        },
        avanzado: {
          title: 'Taller de Cómputo - Avanzado',
          instructor: 'Mtra. Liliana Martínez Palacios',
          role: 'Maestra en Ciencias de la Educación y TIC',
          avatar: '/liliana_palacios.jpg',
          duration: '36 horas de optimización',
          levelName: 'Media Superior',
          description: 'Aprende automatización de tareas con hojas de cálculo avanzadas, fundamentos de hardware, redes locales y gestión avanzada en la nube.',
          badge: 'Usuario Experto',
          topics: [
            'Hojas de cálculo avanzadas (Tablas dinámicas, buscarv, macros)',
            'Introducción a bases de datos sencillas y Access',
            'Automatización de flujos de trabajo de oficina',
            'Seguridad informática y prevención de malware',
            'Optimización de software y solución de fallas',
            'Edición básica de imágenes y multimedia',
            'Configuración de redes locales y carpetas compartidas',
            'Herramientas modernas de gestión de tareas (Trello, Notion)',
            'Fundamentos de hardware y actualización de componentes',
            'Sincronización y respaldos automáticos en la nube'
          ]
        }
      }
    }
  };

  const handleCategoryChange = (category: 'matematicas' | 'computo') => {
    setActiveCategory(category);
    setSelectedLevel(category === 'matematicas' ? 'primaria' : 'basico');
    setIsSyllabusExpanded(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-brand-red selection:text-white overflow-x-hidden">
      
      {/* Navigation Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-4 sm:px-6 lg:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-brand-red/20">
              I
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-slate-800 tracking-tight leading-tight">Impulso Académico</h1>
              <p className="text-[10px] text-brand-red font-bold tracking-wider uppercase">L&L Management</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#inicio" className="hover:text-brand-red transition-colors">Inicio</a>
            <a href="#nosotros" className="hover:text-brand-red transition-colors">Quiénes Somos</a>
            <a href="#cursos" className="hover:text-brand-red transition-colors">Cursos y Talleres</a>
            <a href="#contacto" className="hover:text-brand-red transition-colors">Contacto</a>
          </nav>

          {/* Login Action */}
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="px-5 py-2.5 bg-brand-red text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-brand-red-hover active:scale-[0.98] transition-all shadow-md shadow-brand-red/10 cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden py-16">
        {/* Background Image of Teacher */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700" 
          style={{ backgroundImage: `url('/teacher_class.png')` }}
        />
        {/* White Tint Overlay with fine-tuned gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/20 md:bg-gradient-to-r md:from-white/95 md:via-white/80 md:to-white/10" />
        
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 text-left space-y-6 max-w-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-full text-xs font-semibold text-brand-red">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Liderazgo en Preparación y Regularización</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Potenciamos tu camino a la <span className="text-brand-red bg-gradient-to-r from-brand-red to-brand-red-hover bg-clip-text text-transparent">excelencia académica</span>
            </h1>
            
            <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              Encuentra asesorías personalizadas, cursos intensivos de preparación y un portal de herramientas avanzadas diseñadas para ayudarte a superar tus exámenes e ingresar a las mejores instituciones.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-7 py-4 bg-brand-red text-white font-extrabold text-sm rounded-xl hover:bg-brand-red-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 cursor-pointer"
              >
                <span>Acceder al Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a 
                href="#cursos" 
                className="px-7 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-sm rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center"
              >
                Explorar Cursos
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section id="nosotros" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 border-t border-slate-150 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-brand-red text-xs font-bold uppercase tracking-widest">¿Quiénes Somos?</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Tu aliado estratégico en la educación</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Somos un centro especializado en regularización y preparación académica. Nuestra meta es dotar al alumno de las herramientas analíticas y de conocimiento necesarias para alcanzar el éxito académico integral.
            </p>
          </div>

          {/* Cards Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-3">Docentes Especializados</h4>
              <p className="text-slate-650 text-sm leading-relaxed">
                Nuestros maestros cuentan con una amplia trayectoria pedagógica y un dominio profundo de los exámenes oficiales de admisión.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-3">Metodología de Alto Impacto</h4>
              <p className="text-slate-650 text-sm leading-relaxed">
                Clases enfocadas en la resolución de problemas reales, exámenes de simulación y material de estudio altamente estructurado.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-3">Resultados Comprobados</h4>
              <p className="text-slate-650 text-sm leading-relaxed">
                El 92% de nuestros alumnos logran ingresar a su primera opción de bachillerato y universidad mediante nuestra preparación integral.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos y Talleres Section */}
      <section id="cursos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3">
              <h2 className="text-brand-red text-xs font-bold uppercase tracking-widest">Catálogo de Excelencia</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                Especialidades y Talleres L&L
              </h3>
              <p className="text-slate-650 text-sm max-w-xl">
                Explora nuestros temarios detallados para regularización y capacitación en Matemáticas y Cómputo.
              </p>
            </div>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="inline-flex items-center gap-1.5 text-brand-red hover:text-brand-red-hover font-bold text-sm group cursor-pointer shrink-0"
            >
              <span>Ver todos los cursos en el portal</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 max-w-3xl mx-auto">
            {(['matematicas', 'computo'] as const).map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold capitalize transition-all cursor-pointer border flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/25 scale-105'
                      : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50 hover:text-brand-red'
                  }`}
                >
                  {cat === 'matematicas' ? (
                    <Calculator className="w-4.5 h-4.5" />
                  ) : (
                    <Laptop className="w-4.5 h-4.5" />
                  )}
                  <span>{programsData[cat].title}</span>
                </button>
              );
            })}
          </div>

          {/* Level Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
            {Object.keys(programsData[activeCategory].levels).map((lvl) => {
              const isActive = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setIsSyllabusExpanded(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-brand-teal text-white border-brand-teal shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'universidad'
                    ? 'Universidad'
                    : lvl === 'preparatoria'
                    ? 'Preparatoria / Admisión'
                    : lvl === 'basico'
                    ? 'Básico'
                    : lvl === 'intermedio'
                    ? 'Intermedio'
                    : lvl === 'avanzado'
                    ? 'Avanzado'
                    : lvl}
                </button>
              );
            })}
          </div>

          {/* Interactive Level Detail Card & Collapsible Syllabus */}
          {(() => {
            const currentCategoryData = programsData[activeCategory];
            const levelData = (currentCategoryData.levels as any)[selectedLevel] || Object.values(currentCategoryData.levels)[0];
            
            return (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start shadow-xl shadow-slate-100/50">
                
                {/* Left Column: Course Intro & Teacher (5 cols) */}
                <div className="md:col-span-5 space-y-6">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 bg-slate-100 rounded-full text-slate-650">
                      {levelData.levelName}
                    </span>
                    <h4 className="text-2xl font-extrabold text-slate-855 mt-3 leading-tight">
                      {levelData.title}
                    </h4>
                    <p className="text-xs text-brand-red font-semibold mt-1">
                      💡 {levelData.badge}
                    </p>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {levelData.description}
                  </p>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-4 h-4 text-brand-red" />
                      <span className="font-bold text-slate-700">{levelData.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                      {levelData.avatar ? (
                        <img 
                          src={levelData.avatar} 
                          alt={levelData.instructor} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center font-bold text-lg border border-brand-red/20">
                          {levelData.instructor[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-855">{levelData.instructor}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{levelData.role}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full py-3 bg-brand-red text-white font-extrabold text-xs rounded-xl hover:bg-brand-red-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-red/10"
                  >
                    <span>Inscribirse o Solicitar Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Column: Collapsible Temario / Syllabus (7 cols) */}
                <div className="md:col-span-7 bg-slate-50/50 border border-slate-150 rounded-2xl p-5 sm:p-6 space-y-4 w-full">
                  
                  {/* Collapsible Trigger Button */}
                  <button 
                    onClick={() => setIsSyllabusExpanded(!isSyllabusExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl text-slate-700 hover:text-brand-red hover:bg-slate-50 transition-all font-bold text-xs sm:text-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-brand-red" />
                      <span>{isSyllabusExpanded ? 'Ocultar Temario Completo' : 'Ver Temario Completo (10 Temas Clave)'}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-brand-red transition-transform duration-300 transform ${isSyllabusExpanded ? 'rotate-90' : 'rotate-0'}`} />
                  </button>
                  
                  {/* Collapsible Syllabus List */}
                  <div className={`transition-all duration-500 overflow-hidden ${isSyllabusExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {levelData.topics.map((topic: string, i: number) => (
                        <div key={i} className="flex items-start gap-2.5 p-2 bg-white border border-slate-150 hover:border-slate-250 rounded-xl transition-all group">
                          <span className="w-6 h-6 shrink-0 bg-brand-red/10 text-brand-red text-xs font-bold rounded-lg flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors">
                            {i + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-650 group-hover:text-slate-800 transition-colors leading-relaxed">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* Informational Notes Banner */}
          <div className="mt-12 p-6 bg-slate-50 border border-slate-200/80 rounded-3xl max-w-4xl mx-auto space-y-4">
            <h4 className="font-extrabold text-xs sm:text-sm text-brand-red tracking-wider uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-red" />
              <span>Notas sobre nuestras Especialidades y Talleres</span>
            </h4>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Los programas listados arriba representan <strong>propuestas de temarios base</strong> para estructurar tu aprendizaje. Sin embargo, nuestro catálogo de servicios es mucho más amplio:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200 text-xs text-slate-500">
              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-850 uppercase text-[11px] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-brand-red" />
                  <span>Ciencias y Regularización</span>
                </h5>
                <p className="leading-relaxed">
                  Impartimos materias adicionales como <strong className="text-slate-700">Química y Física</strong>, además de programas especializados de regularización para el <strong className="text-slate-700">ingreso a Secundaria, Preparatoria e Universidad</strong>.
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-850 uppercase text-[11px] flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-brand-red" />
                  <span>Computación Expandida</span>
                </h5>
                <p className="leading-relaxed">
                  El catálogo en cómputo abarca desde paquetería de oficina tradicional y herramientas digitales cotidianas, hasta seminarios prácticos de <strong className="text-slate-700">IA Generativa para Docentes</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* Contact Section */}
      <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Info */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-brand-red text-xs font-bold uppercase tracking-widest">¿Deseas Asesoría Personalizada?</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Establece tu plan hoy mismo</h3>
              <p className="text-slate-650 text-sm sm:text-base leading-relaxed">
                Ponte en contacto con nuestro equipo directivo para coordinar una evaluación inicial de habilidades y resolver tus dudas sobre horarios y costos.
              </p>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed border-l-2 border-brand-red pl-3 italic mt-3">
                ¿Tienes una inquietud o tema específico que resolver? Si requieres apoyo sobre un tema en particular, te brindamos asesorías personalizadas desde una sola hora o el total de horas que requieras para dominarlo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Teléfono / WhatsApp</h4>
                  <p className="text-sm font-semibold text-slate-850">55 4713 0833  /   55 1414 8765</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Correo Electrónico</h4>
                  <p className="text-sm font-semibold text-slate-850">llcursoschapademota@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Ubicación</h4>
                  <p className="text-sm font-semibold text-slate-850">Biblioteca digital, Chapa de Mota.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick contact Card */}
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-100/50 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-slate-855 mb-4">¿Tienes alguna duda rápida?</h3>
            <p className="text-xs text-slate-500 mb-6">Completa el formulario rápido y nos pondremos en contacto contigo en menos de 24 horas hábiles.</p>
            
            <form 
              onSubmit={async (e) => { 
                e.preventDefault(); 
                setIsSubmitting(true);
                try {
                  const response = await fetch("https://formsubmit.co/ajax/llcursoschapademota@gmail.com", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                    },
                    body: JSON.stringify({
                      "Nombre Completo": contactName,
                      "Correo Electrónico": contactEmail,
                      "Número de Celular": contactPhone,
                      "Curso(s) de Interés": contactCourse,
                      "Nivel Solicitado": contactLevel,
                      "Notas Adicionales": contactNotes || "Ninguna",
                      _subject: "Nueva consulta de Asesoría - Impulso Académico"
                    })
                  });
                  
                  if (response.ok) {
                    alert("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.");
                    // Clear fields
                    setContactName('');
                    setContactEmail('');
                    setContactPhone('');
                    setContactCourse('');
                    setContactLevel('');
                    setContactNotes('');
                  } else {
                    alert("Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.");
                  }
                } catch (error) {
                  console.error("Error submitting contact form:", error);
                  alert("Error de conexión. Por favor, verifica tu red e inténtalo de nuevo.");
                } finally {
                  setIsSubmitting(false);
                }
              }} 
              className="space-y-4"
            >
              <input 
                type="text" 
                placeholder="Nombre completo" 
                required
                disabled={isSubmitting}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all disabled:opacity-60"
              />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                required
                disabled={isSubmitting}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all disabled:opacity-60"
              />
              <input 
                type="tel" 
                placeholder="Número de celular" 
                required
                disabled={isSubmitting}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all disabled:opacity-60"
              />
              <select
                value={contactCourse}
                onChange={(e) => setContactCourse(e.target.value)}
                required
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all disabled:opacity-60 ${
                  contactCourse === '' ? 'text-slate-400' : 'text-slate-800'
                }`}
              >
                <option value="" disabled hidden>Selecciona el curso de interés</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Taller de Cómputo">Taller de Cómputo</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
                <option value="Taller de Tareas / Regularización">Taller de Tareas / Regularización</option>
                <option value="Otro">Otro (especificar en notas)</option>
              </select>
              <select
                value={contactLevel}
                onChange={(e) => setContactLevel(e.target.value)}
                required
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all disabled:opacity-60 ${
                  contactLevel === '' ? 'text-slate-400' : 'text-slate-800'
                }`}
              >
                <option value="" disabled hidden>Selecciona el nivel solicitado</option>
                <option value="Primaria">Primaria (Básica)</option>
                <option value="Secundaria">Secundaria (Básica)</option>
                <option value="Preparatoria / Bachillerato">Preparatoria / Bachillerato (Media Superior)</option>
                <option value="Universidad / Nivel Superior">Universidad / Nivel Superior</option>
                <option value="Otro">Otro</option>
              </select>
              <textarea 
                placeholder="Notas adicionales (opcional)" 
                rows={3}
                disabled={isSubmitting}
                value={contactNotes}
                onChange={(e) => setContactNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all resize-none disabled:opacity-60"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-red text-white font-extrabold text-sm rounded-xl hover:bg-brand-red-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>

        {/* Back to top button in the contact section */}
        <div className="max-w-7xl mx-auto mt-12 flex justify-center">
          <button
            onClick={scrollToTop}
            className="px-6 py-3 bg-slate-100 hover:bg-brand-red border border-slate-200 hover:border-brand-red text-slate-700 hover:text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-150 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Impulso Académico. Todos los derechos reservados. L&L Management.</p>
          <div className="flex gap-4">
            <button
              onClick={scrollToTop}
              className="text-brand-red hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 animate-bounce" /> Volver arriba
            </button>
            <span>•</span>
            <a href="#" className="hover:underline">Aviso de Privacidad</a>
            <span>•</span>
            <a href="#" className="hover:underline">Términos de Servicio</a>
          </div>
        </div>
      </footer>

      {/* Integrated Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md animate-fade-in">
            {/* Close button */}
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors z-20 cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Existing login component handles authentication */}
            <Login 
              onLogin={(role, username) => {
                setIsLoginOpen(false);
                onLogin(role, username);
              }} 
              students={students}
            />
          </div>
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-brand-red text-white hover:bg-brand-red-hover hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-red/20 cursor-pointer flex items-center justify-center"
          title="Volver al inicio"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};
