"use client";

import React from "react";
import type { AvatarConfig } from "@/types/avatar";
import { SKIN_TONES, HAIR_COLORS, EYE_COLORS } from "@/lib/careerCosmetics";

interface AvatarSVGProps {
  config: AvatarConfig;
  size?: number;
}

/* ─── Fondos ─────────────────────────────────────────── */
const BACKGROUNDS: Record<string, React.ReactNode> = {
  sky: (
    <>
      <rect width="200" height="200" fill="#E6F1FB" />
      <ellipse cx="40" cy="40" rx="30" ry="14" fill="#fff" opacity="0.7" />
      <ellipse cx="160" cy="60" rx="22" ry="10" fill="#fff" opacity="0.6" />
    </>
  ),
  library: (
    <>
      <rect width="200" height="200" fill="#FAEEDA" />
      {[10,30,50,70,90,110,130,150,170].map((x, i) => (
        <rect key={i} x={x} y={100} width={14} height={60}
          fill={["#378ADD","#639922","#D4537E","#7F77DD","#EF9F27","#E24B4A","#185FA5","#3B6D11","#854F0B"][i]}
          opacity="0.5" rx="1" />
      ))}
    </>
  ),
  lab: (
    <>
      <rect width="200" height="200" fill="#E1F5EE" />
      <rect x="20" y="130" width="160" height="50" fill="#9FE1CB" opacity="0.3" rx="4" />
      <rect x="30" y="140" width="20" height="30" fill="#1D9E75" opacity="0.4" rx="2" />
      <rect x="60" y="135" width="14" height="35" fill="#0F6E56" opacity="0.3" rx="2" />
    </>
  ),
  city: (
    <>
      <rect width="200" height="200" fill="#E6F1FB" />
      {[5,30,60,90,120,150,175].map((x, i) => (
        <rect key={i} x={x} y={[60,80,50,70,55,75,65][i]}
          width={[18,22,25,20,28,18,20][i]}
          height={[140,120,150,130,145,125,135][i]}
          fill="#185FA5" opacity="0.22" />
      ))}
    </>
  ),
  nature: (
    <>
      <rect width="200" height="200" fill="#EAF3DE" />
      <ellipse cx="100" cy="200" rx="120" ry="40" fill="#639922" opacity="0.3" />
      <ellipse cx="30" cy="130" rx="25" ry="30" fill="#3B6D11" opacity="0.3" />
      <ellipse cx="170" cy="120" rx="20" ry="28" fill="#3B6D11" opacity="0.25" />
      <circle cx="100" cy="30" r="20" fill="#EF9F27" opacity="0.4" />
    </>
  ),
  abstract: (
    <>
      <rect width="200" height="200" fill="#EEEDFE" />
      <circle cx="30" cy="30" r="40" fill="#AFA9EC" opacity="0.3" />
      <circle cx="170" cy="170" r="50" fill="#7F77DD" opacity="0.2" />
      <circle cx="170" cy="30" r="25" fill="#F0997B" opacity="0.3" />
      <circle cx="30" cy="170" r="30" fill="#ED93B1" opacity="0.25" />
    </>
  ),
};

/* ─── Cabello ─────────────────────────────────────────── */
function HairPath({ style, color }: { style: string; color: string }) {
  const paths: Record<string, React.ReactNode> = {
    short:  <ellipse cx="100" cy="72" rx="30" ry="20" fill={color} />,
    medium: <><ellipse cx="100" cy="70" rx="32" ry="22" fill={color}/><rect x="70" y="85" width="10" height="25" rx="5" fill={color}/><rect x="120" y="85" width="10" height="25" rx="5" fill={color}/></>,
    long:   <><ellipse cx="100" cy="70" rx="32" ry="22" fill={color}/><rect x="69" y="84" width="12" height="55" rx="6" fill={color}/><rect x="119" y="84" width="12" height="55" rx="6" fill={color}/></>,
    curly:  <><ellipse cx="100" cy="68" rx="34" ry="24" fill={color}/>{[72,84,96,108,120,128].map((x,i)=><circle key={i} cx={x} cy={[60,56,58,56,60,65][i]} r={9} fill={color}/>)}</>,
    bun:    <><ellipse cx="100" cy="74" rx="30" ry="20" fill={color}/><circle cx="100" cy="55" r="13" fill={color}/><circle cx="100" cy="55" r="8" fill={color} stroke={color} strokeWidth="3"/></>,
    braids: <><ellipse cx="100" cy="70" rx="32" ry="22" fill={color}/><rect x="69" y="84" width="9" height="60" rx="4" fill={color}/><rect x="122" y="84" width="9" height="60" rx="4" fill={color}/>{[0,12,24,36,48].map(y=><React.Fragment key={y}><rect x="67" y={88+y} width="13" height="5" rx="2" fill={color} opacity="0.7"/><rect x="120" y={88+y} width="13" height="5" rx="2" fill={color} opacity="0.7"/></React.Fragment>)}</>,
  };
  return <>{paths[style] ?? paths.medium}</>;
}

/* ─── Sombreros / cosméticos de cabeza ───────────────── */
function CareerHat({ cosmetic }: { cosmetic: NonNullable<AvatarConfig["careerCosmetic"]> }) {
  const c = cosmetic.accessoryColor;
  const hats: Record<string, React.ReactNode> = {
    "surgical-cap": <><ellipse cx="100" cy="70" rx="33" ry="12" fill={c} opacity=".85"/><ellipse cx="100" cy="64" rx="28" ry="14" fill={c} opacity=".9"/><rect x="72" y="74" width="14" height="6" rx="3" fill={c}/></>,
    "hard-hat":     <><ellipse cx="100" cy="68" rx="34" ry="10" fill={c}/><ellipse cx="100" cy="63" rx="28" ry="16" fill={c} opacity=".9"/><rect x="67" y="72" width="66" height="5" rx="2" fill={c}/><rect x="94" y="50" width="12" height="8" rx="2" fill="#fff" opacity=".5"/></>,
    mortarboard:    <><ellipse cx="100" cy="67" rx="28" ry="10" fill={c}/><rect x="72" y="58" width="56" height="8" rx="1" fill={c} opacity=".9"/><polygon points="100,50 128,62 100,66 72,62" fill={c}/><line x1="128" y1="62" x2="136" y2="78" stroke={c} strokeWidth="2"/><circle cx="136" cy="80" r="4" fill="#EF9F27"/></>,
    beret:          <><ellipse cx="100" cy="63" rx="30" ry="18" fill={c}/><ellipse cx="100" cy="72" rx="34" ry="6" fill={c} opacity=".7"/><circle cx="116" cy="56" r="4" fill={c}/></>,
    "reading-glasses": <g transform="translate(0,14)"><circle cx="88" cy="90" r="9" fill="none" stroke={c} strokeWidth="2.5"/><circle cx="112" cy="90" r="9" fill="none" stroke={c} strokeWidth="2.5"/><line x1="97" y1="90" x2="103" y2="90" stroke={c} strokeWidth="2"/><line x1="70" y1="90" x2="79" y2="90" stroke={c} strokeWidth="2"/><line x1="121" y1="90" x2="132" y2="90" stroke={c} strokeWidth="2"/></g>,
    headphones:     <><path d="M70 95 Q70 60 100 60 Q130 60 130 95" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round"/><rect x="63" y="90" width="12" height="18" rx="5" fill={c}/><rect x="125" y="90" width="12" height="18" rx="5" fill={c}/></>,
    tie:            <><polygon points="94,142 100,154 106,142" fill={c}/><polygon points="87,138 100,154 94,138" fill={c} opacity=".7"/><polygon points="113,138 100,154 106,138" fill={c} opacity=".7"/></>,
    "lawyer-wig":   <><ellipse cx="100" cy="66" rx="34" ry="22" fill="#F1EFE8"/>{[-18,-10,-2,6,14,22].map((x,i)=><ellipse key={i} cx={100+x} cy="56" rx="5" ry="12" fill="#D3D1C7" opacity=".8"/>)}<rect x="68" y="82" width="10" height="28" rx="5" fill="#D3D1C7"/><rect x="122" y="82" width="10" height="28" rx="5" fill="#D3D1C7"/></>,
    helmet:         <><ellipse cx="100" cy="66" rx="34" ry="24" fill={c} opacity=".9"/><rect x="68" y="76" width="64" height="8" rx="2" fill={c}/><rect x="80" y="84" width="40" height="16" rx="4" fill="#B5D4F4" opacity=".7"/></>,
    "chef-hat":     <><ellipse cx="100" cy="72" rx="28" ry="8" fill="#fff" stroke={c} strokeWidth="1.5"/><ellipse cx="100" cy="58" rx="22" ry="20" fill="#fff" stroke={c} strokeWidth="1.5"/></>,
    none: null,
  };
  return <>{hats[cosmetic.hat ?? "none"] ?? null}</>;
}

/* ─── Accesorios ─────────────────────────────────────── */
function CareerAccessory({ cosmetic }: { cosmetic: NonNullable<AvatarConfig["careerCosmetic"]> }) {
  const c = cosmetic.accessoryColor;
  const accessories: Record<string, React.ReactNode> = {
    stethoscope: <g transform="translate(118,108)"><circle cx="12" cy="6" r="7" fill="none" stroke={c} strokeWidth="3"/><path d="M5 6 Q0 20 8 28" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><circle cx="8" cy="29" r="3" fill={c}/></g>,
    wrench:      <g transform="translate(120,110) rotate(-30)"><rect x="0" y="0" width="6" height="24" rx="3" fill={c}/><circle cx="3" cy="2" r="5" fill="none" stroke={c} strokeWidth="3"/></g>,
    compass:     <g transform="translate(118,108)"><line x1="10" y1="2" x2="10" y2="26" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="4" y1="10" x2="16" y2="18" stroke={c} strokeWidth="2" strokeLinecap="round"/><circle cx="10" cy="2" r="2.5" fill={c}/><circle cx="4" cy="12" r="2" fill={c}/><circle cx="16" cy="18" r="2" fill={c}/></g>,
    palette:     <g transform="translate(116,110)"><ellipse cx="10" cy="12" rx="10" ry="8" fill={c} opacity=".9"/>{["#E24B4A","#EF9F27","#639922","#378ADD","#7F77DD"].map((col,i)=><circle key={i} cx={[4,10,16,6,14][i]} cy={[8,5,8,15,15][i]} r="2.5" fill={col}/>)}</g>,
    quill:       <g transform="translate(120,105)"><path d="M0 24 Q5 12 14 0" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M14 0 Q10 8 6 16 L0 24" fill={c} opacity=".5"/></g>,
    "music-note":<g transform="translate(120,106)"><text x="0" y="22" fontSize="26" fill={c} fontFamily="serif">♪</text></g>,
    briefcase:   <g transform="translate(116,112)"><rect x="0" y="6" width="22" height="16" rx="2" fill={c}/><rect x="7" y="2" width="8" height="6" rx="2" fill="none" stroke={c} strokeWidth="2"/><line x1="0" y1="14" x2="22" y2="14" stroke="#fff" strokeWidth="1.5" opacity=".4"/></g>,
    brain:       <g transform="translate(118,108)"><path d="M10 4 Q18 2 18 10 Q22 12 20 18 Q18 24 12 24 Q6 24 4 18 Q2 12 6 10 Q6 2 10 4Z" fill={c} opacity=".85"/><path d="M10 8 Q14 10 10 14 Q6 10 10 8" fill="none" stroke="#fff" strokeWidth="1" opacity=".6"/></g>,
    scales:      <g transform="translate(114,106)"><line x1="12" y1="2" x2="12" y2="26" stroke={c} strokeWidth="2"/><line x1="2" y1="10" x2="22" y2="10" stroke={c} strokeWidth="2"/><path d="M2 10 Q-2 16 2 18 Q6 20 6 16 Q6 12 2 10" fill={c} opacity=".6"/><path d="M22 10 Q26 16 22 18 Q18 20 18 16 Q18 12 22 10" fill={c} opacity=".6"/><rect x="9" y="24" width="6" height="3" rx="1" fill={c}/></g>,
    ruler:       <g transform="translate(118,106)"><rect x="0" y="0" width="8" height="28" rx="2" fill={c} opacity=".85"/>{[4,8,12,16,20,24].map(y=><line key={y} x1="4" y1={y} x2="8" y2={y} stroke="#fff" strokeWidth="1" opacity=".7"/>)}</g>,
    rocket:      <g transform="translate(118,104)"><path d="M10 0 Q16 8 16 18 L10 22 L4 18 Q4 8 10 0Z" fill={c}/><path d="M4 18 Q0 20 2 24 L10 22Z" fill="#E24B4A"/><path d="M16 18 Q20 20 18 24 L10 22Z" fill="#E24B4A"/><circle cx="10" cy="12" r="3" fill="#fff" opacity=".7"/></g>,
    "chef-knife":<g transform="translate(118,106) rotate(-20)"><rect x="2" y="0" width="5" height="22" rx="2" fill={c}/><rect x="0" y="20" width="9" height="8" rx="1" fill="#5C3317"/></g>,
    megaphone:   <g transform="translate(114,108)"><path d="M2 8 L14 4 L14 20 L2 16 Z" fill={c} opacity=".85"/><rect x="14" y="6" width="6" height="12" rx="2" fill={c}/><line x1="2" y1="16" x2="2" y2="24" stroke={c} strokeWidth="3" strokeLinecap="round"/></g>,
    laptop:      <g transform="translate(112,114)"><rect x="0" y="0" width="26" height="16" rx="2" fill={c} opacity=".85"/><rect x="2" y="2" width="22" height="12" rx="1" fill="#E6F1FB" opacity=".6"/><rect x="-2" y="16" width="30" height="3" rx="1" fill={c} opacity=".6"/></g>,
  };
  return <>{accessories[cosmetic.accessory] ?? null}</>;
}

/* ─── Traje completo por carrera ─────────────────────── */
function CareerBodyOutfit({ cosmetic }: { cosmetic: NonNullable<AvatarConfig["careerCosmetic"]> }) {
  const c = cosmetic.accessoryColor;
  switch (cosmetic.career) {
    case "medicina":
      return (
        <g>
          <path d="M60 155 L60 200 Q100 204 140 200 L140 155 Q120 148 100 148 Q80 148 60 155Z" fill="#ffffff" opacity="0.92"/>
          <rect x="64" y="170" width="14" height="12" rx="2" fill="#f0fdf4" stroke="#d1d5db" strokeWidth="1"/>
          <rect x="122" y="170" width="14" height="12" rx="2" fill="#f0fdf4" stroke="#d1d5db" strokeWidth="1"/>
          <path d="M88 148 L82 162 Q100 158 118 162 L112 148" fill="#f8fafc"/>
          <circle cx="100" cy="165" r="3" fill="#ef4444" opacity="0.6"/>
          <rect x="97" y="155" width="6" height="14" rx="2" fill="#ef4444" opacity="0.5"/>
          <rect x="91" y="161" width="18" height="5" rx="2" fill="#ef4444" opacity="0.5"/>
        </g>
      );
    case "gastronomia":
      return (
        <g>
          <path d="M60 155 L60 200 Q100 204 140 200 L140 155 Q120 148 100 148 Q80 148 60 155Z" fill="#ffffff" opacity="0.94"/>
          <path d="M88 148 L83 162 Q100 158 117 162 L112 148" fill="#f9fafb"/>
          <circle cx="90" cy="170" r="3" fill="#d1d5db"/>
          <circle cx="100" cy="170" r="3" fill="#d1d5db"/>
          <circle cx="110" cy="170" r="3" fill="#d1d5db"/>
        </g>
      );
    case "ingenieria":
      return (
        <g>
          <path d="M60 158 L60 200 Q100 204 140 200 L140 158" fill="#f97316" opacity="0.85"/>
          <line x1="60" y1="170" x2="140" y2="170" stroke="#fbbf24" strokeWidth="4" opacity="0.7"/>
          <line x1="60" y1="185" x2="140" y2="185" stroke="#fbbf24" strokeWidth="4" opacity="0.7"/>
          <path d="M88 148 L82 160 L100 156 L118 160 L112 148" fill="#ea580c" opacity="0.9"/>
        </g>
      );
    case "derecho":
      return (
        <g>
          <path d="M58 154 L58 200 Q100 204 142 200 L142 154 Q120 146 100 146 Q80 146 58 154Z" fill="#1e1b4b" opacity="0.9"/>
          <path d="M86 146 L78 162 L100 157 L122 162 L114 146" fill="#e0e7ff" opacity="0.8"/>
          <rect x="96" y="158" width="8" height="28" fill="#e0e7ff" opacity="0.3" rx="1"/>
        </g>
      );
    case "software":
      return (
        <g>
          <path d="M60 155 L60 200 Q100 204 140 200 L140 155 Q120 147 100 147 Q80 147 60 155Z" fill="#1e293b" opacity="0.9"/>
          <text x="100" y="182" textAnchor="middle" fontSize="13" fill="#60a5fa" fontFamily="monospace" opacity="0.8">&lt;/&gt;</text>
          <path d="M86 147 L80 160 Q100 156 120 160 L114 147" fill="#334155"/>
        </g>
      );
    case "astronauta":
      return (
        <g>
          <path d="M55 152 L55 200 Q100 206 145 200 L145 152 Q122 142 100 142 Q78 142 55 152Z" fill="#94a3b8" opacity="0.92"/>
          <rect x="74" y="162" width="52" height="34" rx="10" fill="#bfdbfe" opacity="0.35"/>
          <rect x="74" y="162" width="52" height="34" rx="10" fill="none" stroke="#64748b" strokeWidth="2"/>
          <path d="M86 142 L80 156 L100 151 L120 156 L114 142" fill="#cbd5e1"/>
        </g>
      );
    case "psicologia":
      return (
        <g>
          <path d="M62 155 L62 200 Q100 204 138 200 L138 155 Q120 148 100 148 Q80 148 62 155Z" fill={c} opacity="0.88"/>
          <path d="M88 148 L83 161 Q100 157 117 161 L112 148" fill={c}/>
          <rect x="86" y="163" width="28" height="20" rx="3" fill="#f5f3ff" opacity="0.4"/>
        </g>
      );
    case "diseno":
      return (
        <g>
          <path d="M62 155 L62 200 Q100 204 138 200 L138 155 Q120 148 100 148 Q80 148 62 155Z" fill={c} opacity="0.88"/>
          <ellipse cx="85" cy="172" rx="6" ry="6" fill="#ef4444" opacity="0.7"/>
          <ellipse cx="100" cy="168" rx="6" ry="6" fill="#f59e0b" opacity="0.7"/>
          <ellipse cx="115" cy="172" rx="6" ry="6" fill="#22c55e" opacity="0.7"/>
        </g>
      );
    case "musica":
      return (
        <g>
          <path d="M62 155 L62 200 Q100 204 138 200 L138 155 Q120 148 100 148 Q80 148 62 155Z" fill="#18181b" opacity="0.9"/>
          <text x="100" y="182" textAnchor="middle" fontSize="18" fill="#dc2626" opacity="0.8" fontFamily="serif">♪</text>
        </g>
      );
    case "matematicas":
      return (
        <g>
          <path d="M62 155 L62 200 Q100 204 138 200 L138 155 Q120 148 100 148 Q80 148 62 155Z" fill="#1d4ed8" opacity="0.88"/>
          <text x="100" y="182" textAnchor="middle" fontSize="13" fill="#dbeafe" opacity="0.8" fontFamily="serif">∑ π</text>
        </g>
      );
    case "literatura":
      return (
        <g>
          <path d="M62 155 L62 200 Q100 204 138 200 L138 155 Q120 148 100 148 Q80 148 62 155Z" fill="#92400e" opacity="0.88"/>
          <path d="M86 148 L82 162 Q100 158 118 162 L114 148" fill="#fef3c7" opacity="0.7"/>
          <rect x="82" y="165" width="36" height="24" rx="3" fill="#fef3c7" opacity="0.2"/>
        </g>
      );
    case "administracion":
      return (
        <g>
          <path d="M60 154 L60 200 Q100 204 140 200 L140 154 Q120 146 100 146 Q80 146 60 154Z" fill="#1e3a5f" opacity="0.9"/>
          <path d="M87 146 L81 161 L100 157 L119 161 L113 146" fill="#f1f5f9" opacity="0.8"/>
          <rect x="96" y="157" width="8" height="26" fill="#ef4444" rx="1"/>
        </g>
      );
    case "arquitectura":
      return (
        <g>
          <path d="M62 155 L62 200 Q100 204 138 200 L138 155 Q120 148 100 148 Q80 148 62 155Z" fill="#292524" opacity="0.9"/>
          <ellipse cx="100" cy="152" rx="20" ry="8" fill="#292524"/>
          <line x1="80" y1="170" x2="120" y2="170" stroke="#f5f5f4" strokeWidth="1.5" opacity="0.4"/>
          <line x1="80" y1="180" x2="120" y2="180" stroke="#f5f5f4" strokeWidth="1.5" opacity="0.4"/>
        </g>
      );
    case "marketing":
      return (
        <g>
          <path d="M62 155 L62 200 Q100 204 138 200 L138 155 Q120 148 100 148 Q80 148 62 155Z" fill={c} opacity="0.88"/>
          <path d="M87 148 L82 162 Q100 158 118 162 L113 148" fill={c}/>
          <circle cx="85" cy="175" r="5" fill="#fca5a5" opacity="0.7"/>
          <circle cx="115" cy="175" r="5" fill="#fca5a5" opacity="0.7"/>
        </g>
      );
    default:
      return null;
  }
}

/* ─── Componente principal ───────────────────────────── */
export default function AvatarSVG({ config, size = 200 }: AvatarSVGProps) {
  const skin   = SKIN_TONES[config.skinTone];
  const hair   = HAIR_COLORS[config.hairColor];
  const eye    = EYE_COLORS[config.eyeColor];
  const outfits = {
    casual:  { shirt: "#7F77DD", collar: "#533AB7" },
    formal:  { shirt: "#185FA5", collar: "#0C447C" },
    sporty:  { shirt: "#1D9E75", collar: "#0F6E56" },
  };
  const outfit = outfits[config.outfitBase];
  const cos    = config.careerCosmetic;
  const showHair = !cos || !cos.hat || cos.hat === "none" || cos.hat === "reading-glasses";

  return (
    <svg width={size} height={size} viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avatar personalizado">
      {BACKGROUNDS[config.background] ?? BACKGROUNDS.sky}

      {/* Cuerpo base */}
      <ellipse cx="100" cy="175" rx="42" ry="30" fill={outfit.shirt} />
      <ellipse cx="100" cy="160" rx="28" ry="18" fill={outfit.shirt} />
      <polygon points="94,142 100,154 106,142" fill={outfit.collar} />
      <polygon points="87,138 100,154 94,138" fill={outfit.collar} opacity=".7" />
      <polygon points="113,138 100,154 106,138" fill={outfit.collar} opacity=".7" />

      {/* Traje completo de carrera (superpuesto al cuerpo base) */}
      {cos && <CareerBodyOutfit cosmetic={cos} />}

      {/* Cuello */}
      <rect x="92" y="130" width="16" height="16" rx="4" fill={skin.fill} />

      {/* Cabello (detrás de la cabeza) */}
      {showHair && <HairPath style={config.hairStyle} color={hair.fill} />}

      {/* Cabeza */}
      <ellipse cx="100" cy="98" rx="30" ry="34" fill={skin.fill} />

      {/* Orejas */}
      <ellipse cx="70" cy="100" rx="6" ry="8" fill={skin.fill} />
      <ellipse cx="130" cy="100" rx="6" ry="8" fill={skin.fill} />
      <ellipse cx="70" cy="100" rx="3" ry="5" fill={skin.shadow} opacity=".4" />
      <ellipse cx="130" cy="100" rx="3" ry="5" fill={skin.shadow} opacity=".4" />

      {/* Ojos */}
      <ellipse cx="88" cy="96" rx="7" ry="7.5" fill="#fff" />
      <ellipse cx="112" cy="96" rx="7" ry="7.5" fill="#fff" />
      <circle cx="89" cy="97" r="4.5" fill={eye.fill} />
      <circle cx="113" cy="97" r="4.5" fill={eye.fill} />
      <circle cx="90" cy="96" r="1.5" fill="#000" opacity=".8" />
      <circle cx="114" cy="96" r="1.5" fill="#000" opacity=".8" />
      <circle cx="91" cy="95" r="1" fill="#fff" opacity=".7" />
      <circle cx="115" cy="95" r="1" fill="#fff" opacity=".7" />

      {/* Cejas */}
      <path d="M82 88 Q88 85 94 87" fill="none" stroke={hair.fill} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M106 87 Q112 85 118 88" fill="none" stroke={hair.fill} strokeWidth="2.5" strokeLinecap="round" />

      {/* Nariz y boca */}
      <path d="M98 102 Q100 108 102 102" fill="none" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M93 115 Q100 120 107 115" fill="none" stroke={skin.shadow} strokeWidth="2" strokeLinecap="round" />

      {/* Mejillas */}
      <ellipse cx="80" cy="112" rx="8" ry="5" fill="#F0997B" opacity=".3" />
      <ellipse cx="120" cy="112" rx="8" ry="5" fill="#F0997B" opacity=".3" />

      {/* Cosmético de carrera */}
      {cos && <CareerHat cosmetic={cos} />}
      {cos && <CareerAccessory cosmetic={cos} />}

      {/* Badge de carrera */}
      {cos && (
        <g>
          <circle cx="168" cy="168" r="16" fill={cos.accessoryColor} opacity=".9" />
          <text x="168" y="173" textAnchor="middle" fontSize="14" fill="#fff" fontFamily="serif">
            {cos.badge}
          </text>
        </g>
      )}
    </svg>
  );
}
