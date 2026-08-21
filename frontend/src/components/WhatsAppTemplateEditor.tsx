import React, { useState, useRef, useEffect } from 'react';
import { Save, RotateCcw, MessageSquare, ArrowLeft, MoreVertical, Mic, Paperclip, Smile, Send, Check } from 'lucide-react';

const DEFAULT_WHATSAPP_TEMPLATE = `¡Hola {nombre_alumno}! 👋

Bienvenido a la plataforma de Impulso Académico L&L. Nos alegra tenerte con nosotros.

Construimos las bases de tu éxito, y para empezar, aquí tienes tus credenciales de acceso:

👤 *Usuario:* {usuario}
🔑 *Contraseña:* {password}

Puedes acceder a tu portal desde este enlace:
🔗 {enlace_acceso}

Si tienes alguna duda, responde a este mensaje. ¡Mucho éxito en tus clases!`;

export const WhatsAppTemplateEditor: React.FC = () => {
  const [templateText, setTemplateText] = useState(DEFAULT_WHATSAPP_TEMPLATE);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch template from backend
  useEffect(() => {
    fetch('/api/whatsapp/template')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch template');
      })
      .then(data => {
        if (data && data.messageText) {
          setTemplateText(data.messageText);
        }
      })
      .catch(err => console.error('Error loading template:', err));
  }, []);

  const dynamicVariables = [
    { label: '{nombre_alumno}', sample: 'Juan Pérez' },
    { label: '{usuario}', sample: 'juan.perez' },
    { label: '{password}', sample: 'Impulso2024*' },
    { label: '{enlace_acceso}', sample: 'https://portal.impulsoacademico.com' },
  ];

  const insertVariable = (variable: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = templateText.substring(0, start) + variable + templateText.substring(end);
    setTemplateText(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 50);
  };

  const handleReset = () => {
    setTemplateText(DEFAULT_WHATSAPP_TEMPLATE);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/whatsapp/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageText: templateText }),
      });
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Generate rendered live preview with sample variables and bold syntax
  const getRenderedPreview = () => {
    let rendered = templateText;
    rendered = rendered.replace(/\{nombre_alumno\}/g, 'Juan Pérez');
    rendered = rendered.replace(/\{usuario\}/g, 'juan.perez');
    rendered = rendered.replace(/\{password\}/g, 'Impulso2024*');
    rendered = rendered.replace(/\{enlace_acceso\}/g, 'https://portal.impulsoacademico.com');

    // Simple markdown bold *text* conversion to HTML strong tags
    const parts = rendered.split('\n');
    return parts.map((line, idx) => {
      const boldFormatted = line.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
      return (
        <span 
          key={idx} 
          dangerouslySetInnerHTML={{ __html: boldFormatted + (idx < parts.length - 1 ? '<br/>' : '') }} 
        />
      );
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark dark:text-white tracking-tight mb-2">
          Mensaje de Bienvenida WhatsApp
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
          Personaliza la plantilla del mensaje automático que reciben los nuevos alumnos junto con sus credenciales de acceso. Utiliza las variables dinámicas para personalizar el contenido.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Section (Spans 7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-brand-dark dark:text-white">Editor de Plantilla</h3>
            {saveSuccess && (
              <span className="text-xs font-bold text-brand-teal bg-brand-red/30 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> ¡Plantilla Guardada!
              </span>
            )}
          </div>

          {/* Dynamic Variables Pill Bar */}
          <div className="bg-[#f2f4f6] dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-2">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Variables Dinámicas Disponibles:
            </p>
            <div className="flex flex-wrap gap-2">
              {dynamicVariables.map((v) => (
                <button
                  key={v.label}
                  onClick={() => insertVariable(v.label)}
                  className="px-3 py-1 bg-brand-red-light dark:bg-brand-teal/30 text-brand-text dark:text-white font-bold text-xs rounded-full hover:bg-brand-red-light hover:scale-105 active:scale-95 transition-all shadow-xs"
                  title={`Insertar ${v.label} (ej: ${v.sample})`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 italic">Haz clic en una variable para insertarla en el texto.</p>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={12}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 p-4 text-sm font-medium focus:border-brand-dark-surface focus:ring-2 focus:ring-brand-dark-surface/20 transition-all resize-y bg-white dark:bg-gray-900 text-gray-900 dark:text-white leading-relaxed"
              placeholder="Escribe la plantilla del mensaje de WhatsApp..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl font-bold text-xs border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar Predeterminado</span>
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-red hover:bg-brand-red-hover text-white transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Plantilla</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Preview Section (Spans 5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <h3 className="font-extrabold text-base text-brand-text dark:text-white mb-4 self-start lg:self-center">
            Vista Previa - WhatsApp
          </h3>

          {/* Phone Device Shell */}
          <div className="w-full max-w-[320px] bg-[#ece5dd] rounded-[32px] border-[8px] border-gray-300 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[580px] relative">
            {/* Header WA */}
            <div className="bg-[#075e54] text-white p-3.5 flex items-center gap-3 shadow-md z-10">
              <ArrowLeft className="w-4 h-4 text-white/80 cursor-pointer" />
              <div className="w-8 h-8 rounded-full bg-white text-brand-dark-surface font-extrabold flex items-center justify-center text-xs">
                I
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">Impulso Académico</p>
                <p className="text-[10px] text-white/80">en línea</p>
              </div>
              <MoreVertical className="w-4 h-4 text-white/80 cursor-pointer" />
            </div>

            {/* Chat Body WA */}
            <div className="flex-1 p-3 overflow-y-auto bg-[#ece5dd] flex flex-col gap-2">
              <div className="self-center bg-[#e1f3fb] text-[#4a4a4a] text-[10px] font-bold px-3 py-0.5 rounded-lg uppercase shadow-xs my-1">
                Hoy
              </div>

              {/* Message Bubble */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-xs max-w-[92%] relative mt-1 text-[13px] leading-relaxed text-[#111b21]">
                <div className="absolute -left-2 top-0 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent"></div>
                
                <div className="whitespace-pre-wrap break-words">
                  {getRenderedPreview()}
                </div>

                <div className="text-[10px] text-[#667781] text-right mt-1.5 flex items-center justify-end gap-1 font-sans">
                  <span>10:42 a. m.</span>
                  <span className="text-[#53bdeb] font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {/* Input Bar WA */}
            <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full py-1.5 px-3 flex items-center gap-2 text-gray-400">
                <Smile className="w-4 h-4" />
                <span className="text-xs flex-1 text-gray-400">Mensaje</span>
                <Paperclip className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-xs">
                <Mic className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
