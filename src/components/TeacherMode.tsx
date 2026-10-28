import { createContext, useContext, useState, ReactNode } from 'react';
import { IconUsers, IconEye } from './Icons';
import { cn } from '../lib/utils';

interface TeacherContextType {
  isTeacher: boolean;
  toggleTeacher: () => void;
  revealAll: boolean;
  setRevealAll: (v: boolean) => void;
}

const TeacherContext = createContext<TeacherContextType | null>(null);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const [isTeacher, setIsTeacher] = useState(false);
  const [revealAll, setRevealAll] = useState(false);

  return (
    <TeacherContext.Provider
      value={{
        isTeacher,
        toggleTeacher: () => setIsTeacher((v) => !v),
        revealAll,
        setRevealAll,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const ctx = useContext(TeacherContext);
  if (!ctx) throw new Error('useTeacher must be used within TeacherProvider');
  return ctx;
}

export function TeacherToggle({ onReset }: { onReset: () => void }) {
  const { isTeacher, toggleTeacher, revealAll, setRevealAll } = useTeacher();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {isTeacher && (
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="btn-secondary text-xs px-3 py-1.5 shadow-lg"
          >
            Reiniciar actividades
          </button>
          <button
            onClick={() => setRevealAll(!revealAll)}
            aria-pressed={revealAll}
            className={cn(
              'btn-secondary text-xs px-3 py-1.5 shadow-lg',
              revealAll && 'bg-primary-600/30 border-primary-500/50'
            )}
          >
            <IconEye size={14} />
            {revealAll ? 'Ocultar orientaciones' : 'Revelar orientaciones'}
          </button>
        </div>
      )}
      <button
        onClick={toggleTeacher}
        aria-pressed={isTeacher}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-xl transition-all',
          isTeacher
            ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
            : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
        )}
      >
        <IconUsers size={16} />
        {isTeacher ? 'Modo docente activado' : 'Modo docente'}
      </button>
    </div>
  );
}
