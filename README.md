# Selector de herramientas de IA

Experiencia educativa interactiva del curso **Inteligencia Artificial aplicada a la Gestión Empresarial**.

**Sesión:** INTRODUCCIÓN — Ecosistema de herramientas de IA y preparación del entorno de trabajo

## Objetivo de aprendizaje

Al finalizar, el estudiante puede responder:

> «Tengo este problema empresarial. ¿Qué tipo de herramienta de IA necesito y qué debo revisar antes de utilizar su resultado?»

## Flujo central

**NECESIDAD → TIPO DE TAREA → INFORMACIÓN → HERRAMIENTA → RESULTADO → VALIDACIÓN → IMPACTO**

## Cómo ejecutar

```bash
cd ai-tool-selector
npm install
npm run dev
```

Abre la URL que muestre Vite (normalmente http://localhost:5173).

## Estructura

- `src/data/tools.ts` — Datos configurables de herramientas (fácil de actualizar)
- `src/data/cases.ts` — Mini casos NOVA y escenarios del challenge
- `src/components/` — Componentes reutilizables de flujo, progreso, modo docente e iconografía
- `src/App.tsx` — Experiencia completa en secciones navegables

## Principios respetados

- No rankings ni «mejor IA»
- No precios ni límites numéricos fijos
- Datos de herramientas en configuración independiente
- Respuestas correctas y orientaciones disponibles en los mini casos, el semáforo de riesgo y el desafío
- Comparador con explicación de capacidades, notas sobre planes y enlaces oficiales para verificar cambios
- Modo docente con revelado de orientaciones y reinicio de actividades
- Validación y privacidad como ejes centrales
- Empresa transversal NOVA S.A.C.
- Desafío que evalúa capacidad, herramienta candidata y validación
- Ficha personal con indicador de éxito (KPI)

## Actualización de herramientas

Edita únicamente `src/data/tools.ts` para reflejar cambios de capacidades sin tocar la UI.
