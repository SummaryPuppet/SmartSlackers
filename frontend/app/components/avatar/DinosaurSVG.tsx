"use client";

import React from "react";

export interface DinosaurSVGProps {
  career?: string | null;
  size?: number;
}

type OutfitDef = {
  body: string;
  belly: string;
  spike: string;
  bg: string;
  badge: string;
  label: string;
};

const BASE: OutfitDef = {
  body: "#4CAF50", belly: "#A5D6A7", spike: "#388E3C",
  bg: "#E8F5E9", badge: "", label: "Mascota",
};

const OUTFITS: Record<string, OutfitDef> = {
  software:      { body:"#334155", belly:"#60a5fa",  spike:"#1e293b", bg:"#dbeafe", badge:"💻", label:"Desarrollador" },
  medicina:      { body:"#059669", belly:"#ffffff",   spike:"#047857", bg:"#d1fae5", badge:"⚕️", label:"Médico" },
  ingenieria:    { body:"#ea580c", belly:"#fbbf24",   spike:"#c2410c", bg:"#ffedd5", badge:"⚙️", label:"Ingeniero" },
  derecho:       { body:"#312e81", belly:"#e0e7ff",   spike:"#1e1b4b", bg:"#ede9fe", badge:"⚖️", label:"Abogado" },
  gastronomia:   { body:"#d1d5db", belly:"#f8fafc",   spike:"#9ca3af", bg:"#fefce8", badge:"👨‍🍳", label:"Chef" },
  astronauta:    { body:"#94a3b8", belly:"#bfdbfe",   spike:"#475569", bg:"#e0f2fe", badge:"🚀", label:"Astronauta" },
  psicologia:    { body:"#7c3aed", belly:"#ede9fe",   spike:"#5b21b6", bg:"#f5f3ff", badge:"🧠", label:"Psicólogo" },
  diseno:        { body:"#db2777", belly:"#fce7f3",   spike:"#9d174d", bg:"#fdf2f8", badge:"🎨", label:"Diseñador" },
  musica:        { body:"#18181b", belly:"#dc2626",   spike:"#09090b", bg:"#fef2f2", badge:"🎵", label:"Músico" },
  matematicas:   { body:"#1d4ed8", belly:"#dbeafe",   spike:"#1e40af", bg:"#eff6ff", badge:"📐", label:"Matemático" },
  literatura:    { body:"#92400e", belly:"#fef3c7",   spike:"#78350f", bg:"#fffbeb", badge:"📚", label:"Escritor" },
  administracion:{ body:"#1e3a5f", belly:"#f1f5f9",   spike:"#0f2a47", bg:"#f0f9ff", badge:"💼", label:"Administrador" },
  arquitectura:  { body:"#292524", belly:"#f5f5f4",   spike:"#1c1917", bg:"#fafaf9", badge:"🏛️", label:"Arquitecto" },
  marketing:     { body:"#dc2626", belly:"#fca5a5",   spike:"#991b1b", bg:"#fff1f2", badge:"📣", label:"Marketero" },
};

function HeadItem({ career, spike }: { career: string; spike: string }) {
  switch (career) {
    case "medicina":
      return (
        <g>
          <ellipse cx="100" cy="68" rx="29" ry="10" fill="#ffffff" opacity="0.95"/>
          <ellipse cx="100" cy="62" rx="23" ry="14" fill="#ffffff" opacity="0.9"/>
          <rect x="88" y="54" width="6" height="12" rx="2" fill="#ef4444"/>
          <rect x="84" y="58" width="14" height="4" rx="2" fill="#ef4444"/>
        </g>
      );
    case "ingenieria":
      return (
        <g>
          <ellipse cx="100" cy="70" rx="34" ry="8" fill={spike}/>
          <ellipse cx="100" cy="63" rx="26" ry="16" fill="#f97316"/>
          <rect x="67" y="72" width="66" height="5" rx="2" fill={spike}/>
          <rect x="94" y="52" width="12" height="8" rx="2" fill="#fbbf24" opacity="0.8"/>
        </g>
      );
    case "derecho":
      return (
        <g>
          <ellipse cx="100" cy="66" rx="35" ry="22" fill="#f1f0e8"/>
          {[-18,-10,-2,6,14,22].map((x,i)=>(
            <ellipse key={i} cx={100+x} cy="56" rx="5" ry="12" fill="#d4d2c4" opacity="0.85"/>
          ))}
          <rect x="68" y="82" width="11" height="26" rx="5" fill="#d4d2c4"/>
          <rect x="121" y="82" width="11" height="26" rx="5" fill="#d4d2c4"/>
        </g>
      );
    case "gastronomia":
      return (
        <g>
          <ellipse cx="100" cy="74" rx="27" ry="7" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5"/>
          <ellipse cx="100" cy="58" rx="21" ry="22" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5"/>
        </g>
      );
    case "astronauta":
      return (
        <g>
          <ellipse cx="100" cy="72" rx="36" ry="30" fill="#cbd5e1" opacity="0.92"/>
          <ellipse cx="100" cy="72" rx="28" ry="22" fill="#bfdbfe" opacity="0.7"/>
          <ellipse cx="100" cy="72" rx="36" ry="30" fill="none" stroke="#94a3b8" strokeWidth="3"/>
        </g>
      );
    case "software":
      return (
        <g>
          <ellipse cx="88" cy="90" rx="9" ry="6" fill="none" stroke="#60a5fa" strokeWidth="2"/>
          <ellipse cx="112" cy="90" rx="9" ry="6" fill="none" stroke="#60a5fa" strokeWidth="2"/>
          <line x1="97" y1="90" x2="103" y2="90" stroke="#60a5fa" strokeWidth="2"/>
          <line x1="70" y1="90" x2="79" y2="90" stroke="#60a5fa" strokeWidth="2"/>
          <line x1="121" y1="90" x2="130" y2="90" stroke="#60a5fa" strokeWidth="2"/>
        </g>
      );
    case "psicologia":
      return (
        <g>
          <ellipse cx="88" cy="90" rx="9" ry="6" fill="none" stroke="#a78bfa" strokeWidth="2"/>
          <ellipse cx="112" cy="90" rx="9" ry="6" fill="none" stroke="#a78bfa" strokeWidth="2"/>
          <line x1="97" y1="90" x2="103" y2="90" stroke="#a78bfa" strokeWidth="2"/>
          <line x1="70" y1="90" x2="79" y2="90" stroke="#a78bfa" strokeWidth="2"/>
          <line x1="121" y1="90" x2="130" y2="90" stroke="#a78bfa" strokeWidth="2"/>
        </g>
      );
    case "literatura":
      return (
        <g>
          <ellipse cx="88" cy="90" rx="9" ry="6" fill="none" stroke="#d97706" strokeWidth="2"/>
          <ellipse cx="112" cy="90" rx="9" ry="6" fill="none" stroke="#d97706" strokeWidth="2"/>
          <line x1="97" y1="90" x2="103" y2="90" stroke="#d97706" strokeWidth="2"/>
          <line x1="70" y1="90" x2="79" y2="90" stroke="#d97706" strokeWidth="2"/>
          <line x1="121" y1="90" x2="130" y2="90" stroke="#d97706" strokeWidth="2"/>
        </g>
      );
    case "matematicas":
      return (
        <g>
          <ellipse cx="100" cy="67" rx="28" ry="10" fill={spike}/>
          <rect x="72" y="58" width="56" height="8" rx="1" fill={spike} opacity="0.9"/>
          <polygon points="100,50 128,62 100,66 72,62" fill={spike}/>
          <line x1="128" y1="62" x2="136" y2="78" stroke={spike} strokeWidth="2"/>
          <circle cx="136" cy="80" r="4" fill="#fbbf24"/>
        </g>
      );
    case "diseno":
      return (
        <g>
          <ellipse cx="102" cy="64" rx="30" ry="18" fill="#db2777" opacity="0.9"/>
          <ellipse cx="100" cy="73" rx="34" ry="6" fill="#db2777" opacity="0.6"/>
          <circle cx="120" cy="58" r="5" fill="#db2777"/>
        </g>
      );
    case "musica":
      return (
        <g>
          <path d="M70 95 Q70 60 100 60 Q130 60 130 95" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round"/>
          <rect x="63" y="90" width="13" height="18" rx="5" fill="#dc2626"/>
          <rect x="124" y="90" width="13" height="18" rx="5" fill="#dc2626"/>
        </g>
      );
    case "arquitectura":
      return (
        <g>
          <ellipse cx="102" cy="64" rx="30" ry="18" fill="#1c1917" opacity="0.9"/>
          <ellipse cx="100" cy="73" rx="34" ry="6" fill="#1c1917" opacity="0.6"/>
          <circle cx="120" cy="58" r="5" fill="#1c1917"/>
        </g>
      );
    default:
      return null;
  }
}

function ArmItem({ career, spike }: { career: string; spike: string }) {
  switch (career) {
    case "software":
      return (
        <g transform="translate(141,122)">
          <rect x="0" y="0" width="26" height="18" rx="2" fill="#334155"/>
          <rect x="2" y="2" width="22" height="13" rx="1" fill="#60a5fa" opacity="0.5"/>
          <text x="11" y="11" textAnchor="middle" fontSize="7" fill="#ffffff" fontFamily="monospace">&lt;/&gt;</text>
          <rect x="-2" y="18" width="30" height="3" rx="1" fill="#334155" opacity="0.7"/>
        </g>
      );
    case "medicina":
      return (
        <g transform="translate(143,118)">
          <circle cx="10" cy="6" r="7" fill="none" stroke={spike} strokeWidth="3"/>
          <path d="M3 6 Q-2 20 6 30" fill="none" stroke={spike} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="6" cy="31" r="4" fill={spike}/>
        </g>
      );
    case "ingenieria":
      return (
        <g transform="translate(140,116) rotate(-25)">
          <rect x="0" y="0" width="7" height="28" rx="3.5" fill={spike}/>
          <circle cx="3.5" cy="2" r="6" fill="none" stroke={spike} strokeWidth="3.5"/>
        </g>
      );
    case "derecho":
      return (
        <g transform="translate(138,112)">
          <line x1="12" y1="2" x2="12" y2="28" stroke={spike} strokeWidth="2"/>
          <line x1="2" y1="10" x2="22" y2="10" stroke={spike} strokeWidth="2"/>
          <path d="M2 10 Q-2 16 2 18 Q6 20 6 16 Q6 12 2 10" fill={spike} opacity="0.7"/>
          <path d="M22 10 Q26 16 22 18 Q18 20 18 16 Q18 12 22 10" fill={spike} opacity="0.7"/>
          <rect x="9" y="26" width="6" height="3" rx="1" fill={spike}/>
        </g>
      );
    case "gastronomia":
      return (
        <g transform="translate(142,112) rotate(-20)">
          <rect x="2" y="0" width="5" height="26" rx="2.5" fill={spike}/>
          <rect x="0" y="24" width="9" height="8" rx="1" fill="#7c5c3a"/>
        </g>
      );
    case "astronauta":
      return (
        <g transform="translate(140,110)">
          <path d="M10 0 Q16 8 16 18 L10 22 L4 18 Q4 8 10 0Z" fill="#475569"/>
          <path d="M4 18 Q0 20 2 24 L10 22Z" fill="#ef4444"/>
          <path d="M16 18 Q20 20 18 24 L10 22Z" fill="#ef4444"/>
          <circle cx="10" cy="12" r="3" fill="#bfdbfe" opacity="0.7"/>
        </g>
      );
    case "psicologia":
      return (
        <g transform="translate(138,114)">
          <rect x="0" y="0" width="20" height="26" rx="2" fill="#f5f3ff"/>
          <rect x="0" y="0" width="20" height="26" rx="2" fill="none" stroke={spike} strokeWidth="1.5"/>
          <line x1="4" y1="7" x2="16" y2="7" stroke={spike} strokeWidth="1.5"/>
          <line x1="4" y1="12" x2="16" y2="12" stroke={spike} strokeWidth="1.5"/>
          <line x1="4" y1="17" x2="12" y2="17" stroke={spike} strokeWidth="1.5"/>
        </g>
      );
    case "diseno":
      return (
        <g transform="translate(140,115)">
          <ellipse cx="10" cy="12" rx="11" ry="9" fill={spike} opacity="0.9"/>
          {["#ef4444","#f59e0b","#22c55e","#3b82f6","#a855f7"].map((col,i)=>(
            <circle key={i} cx={[4,10,16,6,14][i]} cy={[8,5,8,15,15][i]} r="2.5" fill={col}/>
          ))}
        </g>
      );
    case "musica":
      return (
        <g transform="translate(140,108)">
          <text x="0" y="24" fontSize="28" fill={spike} fontFamily="serif">♪</text>
        </g>
      );
    case "matematicas":
      return (
        <g transform="translate(140,110)">
          <line x1="10" y1="2" x2="10" y2="28" stroke={spike} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="4" y1="10" x2="16" y2="18" stroke={spike} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="10" cy="2" r="2.5" fill={spike}/>
          <circle cx="4" cy="12" r="2" fill={spike}/>
          <circle cx="16" cy="18" r="2" fill={spike}/>
        </g>
      );
    case "literatura":
      return (
        <g transform="translate(140,112)">
          <rect x="0" y="2" width="22" height="26" rx="2" fill="#f5f5f4"/>
          <rect x="0" y="2" width="22" height="26" rx="2" fill="none" stroke={spike} strokeWidth="1.5"/>
          <rect x="3" y="0" width="4" height="28" rx="1" fill={spike} opacity="0.7"/>
          <line x1="8" y1="9" x2="19" y2="9" stroke={spike} strokeWidth="1.5" opacity="0.6"/>
          <line x1="8" y1="14" x2="19" y2="14" stroke={spike} strokeWidth="1.5" opacity="0.6"/>
        </g>
      );
    case "administracion":
      return (
        <g transform="translate(138,116)">
          <rect x="0" y="6" width="22" height="18" rx="2" fill={spike}/>
          <rect x="7" y="2" width="8" height="6" rx="2" fill="none" stroke={spike} strokeWidth="2"/>
          <line x1="0" y1="15" x2="22" y2="15" stroke="#ffffff" strokeWidth="1.5" opacity="0.4"/>
        </g>
      );
    case "arquitectura":
      return (
        <g transform="translate(140,110)">
          <rect x="0" y="0" width="8" height="30" rx="2" fill={spike} opacity="0.85"/>
          {[4,8,12,16,20,24].map(y=>(
            <line key={y} x1="4" y1={y} x2="8" y2={y} stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
          ))}
        </g>
      );
    case "marketing":
      return (
        <g transform="translate(136,114)">
          <path d="M2 8 L16 4 L16 22 L2 18 Z" fill={spike} opacity="0.9"/>
          <rect x="16" y="6" width="6" height="12" rx="2" fill={spike}/>
          <line x1="2" y1="18" x2="2" y2="28" stroke={spike} strokeWidth="3" strokeLinecap="round"/>
        </g>
      );
    default:
      return null;
  }
}

function BodyOverlay({ career, outfit }: { career: string; outfit: OutfitDef }) {
  switch (career) {
    case "medicina":
      return (
        <g>
          <path d="M66 135 L66 190 Q100 194 134 190 L134 135 Q118 130 100 130 Q82 130 66 135Z" fill="#ffffff" opacity="0.88"/>
          <rect x="70" y="155" width="14" height="11" rx="2" fill="#f0fdf4" stroke="#d1d5db" strokeWidth="1"/>
          <rect x="116" y="155" width="14" height="11" rx="2" fill="#f0fdf4" stroke="#d1d5db" strokeWidth="1"/>
          <path d="M90 130 L84 145 Q100 141 116 145 L110 130" fill="#f0fdf4"/>
        </g>
      );
    case "gastronomia":
      return (
        <g>
          <path d="M66 135 L66 190 Q100 194 134 190 L134 135 Q118 130 100 130 Q82 130 66 135Z" fill="#ffffff" opacity="0.92"/>
          <circle cx="88" cy="150" r="3" fill="#d1d5db"/>
          <circle cx="100" cy="150" r="3" fill="#d1d5db"/>
          <circle cx="112" cy="150" r="3" fill="#d1d5db"/>
          <path d="M90 130 L86 144 Q100 140 114 144 L110 130" fill="#f9fafb"/>
        </g>
      );
    case "administracion":
      return (
        <g>
          <path d="M68 135 L66 190 Q100 194 134 190 L132 135 Q118 130 100 130 Q82 130 68 135Z" fill={outfit.belly} opacity="0.88"/>
          <path d="M88 130 L82 146 L100 142 L100 160" fill="none" stroke="#94a3b8" strokeWidth="2"/>
          <path d="M112 130 L118 146 L100 142" fill="none" stroke="#94a3b8" strokeWidth="2"/>
          <rect x="96" y="143" width="8" height="22" fill="#ef4444" rx="1"/>
        </g>
      );
    case "ingenieria":
      return (
        <g>
          <path d="M66 138 L68 188 Q100 193 132 188 L134 138" fill="#fbbf24" opacity="0.6"/>
          <line x1="66" y1="148" x2="134" y2="148" stroke="#f97316" strokeWidth="3" opacity="0.5"/>
          <line x1="66" y1="163" x2="134" y2="163" stroke="#f97316" strokeWidth="3" opacity="0.5"/>
        </g>
      );
    case "software":
      return (
        <g>
          <path d="M66 135 L66 190 Q100 194 134 190 L134 135 Q118 128 100 128 Q82 128 66 135Z" fill="#1e293b" opacity="0.85"/>
          <text x="100" y="168" textAnchor="middle" fontSize="12" fill="#60a5fa" fontFamily="monospace" opacity="0.8">&lt;/&gt;</text>
        </g>
      );
    case "astronauta":
      return (
        <g>
          <path d="M60 135 L60 192 Q100 196 140 192 L140 135 Q120 125 100 125 Q80 125 60 135Z" fill="#94a3b8" opacity="0.9"/>
          <rect x="78" y="145" width="44" height="30" rx="8" fill="#bfdbfe" opacity="0.4"/>
          <rect x="78" y="145" width="44" height="30" rx="8" fill="none" stroke="#64748b" strokeWidth="2"/>
        </g>
      );
    case "derecho":
      return (
        <g>
          <path d="M66 135 L66 190 Q100 194 134 190 L134 135 Q118 130 100 130 Q82 130 66 135Z" fill="#1e1b4b" opacity="0.88"/>
          <path d="M88 130 L82 148 L100 144 L118 148 L112 130" fill="#e0e7ff" opacity="0.7"/>
        </g>
      );
    default:
      return null;
  }
}

export default function DinosaurSVG({ career, size = 200 }: DinosaurSVGProps) {
  const outfit = career ? (OUTFITS[career] ?? BASE) : BASE;
  const isAstronaut = career === "astronauta";

  return (
    <svg width={size} height={size} viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mascota Dino">

      {/* Background */}
      <rect width="200" height="200" fill={outfit.bg}/>
      <ellipse cx="100" cy="198" rx="68" ry="12" fill="rgba(0,0,0,0.06)"/>

      {/* Cola (detrás del cuerpo) */}
      <path d="M62 155 Q40 164 28 182 Q42 176 54 168 Q64 160 70 150Z" fill={outfit.body}/>

      {/* Cuerpo */}
      <ellipse cx="100" cy="152" rx="44" ry="42" fill={outfit.body}/>

      {/* Vientre / frente del traje */}
      {!isAstronaut && (
        <ellipse cx="100" cy="158" rx="26" ry="30" fill={outfit.belly}/>
      )}

      {/* Overlay de traje de carrera */}
      {career && <BodyOverlay career={career} outfit={outfit}/>}

      {/* Brazo izquierdo (pequeño) */}
      <path d="M60 132 Q50 138 47 150 Q54 152 60 144 Q64 137 67 130Z" fill={outfit.body}/>

      {/* Brazo derecho + accesorio */}
      <path d="M137 130 Q147 124 152 134 Q148 142 142 139 Q138 133 136 128Z" fill={outfit.body}/>
      {career && <ArmItem career={career} spike={outfit.spike}/>}

      {/* Cuello */}
      <ellipse cx="100" cy="116" rx="16" ry="14" fill={outfit.body}/>

      {/* Puas dorsales */}
      {!isAstronaut && (
        <>
          <polygon points="84,68 88,52 92,68" fill={outfit.spike}/>
          <polygon points="96,62 100,46 104,62" fill={outfit.spike}/>
          <polygon points="108,64 112,48 116,64" fill={outfit.spike}/>
        </>
      )}

      {/* Cabeza */}
      <ellipse cx="100" cy="80" rx="32" ry="28" fill={outfit.body}/>

      {/* Accesorio de cabeza (sombrero/casco/etc) */}
      {career && <HeadItem career={career} spike={outfit.spike}/>}

      {/* Hocico */}
      {!isAstronaut && (
        <>
          <ellipse cx="126" cy="90" rx="17" ry="12" fill={outfit.spike}/>
          <circle cx="122" cy="86" r="2.5" fill="rgba(0,0,0,0.25)"/>
          <circle cx="131" cy="87" r="2" fill="rgba(0,0,0,0.2)"/>
          <path d="M112 96 Q125 104 138 98" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="118" cy="99" rx="3.5" ry="2" fill="white"/>
          <ellipse cx="127" cy="102" rx="3.5" ry="2" fill="white"/>
          <ellipse cx="129" cy="103" rx="5" ry="3.5" fill="#f472b6"/>
        </>
      )}

      {/* Ojo principal */}
      {!isAstronaut && (
        <>
          <ellipse cx="84" cy="74" rx="13" ry="14" fill="white"/>
          <circle cx="86" cy="75" r="9" fill="#1a1a1a"/>
          <circle cx="89" cy="71" r="3.5" fill="white"/>
          <circle cx="83" cy="78" r="1.5" fill="white"/>
          <path d="M71 66 Q84 61 97 67" fill="none" stroke={outfit.spike} strokeWidth="2.5" strokeLinecap="round"/>
        </>
      )}

      {/* Patas */}
      <path d="M78 186 Q74 197 62 200 L70 200 Q82 198 86 190 Q88 182 82 176" fill={outfit.body}/>
      <ellipse cx="63" cy="200" rx="11" ry="5" fill={outfit.spike}/>
      <path d="M118 184 Q122 196 134 200 L126 200 Q114 198 110 190 Q108 182 114 176" fill={outfit.body}/>
      <ellipse cx="133" cy="200" rx="11" ry="5" fill={outfit.spike}/>

      {/* Badge de carrera */}
      {outfit.badge && (
        <g>
          <circle cx="166" cy="36" r="20" fill={outfit.spike} opacity="0.88"/>
          <text x="166" y="43" textAnchor="middle" fontSize="16">{outfit.badge}</text>
        </g>
      )}
    </svg>
  );
}
