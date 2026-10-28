import { cn } from '../lib/utils';

const steps = [
  { id: 'masterclass', label: 'Clase magistral', status: 'done' as const },
  { id: 'intro', label: 'Introducción', status: 'current' as const },
  { id: 'prompting', label: 'Diseño de prompts', status: 'upcoming' as const },
  { id: 'investigacion', label: 'Investigación', status: 'upcoming' as const },
  { id: 'documentos', label: 'Documentos', status: 'upcoming' as const },
  { id: 'datos', label: 'Datos', status: 'upcoming' as const },
];

export function CourseProgress({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 text-sm', className)}>
      <span className="text-slate-500 mr-1">Ruta del curso:</span>
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-600">·</span>}
          <span
            className={cn(
              'font-medium',
              step.status === 'done' && 'text-emerald-400',
              step.status === 'current' && 'text-primary-400',
              step.status === 'upcoming' && 'text-slate-500'
            )}
          >
            {step.label}
            {step.status === 'done' && ' ✓'}
            {step.status === 'current' && ' ●'}
            {step.status === 'upcoming' && ' ○'}
          </span>
        </div>
      ))}
    </div>
  );
}
