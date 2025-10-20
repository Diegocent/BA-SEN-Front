# Business Analytics Frontend

Este proyecto es el frontend de la plataforma de análisis de datos de ayudas, desarrollado con React, TypeScript y Vite. Su objetivo es visualizar, analizar y explorar datos relacionados con eventos, ayudas y su distribución geográfica y temporal en Paraguay.

## Estructura del Proyecto

- **public/**: Archivos estáticos públicos (imágenes, favicon, etc.).
- **src/**: Código fuente principal.
  - **App.tsx**: Componente raíz de la aplicación.
  - **main.tsx**: Punto de entrada de la aplicación.
  - **index.css**: Estilos globales.
  - **store.ts**: Configuración del store (posible uso de Redux o similar).
  - **vite-env.d.ts**: Tipos globales para Vite.
  - **api/**: Lógica de comunicación con el backend, organizada por dominio:
    - **api.ts**: Configuración general de la API (axios, endpoints base, etc.).
    - **eventos/**, **geografica/**, **temporal/**: Módulos para cada dominio de datos.
  - **components/**: Componentes reutilizables y visualizaciones:
    - **data-table.tsx**: Tabla de datos genérica.
    - **grafico-\*.tsx**: Diversos gráficos y visualizaciones (barras, líneas, pie, heatmap, etc.).
    - **mapa-paraguay.tsx**: Mapa interactivo de Paraguay.
    - **VisualizarDetallesGenericos.tsx**: Visualización de detalles de registros.
    - **layout/**: Componentes de layout (sidebar, main-content).
    - **sections/**: Secciones principales de la app, organizadas por tipo de análisis:
      - **AnalisisEventos/**, **AnalisisGeografico/**, **AnalisisTemporal/**, **ResumenGeneral/**: Cada una con su componente principal y constantes asociadas.
    - **ui/**: Componentes de interfaz de usuario (botón, tarjeta, diálogo, input, tabla, tooltip).
  - **constants/**: Constantes globales.
  - **hooks/**: Custom hooks para lógica reutilizable.
  - **lib/**: Utilidades y helpers (formateo, generación de PDF, etc.).
- **styles/**: Estilos globales (Tailwind, CSS).

## Principales Librerías Utilizadas

- **React**: Librería principal para la construcción de interfaces.
- **TypeScript**: Tipado estático para mayor robustez.
- **Vite**: Bundler y servidor de desarrollo rápido.
- **Tailwind CSS**: Framework de utilidades CSS para estilos rápidos y responsivos.
- **Axios**: Cliente HTTP para comunicación con el backend.
- **Otras**: Posiblemente librerías de gráficos como Chart.js, Recharts, o similares (ver `package.json`).

## Funcionamiento General

La aplicación consume datos desde el backend (API REST) y los presenta en diferentes visualizaciones interactivas. Cada gráfico sigue un flujo general:

1. **Obtención de datos**: Cada componente gráfico utiliza hooks generados por RTK Query (ej: `useGetAnualQuery`, `useAsistenciasPorEventoQuery`, etc.) que llaman a endpoints específicos del backend, pasando parámetros como fechas, filtros o paginación.
2. **Procesamiento**: Los datos recibidos (normalmente en formato paginado o como arrays) se procesan en el frontend para:

- Agrupar, ordenar o filtrar según la visualización.
- Calcular totales, porcentajes, tendencias, picos, promedios, etc.
- Adaptar los datos al formato requerido por la librería de gráficos (ECharts).

3. **Visualización**: Se configuran las opciones del gráfico (series, ejes, leyendas, tooltips, colores) y se renderiza usando `echarts-for-react`.

### Ejemplo de flujo en gráficos principales

- **GraficoAnualAyudas**: Llama a `/anual/` para obtener totales de ayudas por año y tipo. Procesa los datos para apilar las barras por tipo de ayuda y mostrar la evolución anual.
- **GraficoMensual**: Llama a `/mensual/` para obtener totales mensuales. Calcula el pico máximo, tendencia, promedio y variabilidad, y muestra la evolución mes a mes.
- **GraficoAyudasPorEvento**: Llama a `/asistencias-por-evento/` para obtener la cantidad de ayudas distribuidas por tipo de evento. Ordena y calcula porcentajes para mostrar la importancia relativa de cada evento.
- **GraficoDistribucionAnualProducto**: Llama a `/distribucion-anual-producto/` filtrando por producto, para mostrar la evolución anual de un producto específico.
- **GraficoDistribucionAyudasPorDepartamento**: Llama a `/por-departamento/` y apila los diferentes tipos de ayuda por departamento.
- **GraficoTendenciaMensual**: Llama a `/tendencia-mensual-asistencias/` y grafica la tendencia temporal de asistencias.
- **GraficoComposicionAyudasPorEvento**: Llama a `/composicion-ayudas-por-evento/` y apila los tipos de ayuda por evento.
- **GraficoComparacionEventosAnio**: Llama a `/ocurrencias-evento-anual/` y compara la cantidad de eventos por año y tipo.
- **GraficoEvolucionAyudasTopDepartamentos**: Llama a `/asistencias-por-anio-departamento/`, agrupa y selecciona los departamentos con mayor cantidad de ayudas para mostrar su evolución.
- **GraficoTopLocalidades**: Llama a `/eventos-por-localidad/` y muestra el top de localidades con más eventos.
- **GraficoPieEventos**: Llama a `/por-evento/` y calcula la proporción de cada tipo de evento para visualización tipo pie.

### Detalles técnicos

- Todos los gráficos usan ECharts vía `echarts-for-react` para flexibilidad y alto rendimiento.
- Los hooks de datos están generados por RTK Query y permiten cacheo, revalidación y manejo automático de estados de carga/error.
- Los parámetros de los endpoints (fechas, filtros, paginación) se pasan desde los props de los componentes, permitiendo visualizaciones dinámicas y filtrables.
- El procesamiento de datos se realiza en el frontend para adaptar la respuesta de la API a las necesidades de cada gráfico.

### Relación con el backend

Cada gráfico está vinculado a uno o varios endpoints REST del backend. La estructura de los datos y los filtros disponibles dependen de la implementación de la API en Django REST Framework.

## Scripts y Comandos

- `pnpm install`: Instala las dependencias.
- `pnpm dev`: Inicia el servidor de desarrollo.
- `pnpm build`: Genera la build de producción.

## Configuración y Archivos Clave

- **vite.config.ts**: Configuración de Vite.
- **tailwind.config.js**: Configuración de Tailwind CSS.
- **tsconfig.json**: Configuración de TypeScript.
- **Dockerfile**: Permite contenerizar la aplicación para despliegue.

## Notas Adicionales

- El proyecto está preparado para escalar y agregar nuevas visualizaciones o secciones.
- Se recomienda revisar los archivos de configuración y el `package.json` para detalles de dependencias y scripts adicionales.

---

# Estructura de carpetas

```
businessAnalitycs/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── ...
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── ...
```
