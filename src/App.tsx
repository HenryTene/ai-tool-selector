import { useState, type ReactElement } from 'react';
import { TeacherProvider, TeacherToggle, useTeacher } from './components/TeacherMode';
import { CourseProgress } from './components/CourseProgress';
import { ProcessFlow } from './components/ProcessFlow';
import { tools, categories, needsOptions, infoSources, riskLevels, getToolsByCategory, getToolById, type ToolId } from './data/tools';
import { miniCases, challengeScenarios, riskSituations } from './data/cases';
import { cn } from './lib/utils';
import {
  IconSearch, IconFileText, IconTable, IconLayers, IconBookOpen, IconPenTool, IconBarChart, IconMessage,
  IconCheck, IconArrowRight, IconShield, IconAlert, IconLightbulb, IconRefresh, IconCopy, IconX, iconMap
} from './components/Icons';

type Section =
  | 'hero'
  | 'question'
  | 'ecosystem'
  | 'explorer'
  | 'selector'
  | 'comparator'
  | 'context'
  | 'files'
  | 'multimodal'
  | 'sources'
  | 'cases'
  | 'privacy'
  | 'validation'
  | 'risk'
  | 'challenge'
  | 'reto'
  | 'next';

const sectionOrder: Section[] = [
  'hero', 'question', 'ecosystem', 'explorer', 'selector', 'comparator',
  'context', 'files', 'multimodal', 'sources', 'cases', 'privacy',
  'validation', 'risk', 'challenge', 'reto', 'next'
];

const sectionLabels: Record<Section, string> = {
  hero: 'Inicio',
  question: 'Pregunta inicial',
  ecosystem: 'Ecosistema',
  explorer: 'Herramientas',
  selector: 'Selector',
  comparator: 'Comparador',
  context: 'Contexto',
  files: 'Archivos',
  multimodal: 'Multimodalidad',
  sources: 'Fuentes',
  cases: 'Casos NOVA',
  privacy: 'Privacidad',
  validation: 'Validación',
  risk: 'Riesgo',
  challenge: 'Desafío',
  reto: 'Ficha personal',
  next: 'Cierre',
};

function AppContent() {
  const { isTeacher, revealAll } = useTeacher();
  const [section, setSection] = useState<Section>('hero');
  const [questionPhase, setQuestionPhase] = useState(0);
  const [openingAnswerVisible, setOpeningAnswerVisible] = useState(false);
  const [openingTool, setOpeningTool] = useState<ToolId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  const [selectorStep, setSelectorStep] = useState(1);
  const [selectorData, setSelectorData] = useState({
    need: '',
    info: '',
    internet: '',
    sources: '',
    risk: ''
  });
  const [compareTools, setCompareTools] = useState<ToolId[]>([]);
  const [caseAnswers, setCaseAnswers] = useState<Record<number, boolean>>({});
  const [riskAnswers, setRiskAnswers] = useState<Record<number, string>>({});
  const [riskAnswerVisibility, setRiskAnswerVisibility] = useState<Record<number, boolean>>({});
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState<Record<number, { type: boolean; tool: boolean; validation: boolean }>>({});
  const [challengeAnswerVisibility, setChallengeAnswerVisibility] = useState<Record<number, boolean>>({});
  const [challengeScore, setChallengeScore] = useState<number | null>(null);
  const [challengeReviewVisible, setChallengeReviewVisible] = useState(false);
  const [challengeType, setChallengeType] = useState('');
  const [challengeTool, setChallengeTool] = useState<ToolId | ''>('');
  const [retoData, setRetoData] = useState({
    need: '', info: '', internet: '', files: '', risk: '', type: '', tool: '', validation: '', kpi: ''
  });
  const [retoGenerated, setRetoGenerated] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);

  const goTo = (s: Section) => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetActivities = () => {
    setQuestionPhase(0);
    setOpeningAnswerVisible(false);
    setOpeningTool(null);
    setSelectedCategory(null);
    setSelectedTool(null);
    setSelectorStep(1);
    setSelectorData({ need: '', info: '', internet: '', sources: '', risk: '' });
    setCompareTools([]);
    setCaseAnswers({});
    setRiskAnswers({});
    setRiskAnswerVisibility({});
    setChallengeIndex(0);
    setChallengeAnswers({});
    setChallengeAnswerVisibility({});
    setChallengeScore(null);
    setChallengeReviewVisible(false);
    setChallengeType('');
    setChallengeTool('');
    setRetoData({ need: '', info: '', internet: '', files: '', risk: '', type: '', tool: '', validation: '', kpi: '' });
    setRetoGenerated(false);
    setFileType(null);
    goTo('hero');
  };

  // Recommendation logic
  const getRecommendation = () => {
    const { need, info, internet, sources, risk } = selectorData;
    const profile: string[] = [];
    const options: { tool: ToolId; why: string; check: string; limit: string; alt: string }[] = [];

    if (need === 'investigar-mercado' || need === 'encontrar-fuentes' || internet === 'si') {
      profile.push('investigación con capacidad de mostrar o contrastar fuentes');
      options.push({
        tool: 'perplexity',
        why: 'Puede resultar útil cuando el objetivo principal es investigar información externa y trabajar con fuentes.',
        check: 'Calidad y actualidad de las fuentes citadas.',
        limit: 'Menos orientada a conocimiento puramente interno.',
        alt: 'Gemini o ChatGPT con búsqueda activada (verificar disponibilidad).'
      });
    }
    if (need === 'analizar-documentos' || need === 'resumir' || info === 'documentos' || sources === 'si') {
      profile.push('trabajo con documentos o fuentes seleccionadas');
      options.push({
        tool: 'notebooklm',
        why: 'Especialmente orientada al trabajo fundamentado en fuentes que tú proporcionas.',
        check: 'Que las respuestas se basen en los documentos cargados.',
        limit: 'Depende de la calidad y cobertura de tus fuentes.',
        alt: 'Claude o ChatGPT/Gemini con buena capacidad de documentos.'
      });
      options.push({
        tool: 'claude',
        why: 'Puede resultar útil para análisis detallado de documentos extensos y comparaciones.',
        check: 'Extracción precisa y que no se omitan puntos críticos.',
        limit: 'Verificar límites de contexto del plan.',
        alt: 'ChatGPT o Gemini según el tipo de documento.'
      });
    }
    if (need === 'trabajar-datos' || info === 'hoja-calculo') {
      profile.push('análisis de datos estructurados');
      options.push({
        tool: 'chatgpt',
        why: 'Puede ayudar a interpretar hojas de cálculo y generar insights (según capacidades del plan).',
        check: 'Verificar cálculos y lógica con una revisión manual.',
        limit: 'Las capacidades de datos dependen del modelo y plan.',
        alt: 'Gemini (integración con hojas) o Claude.'
      });
    }
    if (need === 'generar-contenido') {
      profile.push('generación de contenido y asistencia general');
      options.push({
        tool: 'chatgpt',
        why: 'Versátil para ideación, borradores y estructuración de mensajes.',
        check: 'Tono, alineación con marca y que no invente datos.',
        limit: 'No sustituye criterio editorial o de marca.',
        alt: 'Claude o Gemini.'
      });
    }
    if (need === 'analizar-imagenes' || info === 'imagenes') {
      profile.push('capacidad multimodal');
      options.push({
        tool: 'gemini',
        why: 'Fuerte orientación multimodal para interpretar imágenes junto con texto.',
        check: 'Interpretación correcta de elementos visuales.',
        limit: 'Verificar disponibilidad según plan y región.',
        alt: 'ChatGPT con capacidades de visión.'
      });
    }
    if (need === 'comparar' || need === 'preparar-informe') {
      profile.push('análisis, comparación y estructuración de resultados');
      options.push({
        tool: 'claude',
        why: 'Puede apoyar comparaciones detalladas y la estructuración de informes con contexto amplio.',
        check: 'Que cada conclusión pueda rastrearse a la información proporcionada.',
        limit: 'La calidad depende de la cobertura y consistencia de las fuentes.',
        alt: 'ChatGPT o Gemini según los archivos y el flujo de trabajo.'
      });
    }
    if (info === 'varias') {
      profile.push('combinación de capacidades y trazabilidad entre fuentes');
      options.push({
        tool: 'gemini',
        why: 'Puede ser una opción para combinar distintos formatos y fuentes en un mismo análisis.',
        check: 'Separar claramente hechos externos, datos internos e inferencias.',
        limit: 'La compatibilidad y los límites dependen del plan y los tipos de archivo.',
        alt: 'Combinar una herramienta de investigación con un asistente de análisis.'
      });
    }
    if (internet === 'duda') {
      profile.push('definición previa de la necesidad de actualidad');
    }
    if (need === 'consultar-interna' || sources === 'si') {
      if (!options.find(o => o.tool === 'notebooklm')) {
        options.push({
          tool: 'notebooklm',
          why: 'Diseñada para consultar conocimiento a partir de documentos seleccionados.',
          check: 'Fidelidad a las fuentes cargadas.',
          limit: 'No reemplaza un sistema formal de gestión del conocimiento en todos los casos.',
          alt: 'Claude o ChatGPT con documentos cargados.'
        });
      }
    }

    // Deduplicate
    const seen = new Set<string>();
    const unique = options.filter(o => {
      if (seen.has(o.tool)) return false;
      seen.add(o.tool);
      return true;
    });

    if (unique.length === 0) {
      unique.push({
        tool: 'chatgpt',
        why: 'Asistente de propósito general que puede servir como punto de partida en muchos escenarios.',
        check: 'Adecuación a la tarea y calidad de la respuesta.',
        limit: 'No es la opción más especializada para todos los casos.',
        alt: 'Evaluar Gemini, Claude o Perplexity según la necesidad concreta.'
      });
    }

    return {
      profile: profile.length > 0
        ? `Necesitas una herramienta orientada a ${profile.join(' y a ')}.`
        : 'Evalúa el perfil según la combinación de necesidad e información.',
      options: unique,
      riskNote: risk === 'alto'
        ? 'Riesgo alto: no cargues información sin autorización, minimiza o anonimiza los datos y exige validación humana experta, trazabilidad y aprobación antes de decidir.'
        : risk === 'medio'
        ? 'Riesgo medio: contrasta las fuentes, documenta los supuestos y solicita revisión de la persona responsable antes de aplicar el resultado.'
        : 'Riesgo bajo: realiza una revisión proporcional y confirma que el resultado sea adecuado al contexto.'
    };
  };

  const renderHero = () => (
    <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-transparent pointer-events-none" />
      <CourseProgress className="mb-10 justify-center" />
      <p className="text-primary-400 font-medium tracking-wide text-sm uppercase mb-3">
        IA aplicada a la Gestión Empresarial
      </p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-3xl">
        INTRODUCCIÓN
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 mt-3 font-medium">
        Ecosistema de herramientas de IA
      </p>
      <p className="section-subtitle mt-6 mx-auto">
        Aprende a elegir la herramienta adecuada según el problema que necesitas resolver.
      </p>
      <button onClick={() => goTo('question')} className="btn-primary mt-10 text-lg px-8 py-4">
        Explorar ecosistema
        <IconArrowRight size={20} />
      </button>
      <div className="mt-16 w-full max-w-4xl">
        <ProcessFlow />
      </div>
    </section>
  );

  const renderQuestion = () => (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      {questionPhase === 0 && (
        <div className="animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            ¿Cuál es la mejor Inteligencia Artificial?
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
            {tools.map(t => (
              <button
                key={t.id}
                onClick={() => setOpeningTool(t.id)}
                aria-pressed={openingTool === t.id}
                className={cn(
                  'px-5 py-3 rounded-xl border text-slate-200 transition-all',
                  openingTool === t.id
                    ? 'bg-primary-600/20 border-primary-500 text-white ring-1 ring-primary-500/30'
                    : 'bg-slate-800 border-slate-600 hover:border-primary-500 hover:bg-slate-700',
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-8">
            Puedes seleccionar una opción para reflexionar o continuar directamente. La pantalla no avanzará automáticamente.
          </p>
          <button
            onClick={() => setOpeningAnswerVisible(v => !v)}
            aria-expanded={openingAnswerVisible}
            className="btn-secondary mt-6"
          >
            {openingAnswerVisible ? 'Ocultar respuesta' : 'Ver respuesta'}
          </button>
          {openingAnswerVisible && (
            <div className="card p-5 mt-4 max-w-2xl mx-auto text-left" role="status">
              <p className="text-emerald-300 font-medium">Respuesta orientativa</p>
              <p className="text-slate-300 text-sm mt-2">
                No existe una única IA que sea la mejor para todo. La respuesta depende de la tarea, la información disponible, el riesgo y la validación necesaria.
              </p>
            </div>
          )}
          <button
            onClick={() => setQuestionPhase(1)}
            className="btn-primary mt-6"
          >
            Continuar y descubrir la respuesta
            <IconArrowRight size={18} />
          </button>
        </div>
      )}
      {questionPhase >= 1 && (
        <div className="max-w-2xl animate-fade-in">
          <p className="text-primary-400 font-medium mb-4">La pregunta correcta es otra</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Qué necesito hacer?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            La mejor herramienta depende de la tarea.
          </p>
          <div className="card p-6 text-left">
            <p className="text-slate-300 leading-relaxed">
              No existe una IA universalmente superior. Las capacidades cambian con modelos, planes y fechas.
              El criterio correcto es: <strong className="text-white">necesidad → información → riesgo → herramienta → validación</strong>.
            </p>
          </div>
          <button onClick={() => goTo('ecosystem')} className="btn-primary mt-10">
            Ver el mapa del ecosistema
            <IconArrowRight size={18} />
          </button>
        </div>
      )}
    </section>
  );

  const renderEcosystem = () => (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <h2 className="section-title text-center">Mapa del ecosistema</h2>
      <p className="section-subtitle text-center mx-auto mb-10">
        Selecciona una categoría. Las herramientas pueden pertenecer a varias: no son mutuamente excluyentes.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {categories.map(cat => {
          const Icon = iconMap[cat.icon] || IconMessage;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={cn(
                'card card-hover p-5 text-left flex flex-col gap-2',
                selectedCategory === cat.id && 'border-primary-500 bg-primary-600/10'
              )}
            >
              <Icon size={28} className="text-primary-400" />
              <span className="font-semibold text-white">{cat.name}</span>
              <span className="text-xs text-slate-400 leading-snug">{cat.description}</span>
            </button>
          );
        })}
      </div>
      {selectedCategory && (
        <div className="card p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4">
            Herramientas que pueden participar en «{categories.find(c => c.id === selectedCategory)?.name}»
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getToolsByCategory(selectedCategory).map(t => (
              <div key={t.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                <p className="font-medium text-primary-300">{t.name}</p>
                <p className="text-sm text-slate-400 mt-1">{t.type}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Una misma herramienta puede cubrir varias categorías. La superposición es normal y educativa.
          </p>
        </div>
      )}
      <div className="flex justify-center gap-4 mt-12">
        <button onClick={() => goTo('explorer')} className="btn-primary">
          Explorar herramientas
          <IconArrowRight size={18} />
        </button>
      </div>
    </section>
  );

  const renderExplorer = () => (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <h2 className="section-title text-center">Explorador de herramientas</h2>
      <p className="section-subtitle text-center mx-auto mb-4">
        Conoce el perfil de cada herramienta de referencia. Ninguna es universalmente superior.
      </p>
      <p className="text-center text-xs text-amber-400/80 mb-10">
        Las funciones y límites pueden variar según modelo, plan, cuenta y fecha.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {tools.map(t => (
          <button
            type="button"
            key={t.id}
            aria-expanded={selectedTool === t.id}
            className={cn(
              'card p-6 cursor-pointer transition-all text-left w-full',
              selectedTool === t.id ? 'border-primary-500 ring-1 ring-primary-500/30' : 'card-hover'
            )}
            onClick={() => setSelectedTool(selectedTool === t.id ? null : t.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{t.name}</h3>
                <p className="text-sm text-primary-400 mt-1">{t.type}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">{t.description}</p>
            {selectedTool === t.id && (
              <div className="mt-5 space-y-4 border-t border-slate-700 pt-4 text-sm">
                <div>
                  <p className="text-slate-500 font-medium mb-1">¿Para qué tareas puede resultar útil?</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {t.usefulFor.map((u, i) => <li key={i}>{u}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">¿Qué tipo de información puede utilizar?</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {t.informationTypes.map((u, i) => <li key={i}>{u}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Ejemplo empresarial</p>
                  <p className="text-slate-300 italic">{t.businessExample}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Qué debes validar</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {t.whatToValidate.map((u, i) => <li key={i}>{u}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Consideraciones</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {t.considerations.map((u, i) => <li key={i}>{u}</li>)}
                  </ul>
                </div>
                <p className="text-xs text-amber-400/70">{t.note}</p>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <button onClick={() => goTo('selector')} className="btn-primary">
          Usar el selector de herramientas
          <IconArrowRight size={18} />
        </button>
      </div>
    </section>
  );

  const renderSelector = () => {
    const rec = selectorStep > 5 ? getRecommendation() : null;
    return (
      <section className="px-4 py-16 max-w-3xl mx-auto">
        <h2 className="section-title text-center">Selector de herramientas de IA</h2>
        <p className="section-subtitle text-center mx-auto mb-10">
          ¿Qué necesitas hacer? No hay una única respuesta correcta: la recomendación depende de tus respuestas y del contexto.
        </p>

        {selectorStep === 1 && (
          <div>
            <p className="text-slate-400 mb-4 font-medium">Paso 1 — Selecciona tu necesidad</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {needsOptions.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    setSelectorData(d => ({ ...d, need: n.id }));
                    setSelectorStep(2);
                  }}
                  className="card card-hover p-4 text-left text-slate-200 hover:text-white"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectorStep === 2 && (
          <div>
            <p className="text-slate-400 mb-4 font-medium">Paso 2 — ¿Dónde está la información?</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {infoSources.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectorData(d => ({ ...d, info: s.id }));
                    setSelectorStep(3);
                  }}
                  className="card card-hover p-4 text-left text-slate-200"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button onClick={() => setSelectorStep(1)} className="btn-ghost mt-4 text-sm">← Volver</button>
          </div>
        )}

        {selectorStep === 3 && (
          <div>
            <p className="text-slate-400 mb-4 font-medium">Paso 3 — ¿Necesitas información actual de Internet?</p>
            <div className="flex flex-wrap gap-3">
              {[{ id: 'si', label: 'Sí' }, { id: 'no', label: 'No' }, { id: 'duda', label: 'No estoy seguro' }].map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectorData(d => ({ ...d, internet: v.id }));
                    setSelectorStep(4);
                  }}
                  className="btn-secondary px-6"
                >
                  {v.label}
                </button>
              ))}
            </div>
            <button onClick={() => setSelectorStep(2)} className="btn-ghost mt-4 text-sm">← Volver</button>
          </div>
        )}

        {selectorStep === 4 && (
          <div>
            <p className="text-slate-400 mb-4 font-medium">Paso 4 — ¿Necesitas que la respuesta se base principalmente en fuentes específicas?</p>
            <div className="flex gap-3">
              {[{ id: 'si', label: 'Sí' }, { id: 'no', label: 'No' }].map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectorData(d => ({ ...d, sources: v.id }));
                    setSelectorStep(5);
                  }}
                  className="btn-secondary px-8"
                >
                  {v.label}
                </button>
              ))}
            </div>
            <button onClick={() => setSelectorStep(3)} className="btn-ghost mt-4 text-sm">← Volver</button>
          </div>
        )}

        {selectorStep === 5 && (
          <div>
            <p className="text-slate-400 mb-4 font-medium">Paso 5 — ¿Qué nivel de riesgo tiene la tarea?</p>
            <div className="space-y-3">
              {riskLevels.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectorData(d => ({ ...d, risk: r.id }));
                    setSelectorStep(6);
                  }}
                  className={cn(
                    'w-full card card-hover p-4 text-left flex items-center gap-4',
                    r.color === 'green' && 'hover:border-emerald-500/50',
                    r.color === 'yellow' && 'hover:border-amber-500/50',
                    r.color === 'red' && 'hover:border-red-500/50'
                  )}
                >
                  <span className={cn(
                    'w-3 h-3 rounded-full',
                    r.color === 'green' && 'bg-emerald-500',
                    r.color === 'yellow' && 'bg-amber-500',
                    r.color === 'red' && 'bg-red-500'
                  )} />
                  <div>
                    <p className="font-medium text-white">{r.label}</p>
                    <p className="text-sm text-slate-400">{r.example}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setSelectorStep(4)} className="btn-ghost mt-4 text-sm">← Volver</button>
          </div>
        )}

        {selectorStep === 6 && rec && (
          <div className="space-y-6 animate-fade-in">
            <div className="card p-6 border-primary-500/30">
              <p className="text-sm text-primary-400 font-medium mb-2">Perfil recomendado</p>
              <p className="text-lg text-white">{rec.profile}</p>
              <p className="text-sm text-slate-400 mt-3">{rec.riskNote}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium mb-3">Opciones a evaluar</p>
              <div className="space-y-4">
                {rec.options.map(o => {
                  const tool = getToolById(o.tool);
                  return (
                    <div key={o.tool} className="card p-5">
                      <h4 className="font-semibold text-primary-300 text-lg">{tool?.name}</h4>
                      <p className="text-slate-300 text-sm mt-2"><span className="text-slate-500">Por qué puede encajar:</span> {o.why}</p>
                      <p className="text-slate-300 text-sm mt-1"><span className="text-slate-500">Qué debes comprobar:</span> {o.check}</p>
                      <p className="text-slate-300 text-sm mt-1"><span className="text-slate-500">Posible limitación:</span> {o.limit}</p>
                      <p className="text-slate-300 text-sm mt-1"><span className="text-slate-500">Alternativa:</span> {o.alt}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center">
              No presentamos «la herramienta correcta». Evaluamos opciones según el contexto. Las capacidades cambian con el tiempo.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => { setSelectorStep(1); setSelectorData({ need: '', info: '', internet: '', sources: '', risk: '' }); }} className="btn-secondary">
                <IconRefresh size={16} /> Reiniciar selector
              </button>
              <button onClick={() => goTo('comparator')} className="btn-primary">
                Comparar herramientas
                <IconArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </section>
    );
  };

  const comparisonCategories = [
    'Asistencia general',
    'Investigación',
    'Archivos',
    'Datos',
    'Multimodalidad',
    'Trabajo fundamentado en fuentes',
    'Organización mediante proyectos',
    'Creación de contenido'
  ];

  const capabilityMap: Record<ToolId, Record<string, string>> = {
    chatgpt: {
      'Asistencia general': 'Disponible',
      'Investigación': 'Puede depender del plan',
      'Archivos': 'Disponible',
      'Datos': 'Puede depender del plan',
      'Multimodalidad': 'Disponible',
      'Trabajo fundamentado en fuentes': 'Puede depender del plan',
      'Organización mediante proyectos': 'Puede depender del plan',
      'Creación de contenido': 'Disponible'
    },
    gemini: {
      'Asistencia general': 'Disponible',
      'Investigación': 'Disponible',
      'Archivos': 'Disponible',
      'Datos': 'Puede depender del plan',
      'Multimodalidad': 'Enfoque relevante',
      'Trabajo fundamentado en fuentes': 'Puede depender del plan',
      'Organización mediante proyectos': 'Puede depender del plan',
      'Creación de contenido': 'Disponible'
    },
    claude: {
      'Asistencia general': 'Disponible',
      'Investigación': 'Puede depender del plan',
      'Archivos': 'Enfoque relevante',
      'Datos': 'Puede depender del plan',
      'Multimodalidad': 'Puede depender del plan',
      'Trabajo fundamentado en fuentes': 'Puede depender del plan',
      'Organización mediante proyectos': 'Puede depender del plan',
      'Creación de contenido': 'Disponible'
    },
    perplexity: {
      'Asistencia general': 'Disponible',
      'Investigación': 'Enfoque relevante',
      'Archivos': 'Puede depender del plan',
      'Datos': 'Verificar disponibilidad actual',
      'Multimodalidad': 'Verificar disponibilidad actual',
      'Trabajo fundamentado en fuentes': 'Enfoque relevante',
      'Organización mediante proyectos': 'Puede depender del plan',
      'Creación de contenido': 'Disponible'
    },
    notebooklm: {
      'Asistencia general': 'Disponible',
      'Investigación': 'Verificar disponibilidad actual',
      'Archivos': 'Enfoque relevante',
      'Datos': 'Verificar disponibilidad actual',
      'Multimodalidad': 'Verificar disponibilidad actual',
      'Trabajo fundamentado en fuentes': 'Enfoque relevante',
      'Organización mediante proyectos': 'Enfoque relevante',
      'Creación de contenido': 'Disponible'
    }
  };

  const capabilityStatusDetails: Record<string, string> = {
    'Disponible': 'La función forma parte del servicio, pero puede tener límites de uso. No significa acceso ilimitado.',
    'Enfoque relevante': 'Es un uso central de la herramienta; aun así, verifica si encaja con tu tarea concreta.',
    'Puede depender del plan': 'El acceso, el modelo disponible o la cantidad de usos puede variar entre niveles gratuitos y de pago, según la cuenta y la región.',
    'Verificar disponibilidad actual': 'No se da por garantizada esta función. Confirma su disponibilidad y sus límites en la información oficial.'
  };

  const toolPlanDetails: Record<ToolId, { plans: string; note: string; url: string; linkLabel: string }> = {
    chatgpt: {
      plans: 'OpenAI ofrece acceso gratuito y planes Go, Plus, Business y Enterprise.',
      note: 'Los modelos, herramientas y límites de uso varían por plan, cuenta y región. La etiqueta del comparador no afirma que una función pertenezca exclusivamente a un plan.',
      url: 'https://chatgpt.com/pricing/',
      linkLabel: 'Consultar planes de ChatGPT'
    },
    gemini: {
      plans: 'Google ofrece acceso sin costo y planes Google AI Plus, Google AI Pro y Google AI Ultra.',
      note: 'Los planes pagos pueden ampliar el acceso a modelos y funciones o sus límites. La disponibilidad depende también del país y de la cuenta.',
      url: 'https://gemini.google/subscriptions/',
      linkLabel: 'Consultar planes de Google AI'
    },
    claude: {
      plans: 'Anthropic ofrece Claude Free, Pro y Max para uso individual.',
      note: 'Free incluye funciones básicas; Pro amplía el acceso e incluye funciones como Projects, y Max ofrece límites de uso más altos. Las funciones y límites pueden cambiar.',
      url: 'https://claude.com/pricing',
      linkLabel: 'Consultar planes de Claude'
    },
    perplexity: {
      plans: 'Perplexity ofrece acceso gratuito y planes de pago.',
      note: 'Las cuotas y funciones avanzadas dependen del plan vigente. Comprueba en la página oficial si la capacidad que necesitas está incluida en tu cuenta.',
      url: 'https://www.perplexity.ai/pricing',
      linkLabel: 'Consultar planes de Perplexity'
    },
    notebooklm: {
      plans: 'NotebookLM ofrece acceso Standard sin costo y niveles ampliados mediante Google AI Plus, Pro y Ultra. Las cuentas de trabajo o educativas pueden tener límites según su licencia.',
      note: 'Los niveles amplían límites de uso y algunas funciones. Google puede presentar el producto como Gemini Notebook en su documentación más reciente.',
      url: 'https://support.google.com/gemininotebook/answer/16213268?hl=es',
      linkLabel: 'Consultar planes y límites de NotebookLM'
    }
  };

  const renderComparator = () => (
    <section className="px-4 py-16 max-w-5xl mx-auto">
      <h2 className="section-title text-center">Comparador interactivo</h2>
      <p className="section-subtitle text-center mx-auto mb-6">
        Selecciona hasta 3 herramientas. Compara sus enfoques, no un ranking: cada función y sus límites pueden variar según el plan, la cuenta, la región y la fecha.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {tools.map(t => {
          const selected = compareTools.includes(t.id);
          const disabled = !selected && compareTools.length >= 3;
          return (
            <button
              key={t.id}
              disabled={disabled}
              onClick={() => {
                if (selected) setCompareTools(compareTools.filter(id => id !== t.id));
                else if (compareTools.length < 3) setCompareTools([...compareTools, t.id]);
              }}
              className={cn(
                'px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                selected ? 'bg-primary-600/30 border-primary-500 text-primary-200' : 'bg-slate-800 border-slate-600 text-slate-300',
                disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {t.name}
            </button>
          );
        })}
      </div>
      {compareTools.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 text-slate-500 font-medium border-b border-slate-700">Capacidad</th>
                {compareTools.map(id => (
                  <th key={id} className="p-3 text-primary-300 font-semibold border-b border-slate-700 text-center">
                    {getToolById(id)?.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonCategories.map(cat => (
                <tr key={cat} className="border-b border-slate-800">
                  <td className="p-3 text-slate-300">{cat}</td>
                  {compareTools.map(id => {
                    const val = capabilityMap[id][cat];
                    return (
                      <td key={id} className="p-3 text-center">
                        <div className="min-w-36">
                          <span className={cn(
                            'inline-block px-2 py-0.5 rounded text-xs',
                            val === 'Disponible' && 'bg-emerald-500/20 text-emerald-300',
                            val === 'Enfoque relevante' && 'bg-primary-500/20 text-primary-300',
                            val === 'Puede depender del plan' && 'bg-amber-500/20 text-amber-300',
                            val === 'Verificar disponibilidad actual' && 'bg-slate-600/40 text-slate-300'
                          )}>
                            {val}
                          </span>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            {capabilityStatusDetails[val]}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Es una guía orientativa, no una garantía de disponibilidad. Los proveedores actualizan funciones y planes; comprueba la información oficial antes de elegir o contratar.
          </p>
        </div>
      )}
      {compareTools.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Planes y límites de las herramientas seleccionadas</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {compareTools.map(id => {
              const details = toolPlanDetails[id];
              return (
                <article key={id} className="card p-5">
                  <h4 className="font-semibold text-primary-200">{getToolById(id)?.name}</h4>
                  <p className="text-sm text-slate-300 mt-2">{details.plans}</p>
                  <p className="text-sm text-slate-400 mt-2">{details.note}</p>
                  <a
                    href={details.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm text-primary-300 hover:text-primary-200 underline underline-offset-4 mt-3"
                  >
                    {details.linkLabel} ↗
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('context')} className="btn-primary">
          Continuar: contexto
          <IconArrowRight size={18} />
        </button>
      </div>
    </section>
  );

  const renderContext = () => (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="section-title text-center">La IA no sabe automáticamente todo sobre tu empresa</h2>
      <p className="section-subtitle text-center mx-auto mb-10">
        El contexto determina qué información tiene la IA para comprender tu tarea.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 border-red-500/20">
          <p className="text-red-400 font-medium text-sm mb-3">Sin contexto</p>
          <div className="bg-slate-900/60 rounded-lg p-4 font-mono text-sm text-slate-300 mb-4">
            «Analiza nuestras ventas.»
          </div>
          <p className="text-slate-400 text-sm">Resultado probable: respuesta genérica, sin criterios, período ni objetivos claros.</p>
        </div>
        <div className="card p-6 border-emerald-500/20">
          <p className="text-emerald-400 font-medium text-sm mb-3">Con contexto</p>
          <div className="bg-slate-900/60 rounded-lg p-4 font-mono text-sm text-slate-300 mb-4 space-y-1">
            <p>«Somos una empresa retail…»</p>
            <p className="text-slate-500">+ archivo de ventas</p>
            <p className="text-slate-500">+ objetivo + período + criterios</p>
          </div>
          <p className="text-slate-400 text-sm">Resultado potencialmente más útil y alineado con la necesidad real.</p>
        </div>
      </div>
      <p className="text-center text-slate-400 mt-8 text-sm max-w-xl mx-auto">
        No profundizamos aún en el diseño profesional de instrucciones (prompts). Eso corresponde a la siguiente sesión.
      </p>
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('files')} className="btn-primary">Continuar <IconArrowRight size={18} /></button>
      </div>
    </section>
  );

  const fileTypes = [
    { id: 'pdf', label: 'PDF', examples: ['Contrato', 'Procedimiento', 'Reporte ejecutivo'] },
    { id: 'docx', label: 'DOCX', examples: ['Política', 'Manual', 'Informe'] },
    { id: 'xlsx', label: 'XLSX / CSV', examples: ['Ventas', 'Inventario', 'Costos'] },
    { id: 'ppt', label: 'Presentación', examples: ['Propuesta comercial', 'Resultados trimestrales', 'Capacitación'] },
    { id: 'img', label: 'Imagen', examples: ['Factura escaneada', 'Gráfico', 'Captura de pantalla'] },
    { id: 'audio', label: 'Audio', examples: ['Reunión grabada', 'Nota de voz', 'Entrevista'] },
  ];

  const renderFiles = () => (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="section-title text-center">¿Qué puede contener un archivo empresarial?</h2>
      <p className="section-subtitle text-center mx-auto mb-8">
        La compatibilidad exacta depende de la herramienta y del plan.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {fileTypes.map(f => (
          <button
            key={f.id}
            onClick={() => setFileType(fileType === f.id ? null : f.id)}
            className={cn(
              'card card-hover p-5 text-center',
              fileType === f.id && 'border-primary-500 bg-primary-600/10'
            )}
          >
            <p className="font-semibold text-white">{f.label}</p>
          </button>
        ))}
      </div>
      {fileType && (
        <div className="card p-5 animate-fade-in">
          <p className="text-slate-400 text-sm mb-2">Ejemplos empresariales — {fileTypes.find(f => f.id === fileType)?.label}</p>
          <ul className="flex flex-wrap gap-2">
            {fileTypes.find(f => f.id === fileType)?.examples.map(e => (
              <li key={e} className="badge bg-slate-700 text-slate-200">{e}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('multimodal')} className="btn-primary">Continuar <IconArrowRight size={18} /></button>
      </div>
    </section>
  );

  const renderMultimodal = () => (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="section-title text-center">Texto es solo una forma de información</h2>
      <p className="section-subtitle text-center mx-auto mb-10">
        La multimodalidad permite combinar distintos tipos de entrada y salida.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {['Texto', 'Imagen', 'Audio', 'Video', 'Documento', 'Tabla'].map(m => (
          <span key={m} className="px-4 py-2 rounded-full bg-slate-800 border border-slate-600 text-slate-300 text-sm">{m}</span>
        ))}
      </div>
      <div className="flex justify-center mb-6">
        <IconArrowRight size={24} className="text-primary-400 rotate-90" />
      </div>
      <div className="card p-6 text-center mb-8">
        <p className="text-primary-300 font-semibold text-lg">IA multimodal</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {['Analizar', 'Interpretar', 'Relacionar', 'Generar'].map(a => (
            <span key={a} className="badge bg-primary-600/20 text-primary-300">{a}</span>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-400 mb-2">Ejemplo 1</p>
          <p className="text-slate-200 text-sm">Fotografía de un gráfico + pregunta escrita → explicación</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-400 mb-2">Ejemplo 2</p>
          <p className="text-slate-200 text-sm">Hoja de cálculo + instrucciones → análisis</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-400 mb-2">Ejemplo 3</p>
          <p className="text-slate-200 text-sm">Documento + preguntas → resumen orientado</p>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('sources')} className="btn-primary">Continuar <IconArrowRight size={18} /></button>
      </div>
    </section>
  );

  const renderSources = () => (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="section-title text-center">Internet vs. Mis fuentes</h2>
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary-300 mb-3">Información abierta</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Internet</li>
            <li>• Muchas fuentes</li>
            <li>• Información cambiante</li>
            <li>• Necesidad de contrastar</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-emerald-300 mb-3">Fuentes controladas</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Documentos seleccionados</li>
            <li>• Manuales y procedimientos</li>
            <li>• Reportes internos</li>
            <li>• Normativas de la organización</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-slate-300 mt-8 max-w-xl mx-auto">
        La estrategia depende de dónde está el conocimiento que necesitamos.
      </p>
      <div className="card p-5 mt-8 border-primary-500/20">
        <p className="text-sm text-slate-400">
          <strong className="text-primary-300">NotebookLM</strong> es un ejemplo de herramienta especialmente orientada al trabajo fundamentado en fuentes seleccionadas.
          No es la única capaz de hacerlo; otras herramientas también permiten trabajar con documentos cargados según el plan.
        </p>
      </div>
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('cases')} className="btn-primary">Mini casos NOVA <IconArrowRight size={18} /></button>
      </div>
    </section>
  );

  const renderCases = () => (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="section-title text-center">Mini casos — NOVA S.A.C.</h2>
      <p className="section-subtitle text-center mx-auto mb-10">
        Practica el razonamiento de selección con la empresa transversal del curso.
      </p>
      <div className="space-y-6">
        {miniCases.map(c => (
          <div key={c.id} className="card p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-primary-600/30 text-primary-300">Caso {c.id}</span>
              <h3 className="font-semibold text-white">{c.title}</h3>
            </div>
            <p className="text-slate-300 text-sm mb-3">{c.scenario}</p>
            <p className="text-slate-400 text-sm font-medium mb-2">{c.question}</p>
            {!caseAnswers[c.id] ? (
              <button
                onClick={() => setCaseAnswers(a => ({ ...a, [c.id]: !a[c.id] }))}
                aria-expanded={!!caseAnswers[c.id]}
                className="btn-secondary text-sm"
              >
                Ver respuesta correcta
              </button>
            ) : (
              <div>
                <div className="bg-slate-900/50 rounded-lg p-4 mt-2 animate-fade-in" role="status">
                  <p className="text-emerald-400 text-sm font-medium">{c.expectedType}</p>
                  <p className="text-slate-400 text-sm mt-2">{c.explanation}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Herramientas posibles a evaluar: {c.possibleTools.map(id => getToolById(id as ToolId)?.name).join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => setCaseAnswers(a => ({ ...a, [c.id]: false }))}
                  aria-expanded={!!caseAnswers[c.id]}
                  className="btn-secondary text-sm mt-3"
                >
                  Ocultar respuesta
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-slate-400 text-sm mt-8">
        El caso 6 enseña que a veces una única herramienta no basta: puede requerirse combinación de capacidades.
      </p>
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('privacy')} className="btn-primary">Continuar <IconArrowRight size={18} /></button>
      </div>
    </section>
  );

  const renderPrivacy = () => (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="section-title text-center flex items-center justify-center gap-3">
        <IconShield size={32} className="text-amber-400" />
        Antes de subir un archivo, detente.
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 mt-10">
        {[
          { label: 'Público', desc: 'Información que puede compartirse públicamente.', color: 'emerald' },
          { label: 'Interno', desc: 'Información empresarial no destinada al público.', color: 'blue' },
          { label: 'Confidencial', desc: 'Información financiera sensible, contractual, estratégica o equivalente.', color: 'amber' },
          { label: 'Datos personales', desc: 'Información de personas.', color: 'red' },
        ].map(c => (
          <div key={c.label} className="card p-5">
            <p className={cn(
              'font-semibold',
              c.color === 'emerald' && 'text-emerald-400',
              c.color === 'blue' && 'text-blue-400',
              c.color === 'amber' && 'text-amber-400',
              c.color === 'red' && 'text-red-400'
            )}>{c.label}</p>
            <p className="text-sm text-slate-400 mt-1">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="card p-6 mt-8 space-y-3">
        <p className="font-medium text-white">Pregúntate:</p>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li>• ¿Tengo autorización para usar esta información?</li>
          <li>• ¿La herramienta está aprobada por la organización?</li>
          <li>• ¿Qué política de tratamiento de datos aplica?</li>
          <li>• ¿Realmente necesito subir todo el archivo?</li>
        </ul>
      </div>
      <p className="text-center text-slate-500 text-sm mt-4">
        Estas son preguntas de reflexión; su respuesta depende de las políticas y circunstancias de cada organización.
      </p>
      <p className="text-center text-amber-300/90 mt-8 font-medium">
        La capacidad técnica de subir información no significa que debamos hacerlo.
      </p>
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('validation')} className="btn-primary">Continuar <IconArrowRight size={18} /></button>
      </div>
    </section>
  );

  const renderValidation = () => (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="section-title text-center">Resultado generado ≠ verdad garantizada</h2>
      <p className="text-center text-slate-400 text-sm mt-3">
        Estas preguntas son una guía de reflexión, no tienen una única respuesta correcta.
      </p>
      <div className="flex flex-col items-center gap-2 my-10">
        {['IA genera resultado', 'Revisar', 'Contrastar', 'Comprobar fuentes', 'Aplicar criterio', 'Utilizar'].map((s, i) => (
          <div key={s} className="flex flex-col items-center">
            <div className="px-5 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 text-sm font-medium">
              {s}
            </div>
            {i < 5 && <div className="w-0.5 h-4 bg-slate-600" />}
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          '¿De dónde salió esta información?',
          '¿Puedo verificarla?',
          '¿Hay información faltante?',
          '¿Cuál sería el impacto de equivocarnos?'
        ].map((q, i) => (
          <div key={i} className="card p-4 flex items-start gap-3">
            <span className="text-primary-400 font-bold">{i + 1}</span>
            <p className="text-slate-200 text-sm">{q}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('risk')} className="btn-primary">Semáforo de riesgo <IconArrowRight size={18} /></button>
      </div>
    </section>
  );

  const renderRisk = () => (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="section-title text-center">Semáforo de riesgo</h2>
      <p className="section-subtitle text-center mx-auto mb-8">
        Clasifica cada situación. A mayor impacto potencial del error, mayor necesidad de validación.
      </p>
      <div className="space-y-4">
        {riskSituations.map(s => (
          <div key={s.id} className="card p-4">
            <p className="text-slate-200 text-sm mb-3">{s.text}</p>
            <div className="flex gap-2">
              {(['bajo', 'medio', 'alto'] as const).map(level => {
                const answered = riskAnswers[s.id];
                const isCorrect = answered === s.level;
                const isSelected = answered === level;
                return (
                  <button
                    key={level}
                    onClick={() => setRiskAnswers(a => ({ ...a, [s.id]: level }))}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      level === 'bajo' && 'border-emerald-600/50',
                      level === 'medio' && 'border-amber-600/50',
                      level === 'alto' && 'border-red-600/50',
                      isSelected && level === 'bajo' && 'bg-emerald-500/30 text-emerald-200',
                      isSelected && level === 'medio' && 'bg-amber-500/30 text-amber-200',
                      isSelected && level === 'alto' && 'bg-red-500/30 text-red-200',
                      !isSelected && 'text-slate-400 hover:bg-slate-700/50',
                      answered && isCorrect && isSelected && 'ring-1 ring-emerald-400',
                      answered && !isCorrect && isSelected && 'ring-1 ring-red-400'
                    )}
                  >
                    {level === 'bajo' && '🟢 Bajo'}
                    {level === 'medio' && '🟡 Medio'}
                    {level === 'alto' && '🔴 Alto'}
                  </button>
                );
              })}
            </div>
            {riskAnswers[s.id] && riskAnswers[s.id] !== s.level && (
              <p className="text-xs text-amber-400 mt-2">Orientación: esta situación se considera de riesgo {s.level}.</p>
            )}
            <button
              onClick={() => setRiskAnswerVisibility(a => ({ ...a, [s.id]: !a[s.id] }))}
              aria-expanded={!!riskAnswerVisibility[s.id]}
              className="btn-secondary text-xs mt-3"
            >
              {riskAnswerVisibility[s.id] ? 'Ocultar respuesta' : 'Ver respuesta correcta'}
            </button>
            {riskAnswerVisibility[s.id] && (
              <p className="text-sm text-emerald-300 mt-3" role="status">
                Respuesta: riesgo {s.level}.
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-slate-400 text-sm mt-8">
        Ninguna categoría elimina completamente el riesgo. La validación escala con el impacto.
      </p>
      <div className="flex justify-center mt-10">
        <button onClick={() => goTo('challenge')} className="btn-primary">Desafío de selección <IconArrowRight size={18} /></button>
      </div>
    </section>
  );

  const renderChallenge = () => {
    const scenario = challengeScenarios[challengeIndex];
    const answered = challengeAnswers[scenario.id];
    const typeOptions = Array.from(new Set(challengeScenarios.map(item => item.correctType)));

    if (challengeScore !== null) {
      const total = challengeScenarios.length;
      const label = challengeScore >= 7 ? 'Muy buen criterio' : challengeScore >= 5 ? 'Buen criterio' : 'En desarrollo';
      const criteriaScore = Object.values(challengeAnswers).reduce(
        (sum, answer) => sum + Number(answer.type) + Number(answer.tool) + Number(answer.validation),
        0,
      );
      return (
        <section className="px-4 py-16 max-w-3xl mx-auto text-center">
          <h2 className="section-title">Tu criterio de selección</h2>
          <p className="text-5xl font-bold text-primary-400 mt-8">{challengeScore} / {total}</p>
          <p className="text-xl text-white mt-4">{label}</p>
          <p className="text-slate-300 mt-3">{criteriaScore} de {total * 3} criterios correctos: capacidad, herramienta y validación.</p>
          <p className="text-slate-400 mt-4 text-sm">No hay ranking entre estudiantes. El objetivo es desarrollar criterio.</p>
          <button
            onClick={() => setChallengeReviewVisible(v => !v)}
            aria-expanded={challengeReviewVisible}
            className="btn-secondary mt-6"
          >
            {challengeReviewVisible ? 'Ocultar respuestas correctas' : 'Ver respuestas correctas'}
          </button>
          {challengeReviewVisible && (
            <div className="text-left space-y-4 mt-6">
              {challengeScenarios.map(item => (
                <div key={item.id} className="card p-4">
                  <p className="text-sm font-medium text-white">Escenario {item.id}</p>
                  <ul className="text-sm text-slate-300 mt-2 space-y-1">
                    <li>Capacidad: {item.correctType}</li>
                    <li>Herramientas posibles: {item.correctTools.map(id => getToolById(id as ToolId)?.name).join(', ')}</li>
                    <li>Validación: {item.validationOptions.find(option => option.correct)?.text}</li>
                  </ul>
                  <p className="text-sm text-slate-400 mt-2">{item.explanation}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <button
              onClick={() => {
                setChallengeIndex(0);
                setChallengeAnswers({});
                setChallengeAnswerVisibility({});
                setChallengeScore(null);
                setChallengeReviewVisible(false);
                setChallengeType('');
                setChallengeTool('');
              }}
              className="btn-secondary"
            >
              <IconRefresh size={16} /> Repetir desafío
            </button>
            <button onClick={() => goTo('reto')} className="btn-primary">Crear ficha personal <IconArrowRight size={18} /></button>
          </div>
        </section>
      );
    }

    return (
      <section className="px-4 py-16 max-w-3xl mx-auto">
        <h2 className="section-title text-center">Desafío de selección</h2>
        <p className="text-center text-slate-400 text-sm mb-8">
          Escenario {challengeIndex + 1} de {challengeScenarios.length}
        </p>
        <div className="card p-6 space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Necesidad</p>
            <p className="text-white">{scenario.need}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Información</p>
            <p className="text-slate-300">{scenario.information}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Condiciones</p>
            <p className="text-slate-300">{scenario.conditions}</p>
          </div>
          <div className="border-t border-slate-700 pt-4">
            <label htmlFor="challenge-type" className="text-sm font-medium text-white block mb-2">1. ¿Qué capacidad necesitas principalmente?</label>
            <select
              id="challenge-type"
              value={challengeType}
              disabled={!!answered}
              onChange={(event) => setChallengeType(event.target.value)}
              className="form-control"
            >
              <option value="">Selecciona una capacidad</option>
              {typeOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            {revealAll && !answered && (
              <p className="text-xs text-amber-300 mt-2">Orientación docente: {scenario.correctType}</p>
            )}
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-white mb-3">2. ¿Qué herramienta candidata evaluarías?</legend>
            <div className="grid sm:grid-cols-2 gap-2">
              {tools.map(tool => (
                <button
                  type="button"
                  key={tool.id}
                  disabled={!!answered}
                  aria-pressed={challengeTool === tool.id}
                  onClick={() => setChallengeTool(tool.id)}
                  className={cn(
                    'px-4 py-3 rounded-xl border text-left text-sm transition-all',
                    challengeTool === tool.id
                      ? 'border-primary-500 bg-primary-500/15 text-primary-200'
                      : 'border-slate-600 text-slate-300 hover:border-primary-500',
                  )}
                >
                  {tool.name}
                </button>
              ))}
            </div>
            {revealAll && !answered && (
              <p className="text-xs text-amber-300 mt-2">Opciones razonables: {scenario.correctTools.map(id => getToolById(id as ToolId)?.name).join(', ')}</p>
            )}
          </fieldset>
          <div>
            <p className="text-sm font-medium text-white mb-3">3. {scenario.validationQuestion}</p>
            <div className="space-y-2">
              {scenario.validationOptions.map(opt => {
                return (
                  <button
                    key={opt.id}
                    disabled={!!answered || !challengeType || !challengeTool}
                    onClick={() => {
                      setChallengeAnswers(a => ({
                        ...a,
                        [scenario.id]: {
                          type: challengeType === scenario.correctType,
                          tool: scenario.correctTools.includes(challengeTool as ToolId),
                          validation: opt.correct,
                        }
                      }));
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all',
                      !answered && 'border-slate-600 hover:border-primary-500 text-slate-200',
                      answered && opt.correct && 'border-emerald-500 bg-emerald-500/10 text-emerald-200',
                      answered && !opt.correct && 'border-slate-700 text-slate-500'
                    )}
                  >
                    {opt.id.toUpperCase()}. {opt.text}
                  </button>
                );
              })}
            </div>
            {!challengeType || !challengeTool ? (
              <p className="text-xs text-slate-500 mt-3">Selecciona primero la capacidad y la herramienta candidata.</p>
            ) : null}
            <button
              onClick={() => setChallengeAnswerVisibility(a => ({ ...a, [scenario.id]: !a[scenario.id] }))}
              aria-expanded={!!challengeAnswerVisibility[scenario.id]}
              className="btn-secondary text-sm mt-4"
            >
              {challengeAnswerVisibility[scenario.id] ? 'Ocultar respuesta correcta' : 'Ver respuesta correcta'}
            </button>
            {challengeAnswerVisibility[scenario.id] && (
              <div className="mt-3 rounded-xl border border-emerald-700/50 bg-emerald-950/20 p-4" role="status">
                <p className="text-sm font-medium text-emerald-300">Respuesta correcta orientativa</p>
                <ul className="text-sm text-slate-300 mt-2 space-y-1">
                  <li>Capacidad: {scenario.correctType}</li>
                  <li>Herramientas posibles: {scenario.correctTools.map(id => getToolById(id as ToolId)?.name).join(', ')}</li>
                  <li>Validación: {scenario.validationOptions.find(option => option.correct)?.text}</li>
                </ul>
                <p className="text-sm text-slate-400 mt-3">{scenario.explanation}</p>
              </div>
            )}
            {answered && (
              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4" role="status">
                <p className="text-sm font-medium text-white">Resultado del escenario</p>
                <ul className="text-sm text-slate-300 mt-2 space-y-1">
                  <li>{answered.type ? '✓' : '✕'} Capacidad: {scenario.correctType}</li>
                  <li>{answered.tool ? '✓' : '✕'} Herramientas posibles: {scenario.correctTools.map(id => getToolById(id as ToolId)?.name).join(', ')}</li>
                  <li>{answered.validation ? '✓' : '✕'} Validación seleccionada</li>
                </ul>
                <p className="text-sm text-slate-400 mt-3">{scenario.explanation}</p>
              </div>
            )}
          </div>
        </div>
        {answered && (
          <div className="flex justify-center mt-8">
            {challengeIndex < challengeScenarios.length - 1 ? (
              <button onClick={() => { setChallengeIndex(i => i + 1); setChallengeType(''); setChallengeTool(''); }} className="btn-primary">
                Siguiente escenario <IconArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => {
                  const score = Object.values(challengeAnswers).filter(a => a.type && a.tool && a.validation).length;
                  setChallengeScore(score);
                }}
                className="btn-primary"
              >
                Ver resultado
              </button>
            )}
          </div>
        )}
      </section>
    );
  };

  const renderReto = () => (
    <section className="px-4 py-16 max-w-3xl mx-auto">
      <h2 className="section-title text-center">Reto personal</h2>
      <p className="section-subtitle text-center mx-auto mb-8">
        Elige una tarea real de tu trabajo o estudios y completa tu ficha de selección.
      </p>
      <p className="text-center text-slate-500 text-sm mb-6">
        Esta ficha es personal y no tiene una única respuesta correcta.
      </p>
      {!retoGenerated ? (
        <div className="space-y-4">
          {[
            { key: 'need', label: '¿Qué necesitas conseguir?' },
            { key: 'info', label: '¿Dónde está la información?' },
            { key: 'internet', label: '¿Necesitas Internet?' },
            { key: 'files', label: '¿Necesitas archivos?' },
            { key: 'risk', label: '¿Cuál es el nivel de riesgo?' },
            { key: 'type', label: '¿Qué tipo de IA parece apropiada?' },
            { key: 'tool', label: '¿Qué herramienta candidata evaluarías?' },
            { key: 'validation', label: '¿Cómo validarías el resultado?' },
            { key: 'kpi', label: '¿Qué indicador demostraría que la solución aporta valor?' },
          ].map(f => (
            <div key={f.key}>
              <label htmlFor={`reto-${f.key}`} className="text-sm text-slate-400 block mb-1">{f.label}</label>
              <input
                id={`reto-${f.key}`}
                type="text"
                value={(retoData as any)[f.key]}
                onChange={e => setRetoData(d => ({ ...d, [f.key]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-primary-500"
                placeholder="Escribe aquí…"
              />
            </div>
          ))}
          <button
            onClick={() => setRetoGenerated(true)}
            className="btn-primary w-full mt-4"
            disabled={!retoData.need}
          >
            Crear mi ficha de selección
          </button>
        </div>
      ) : (
        <div className="card p-6 space-y-3 animate-fade-in">
          <h3 className="text-lg font-bold text-white">Ficha de selección de IA</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-500">Necesidad:</span> <span className="text-slate-200">{retoData.need}</span></p>
            <p><span className="text-slate-500">Información:</span> <span className="text-slate-200">{retoData.info}</span></p>
            <p><span className="text-slate-500">Internet:</span> <span className="text-slate-200">{retoData.internet}</span></p>
            <p><span className="text-slate-500">Archivos:</span> <span className="text-slate-200">{retoData.files}</span></p>
            <p><span className="text-slate-500">Tipo de IA:</span> <span className="text-slate-200">{retoData.type}</span></p>
            <p><span className="text-slate-500">Herramienta candidata:</span> <span className="text-slate-200">{retoData.tool}</span></p>
            <p><span className="text-slate-500">Riesgo:</span> <span className="text-slate-200">{retoData.risk}</span></p>
            <p><span className="text-slate-500">Validación:</span> <span className="text-slate-200">{retoData.validation}</span></p>
            <p><span className="text-slate-500">Indicador de éxito (KPI):</span> <span className="text-slate-200">{retoData.kpi}</span></p>
          </div>
          <div className="flex flex-wrap gap-2 pt-4">
            <button onClick={() => setRetoGenerated(false)} className="btn-secondary text-sm">Editar</button>
            <button
              onClick={() => {
                setRetoData({ need: '', info: '', internet: '', files: '', risk: '', type: '', tool: '', validation: '', kpi: '' });
                setRetoGenerated(false);
              }}
              className="btn-secondary text-sm"
            >
              <IconRefresh size={14} /> Reiniciar
            </button>
            <button
              onClick={() => {
                const text = `FICHA DE SELECCIÓN DE IA\nNecesidad: ${retoData.need}\nInformación: ${retoData.info}\nInternet: ${retoData.internet}\nArchivos: ${retoData.files}\nCapacidad de IA: ${retoData.type}\nHerramienta candidata: ${retoData.tool}\nRiesgo: ${retoData.risk}\nValidación: ${retoData.validation}\nIndicador de éxito (KPI): ${retoData.kpi}`;
                navigator.clipboard?.writeText(text);
              }}
              className="btn-secondary text-sm"
            >
              <IconCopy size={14} /> Copiar como texto
            </button>
          </div>
          <button onClick={() => goTo('next')} className="btn-primary w-full mt-4">
            Ver próxima etapa <IconArrowRight size={18} />
          </button>
        </div>
      )}
    </section>
  );

  const renderNext = () => (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-primary-400 font-medium mb-4">Ya elegiste la herramienta.</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Ahora necesitas aprender a comunicarte con ella.
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-2 text-slate-300 mb-10">
        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm">Herramienta ✓</span>
        <IconArrowRight size={16} className="text-slate-600" />
        <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-sm">Prompt</span>
        <IconArrowRight size={16} className="text-slate-600" />
        <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-sm">Resultado</span>
        <IconArrowRight size={16} className="text-slate-600" />
        <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-sm">Refinamiento</span>
      </div>
      <div className="card p-6 max-w-md">
        <p className="text-sm text-slate-500 mb-1">Siguiente sesión</p>
        <p className="text-xl font-bold text-white">SESIÓN 1</p>
        <p className="text-slate-300 mt-1">Fundamentos de IA generativa y diseño profesional de prompts</p>
      </div>
      <button className="btn-primary mt-10 opacity-80 cursor-default">
        Ver próxima etapa
      </button>
      <p className="text-slate-500 text-xs mt-6">
        Has completado el Selector de herramientas de IA — Introducción al ecosistema de herramientas de IA
      </p>
    </section>
  );

  const sections: Record<Section, () => ReactElement> = {
    hero: renderHero,
    question: renderQuestion,
    ecosystem: renderEcosystem,
    explorer: renderExplorer,
    selector: renderSelector,
    comparator: renderComparator,
    context: renderContext,
    files: renderFiles,
    multimodal: renderMultimodal,
    sources: renderSources,
    cases: renderCases,
    privacy: renderPrivacy,
    validation: renderValidation,
    risk: renderRisk,
    challenge: renderChallenge,
    reto: renderReto,
    next: renderNext,
  };

  return (
    <div className={cn('min-h-screen', isTeacher && 'teacher-mode')}>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              IA
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Selector de herramientas de IA</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">IA aplicada a la Gestión Empresarial</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1 text-xs" aria-label="Navegación principal">
            {sectionOrder.slice(0, 8).map(s => (
              <button
                key={s}
                onClick={() => goTo(s)}
                className={cn(
                  'px-2 py-1 rounded transition-colors',
                  section === s ? 'text-primary-400 bg-primary-500/10' : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {sectionLabels[s]}
              </button>
            ))}
          </nav>
          <label className="lg:hidden">
            <span className="sr-only">Ir a una sección</span>
            <select
              value={section}
              onChange={(event) => goTo(event.target.value as Section)}
              className="form-control py-2 text-sm"
              aria-label="Ir a una sección"
            >
              {sectionOrder.map(item => <option key={item} value={item}>{sectionLabels[item]}</option>)}
            </select>
          </label>
        </div>
      </header>

      <main>
        {sections[section]()}
      </main>

      <footer className="border-t border-slate-800 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Selector de herramientas de IA · Curso: Inteligencia Artificial aplicada a la Gestión Empresarial</p>
          <p className="mt-1 text-xs">Las capacidades de las herramientas de IA evolucionan. Verifica siempre la disponibilidad actual.</p>
        </div>
      </footer>

      <TeacherToggle onReset={resetActivities} />
    </div>
  );
}

export default function App() {
  return (
    <TeacherProvider>
      <AppContent />
    </TeacherProvider>
  );
}
