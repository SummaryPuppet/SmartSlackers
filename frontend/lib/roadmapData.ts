import type { Node, Edge } from "reactflow";

export type StageDetail = {
  title: string;
  items: string[];
};

export type RoadmapStage = {
  id: string;
  label: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
  details: StageDetail[];
};

export type CareerRoadmap = {
  stages: RoadmapStage[];
  nodes: Node[];
  edges: Edge[];
};

const H_GAP = 220;
const BASE_X = 40;
const ROW_Y = 300;

function col(i: number) {
  return BASE_X + i * H_GAP;
}

export const roadmapData: Record<string, CareerRoadmap> = {
  software: {
    stages: [
      {
        id: "s1", label: "Fundamentos", description: "Lógica, algoritmos y estructuras de datos", duration: "6 meses", icon: "📚", color: "#534AB7",
        details: [
          { title: "Aprende", items: ["Pseudocódigo y diagramas de flujo", "Complejidad Big O", "Arrays, linked lists, stacks, queues", "Recursión y búsqueda binaria"] },
          { title: "Recursos", items: ["freeCodeCamp (gratis)", "CS50 de Harvard (gratis)", "Libro: Introducción a Algoritmos (CLRS)"] },
          { title: "Practica", items: ["LeetCode Easy (50+ problemas)", "HackerRank 30 Days of Code", "Crea un calendario de estudio semanal"] },
        ],
      },
      {
        id: "s2", label: "Frontend", description: "HTML, CSS, JavaScript y frameworks como React", duration: "4 meses", icon: "🖥️", color: "#6C5CE7",
        details: [
          { title: "Domina", items: ["HTML semántico y CSS Flexbox/Grid", "JavaScript moderno (ES6+)", "React hooks y componentes", "Tailwind CSS oStyled Components"] },
          { title: "Proyectos", items: ["Landing page responsiva", "To-do app con estado local", "Buscador de APIs públicas", "Mini e-commerce con carrito"] },
          { title: "Herramientas", items: ["VS Code + extensiones", "Git y GitHub básico", "Chrome DevTools", "npm/yarn"] },
        ],
      },
      {
        id: "s3", label: "Backend", description: "Node.js, bases de datos y APIs REST", duration: "4 meses", icon: "⚙️", color: "#7C6CF7",
        details: [
          { title: "Aprende", items: ["Node.js y Express.js", "RESTful API design", "Autenticación JWT", "Patrones MVC y Clean Architecture"] },
          { title: "Bases de datos", items: ["PostgreSQL o MySQL (SQL)", "MongoDB (NoSQL)", "ORMs: Prisma o Sequelize", "Migraciones y seeders"] },
          { title: "Deploy", items: ["Railway / Render / Vercel", "Docker básico", "Variables de entorno", "CI/CD con GitHub Actions"] },
        ],
      },
      {
        id: "s4", label: "Portafolio", description: "Crea tu portafolio con proyectos reales", duration: "3 meses", icon: "🚀", color: "#8C7CFF",
        details: [
          { title: "Proyectos clave", items: ["App Full Stack (CRUD completo)", " clone de una app real (Twitter, Netflix)", "Sistema de autenticación completo", "Integración con APIs de pago"] },
          { title: "Presentación", items: ["GitHub con README profesional", "Portfolio web personal", "Deploy en Vercel o Netlify", "Documentación clara del código"] },
        ],
      },
      {
        id: "s5", label: "Especialización", description: "IA, Cloud, DevOps o Seguridad", duration: "3+ meses", icon: "🎯", color: "#534AB7",
        details: [
          { title: "Campos", items: ["Machine Learning / IA (Python, TensorFlow)", "Cloud (AWS, GCP, Azure)", "DevOps (Docker, K8s, CI/CD)", "Ciberseguridad (pentesting, OWASP)"] },
          { title: "Certificaciones", items: ["AWS Cloud Practitioner", "Google Cloud Associate", "Kubernetes (CKA)", "CompTIA Security+"] },
        ],
      },
    ],
    nodes: [
      { id: "s1", position: { x: col(0), y: ROW_Y }, data: { label: "s1" }, type: "careerNode" },
      { id: "s2", position: { x: col(1), y: ROW_Y }, data: { label: "s2" }, type: "careerNode" },
      { id: "s3", position: { x: col(2), y: ROW_Y }, data: { label: "s3" }, type: "careerNode" },
      { id: "s4", position: { x: col(3), y: ROW_Y }, data: { label: "s4" }, type: "careerNode" },
      { id: "s5", position: { x: col(4), y: ROW_Y }, data: { label: "s5" }, type: "careerNode" },
    ],
    edges: [
      { id: "e1-2", source: "s1", target: "s2", animated: true, style: { stroke: "#534AB7", strokeWidth: 2 } },
      { id: "e1-3", source: "s1", target: "s3", animated: true, style: { stroke: "#534AB7", strokeWidth: 2 } },
      { id: "e2-4", source: "s2", target: "s4", animated: true, style: { stroke: "#6C5CE7", strokeWidth: 2 } },
      { id: "e3-4", source: "s3", target: "s4", animated: true, style: { stroke: "#7C6CF7", strokeWidth: 2 } },
      { id: "e4-5", source: "s4", target: "s5", animated: true, style: { stroke: "#8C7CFF", strokeWidth: 2 } },
    ],
  },

  medicina: {
    stages: [
      {
        id: "m1", label: "Pregrado", description: "Carrera de Medicina Humana", duration: "6 años", icon: "📖", color: "#1D9E75",
        details: [
          { title: "Materias clave", items: ["Anatomía y Fisiología", "Bioquímica y Farmacología", "Patología General", "Semiología y Semiología Quirúrgica"] },
          { title: "Preparación", items: ["Ingresa a una universidad acreditada", "Dedicación de 8+ horas diarias de estudio", "Prácticas en laboratorio desde el 1er año", "Grupo de estudio obligatorio"] },
        ],
      },
      {
        id: "m2", label: "Internado", description: "Rotaciones hospitalarias generales", duration: "1 año", icon: "🏥", color: "#27AE60",
        details: [
          { title: "Rotaciones", items: ["Medicina Interna (2 meses)", "Cirugía General (2 meses)", "Pediatría (2 meses)", "Ginecología y Obstetricia (2 meses)", "Emergencias (2 meses)"] },
          { title: "Aprende", items: ["Anamnesis y exploración física", "Toma de decisiones clínicas", "Manejo de urgencias", "Trabajo en equipo multidisciplinario"] },
        ],
      },
      {
        id: "m3", label: "Servicio Rural", description: "Atención primaria en zonas rurales", duration: "1-2 años", icon: "🌿", color: "#2ECC71",
        details: [
          { title: "Experiencia", items: ["Atención primaria en comunidades alejadas", "Prevención y promoción de salud", "Manejo de patologías frecuentes", "Trabajo con recursos limitados"] },
          { title: "Beneficios", items: ["Compromiso social real", "Autonomía clínica desde el inicio", "Requisito para especialización", "Contacto directo con pacientes"] },
        ],
      },
      {
        id: "m4", label: "Especialización", description: "Cardiología, pediatría, cirugía...", duration: "3-5 años", icon: "🔬", color: "#1D9E75",
        details: [
          { title: "Opciones", items: ["Medicina Interna (3 años)", "Cardiología (3 años)", "Pediatría (3 años)", "Cirugía General (4 años)", "Dermatología, Neurología, etc."] },
          { title: "Requisitos", items: ["ENAM o examen de ingreso", "CV con publicaciones y congresos", "Entrevista personal", "Alto promedio académico"] },
        ],
      },
      {
        id: "m5", label: "Ejercicio", description: "Consulta privada o institucional", duration: "∞", icon: "👨‍⚕️", color: "#16A085",
        details: [
          { title: "Opciones", items: ["Consulta privada propia", "Hospital público o privado", "Investigación médica", "Docencia universitaria", "Salud ocupacional"] },
          { title: "Ingreso", items: ["S/. 8,000 – 25,000+ mensuales", "Varía según especialidad y experiencia", "Mayor ingreso en especialidades quirúrgicas"] },
        ],
      },
    ],
    nodes: [
      { id: "m1", position: { x: col(0), y: ROW_Y }, data: { label: "m1" }, type: "careerNode" },
      { id: "m2", position: { x: col(1), y: ROW_Y }, data: { label: "m2" }, type: "careerNode" },
      { id: "m3", position: { x: col(2), y: ROW_Y }, data: { label: "m3" }, type: "careerNode" },
      { id: "m4", position: { x: col(3), y: ROW_Y }, data: { label: "m4" }, type: "careerNode" },
      { id: "m5", position: { x: col(4), y: ROW_Y }, data: { label: "m5" }, type: "careerNode" },
    ],
    edges: [
      { id: "em1-2", source: "m1", target: "m2", animated: true, style: { stroke: "#1D9E75", strokeWidth: 2 } },
      { id: "em2-3", source: "m2", target: "m3", animated: true, style: { stroke: "#27AE60", strokeWidth: 2 } },
      { id: "em3-4", source: "m3", target: "m4", animated: true, style: { stroke: "#2ECC71", strokeWidth: 2 } },
      { id: "em4-5", source: "m4", target: "m5", animated: true, style: { stroke: "#1D9E75", strokeWidth: 2 } },
    ],
  },

  diseno: {
    stages: [
      {
        id: "d1", label: "Fundamentos", description: "Teoría del color, tipografía, composición", duration: "3 meses", icon: "🎨", color: "#D4537E",
        details: [
          { title: "Aprende", items: ["Teoría del color y armonías", "Tipografía y jerarquía visual", "Composición y regla de tercios", "Psicología del diseño"] },
          { title: "Recursos", items: ["Google Fonts (tipografías)", "Coolors.co (paletas de color)", "Libro: Diseño Gráfico: Los fundamentos", "Canal The Futur (YouTube)"] },
        ],
      },
      {
        id: "d2", label: "Herramientas", description: "Figma, Adobe XD, Photoshop, Illustrator", duration: "3 meses", icon: "🖌️", color: "#E84393",
        details: [
          { title: "Domina", items: ["Figma (principal)", "Componentes y auto layout", "Prototipos interactivos", "Design systems básicos"] },
          { title: "Complementos", items: ["Photoshop para edición de imagen", "Illustrator para iconos vectoriales", "After Effects para motion básico", "Illustrator para logos"] },
        ],
      },
      {
        id: "d3", label: "UX Research", description: "Investigación de usuarios, tests de usabilidad", duration: "2 meses", icon: "🔍", color: "#FD79A8",
        details: [
          { title: "Métodos", items: ["Entrevistas a usuarios", "Tests de usabilidad", "Análisis de competencia", "Personas y user journeys"] },
          { title: "Herramientas", items: ["Maze (tests remotos)", "Hotjar (heatmaps)", "Google Analytics", "Optimal Workshop"] },
        ],
      },
      {
        id: "d4", label: "Portafolio", description: "Crea 5-6 proyectos reales para mostrar", duration: "3 meses", icon: "💼", color: "#D4537E",
        details: [
          { title: "Proyectos", items: ["Rediseño de app existente", "App móvil desde cero", "Sitio web responsive", "Sistema de diseño personal"] },
          { title: "Presentación", items: ["Case studies detallados", "Proceso de diseño documentado", "Resultados y métricas", "Behance o portfolio web"] },
        ],
      },
      {
        id: "d5", label: "Especialización", description: "UI, UX, Motion Design o Product Design", duration: "2+ meses", icon: "🎯", color: "#C44569",
        details: [
          { title: "Campos", items: ["UI Design (interfaces visuales)", "UX Design (investigación y flujo)", "Motion Design (animaciones)", "Product Design (visión de negocio)"] },
          { title: "Certificaciones", items: ["Google UX Design Certificate", "Nielsen Norman Group", "Interaction Design Foundation", "Coursera / Udemy"] },
        ],
      },
    ],
    nodes: [
      { id: "d1", position: { x: col(0), y: ROW_Y }, data: { label: "d1" }, type: "careerNode" },
      { id: "d2", position: { x: col(1), y: ROW_Y }, data: { label: "d2" }, type: "careerNode" },
      { id: "d3", position: { x: col(2), y: ROW_Y }, data: { label: "d3" }, type: "careerNode" },
      { id: "d4", position: { x: col(3), y: ROW_Y }, data: { label: "d4" }, type: "careerNode" },
      { id: "d5", position: { x: col(4), y: ROW_Y }, data: { label: "d5" }, type: "careerNode" },
    ],
    edges: [
      { id: "ed1-2", source: "d1", target: "d2", animated: true, style: { stroke: "#D4537E", strokeWidth: 2 } },
      { id: "ed2-3", source: "d2", target: "d3", animated: true, style: { stroke: "#E84393", strokeWidth: 2 } },
      { id: "ed2-4", source: "d2", target: "d4", animated: true, style: { stroke: "#E84393", strokeWidth: 2 } },
      { id: "ed3-5", source: "d3", target: "d5", animated: true, style: { stroke: "#FD79A8", strokeWidth: 2 } },
      { id: "ed4-5", source: "d4", target: "d5", animated: true, style: { stroke: "#D4537E", strokeWidth: 2 } },
    ],
  },

  derecho: {
    stages: [
      {
        id: "dr1", label: "Pregrado", description: "Carrera de Derecho", duration: "5 años", icon: "📖", color: "#BA7517",
        details: [
          { title: "Materias clave", items: ["Derecho Civil y Obligaciones", "Derecho Penal", "Derecho Constitucional", "Derecho Laboral y Administrativo"] },
          { title: "Desarrolla", items: ["Habilidad argumentativa oral y escrita", "Lectura crítica de sentencias", "Investigación jurídica (lexislaw)", "Redacción de escritos forenses"] },
        ],
      },
      {
        id: "dr2", label: "Prácticas", description: "Clínicas jurídicas o estudios de abogados", duration: "1 año", icon: "⚖️", color: "#D4A017",
        details: [
          { title: "Experiencia", items: ["Clínica jurídica universitaria", "Estudio de abogados (litigio)", "Ministerio Público", "Defensoría del Pueblo"] },
          { title: "Aprende", items: ["Atención al ciudadano", "Redacción de demandas y recursos", "Estrategia de litigio", "Negociación y mediación"] },
        ],
      },
      {
        id: "dr3", label: "Especialización", description: "Civil, penal, laboral, constitucional", duration: "1-2 años", icon: "📚", color: "#BA7517",
        details: [
          { title: "Opciones", items: ["Derecho Civil y Familia", "Derecho Penal y Criminología", "Derecho Laboral", "Derecho Constitucional e Internacional"] },
          { title: "Posgrado", items: ["Maestría en Derecho", "Especialización tributaria", "Diplomado en Derecho Digital", "Certificación en arbitraje"] },
        ],
      },
      {
        id: "dr4", label: "Habilitación", description: "Examen de licencia para ejercer", duration: "6 meses", icon: "✅", color: "#C9A020",
        details: [
          { title: "Preparación", items: ["Estudiar leyes y códigos vigentes", "Resolver exámenes de años anteriores", "Grupo de estudio con compañeros", "Cursos preparatorios (2-3 meses)"] },
          { title: "Requisitos", items: ["Título universitario", "Examen de habilitación del Colegio", "Ética profesional", "Seguro de responsabilidad civil"] },
        ],
      },
      {
        id: "dr5", label: "Ejercicio", description: "Bufete propio, empresa o sector público", duration: "∞", icon: "🏛️", color: "#A66B10",
        details: [
          { title: "Opciones", items: ["Bufete propio (litigio)", "Legal department en empresa", "Fiscalía o Poder Judicial", "Consultoría jurídica", "Derecho internacional"] },
          { title: "Ingreso", items: ["S/. 4,000 – 15,000+ mensuales", "Mayor ingreso en corporativo", "Litigio puede ser más variable"] },
        ],
      },
    ],
    nodes: [
      { id: "dr1", position: { x: col(0), y: ROW_Y }, data: { label: "dr1" }, type: "careerNode" },
      { id: "dr2", position: { x: col(1), y: ROW_Y }, data: { label: "dr2" }, type: "careerNode" },
      { id: "dr3", position: { x: col(2), y: ROW_Y }, data: { label: "dr3" }, type: "careerNode" },
      { id: "dr4", position: { x: col(3), y: ROW_Y }, data: { label: "dr4" }, type: "careerNode" },
      { id: "dr5", position: { x: col(4), y: ROW_Y }, data: { label: "dr5" }, type: "careerNode" },
    ],
    edges: [
      { id: "edr1-2", source: "dr1", target: "dr2", animated: true, style: { stroke: "#BA7517", strokeWidth: 2 } },
      { id: "edr2-3", source: "dr2", target: "dr3", animated: true, style: { stroke: "#D4A017", strokeWidth: 2 } },
      { id: "edr3-4", source: "dr3", target: "dr4", animated: true, style: { stroke: "#BA7517", strokeWidth: 2 } },
      { id: "edr4-5", source: "dr4", target: "dr5", animated: true, style: { stroke: "#C9A020", strokeWidth: 2 } },
    ],
  },

  psicologia: {
    stages: [
      {
        id: "p1", label: "Pregrado", description: "Psicología General", duration: "5 años", icon: "📖", color: "#7A5A9A",
        details: [
          { title: "Materias clave", items: ["Psicología General y Social", "Psicopatología", "Neuropsicología", "Psicología del Desarrollo"] },
          { title: "Desarrolla", items: ["Escucha activa y empatía", "Observación conductual", "Técnicas de entrevista", "Pensamiento crítico"] },
        ],
      },
      {
        id: "p2", label: "Prácticas", description: "Atención directa con pacientes supervisada", duration: "1 año", icon: "🧠", color: "#9B59B6",
        details: [
          { title: "Experiencia", items: ["Centro de salud mental", "Consultorio con supervisión", "Hospital psiquiátrico", "Institución educativa"] },
          { title: "Aprende", items: ["Entrevista clínica", "Anamnesis psicológica", "Técnicas proyectivas", "Elaboración de informes"] },
        ],
      },
      {
        id: "p3", label: "Posgrado", description: "Clínica, educativa, organizacional o forense", duration: "2 años", icon: "🎓", color: "#7A5A9A",
        details: [
          { title: "Opciones", items: ["Psicología Clínica (consultorio)", "Psicología Educativa (colegios)", "Psicología Organizacional (empresas)", "Psicología Forense (peritajes)"] },
          { title: "Programas", items: ["Maestría en Psicología Clínica", "Especialización en Terapia Cognitiva", "Diplomado en Neuropsicología", "Certificación en Terapia de Pareja"] },
        ],
      },
      {
        id: "p4", label: "Certificaciones", description: "Terapias específicas (CBT, sistémica...)", duration: "6-12 meses", icon: "📜", color: "#8E6BAF",
        details: [
          { title: "Terapias", items: ["Terapia Cognitivo-Conductual (CBT)", "Terapia Sistémica Familiar", "Terapia de Aceptación y Compromiso (ACT)", "EMDR para trauma"] },
          { title: "Certificaciones", items: ["Certificación en CBT (Beck Institute)", "Terapia Breve Centrada en Soluciones", "Mindfulness-Based Stress Reduction", "Coaching certificado (ICF)"] },
        ],
      },
      {
        id: "p5", label: "Ejercicio", description: "Consulta privada, hospital o empresa", duration: "∞", icon: "💚", color: "#6C3D8F",
        details: [
          { title: "Opciones", items: ["Consulta privada propia", "Hospital o centro de salud mental", "Empresa (Bienestar Laboral)", "Escuela o universidad", "Investigación y docencia"] },
          { title: "Ingreso", items: ["S/. 3,000 – 10,000+ mensuales", "Consulta privada: S/. 80-200 por sesión", "Mayor ingreso con especialización"] },
        ],
      },
    ],
    nodes: [
      { id: "p1", position: { x: col(0), y: ROW_Y }, data: { label: "p1" }, type: "careerNode" },
      { id: "p2", position: { x: col(1), y: ROW_Y }, data: { label: "p2" }, type: "careerNode" },
      { id: "p3", position: { x: col(2), y: ROW_Y }, data: { label: "p3" }, type: "careerNode" },
      { id: "p4", position: { x: col(3), y: ROW_Y }, data: { label: "p4" }, type: "careerNode" },
      { id: "p5", position: { x: col(4), y: ROW_Y }, data: { label: "p5" }, type: "careerNode" },
    ],
    edges: [
      { id: "ep1-2", source: "p1", target: "p2", animated: true, style: { stroke: "#7A5A9A", strokeWidth: 2 } },
      { id: "ep2-3", source: "p2", target: "p3", animated: true, style: { stroke: "#9B59B6", strokeWidth: 2 } },
      { id: "ep3-4", source: "p3", target: "p4", animated: true, style: { stroke: "#7A5A9A", strokeWidth: 2 } },
      { id: "ep3-5", source: "p3", target: "p5", animated: true, style: { stroke: "#7A5A9A", strokeWidth: 2 } },
    ],
  },

  marketing: {
    stages: [
      {
        id: "mk1", label: "Fundamentos", description: "Marketing, consumidor, market research", duration: "3 meses", icon: "📖", color: "#D85A30",
        details: [
          { title: "Aprende", items: ["Mix de Marketing (4P/7P)", "Segmentación y targeting", "Embudo de conversión", "Análisis FODA y competencia"] },
          { title: "Recursos", items: ["Google Digital Garage (gratis)", "HubSpot Academy (gratis)", "Libro: Posicionamiento de Ries y Trout", "Podcast: Marketing PM"] },
        ],
      },
      {
        id: "mk2", label: "Digital", description: "SEO, SEM, redes sociales, email marketing", duration: "3 meses", icon: "📱", color: "#E67E22",
        details: [
          { title: "Canales", items: ["SEO on-page y off-page", "Google Ads (SEM)", "Facebook/Instagram Ads", "Email marketing (Mailchimp)"] },
          { title: "Redes sociales", items: ["Estrategia de contenido", "Community management", "Influencer marketing", "Social listening"] },
        ],
      },
      {
        id: "mk3", label: "Contenido", description: "Copywriting, storytelling, branded content", duration: "2 meses", icon: "✍️", color: "#D85A30",
        details: [
          { title: "Habilidades", items: ["Copywriting persuasivo", "Storytelling de marca", "Copy para ads y landing pages", "Contenido para redes sociales"] },
          { title: "Practica", items: ["Crea 10 copies para anuncios", "Escribe 5 landings de prueba", "Crea un blog personal", "Gestiona una marca ficticia"] },
        ],
      },
      {
        id: "mk4", label: "Analytics", description: "Google Analytics, métricas, ROI", duration: "2 meses", icon: "📊", color: "#F39C12",
        details: [
          { title: "Herramientas", items: ["Google Analytics 4", "Google Tag Manager", "Meta Business Suite", "Hotjar (comportamiento)"] },
          { title: "Métricas", items: ["CAC, LTV, ROAS", "Tasa de conversión", "Engagement rate", "Attribution modeling"] },
        ],
      },
      {
        id: "mk5", label: "Especialización", description: "Performance, Branding, Growth o Gerencia", duration: "2+ meses", icon: "🎯", color: "#D35400",
        details: [
          { title: "Campos", items: ["Performance Marketing (ads)", "Branding e Identidad Corporativa", "Growth Hacking", "Gerencia de Marketing"] },
          { title: "Certificaciones", items: ["Google Ads Certification", "Meta Blueprint", "HubSpot Inbound Marketing", "Google Analytics IQ"] },
        ],
      },
    ],
    nodes: [
      { id: "mk1", position: { x: col(0), y: ROW_Y }, data: { label: "mk1" }, type: "careerNode" },
      { id: "mk2", position: { x: col(1), y: ROW_Y }, data: { label: "mk2" }, type: "careerNode" },
      { id: "mk3", position: { x: col(2), y: ROW_Y }, data: { label: "mk3" }, type: "careerNode" },
      { id: "mk4", position: { x: col(3), y: ROW_Y }, data: { label: "mk4" }, type: "careerNode" },
      { id: "mk5", position: { x: col(4), y: ROW_Y }, data: { label: "mk5" }, type: "careerNode" },
    ],
    edges: [
      { id: "emk1-2", source: "mk1", target: "mk2", animated: true, style: { stroke: "#D85A30", strokeWidth: 2 } },
      { id: "emk2-3", source: "mk2", target: "mk3", animated: true, style: { stroke: "#E67E22", strokeWidth: 2 } },
      { id: "emk2-4", source: "mk2", target: "mk4", animated: true, style: { stroke: "#E67E22", strokeWidth: 2 } },
      { id: "emk3-5", source: "mk3", target: "mk5", animated: true, style: { stroke: "#D85A30", strokeWidth: 2 } },
      { id: "emk4-5", source: "mk4", target: "mk5", animated: true, style: { stroke: "#F39C12", strokeWidth: 2 } },
    ],
  },

  arquitectura: {
    stages: [
      {
        id: "a1", label: "Pregrado", description: "Arquitectura y Urbanismo", duration: "5 años", icon: "📖", color: "#5A7A5A",
        details: [
          { title: "Materias clave", items: ["Diseño Arquitectónico", "Estructuras y Resistencia", "Urbanismo y Planificación", "Historia de la Arquitectura"] },
          { title: "Desarrolla", items: ["Visión espacial y 3D", "Creatividad y composición", "Modelado físico (maquetas)", "Software: AutoCAD, SketchUp"] },
        ],
      },
      {
        id: "a2", label: "Taller", description: "Diseño arquitectónico y maquetación", duration: "Continuo", icon: "📐", color: "#6B8E6B",
        details: [
          { title: "Practica", items: ["Diseña viviendas pequeñas", "Remodelación de espacios", "Maquetas físicas y digitales", "Presentación ante jurado"] },
          { title: "Software", items: ["AutoCAD (planos)", "SketchUp (modelado 3D)", "Revit (BIM)", "Lumion / V-Ray (render)"] },
        ],
      },
      {
        id: "a3", label: "Software", description: "AutoCAD, Revit, SketchUp, Lumion", duration: "6 meses", icon: "💻", color: "#5A7A5A",
        details: [
          { title: "Domina", items: ["AutoCAD 2D y 3D", "Revit (Building Information Modeling)", "SketchUp + V-Ray", "Lumion para renders fotorrealistas"] },
          { title: "Extra", items: ["Photoshop para postproducción", "Illustrator para planos", "Enscape (render en tiempo real)", "Rhino + Grasshopper (paramétrico)"] },
        ],
      },
      {
        id: "a4", label: "Prácticas", description: "En estudios de arquitectura o constructoras", duration: "1-2 años", icon: "🏗️", color: "#7BA07B",
        details: [
          { title: "Experiencia", items: ["Estudio de arquitectura (diseño)", "Constructora (obra)", "Municipalidad (permisos y urbanismo)", "Oficina de diseño de interiores"] },
          { title: "Aprende", items: ["Gestión de proyectos reales", "Presupuestos y planificación", "Relación con clientes", "Normativas de construcción"] },
        ],
      },
      {
        id: "a5", label: "Especialización", description: "Sostenible, interiorismo, urbanismo", duration: "1+ años", icon: "🎯", color: "#4A6A4A",
        details: [
          { title: "Campos", items: ["Arquitectura Sustentable (LEED)", "Diseño de Interiores", "Urbanismo y Planificación", "Paisajismo ( Landscape)"] },
          { title: "Certificaciones", items: ["LEED Accredited Professional", "Maestría en Arquitectura Sustentable", "Certificación en BIM", "Diplomado en Urbanismo"] },
        ],
      },
    ],
    nodes: [
      { id: "a1", position: { x: col(0), y: ROW_Y }, data: { label: "a1" }, type: "careerNode" },
      { id: "a2", position: { x: col(1), y: ROW_Y }, data: { label: "a2" }, type: "careerNode" },
      { id: "a3", position: { x: col(2), y: ROW_Y }, data: { label: "a3" }, type: "careerNode" },
      { id: "a4", position: { x: col(3), y: ROW_Y }, data: { label: "a4" }, type: "careerNode" },
      { id: "a5", position: { x: col(4), y: ROW_Y }, data: { label: "a5" }, type: "careerNode" },
    ],
    edges: [
      { id: "ea1-2", source: "a1", target: "a2", animated: true, style: { stroke: "#5A7A5A", strokeWidth: 2 } },
      { id: "ea1-3", source: "a1", target: "a3", animated: true, style: { stroke: "#5A7A5A", strokeWidth: 2 } },
      { id: "ea2-4", source: "a2", target: "a4", animated: true, style: { stroke: "#6B8E6B", strokeWidth: 2 } },
      { id: "ea3-4", source: "a3", target: "a4", animated: true, style: { stroke: "#5A7A5A", strokeWidth: 2 } },
      { id: "ea4-5", source: "a4", target: "a5", animated: true, style: { stroke: "#7BA07B", strokeWidth: 2 } },
    ],
  },

  finanzas: {
    stages: [
      {
        id: "f1", label: "Pregrado", description: "Administración, Economía o Contabilidad", duration: "5 años", icon: "📖", color: "#378ADD",
        details: [
          { title: "Materias clave", items: ["Contabilidad General y Avanzada", "Micro y Macroeconomía", "Finanzas Corporativas", "Estadística y Probabilidades"] },
          { title: "Desarrolla", items: ["Pensamiento analítico", "Modelado financiero en Excel", "Atención al detalle", "Pensamiento estratégico"] },
        ],
      },
      {
        id: "f2", label: "Fundamentos", description: "Contabilidad, micro y macroeconomía", duration: "Continuo", icon: "📊", color: "#5DADE2",
        details: [
          { title: "Domina", items: ["Estados financieros (EERR, BS, CF)", "Análisis de costos", "Presupuestos y proyecciones", "Conceptos de ROI, WACC, VPN"] },
          { title: "Herramientas", items: ["Excel avanzado (tablas dinámicas)", "Google Sheets", "Power BI o Tableau", "Software contable (SAP, Oracle)"] },
        ],
      },
      {
        id: "f3", label: "Análisis", description: "Análisis financiero, modelos y valoración", duration: "6 meses", icon: "📈", color: "#378ADD",
        details: [
          { title: "Aprende", items: ["Valuación de empresas (DCF)", "Análisis de estados financieros", "Gestión de riesgos", "Portafolio de inversión"] },
          { title: "Practica", items: ["Modelos financieros en Excel", "Simulaciones de inversión", "Análisis de case studies", "Crea tu propio portafolio de inversiones"] },
        ],
      },
      {
        id: "f4", label: "Certificaciones", description: "CFA, CPA o certificaciones especializadas", duration: "1-3 años", icon: "📜", color: "#2E86C1",
        details: [
          { title: "Opciones", items: ["CFA (Chartered Financial Analyst)", "CPA (Certified Public Accountant)", "FRM (Financial Risk Manager)", "CFP (Certified Financial Planner)"] },
          { title: "Preparación", items: ["Estudiar 300+ horas por nivel", "Resolver mock exams", "Unirse a grupos de estudio", "Cursos de preparación (Kaplan, Schweser)"] },
        ],
      },
      {
        id: "f5", label: "Ejercicio", description: "Banca, bolsa, consultoría o emprendimiento", duration: "∞", icon: "🏦", color: "#1F618D",
        details: [
          { title: "Opciones", items: ["Banca de inversión", "Asset Management / Fondos", "Consultoría financiera", "Corporate Finance en empresa", "Emprendimiento fintech"] },
          { title: "Ingreso", items: ["S/. 5,000 – 20,000+ mensuales", "Mayor ingreso en banca de inversión", "Bonos por desempeño significativos"] },
        ],
      },
    ],
    nodes: [
      { id: "f1", position: { x: col(0), y: ROW_Y }, data: { label: "f1" }, type: "careerNode" },
      { id: "f2", position: { x: col(1), y: ROW_Y }, data: { label: "f2" }, type: "careerNode" },
      { id: "f3", position: { x: col(2), y: ROW_Y }, data: { label: "f3" }, type: "careerNode" },
      { id: "f4", position: { x: col(3), y: ROW_Y }, data: { label: "f4" }, type: "careerNode" },
      { id: "f5", position: { x: col(4), y: ROW_Y }, data: { label: "f5" }, type: "careerNode" },
    ],
    edges: [
      { id: "ef1-2", source: "f1", target: "f2", animated: true, style: { stroke: "#378ADD", strokeWidth: 2 } },
      { id: "ef2-3", source: "f2", target: "f3", animated: true, style: { stroke: "#5DADE2", strokeWidth: 2 } },
      { id: "ef3-4", source: "f3", target: "f4", animated: true, style: { stroke: "#378ADD", strokeWidth: 2 } },
      { id: "ef4-5", source: "f4", target: "f5", animated: true, style: { stroke: "#2E86C1", strokeWidth: 2 } },
    ],
  },
};
