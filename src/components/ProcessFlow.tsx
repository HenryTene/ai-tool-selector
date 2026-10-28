import { cn } from '../lib/utils';
import { IconArrowRight } from './Icons';

const steps = [
  { id: 'necesidad', label: 'NECESIDAD', desc: '¿Qué queremos conseguir?' },
  { id: 'tarea', label: 'TIPO DE TAREA', desc: 'Crear, investigar, analizar…' },
  { id: 'info', label: 'INFORMACIÓN', desc: '¿De dónde viene?' },
  { id: 'herramienta', label: 'HERRAMIENTA', desc: 'Categoría y herramienta concreta' },
  { id: 'resultado', label: 'RESULTADO', desc: '¿Qué esperamos obtener?' },
  { id: 'validacion', label: 'VALIDACIÓN', desc: '¿Cómo comprobamos fiabilidad?' },
  { id: 'impacto', label: 'IMPACTO', desc: '¿Qué KPI demostrará valor?' },
];

export function ProcessFlow({ activeStep, className }: { activeStep?: string; className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-1 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
            <div
              className={cn(
                'flex flex-col items-center text-center px-3 py-3 rounded-xl border min-w-[110px] transition-all',
                activeStep === step.id
                  ? 'bg-primary-600/20 border-primary-500 text-primary-200'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
              )}
            >
              <span className="text-[10px] font-semibold tracking-wider uppercase opacity-80">
                {i + 1}
              </span>
              <span className="text-xs font-bold mt-0.5">{step.label}</span>
              <span className="text-[10px] mt-1 leading-tight opacity-70 hidden sm:block">{step.desc}</span>
            </div>
            {i < steps.length - 1 && (
              <IconArrowRight size={14} className="text-slate-600 flex-shrink-0 hidden md:block" />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-slate-400 mt-4 max-w-2xl mx-auto">
        No existe una herramienta perfecta para todo. La elección depende de la tarea, la información, el riesgo y el contexto.
      </p>
    </div>
  );
}
