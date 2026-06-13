"use client";

import { careerResults } from "@/lib/questions";
import {
  roadmapData,
  type CareerRoadmap,
  type RoadmapStage,
  type StageDetail,
} from "@/lib/roadmapData";
import { scraperToRoadmap } from "@/lib/scraperToRoadmap";
import { useRouter, useSearchParams } from "next/navigation";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  type NodeProps,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

const API_BASE = "http://127.0.0.1:8000";

type NodeData = {
  label: string;
  icon: string;
  description: string;
  duration: string;
  bg: string;
  borderColor: string;
  expanded: boolean;
};

const CareerNode = memo(function CareerNode({ data }: NodeProps<NodeData>) {
  return (
    <div
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 text-center min-w-[180px] transition-all duration-200"
      style={{
        border: `2px solid ${data.borderColor}`,
        boxShadow: `0 4px 24px ${data.borderColor}25`,
        transform: data.expanded ? "scale(1.05)" : "scale(1)",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0 }}
      />
      <div className="text-3xl mb-1.5">{data.icon}</div>
      <div className="text-base font-bold text-slate-900 mb-1">
        {data.label}
      </div>
      <div className="text-xs text-slate-500 leading-relaxed">
        {data.description}
      </div>
      <div
        className="mt-2 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
        style={{
          background: `${data.borderColor}18`,
          color: data.borderColor,
        }}
      >
        ⏱ {data.duration}
      </div>
      <div
        className="text-xs font-semibold mt-1.5"
        style={{ color: data.borderColor }}
      >
        {data.expanded ? "▲ Ocultar" : "▼ Explorar"}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0 }}
      />
    </div>
  );
});

const nodeTypes: NodeTypes = { careerNode: CareerNode };

const SECTION_ICONS: Record<string, string> = {
  Aprende: "📘",
  Domina: "🔧",
  "Materias clave": "📚",
  Desarrolla: "💪",
  Recursos: "🌐",
  Practica: "🎯",
  Herramientas: "🛠️",
  Proyectos: "🚀",
  Presentación: "💼",
  Certificaciones: "📜",
  Campos: "🧭",
  Opciones: "🔀",
  Experiencia: "📋",
  Preparación: "🏋️",
  Requisitos: "📋",
  Rotaciones: "🔄",
  Beneficios: "✨",
  Métodos: "🔬",
  Programas: "🎓",
  Habilidades: "⚡",
  Canales: "📡",
  Ingreso: "💰",
  Extra: "⭐",
  Software: "💻",
  Prácticas: "🏢",
  Terapias: "🧠",
};

function DetailPanel({
  stage,
  onClose,
}: {
  stage: RoadmapStage;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-0 right-0 bottom-0 w-[380px] z-50 bg-white/95 backdrop-blur-xl flex flex-col overflow-hidden animate-slide-in-right"
      style={{
        borderLeft: `2px solid ${stage.color}30`,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.1)",
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div
        className="p-6 flex-shrink-0"
        style={{
          borderBottom: `1px solid ${stage.color}20`,
          background: `linear-gradient(135deg, ${stage.color}12, ${stage.color}06)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: `linear-gradient(135deg, ${stage.color}30, ${stage.color}15)`,
                border: `1.5px solid ${stage.color}40`,
              }}
            >
              {stage.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                {stage.label}
              </h3>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                {stage.duration}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white cursor-pointer flex items-center justify-center text-sm text-slate-500 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-slate-600 m-0 mt-3 leading-relaxed">
          {stage.description}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-3.5">
          {stage.details.map((section: StageDetail, idx: number) => {
            const sectionIcon = SECTION_ICONS[section.title] || "📌";
            return (
              <div
                key={section.title}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4"
                style={{
                  border: `1px solid ${stage.color}18`,
                  boxShadow: `0 2px 8px ${stage.color}08`,
                }}
              >
                {/* Section header */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${stage.color}20, ${stage.color}10)`,
                    }}
                  >
                    {sectionIcon}
                  </div>
                  <h4
                    className="text-xs font-bold uppercase tracking-wide m-0"
                    style={{ color: stage.color }}
                  >
                    {section.title}
                  </h4>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: `linear-gradient(90deg, ${stage.color}25, transparent)`,
                    }}
                  />
                </div>

                {/* Items as mini cards */}
                <div className="flex flex-wrap gap-1.5">
                  {section.items.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 leading-tight px-2.5 py-1.5 rounded-lg"
                      style={{
                        background: `${stage.color}08`,
                        border: `1px solid ${stage.color}15`,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-60"
                        style={{ background: stage.color }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RoadmapPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const careerKey = searchParams.get("career") ?? "software";

  const [scrapedData, setScrapedData] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchMalla() {
      try {
        const res = await fetch(`${API_BASE}/api/scrape/${careerKey}`);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setScrapedData(scraperToRoadmap(json));
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      }
    }
    fetchMalla();
    return () => {
      cancelled = true;
    };
  }, [careerKey]);

  const data = scrapedData ?? roadmapData[careerKey];
  const career = careerResults[careerKey];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const nodes = useMemo(
    () =>
      (data?.nodes ?? []).map((n) => {
        const stage = data.stages.find((s) => s.id === n.id);
        return {
          ...n,
          type: "careerNode",
          data: {
            label: stage?.label ?? "",
            icon: stage?.icon ?? "📌",
            description: stage?.description ?? "",
            duration: stage?.duration ?? "",
            bg: `linear-gradient(135deg, ${career?.color}15, ${career?.color}08)`,
            borderColor: career?.color ?? "#ccc",
            expanded: expandedId === n.id,
          },
        };
      }),
    [data, career, expandedId],
  );

  const edges = useMemo(() => data?.edges ?? [], [data]);

  const onInit = useCallback(() => {}, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setExpandedId((prev) => (prev === node.id ? null : node.id));
    },
    [],
  );

  const expandedStage = useMemo(
    () => data?.stages.find((s) => s.id === expandedId) ?? null,
    [data, expandedId],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_24%),linear-gradient(180deg,#fff5f5_0%,#fef2f2_100%)] flex-col gap-4">
        <div className="text-4xl animate-spin">⏳</div>
        <p className="text-base text-slate-500">
          Cargando malla curricular...
        </p>
        {error && (
          <p className="text-xs text-slate-400">
            API no disponible, usando datos de ejemplo
          </p>
        )}
      </div>
    );
  }

  if (!data || !career) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_24%),linear-gradient(180deg,#fff5f5_0%,#fef2f2_100%)] flex-col gap-4">
        <p className="text-lg text-slate-600">Carrera no encontrada</p>
        <button
          onClick={() => router.push("/test")}
          className="px-6 py-3 bg-linear-to-r from-red-600 via-rose-600 to-orange-500 border-none rounded-xl text-sm font-semibold text-white cursor-pointer shadow-[0_4px_20px_rgba(220,38,38,0.25)] transition-all hover:brightness-110"
        >
          Volver al test
        </button>
      </div>
    );
  }

  return (
    <main
      className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_24%),linear-gradient(180deg,#fff5f5_0%,#fef2f2_100%)] text-slate-900 flex flex-col"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-red-300/30 blur-3xl" />
        <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-rose-300/30 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/50 bg-white/50 backdrop-blur-xl flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg text-lg font-black"
            style={{ background: `linear-gradient(135deg, ${career.color}, ${career.color}aa)` }}
          >
            {career.emoji}
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-950 m-0">
              Roadmap: {career.title}
            </h1>
            <p className="text-xs text-slate-500 m-0">
              {career.area} · {career.match}% compatibilidad
              {scrapedData && (
                <span className="ml-2 text-green-500 font-semibold">
                  ● Datos reales UTP
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/test")}
            className="px-5 py-2.5 bg-transparent border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 cursor-pointer transition-all hover:bg-white/80"
          >
            ← Volver al test
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 bg-linear-to-r from-red-600 via-rose-600 to-orange-500 border-none rounded-xl text-sm font-semibold text-white cursor-pointer shadow-[0_4px_20px_rgba(220,38,38,0.25)] transition-all hover:brightness-110"
          >
            Inicio
          </button>
        </div>
      </header>

      {/* Info bar */}
      <div className="relative z-10 flex items-center gap-6 px-8 py-3.5 border-b border-white/30 bg-white/40 backdrop-blur-sm flex-wrap">
        <div className="text-sm text-slate-600">
          <strong>Sueldo estimado:</strong> {career.salary}
        </div>
        <div className="text-sm text-slate-600">
          <strong>Habilidades clave:</strong> {career.skills.join(" · ")}
        </div>
        {scrapedData && (
          <div className="text-sm text-slate-600">
            <strong>Curso completo:</strong>{" "}
            <a
              href={`https://www.utp.edu.pe/pregrado/facultad-de-ingenieria/${careerKey}/malla-curricular`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline hover:text-indigo-500"
            >
              UTP.edu.pe
            </a>
          </div>
        )}
      </div>

      {/* Body: Flow + Side Panel */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="w-full h-full min-h-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onInit={onInit}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: expandedStage ? 0.15 : 0.25 }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            nodeTypes={nodeTypes}
          >
            <Controls
              showInteractive={false}
              className="rounded-xl overflow-hidden shadow-lg"
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="#e2e8f0"
            />
          </ReactFlow>
        </div>

        {/* Side Panel */}
        {expandedStage && (
          <DetailPanel
            stage={expandedStage}
            onClose={() => setExpandedId(null)}
          />
        )}
      </div>
    </main>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_24%),linear-gradient(180deg,#fff5f5_0%,#fef2f2_100%)]">
          <p className="text-base text-slate-400">Cargando roadmap...</p>
        </div>
      }
    >
      <RoadmapPageInner />
    </Suspense>
  );
}
