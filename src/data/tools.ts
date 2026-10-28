export type ToolId = 'chatgpt' | 'gemini' | 'claude' | 'perplexity' | 'notebooklm';

export interface Tool {
  id: ToolId;
  name: string;
  shortName: string;
  type: string;
  description: string;
  usefulFor: string[];
  informationTypes: string[];
  businessExample: string;
  whatToValidate: string[];
  considerations: string[];
  categories: string[];
  strengths: string[];
  note: string;
}

export const tools: Tool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    shortName: 'ChatGPT',
    type: 'Asistente generativo general multimodal',
    description: 'Asistente de propósito general orientado a conversación, creación de contenido, análisis y razonamiento sobre múltiples tipos de información.',
    usefulFor: [
      'Generación de contenido y borradores',
      'Resúmenes y síntesis',
      'Análisis de documentos e imágenes (según modelo y plan)',
      'Razonamiento paso a paso',
      'Estructuración de información',
      'Ideación y brainstorming'
    ],
    informationTypes: [
      'Conocimiento general del modelo',
      'Documentos subidos',
      'Imágenes',
      'Hojas de cálculo (según capacidades del plan)',
      'Conversación previa como contexto'
    ],
    businessExample: 'Un equipo de marketing pide alternativas de mensajes para una campaña interna y luego itera sobre los borradores recibidos.',
    whatToValidate: [
      'Exactitud de datos numéricos o factuales',
      'Alineación con la voz de marca',
      'Que no se hayan inventado fuentes o citas',
      'Coherencia con políticas internas'
    ],
    considerations: [
      'Las capacidades dependen del modelo y del plan contratado',
      'La información de entrenamiento no es tiempo real por defecto',
      'Revisar políticas de privacidad antes de subir datos sensibles'
    ],
    categories: ['asistencia-general', 'generacion-contenido', 'documentos', 'multimodalidad', 'analisis', 'datos'],
    strengths: ['Versatilidad', 'Conversación fluida', 'Creación de contenido', 'Razonamiento'],
    note: 'Las funciones y límites pueden variar según modelo, plan, cuenta y fecha.'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    shortName: 'Gemini',
    type: 'Asistente multimodal integrado al ecosistema Google',
    description: 'Asistente con fuerte orientación multimodal e integración con servicios de Google. Útil para tareas que combinan texto, imágenes y, en ciertos contextos, información de la web.',
    usefulFor: [
      'Tareas multimodales (texto + imagen)',
      'Investigación y síntesis',
      'Trabajo con documentos y presentaciones',
      'Análisis de datos en hojas de cálculo (según integración)',
      'Generación de contenido'
    ],
    informationTypes: [
      'Conocimiento general',
      'Internet (según configuración)',
      'Documentos e imágenes',
      'Archivos de Google Drive (según integración)',
      'Hojas de cálculo'
    ],
    businessExample: 'El área de operaciones sube una captura de un tablero de indicadores y pide una interpretación orientada a acciones prioritarias.',
    whatToValidate: [
      'Actualidad de la información cuando se usó búsqueda',
      'Interpretación correcta de gráficos e imágenes',
      'Que las recomendaciones no contradigan datos internos'
    ],
    considerations: [
      'La integración con el ecosistema Google puede ser una ventaja o un requisito de organización',
      'Verificar disponibilidad de funciones según región y plan',
      'Revisar políticas de datos de la organización'
    ],
    categories: ['asistencia-general', 'investigacion', 'documentos', 'multimodalidad', 'datos', 'generacion-contenido', 'analisis'],
    strengths: ['Multimodalidad', 'Integración Google', 'Análisis visual', 'Síntesis'],
    note: 'Las funciones y límites pueden variar según modelo, plan, cuenta y fecha.'
  },
  {
    id: 'claude',
    name: 'Claude',
    shortName: 'Claude',
    type: 'Asistente orientado a razonamiento, documentos largos y análisis cuidadoso',
    description: 'Asistente conocido por su capacidad de trabajar con contextos extensos, documentos largos y un estilo de respuesta reflexivo. Útil para análisis detallados y trabajo con textos extensos.',
    usefulFor: [
      'Análisis de documentos extensos',
      'Resúmenes y extracción de información clave',
      'Razonamiento estructurado',
      'Comparación de textos',
      'Redacción cuidadosa y revisión'
    ],
    informationTypes: [
      'Documentos largos (PDF, texto)',
      'Conocimiento general del modelo',
      'Múltiples archivos en un mismo contexto (según límites)',
      'Código y datos estructurados en texto'
    ],
    businessExample: 'Gerencia necesita comparar tres propuestas de proveedores en PDF y obtener una matriz de diferencias, riesgos y puntos de atención.',
    whatToValidate: [
      'Que no se hayan omitido cláusulas o datos críticos',
      'Precisión en la extracción de cifras o condiciones',
      'Que las conclusiones estén respaldadas por el texto fuente'
    ],
    considerations: [
      'Excelente para documentos, pero verificar límites de contexto del plan',
      'No asume acceso automático a Internet en todos los modos',
      'Útil cuando se prioriza profundidad sobre velocidad de respuesta'
    ],
    categories: ['documentos', 'analisis', 'asistencia-general', 'generacion-contenido'],
    strengths: ['Contextos largos', 'Análisis de documentos', 'Razonamiento cuidadoso', 'Comparaciones'],
    note: 'Las funciones y límites pueden variar según modelo, plan, cuenta y fecha.'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    shortName: 'Perplexity',
    type: 'Asistente orientado a investigación con fuentes',
    description: 'Herramienta diseñada principalmente para investigar información en Internet y presentar respuestas con referencias a fuentes. Especialmente útil cuando la actualidad y la trazabilidad de la información son prioritarias.',
    usefulFor: [
      'Investigación de mercado y tendencias',
      'Búsqueda de información actualizada',
      'Obtención de respuestas con fuentes citadas',
      'Exploración de temas con contraste de información',
      'Preparación de bases documentales para informes'
    ],
    informationTypes: [
      'Internet y fuentes web',
      'Conocimiento general',
      'Archivos subidos (según plan)',
      'Fuentes seleccionadas en modo de investigación'
    ],
    businessExample: 'El equipo de estrategia necesita conocer tendencias recientes del mercado de retail en la región y obtener fuentes verificables para un informe ejecutivo.',
    whatToValidate: [
      'Calidad y reputación de las fuentes citadas',
      'Actualidad de las referencias',
      'Que no se presenten como hechos afirmaciones no respaldadas',
      'Coherencia entre fuentes cuando hay divergencias'
    ],
    considerations: [
      'Fuerte orientada a investigación externa; menos enfocada en conocimiento interno de la empresa',
      'Siempre revisar las fuentes, no solo el resumen',
      'Las capacidades de archivos y pro dependen del plan'
    ],
    categories: ['investigacion', 'conocimiento-fuentes', 'asistencia-general'],
    strengths: ['Fuentes citadas', 'Investigación actual', 'Trazabilidad', 'Contraste de información'],
    note: 'Las funciones y límites pueden variar según modelo, plan, cuenta y fecha.'
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    shortName: 'NotebookLM',
    type: 'Asistente orientado a trabajo fundamentado en fuentes seleccionadas',
    description: 'Herramienta diseñada para trabajar principalmente a partir de documentos y fuentes que el usuario proporciona. Ideal para consultar conocimiento interno, manuales, reportes y material seleccionado sin depender prioritariamente de conocimiento general abierto.',
    usefulFor: [
      'Consultar procedimientos y manuales internos',
      'Resumir y relacionar múltiples documentos propios',
      'Preparar respuestas basadas en fuentes controladas',
      'Estudiar material de formación o reportes internos',
      'Generar guías a partir de documentación existente'
    ],
    informationTypes: [
      'Documentos subidos por el usuario (PDF, texto, etc.)',
      'Fuentes seleccionadas explícitamente',
      'Material de Google Drive (según integración)',
      'Conocimiento limitado al corpus cargado'
    ],
    businessExample: 'NOVA tiene cinco manuales de procedimientos y quiere que el equipo pueda consultar "¿cuál es el proceso de aprobación de compras?" basándose solo en esos documentos.',
    whatToValidate: [
      'Que la respuesta se base efectivamente en los documentos cargados',
      'Que no se introduzca información externa no solicitada',
      'Cobertura: si los documentos realmente contienen la respuesta',
      'Actualización de los documentos fuente'
    ],
    considerations: [
      'Excelente cuando el conocimiento está en documentos controlados',
      'La calidad depende de la calidad y completitud de las fuentes cargadas',
      'No sustituye un sistema de gestión documental formal en todos los casos'
    ],
    categories: ['conocimiento-fuentes', 'documentos', 'analisis'],
    strengths: ['Fuentes controladas', 'Conocimiento interno', 'Trazabilidad a documentos', 'Reducción de alucinaciones externas'],
    note: 'Las funciones y límites pueden variar según modelo, plan, cuenta y fecha. NotebookLM forma parte del ecosistema Gemini/Google.'
  }
];

export const categories = [
  { id: 'asistencia-general', name: 'Asistencia general', description: 'Conversación, ideación, estructuración y tareas cotidianas de apoyo.', icon: 'MessageSquare' },
  { id: 'investigacion', name: 'Investigación', description: 'Explorar mercados, tendencias, competidores e información actual.', icon: 'Search' },
  { id: 'documentos', name: 'Documentos', description: 'Analizar, resumir, comparar y extraer información de archivos.', icon: 'FileText' },
  { id: 'datos', name: 'Datos', description: 'Trabajar con hojas de cálculo, tablas y datos estructurados.', icon: 'Table' },
  { id: 'multimodalidad', name: 'Multimodalidad', description: 'Combinar texto, imágenes, audio u otros formatos.', icon: 'Layers' },
  { id: 'conocimiento-fuentes', name: 'Conocimiento basado en fuentes', description: 'Trabajar a partir de documentos o fuentes seleccionadas.', icon: 'BookOpen' },
  { id: 'generacion-contenido', name: 'Generación de contenido', description: 'Crear textos, borradores, mensajes y materiales.', icon: 'PenTool' },
  { id: 'analisis', name: 'Análisis', description: 'Interpretar, comparar, extraer insights y razonar sobre información.', icon: 'BarChart3' }
];

export const needsOptions = [
  { id: 'investigar-mercado', label: 'Investigar un mercado', category: 'investigacion' },
  { id: 'analizar-documentos', label: 'Analizar documentos', category: 'documentos' },
  { id: 'resumir', label: 'Resumir información', category: 'documentos' },
  { id: 'trabajar-datos', label: 'Trabajar con datos', category: 'datos' },
  { id: 'generar-contenido', label: 'Generar contenido', category: 'generacion-contenido' },
  { id: 'analizar-imagenes', label: 'Analizar imágenes', category: 'multimodalidad' },
  { id: 'consultar-interna', label: 'Consultar información interna', category: 'conocimiento-fuentes' },
  { id: 'comparar', label: 'Comparar alternativas', category: 'analisis' },
  { id: 'preparar-informe', label: 'Preparar un informe', category: 'analisis' },
  { id: 'encontrar-fuentes', label: 'Encontrar fuentes', category: 'investigacion' }
];

export const infoSources = [
  { id: 'internet', label: 'Internet' },
  { id: 'documentos', label: 'Mis documentos' },
  { id: 'hoja-calculo', label: 'Hoja de cálculo' },
  { id: 'imagenes', label: 'Imágenes' },
  { id: 'varias', label: 'Varias fuentes' },
  { id: 'ninguna', label: 'Aún no tengo información' }
];

export const riskLevels = [
  { id: 'bajo', label: 'Bajo', color: 'green', example: 'Ideas para una campaña interna' },
  { id: 'medio', label: 'Medio', color: 'yellow', example: 'Comparación de proveedores' },
  { id: 'alto', label: 'Alto', color: 'red', example: 'Información financiera, legal, contractual o decisiones críticas' }
];

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(t => t.categories.includes(categoryId));
}

export function getToolById(id: ToolId): Tool | undefined {
  return tools.find(t => t.id === id);
}
