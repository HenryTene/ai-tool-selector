export interface MiniCase {
  id: number;
  title: string;
  scenario: string;
  question: string;
  expectedType: string;
  explanation: string;
  possibleTools: string[];
}

export const miniCases: MiniCase[] = [
  {
    id: 1,
    title: 'Tendencias de mercado',
    scenario: 'NOVA quiere conocer tendencias recientes del mercado de retail en su región para ajustar la estrategia del próximo trimestre.',
    question: '¿Qué tipo de herramienta necesitamos principalmente?',
    expectedType: 'Investigación con fuentes actuales',
    explanation: 'Se necesita información reciente del exterior. Una herramienta orientada a investigación con capacidad de mostrar o contrastar fuentes es especialmente útil.',
    possibleTools: ['perplexity', 'gemini', 'chatgpt']
  },
  {
    id: 2,
    title: 'Manuales internos',
    scenario: 'NOVA tiene cinco manuales de procedimientos internos y quiere que el equipo pueda consultar rápidamente "¿cuál es el proceso de aprobación de compras?" basándose en esos documentos.',
    question: '¿Qué tipo de enfoque necesitamos?',
    expectedType: 'Sistema basado principalmente en documentos / fuentes internas',
    explanation: 'El conocimiento está en documentos controlados. Una herramienta orientada a trabajo fundamentado en fuentes seleccionadas (como NotebookLM) o un asistente con buena capacidad de documentos es adecuada.',
    possibleTools: ['notebooklm', 'claude', 'chatgpt', 'gemini']
  },
  {
    id: 3,
    title: 'Hoja de ventas',
    scenario: 'El área comercial de NOVA tiene una hoja Excel con ventas de los últimos 12 meses y necesita identificar productos con mayor crecimiento y posibles estacionalidades.',
    question: '¿Qué capacidad es prioritaria?',
    expectedType: 'Herramienta con capacidad para analizar datos estructurados',
    explanation: 'Se trabaja con datos tabulares. Se necesita una herramienta que pueda interpretar hojas de cálculo o datos estructurados y generar insights.',
    possibleTools: ['chatgpt', 'gemini', 'claude']
  },
  {
    id: 4,
    title: 'Mensajes de marketing',
    scenario: 'El equipo de Marketing necesita generar 8 alternativas de mensajes cortos para una campaña interna de cultura organizacional.',
    question: '¿Qué tipo de herramienta encaja mejor?',
    expectedType: 'Asistente generativo general',
    explanation: 'Es una tarea de generación de contenido creativo con bajo riesgo. Un asistente general es suficiente y apropiado.',
    possibleTools: ['chatgpt', 'gemini', 'claude']
  },
  {
    id: 5,
    title: 'Comparar propuestas PDF',
    scenario: 'Gerencia de NOVA recibió tres propuestas de proveedores en formato PDF (15–20 páginas cada una) y necesita una comparación estructurada de alcance, condiciones y riesgos.',
    question: '¿Qué capacidad es clave?',
    expectedType: 'Asistente capaz de trabajar y comparar documentos extensos',
    explanation: 'Se requiere leer y comparar múltiples documentos largos. Herramientas con buen manejo de contexto largo y documentos son prioritarias.',
    possibleTools: ['claude', 'chatgpt', 'gemini']
  },
  {
    id: 6,
    title: 'Información actual + documentos internos',
    scenario: 'NOVA necesita evaluar si una tendencia de mercado reciente (información actual de Internet) es compatible con sus procedimientos internos de pricing y con el último reporte de márgenes.',
    question: '¿Qué implica este escenario?',
    expectedType: 'Puede requerir combinación de capacidades o herramientas',
    explanation: 'A veces una única herramienta no basta. Puede ser necesario investigar externamente y luego contrastar con documentos internos, o usar una herramienta que combine ambas capacidades según el plan.',
    possibleTools: ['perplexity', 'notebooklm', 'chatgpt', 'gemini', 'claude']
  }
];

export interface ChallengeScenario {
  id: number;
  need: string;
  information: string;
  conditions: string;
  correctType: string;
  correctTools: string[];
  validationQuestion: string;
  validationOptions: { id: string; text: string; correct: boolean }[];
  explanation: string;
}

export const challengeScenarios: ChallengeScenario[] = [
  {
    id: 1,
    need: 'NOVA quiere investigar nuevos competidores con información reciente.',
    information: 'Internet y noticias del sector',
    conditions: 'Necesitan fuentes verificables para un informe de dirección',
    correctType: 'Investigación',
    correctTools: ['perplexity', 'gemini'],
    validationQuestion: '¿Qué deberías exigir del resultado?',
    validationOptions: [
      { id: 'a', text: 'Fuentes verificables', correct: true },
      { id: 'b', text: 'Una respuesta muy larga', correct: false },
      { id: 'c', text: 'Muchas imágenes', correct: false },
      { id: 'd', text: 'Ninguna comprobación', correct: false }
    ],
    explanation: 'En investigación externa, la trazabilidad de fuentes es crítica.'
  },
  {
    id: 2,
    need: 'Consultar el procedimiento exacto de devoluciones según el manual interno.',
    information: 'Manual de operaciones en PDF (documento interno)',
    conditions: 'Solo debe basarse en el documento oficial',
    correctType: 'Conocimiento basado en fuentes / Documentos',
    correctTools: ['notebooklm', 'claude'],
    validationQuestion: '¿Qué es especialmente importante validar?',
    validationOptions: [
      { id: 'a', text: 'Que la respuesta se base en el documento cargado', correct: true },
      { id: 'b', text: 'Que use el mayor número posible de emojis', correct: false },
      { id: 'c', text: 'Que invente un procedimiento más eficiente', correct: false },
      { id: 'd', text: 'Que ignore el manual si parece antiguo', correct: false }
    ],
    explanation: 'Cuando el conocimiento es interno y controlado, la fidelidad a la fuente es prioritaria.'
  },
  {
    id: 3,
    need: 'Generar ideas de nombres para una campaña interna de bienestar.',
    information: 'Breve brief del equipo de RRHH',
    conditions: 'Riesgo bajo; solo uso interno',
    correctType: 'Generación de contenido / Asistencia general',
    correctTools: ['chatgpt', 'gemini', 'claude'],
    validationQuestion: '¿Qué nivel de validación es razonable?',
    validationOptions: [
      { id: 'a', text: 'Revisión rápida de tono y adecuación cultural', correct: true },
      { id: 'b', text: 'Auditoría legal completa antes de cualquier idea', correct: false },
      { id: 'c', text: 'Ninguna revisión es necesaria', correct: false },
      { id: 'd', text: 'Validación por un notario', correct: false }
    ],
    explanation: 'En tareas de bajo riesgo, una revisión humana ligera suele ser suficiente.'
  },
  {
    id: 4,
    need: 'Interpretar un contrato de 40 páginas y señalar cláusulas de riesgo.',
    information: 'Contrato en PDF',
    conditions: 'Decisión contractual de alto impacto',
    correctType: 'Análisis de documentos',
    correctTools: ['claude', 'chatgpt', 'gemini'],
    validationQuestion: '¿Qué debe hacerse siempre en este caso?',
    validationOptions: [
      { id: 'a', text: 'Validación por personal legal / especialista antes de decidir', correct: true },
      { id: 'b', text: 'Confiar plenamente en el resumen de la IA', correct: false },
      { id: 'c', text: 'Publicar el análisis en redes internas sin revisión', correct: false },
      { id: 'd', text: 'Usar solo la primera respuesta generada', correct: false }
    ],
    explanation: 'Alto riesgo: la IA puede apoyar, pero no sustituye criterio experto ni responsabilidad formal.'
  },
  {
    id: 5,
    need: 'Analizar una hoja de cálculo de costos y detectar outliers.',
    information: 'Archivo XLSX de costos del último año',
    conditions: 'Uso interno de finanzas; riesgo medio',
    correctType: 'Análisis de datos',
    correctTools: ['chatgpt', 'gemini', 'claude'],
    validationQuestion: '¿Qué deberías comprobar?',
    validationOptions: [
      { id: 'a', text: 'Que los cálculos y detecciones coincidan con una revisión manual o fórmula', correct: true },
      { id: 'b', text: 'Solo la longitud de la respuesta', correct: false },
      { id: 'c', text: 'Que use el mayor número de colores', correct: false },
      { id: 'd', text: 'Nada; los números de la IA son siempre exactos', correct: false }
    ],
    explanation: 'Los datos estructurados requieren verificación de cálculos y lógica.'
  },
  {
    id: 6,
    need: 'Explicar un gráfico de barras fotografiado desde una presentación.',
    information: 'Fotografía del gráfico + pregunta escrita',
    conditions: 'Reunión en 30 minutos; riesgo bajo-medio',
    correctType: 'Multimodalidad',
    correctTools: ['gemini', 'chatgpt'],
    validationQuestion: '¿Qué es importante?',
    validationOptions: [
      { id: 'a', text: 'Contrastar la interpretación con los datos originales si es posible', correct: true },
      { id: 'b', text: 'Aceptar cualquier lectura de la imagen sin dudar', correct: false },
      { id: 'c', text: 'Ignorar la imagen y pedir solo texto', correct: false },
      { id: 'd', text: 'No hacer ninguna pregunta de seguimiento', correct: false }
    ],
    explanation: 'La multimodalidad es poderosa, pero la interpretación visual también puede fallar.'
  },
  {
    id: 7,
    need: 'Preparar un informe que combine tendencias de mercado y datos internos de ventas.',
    information: 'Internet + hoja de ventas interna',
    conditions: 'Presentación a gerencia; riesgo medio-alto',
    correctType: 'Combinación de capacidades',
    correctTools: ['chatgpt', 'gemini', 'perplexity', 'claude'],
    validationQuestion: '¿Qué estrategia es más prudente?',
    validationOptions: [
      { id: 'a', text: 'Separar fuentes externas e internas y validar cada parte', correct: true },
      { id: 'b', text: 'Mezclar todo sin indicar origen de cada dato', correct: false },
      { id: 'c', text: 'Usar solo una herramienta y no revisar', correct: false },
      { id: 'd', text: 'Priorizar velocidad sobre trazabilidad', correct: false }
    ],
    explanation: 'Cuando se combinan fuentes, la trazabilidad y la validación por tipo de fuente son esenciales.'
  },
  {
    id: 8,
    need: 'Responder dudas frecuentes del equipo usando solo el manual de onboarding.',
    information: 'Manual de onboarding (PDF) y políticas internas',
    conditions: 'Respuestas deben ser consistentes con documentos oficiales',
    correctType: 'Conocimiento basado en fuentes',
    correctTools: ['notebooklm', 'claude', 'chatgpt'],
    validationQuestion: '¿Qué principio aplica?',
    validationOptions: [
      { id: 'a', text: 'La respuesta debe poder rastrearse a los documentos cargados', correct: true },
      { id: 'b', text: 'Es mejor inventar respuestas amables si el manual no cubre el tema', correct: false },
      { id: 'c', text: 'No importa si se mezcla información de Internet', correct: false },
      { id: 'd', text: 'Cualquier respuesta es válida si suena profesional', correct: false }
    ],
    explanation: 'En conocimiento interno, la fidelidad a la fuente evita inconsistencias operativas.'
  }
];

export const riskSituations = [
  { id: 1, text: 'Generar ideas para nombre de una campaña interna.', level: 'bajo' as const },
  { id: 2, text: 'Resumir resultados de una encuesta anónima de clima laboral.', level: 'medio' as const },
  { id: 3, text: 'Interpretar un contrato de proveedor.', level: 'alto' as const },
  { id: 4, text: 'Evaluar información financiera para una decisión de inversión.', level: 'alto' as const },
  { id: 5, text: 'Analizar datos personales de clientes para un reporte.', level: 'alto' as const },
  { id: 6, text: 'Redactar un correo interno de felicitación por logros del equipo.', level: 'bajo' as const },
  { id: 7, text: 'Comparar tres cotizaciones de proveedores para una compra rutinaria.', level: 'medio' as const },
  { id: 8, text: 'Preparar un resumen de noticias del sector para la reunión semanal.', level: 'medio' as const }
];
