import type { Node, Edge } from "reactflow";
import type { CareerRoadmap, RoadmapStage, StageDetail } from "./roadmapData";

type ScraperCycle = {
  cycle: number;
  courses: string[];
};

type ScraperData = {
  id: string;
  career: string;
  total_cycles: number;
  cycles: ScraperCycle[];
};

const CYCLE_ICONS = [
  "📚", "📖", "📝", "🔬", "💻", "⚙️", "🧪", "🎓", "📋", "🏆",
  "🔧", "📐", "🎯", "📜",
];

const HORIZONTAL_GAP = 220;
const BASE_X = 40;
const ROW_Y = 300;

function col(i: number) {
  return BASE_X + i * HORIZONTAL_GAP;
}

function chunkCourses(courses: string[], maxPerSection = 6): string[][] {
  if (courses.length <= maxPerSection) return [courses];
  const chunks: string[][] = [];
  for (let i = 0; i < courses.length; i += maxPerSection) {
    chunks.push(courses.slice(i, i + maxPerSection));
  }
  return chunks;
}

export function scraperToRoadmap(scraperData: ScraperData): CareerRoadmap {
  const color = "#534AB7";

  const cycleStages: RoadmapStage[] = scraperData.cycles.map((cycle, i) => {
    const icon = CYCLE_ICONS[i] ?? "📌";
    const courseChunks = chunkCourses(cycle.courses);
    const details: StageDetail[] = courseChunks.map((chunk, j) => ({
      title: j === 0 ? "Materias" : `Materias (${j + 1})`,
      items: chunk,
    }));

    return {
      id: `c${cycle.cycle}`,
      label: `Ciclo ${cycle.cycle}`,
      description: `${cycle.courses.length} cursos`,
      duration: `Ciclo ${cycle.cycle}`,
      icon,
      color,
      details,
    };
  });

  const extraStages: RoadmapStage[] = [
    {
      id: "practicas",
      label: "Prácticas Preprofesionales",
      description: "Experiencia en empresa o institución",
      duration: "6-12 meses",
      icon: "🏢",
      color: "#22c55e",
      details: [
        { title: "Experiencia", items: ["Prácticas en empresa del sector", "Proyectos reales con clientes", "Mentoría profesional", " networking laboral"] },
        { title: "Preparación", items: ["Portafolio actualizado", "CV profesional", "LinkedIn optimizado", "Simulacros de entrevista"] },
      ],
    },
    {
      id: "tesis",
      label: "Tesis / Proyecto Final",
      description: "Investigación o proyecto de grado",
      duration: "6-12 meses",
      icon: "📝",
      color: "#f59e0b",
      details: [
        { title: "Opciones", items: ["Tesis de investigación", "Proyecto de desarrollo", "Exposición ante jurado", "Publicación académica"] },
        { title: "Preparación", items: ["Bibliografía revisada", "Metodología definida", "Avances presentados", "Revisión del asesor"] },
      ],
    },
    {
      id: "habilitacion",
      label: "Habilitación Profesional",
      description: "Certificación y colegiatura",
      duration: "3-6 meses",
      icon: "✅",
      color: "#06b6d4",
      details: [
        { title: "Requisitos", items: ["Título universitario", "Examen de habilitación", "Colegiatura profesional", "Seguro (si aplica)"] },
        { title: "Pasos", items: ["Inscribirse en colegio profesional", "Preparar documentación", "Rendir examen", "Obtener carné de ejercicio"] },
      ],
    },
    {
      id: "ejercicio",
      label: "Ejercicio Profesional",
      description: "Tu carrera profesional comienza",
      duration: "∞",
      icon: "🚀",
      color: "#8b5cf6",
      details: [
        { title: "Opciones", items: ["Empresa privada", "Emprendimiento propio", "Sector público", "Freelance / Consultoría"] },
        { title: "Crecimiento", items: ["Especialización continua", "Posgrados y diplomados", "Certificaciones internacionales", "Red profesional"] },
      ],
    },
  ];

  const allStages = [...cycleStages, ...extraStages];

  const nodes: Node[] = allStages.map((stage, i) => ({
    id: stage.id,
    position: { x: col(i), y: ROW_Y },
    data: { label: stage.id },
    type: "careerNode",
  }));

  const edges: Edge[] = [];
  for (let i = 0; i < allStages.length - 1; i++) {
    edges.push({
      id: `e${allStages[i].id}-${allStages[i + 1].id}`,
      source: allStages[i].id,
      target: allStages[i + 1].id,
      animated: true,
      style: { stroke: color, strokeWidth: 2 },
    });
  }

  return { stages: allStages, nodes, edges };
}
