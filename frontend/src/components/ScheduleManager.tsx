import React, { useState, useEffect } from 'react';
import { ScheduleItem, Teacher } from '../types';
import { ChevronLeft, ChevronRight, Plus, User, BookOpen, MapPin, AlertTriangle, Clock, X, Check, Calendar } from 'lucide-react';

interface ScheduleManagerProps {
  scheduleItems: ScheduleItem[];
  onAddScheduleItem: (newItem: ScheduleItem) => void;
  onResolveConflict: (itemId: string) => void;
  teachers?: Teacher[];
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  scheduleItems,
  onAddScheduleItem,
  onResolveConflict,
  teachers = [],
}) => {
  const [filterType, setFilterType] = useState<'maestro' | 'curso' | 'aula' | 'todos'>('todos');
  const [selectedClass, setSelectedClass] = useState<ScheduleItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new class
  const [newTitle, setNewTitle] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newRoom, setNewRoom] = useState('Aula 201');

  // Sync default teacher and room when teachers load
  useEffect(() => {
    if (teachers.length > 0 && !newTeacher) {
      setNewTeacher(teachers[0].name);
      setNewRoom(teachers[0].room || 'Aula 201');
    }
  }, [teachers]);

  const handleTeacherChange = (teacherName: string) => {
    setNewTeacher(teacherName);
    const matchingTeacher = teachers.find(t => t.name === teacherName);
    if (matchingTeacher && matchingTeacher.room) {
      setNewRoom(matchingTeacher.room);
    }
  };
  const [weekStartDate, setWeekStartDate] = useState('2026-08-17'); // default Monday, Aug 17, 2026
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('Mtra. Liliana Martínez Palacios');
  const [selectedDays, setSelectedDays] = useState<{[key: number]: { start: string; end: string; active: boolean }}>({
    0: { start: '09:00', end: '10:30', active: true },
    1: { start: '09:00', end: '10:30', active: false },
    2: { start: '09:00', end: '10:30', active: false },
    3: { start: '09:00', end: '10:30', active: false },
    4: { start: '09:00', end: '10:30', active: false },
    5: { start: '09:00', end: '10:30', active: false },
  });
  const [newClassWeekStart, setNewClassWeekStart] = useState('2026-08-17');

  const getWeekDates = (startStr: string) => {
    const baseDate = new Date(startStr + 'T00:00:00');
    const dates = [];
    const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    const fullDayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    for (let i = 0; i < 6; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dayNum = d.getDate();
      const monthName = monthNames[d.getMonth()];
      dates.push({
        name: dayNames[i],
        fullName: `${fullDayNames[i]} ${dayNum}`,
        date: String(dayNum),
        formatted: `${fullDayNames[i]} ${dayNum} de ${monthName}`,
        rawDate: d,
      });
    }
    return dates;
  };

  const weekDates = getWeekDates(weekStartDate);
  const newClassWeekDates = getWeekDates(newClassWeekStart);
  const firstDay = weekDates[0];
  const lastDay = weekDates[5];
  
  const getSpanishMonthName = (date: Date) => {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return months[date.getMonth()];
  };

  const firstMonth = getSpanishMonthName(firstDay.rawDate);
  const lastMonth = getSpanishMonthName(lastDay.rawDate);
  
  const periodLabel = firstMonth === lastMonth 
    ? `Semana del ${firstDay.date} al ${lastDay.date} de ${firstMonth.charAt(0).toUpperCase() + firstMonth.slice(1)}`
    : `Semana del ${firstDay.date} de ${firstMonth.charAt(0).toUpperCase() + firstMonth.slice(1)} al ${lastDay.date} de ${lastMonth.charAt(0).toUpperCase() + lastMonth.slice(1)}`;

  const daysHeader = weekDates.map((wd, index) => ({
    name: wd.name,
    date: wd.date,
    active: index === 1,
  }));

  const displayedSchedules = scheduleItems.filter(item => {
    const itemWeek = item.weekStartDate || '2026-08-17';
    const matchesWeek = itemWeek === weekStartDate;
    const matchesTeacher = item.teacher === selectedTeacherFilter;
    return matchesWeek && matchesTeacher;
  });

  let startHour = 8;
  let endHour = 14;

  displayedSchedules.forEach(item => {
    const startPart = parseInt(item.startTime.split(':')[0], 10);
    if (!isNaN(startPart)) {
      if (startPart < startHour) {
        startHour = startPart;
      }
      const endPart = Math.ceil(startPart + item.durationHours);
      if (endPart > endHour) {
        endHour = endPart;
      }
    }
  });

  if (startHour < 7) startHour = 7;
  if (endHour > 21) endHour = 21;

  const hours: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    hours.push(`${String(h).padStart(2, '0')}:00`);
  }

  const parseTimeToHours = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return hours + minutes / 60;
      }
    }
    const val = parseFloat(timeStr);
    return isNaN(val) ? 0 : val;
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    let hasAdded = false;
    Object.keys(selectedDays).forEach((dayIdxKey) => {
      const dayIdx = Number(dayIdxKey);
      const dayConfig = selectedDays[dayIdx];
      if (dayConfig.active) {
        const startHrs = parseTimeToHours(dayConfig.start);
        const endHrs = parseTimeToHours(dayConfig.end);
        let duration = endHrs - startHrs;
        if (duration <= 0 || isNaN(duration)) {
          duration = 1.5;
        }

        const item: ScheduleItem = {
          id: `sch-${Date.now()}-${dayIdx}`,
          title: newTitle,
          teacher: newTeacher,
          dayIndex: dayIdx,
          startTime: dayConfig.start,
          durationHours: duration,
          room: newRoom,
          colorTheme: 'navy',
          weekStartDate: newClassWeekStart,
        };
        onAddScheduleItem(item);
        hasAdded = true;
      }
    });

    if (!hasAdded) {
      alert('Por favor, selecciona al menos un día para programar la clase.');
      return;
    }

    setShowAddModal(false);
    setNewTitle('');
    setSelectedDays({
      0: { start: '09:00', end: '10:30', active: true },
      1: { start: '09:00', end: '10:30', active: false },
      2: { start: '09:00', end: '10:30', active: false },
      3: { start: '09:00', end: '10:30', active: false },
      4: { start: '09:00', end: '10:30', active: false },
      5: { start: '09:00', end: '10:30', active: false },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark-surface dark:text-white tracking-tight">
            Gestión de Horarios
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {periodLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Filters Bar */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setFilterType(filterType === 'maestro' ? 'todos' : 'maestro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                filterType === 'maestro' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Maestro</span>
            </button>

            <button
              onClick={() => setFilterType(filterType === 'curso' ? 'todos' : 'curso')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                filterType === 'curso' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curso</span>
            </button>

            <button
              onClick={() => setFilterType(filterType === 'aula' ? 'todos' : 'aula')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                filterType === 'aula' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Aula</span>
            </button>
          </div>

          {/* Date Navigation / Week Picker */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-gray-500 px-2">Semana del:</span>
            <input
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              className="text-xs font-bold bg-[#f7f9fb] dark:bg-gray-800 border border-gray-200 rounded-lg p-1 text-slate-800 dark:text-white focus:outline-none cursor-pointer"
            />
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              setShowAddModal(true);
              setNewClassWeekStart(weekStartDate);
            }}
            className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm ml-auto lg:ml-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Clase</span>
          </button>
        </div>
      </div>

      {/* Teacher Switcher Buttons (3 maestros + Todos) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-wider">Filtrar Horario por Maestro</h3>
          <p className="text-xs text-gray-400">Ver clases asignadas a cada docente</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { name: 'Mtra. Liliana Martínez Palacios', label: '1. Mtra. Liliana Martínez' },
            { name: 'Ing. Liliana Silvestre Castillo', label: '2. Ing. Liliana Silvestre' },
            { name: 'Lic. Victor David Maya Arce', label: '3. Lic. Victor David Maya' }
          ].map((t) => {
            const isActive = selectedTeacherFilter === t.name;
            return (
              <button
                key={t.name}
                onClick={() => setSelectedTeacherFilter(t.name)}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-brand-red text-white border-brand-red shadow-xs animate-scale-up'
                    : 'bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-250 border-slate-200 dark:border-gray-700 hover:bg-slate-100 hover:text-brand-red'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Area */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden relative">
        {/* Days Header Bar */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-[#f8fafc] dark:bg-gray-800/50 text-center font-bold text-xs sticky top-0 z-20">
          <div className="p-3 border-r border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400">
            <Clock className="w-4 h-4" />
          </div>
          {daysHeader.map((d, i) => (
            <div key={d.name} className={`p-3 border-r border-gray-200 dark:border-gray-800 relative ${d.active ? 'bg-white dark:bg-gray-900' : ''}`}>
              {d.active && <div className="absolute top-0 left-0 right-0 h-1 bg-brand-red" />}
              <div className={`uppercase tracking-wider notranslate ${d.active ? 'text-brand-teal font-extrabold' : 'text-gray-500'}`} translate="no">{d.name}</div>
              <div className="text-lg font-extrabold text-brand-dark dark:text-white mt-0.5">{d.date}</div>
            </div>
          ))}
        </div>

        {/* Time Grid View */}
        <div className="relative min-h-[500px] overflow-x-auto">
          {/* Current Time Red Marker Line (10:45 AM) */}
          {10.75 >= startHour && 10.75 <= endHour && (
            <div 
              style={{ top: `${(10.75 - startHour) * 80}px` }} 
              className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
            >
              <div className="w-16 text-right pr-2 text-[10px] font-extrabold text-red-600 bg-white/80 dark:bg-gray-900/80 px-1 rounded">
                10:45
              </div>
              <div className="h-0.5 bg-red-600 flex-1 relative">
                <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-red-600 rounded-full" />
              </div>
            </div>
          )}

          {/* Background Hours Lines */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {hours.map((h) => (
              <div key={h} className="grid grid-cols-7 h-20">
                <div className="p-2 text-right pr-3 text-xs font-bold text-gray-400 border-r border-gray-100 dark:border-gray-800">
                  {h}
                </div>
                <div className="border-r border-gray-100 dark:border-gray-800"></div>
                <div className="border-r border-gray-100 dark:border-gray-800 bg-gray-50/30"></div>
                <div className="border-r border-gray-100 dark:border-gray-800"></div>
                <div className="border-r border-gray-100 dark:border-gray-800"></div>
                <div className="border-r border-gray-100 dark:border-gray-800"></div>
                <div></div>
              </div>
            ))}
          </div>

          {/* Render Schedule Items as Cards positioned on grid */}
          <div className="absolute top-0 left-16 right-0 bottom-0 grid grid-cols-6 pointer-events-none p-1">
            {scheduleItems
              .filter(item => {
                const itemWeek = item.weekStartDate || '2026-08-17';
                const matchesWeek = itemWeek === weekStartDate;
                const matchesTeacher = item.teacher === selectedTeacherFilter;
                return matchesWeek && matchesTeacher;
              })
              .map((item) => {
              // Calculate top offset based on hour
              const hourNum = parseInt(item.startTime.split(':')[0]);
              const minNum = parseInt(item.startTime.split(':')[1] || '0');
              const topPx = (hourNum - startHour) * 80 + (minNum / 60) * 80;
              const heightPx = item.durationHours * 80;

              return (
                <div
                  key={item.id}
                  style={{
                    gridColumnStart: item.dayIndex + 1,
                    gridColumnEnd: item.dayIndex + 2,
                    top: `${topPx}px`,
                    height: `${heightPx}px`,
                  }}
                  onClick={() => setSelectedClass(item)}
                  className={`
                    absolute left-1 right-1 p-2.5 rounded-xl border pointer-events-auto cursor-pointer shadow-xs
                    hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden
                    ${item.hasConflict 
                      ? 'bg-red-50 border-red-500 text-red-900 animate-pulse' 
                      : item.colorTheme === 'lime' 
                      ? 'bg-brand-red/30 border-brand-teal text-brand-text' 
                      : item.colorTheme === 'blue' 
                      ? 'bg-brand-red-light border-brand-dark-surface text-brand-text' 
                      : 'bg-brand-red border-brand-red-hover text-white'
                    }
                  `}
                >
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-extrabold text-xs leading-tight truncate">{item.title}</h4>
                      {item.hasConflict && (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] font-medium opacity-80 truncate mt-0.5">{item.teacher}</p>
                  </div>

                  <div className="mt-auto">
                    {item.hasConflict ? (
                      <span className="inline-flex items-center gap-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                        <AlertTriangle className="w-3 h-3" /> Conflicto de Aula
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        <MapPin className="w-3 h-3" /> {item.room}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Class Details / Conflict Resolution Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setSelectedClass(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                selectedClass.hasConflict ? 'bg-red-100 text-red-700' : 'bg-brand-red/10 text-brand-red'
              }`}>
                {selectedClass.hasConflict ? <AlertTriangle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">{selectedClass.title}</h3>
                <p className="text-xs text-gray-500">{selectedClass.teacher}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-[#f2f4f6] dark:bg-gray-800 p-4 rounded-xl border">
              <p>📍 <strong>Lugar/Aula:</strong> {selectedClass.room}</p>
              <p>⏰ <strong>Horario:</strong> {selectedClass.startTime} hrs ({selectedClass.durationHours} horas)</p>
              {selectedClass.hasConflict && (
                <div className="mt-2 p-2 bg-red-100 text-red-900 rounded-lg border border-red-200">
                  ⚠️ <strong>Detalle del Conflicto:</strong> {selectedClass.conflictDetails}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {selectedClass.hasConflict && (
                <button
                  onClick={() => {
                    onResolveConflict(selectedClass.id);
                    setSelectedClass(null);
                  }}
                  className="flex-1 py-2.5 bg-brand-teal text-white rounded-xl font-bold text-xs hover:bg-brand-teal-hover transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" /> Resolver Conflicto (Cambiar Lab)
                </button>
              )}
              <button
                onClick={() => setSelectedClass(null)}
                className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-bold text-xs hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 p-6 pb-4">
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Programar Nueva Clase</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="flex-1 overflow-y-auto p-6 space-y-4 pr-5 scrollbar-thin">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre de la Clase/Materia</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej: Química Inorgánica"
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border rounded-xl text-sm text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Profesor Asignado</label>
                <select 
                  value={newTeacher} 
                  onChange={(e) => handleTeacherChange(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border rounded-xl text-sm text-gray-800 dark:text-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Período (Lunes)</label>
                  <input
                    type="date"
                    required
                    value={newClassWeekStart}
                    onChange={(e) => setNewClassWeekStart(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border rounded-xl text-sm cursor-pointer text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Aula o Laboratorio</label>
                  <input
                    type="text"
                    required
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="ej: Aula 201"
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border rounded-xl text-sm text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Selecciona los Días de la Clase</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {newClassWeekDates.map((wd, index) => {
                    const isSelected = selectedDays[index]?.active;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setSelectedDays(prev => ({
                            ...prev,
                            [index]: {
                              ...prev[index],
                              active: !isSelected
                            }
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-brand-red text-white shadow-xs' 
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {wd.name} {wd.date}
                      </button>
                    );
                  })}
                </div>

                {/* Day Config Rows */}
                <div className="space-y-2">
                  {newClassWeekDates.map((wd, index) => {
                    const dayConfig = selectedDays[index];
                    if (!dayConfig?.active) return null;
                    return (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 animate-fade-in">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 w-24 shrink-0">{wd.fullName}</span>
                        
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-500">Inicia:</span>
                            <input
                              type="text"
                              required
                              value={dayConfig.start}
                              onChange={(e) => {
                                setSelectedDays(prev => ({
                                  ...prev,
                                  [index]: {
                                    ...prev[index],
                                    start: e.target.value
                                  }
                                }));
                              }}
                              placeholder="09:00"
                              className="w-16 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-center text-gray-800 dark:text-white"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-500">Termina:</span>
                            <input
                              type="text"
                              required
                              value={dayConfig.end}
                              onChange={(e) => {
                                setSelectedDays(prev => ({
                                  ...prev,
                                  [index]: {
                                    ...prev[index],
                                    end: e.target.value
                                  }
                                }));
                              }}
                              placeholder="10:30"
                              className="w-16 p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-center text-gray-800 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Keep this submit button standard inside the form to support enter-key submission, but visually styled perfectly */}
              <button type="submit" className="hidden" id="submit-hidden-btn" />
            </form>

            {/* Sticky Actions Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-6 pt-4 flex gap-3 bg-gray-50 dark:bg-gray-800/20">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('submit-hidden-btn')?.click()}
                className="flex-1 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Guardar Clase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
