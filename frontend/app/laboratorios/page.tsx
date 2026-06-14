"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/lib/i18n";

type Lab = {
  nameKey?: string;
  descKey?: string;
  name?: string;
  desc?: string;
  img: string;
};

const BASE = "https://www.utp.edu.pe";

const LABS_BY_CAREER: Record<string, Lab[]> = {
  medicina: [
    {
      nameKey: "labs.medicina.hospitalSimulado.name",
      descKey: "labs.medicina.hospitalSimulado.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/HOSPITAL%20SIMULADO_1%202.jpg`,
    },
    {
      nameKey: "labs.medicina.labOrganizacion.name",
      descKey: "labs.medicina.labOrganizacion.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/LAB%20DE%20ORGANIZACI%C3%93N%20Y%20FUNCI%C3%93N%20DEL%20CUERPO%20HUMANO_1%202.jpg`,
    },
    {
      nameKey: "labs.medicina.salaSimulacion.name",
      descKey: "labs.medicina.salaSimulacion.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/Sala%20de%20Simulaci%C3%B3n%20Compleja%20-%20%20Obestricia%201.jpg`,
    },
    {
      nameKey: "labs.medicina.salaDiseccion.name",
      descKey: "labs.medicina.salaDiseccion.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Saladedisecci%C3%B3nARyVR.webp`,
    },
  ],
  enfermeria: [
    {
      nameKey: "labs.enfermeria.hospitalSimulado.name",
      descKey: "labs.enfermeria.hospitalSimulado.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/HOSPITAL%20SIMULADO_1%202.jpg`,
    },
    {
      nameKey: "labs.enfermeria.salaSimulacionGinecobstetra.name",
      descKey: "labs.enfermeria.salaSimulacionGinecobstetra.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/Sala%20de%20Simulaci%C3%B3n%20Compleja%20-%20%20Obestricia%201.jpg`,
    },
    {
      nameKey: "labs.enfermeria.labOrganizacion.name",
      descKey: "labs.enfermeria.labOrganizacion.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/LAB%20DE%20ORGANIZACI%C3%93N%20Y%20FUNCI%C3%93N%20DEL%20CUERPO%20HUMANO_1%202.jpg`,
    },
  ],
  "ingenieria-biomedica": [
    {
      nameKey: "labs.ingenieriaBiomedica.hospitalSimulado.name",
      descKey: "labs.ingenieriaBiomedica.hospitalSimulado.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/HOSPITAL%20SIMULADO_1%202.jpg`,
    },
    {
      nameKey: "labs.ingenieriaBiomedica.labMecatronica.name",
      descKey: "labs.ingenieriaBiomedica.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
  ],
  odontologia: [
    {
      nameKey: "labs.odontologia.hospitalSimulado.name",
      descKey: "labs.odontologia.hospitalSimulado.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/HOSPITAL%20SIMULADO_1%202.jpg`,
    },
    {
      nameKey: "labs.odontologia.salaDiseccion.name",
      descKey: "labs.odontologia.salaDiseccion.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Saladedisecci%C3%B3nARyVR.webp`,
    },
  ],
  obstetricia: [
    {
      nameKey: "labs.obstetricia.salaSimulacionGinecobstetra.name",
      descKey: "labs.obstetricia.salaSimulacionGinecobstetra.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/Sala%20de%20Simulaci%C3%B3n%20Compleja%20-%20%20Obestricia%201.jpg`,
    },
    {
      nameKey: "labs.obstetricia.hospitalSimulado.name",
      descKey: "labs.obstetricia.hospitalSimulado.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/HOSPITAL%20SIMULADO_1%202.jpg`,
    },
  ],
  nutricion: [
    {
      nameKey: "labs.nutricion.labTecnicasDieteticas.name",
      descKey: "labs.nutricion.labTecnicasDieteticas.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/Laboratorio%20de%20Nutrici%C3%B3n%20y%20Diet%C3%A9tica%201.jpg`,
    },
    {
      nameKey: "labs.nutricion.labProcesosIndustriales.name",
      descKey: "labs.nutricion.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
  ],
  psicologia: [
    {
      nameKey: "labs.psicologia.camaraGesell.name",
      descKey: "labs.psicologia.camaraGesell.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20GESSEL%201.jpg`,
    },
    {
      nameKey: "labs.psicologia.salaDesignThinking.name",
      descKey: "labs.psicologia.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
  ],
  "psicologia-consumidor": [
    {
      nameKey: "labs.psicologiaConsumidor.camaraGesell.name",
      descKey: "labs.psicologiaConsumidor.camaraGesell.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20GESSEL%201.jpg`,
    },
    {
      nameKey: "labs.psicologiaConsumidor.salaDesignThinking.name",
      descKey: "labs.psicologiaConsumidor.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.psicologiaConsumidor.salaMacs.name",
      descKey: "labs.psicologiaConsumidor.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  veterinaria: [
    {
      nameKey: "labs.veterinaria.hospitalSimulado.name",
      descKey: "labs.veterinaria.hospitalSimulado.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/HOSPITAL%20SIMULADO_1%202.jpg`,
    },
    {
      nameKey: "labs.veterinaria.salaDiseccion.name",
      descKey: "labs.veterinaria.salaDiseccion.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Saladedisecci%C3%B3nARyVR.webp`,
    },
  ],
  "tecnologia-medica": [
    {
      nameKey: "labs.tecnologiaMedica.hospitalSimulado.name",
      descKey: "labs.tecnologiaMedica.hospitalSimulado.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/HOSPITAL%20SIMULADO_1%202.jpg`,
    },
    {
      nameKey: "labs.tecnologiaMedica.labOrganizacion.name",
      descKey: "labs.tecnologiaMedica.labOrganizacion.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/LAB%20DE%20ORGANIZACI%C3%93N%20Y%20FUNCI%C3%93N%20DEL%20CUERPO%20HUMANO_1%202.jpg`,
    },
  ],
  derecho: [
    {
      nameKey: "labs.derecho.salaAudiencias.name",
      descKey: "labs.derecho.salaAudiencias.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALADEAUDIENCIA%201.webp`,
    },
    {
      nameKey: "labs.derecho.salaDesignThinking.name",
      descKey: "labs.derecho.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
  ],
  arquitectura: [
    {
      nameKey: "labs.arquitectura.tallerArquitectura.name",
      descKey: "labs.arquitectura.tallerArquitectura.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/TALLER%20DE%20ARQUITECTURA.jpg`,
    },
    {
      nameKey: "labs.arquitectura.salaBIM.name",
      descKey: "labs.arquitectura.salaBIM.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20BIM%201.jpg`,
    },
  ],
  "ingenieria-civil": [
    {
      nameKey: "labs.ingenieriaCivil.labConcretoSuelos.name",
      descKey: "labs.ingenieriaCivil.labConcretoSuelos.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/Laboratorio%20de%20tecnolog%C3%ADa%20de%20concreto%20y%20resistencia%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaCivil.labHidraulica.name",
      descKey: "labs.ingenieriaCivil.labHidraulica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20HIDR%C3%81ULICA%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaCivil.salaBIM.name",
      descKey: "labs.ingenieriaCivil.salaBIM.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20BIM%201.jpg`,
    },
  ],
  "ingenieria-minas": [
    {
      nameKey: "labs.ingenieriaMinas.labProcesosIndustriales.name",
      descKey: "labs.ingenieriaMinas.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
    {
      nameKey: "labs.ingenieriaMinas.salaBIM.name",
      descKey: "labs.ingenieriaMinas.salaBIM.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20BIM%201.jpg`,
    },
  ],
  "ingenieria-ambiental": [
    {
      nameKey: "labs.ingenieriaAmbiental.labProcesosIndustriales.name",
      descKey: "labs.ingenieriaAmbiental.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
    {
      nameKey: "labs.ingenieriaAmbiental.labMecatronica.name",
      descKey: "labs.ingenieriaAmbiental.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
  ],
  "ingenieria-transporte": [
    {
      nameKey: "labs.ingenieriaTransporte.labHidraulica.name",
      descKey: "labs.ingenieriaTransporte.labHidraulica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20HIDR%C3%81ULICA%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaTransporte.salaBIM.name",
      descKey: "labs.ingenieriaTransporte.salaBIM.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20BIM%201.jpg`,
    },
  ],
  "ingenieria-electronica": [
    {
      nameKey: "labs.ingenieriaElectronica.labMecatronica.name",
      descKey: "labs.ingenieriaElectronica.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaElectronica.salaMacs.name",
      descKey: "labs.ingenieriaElectronica.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  "ingenieria-mecanica": [
    {
      nameKey: "labs.ingenieriaMecanica.labMecatronica.name",
      descKey: "labs.ingenieriaMecanica.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaMecanica.labProcesosIndustriales.name",
      descKey: "labs.ingenieriaMecanica.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
  ],
  "ingenieria-mecatronica": [
    {
      nameKey: "labs.ingenieriaMecatronica.labMecatronica.name",
      descKey: "labs.ingenieriaMecatronica.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaMecatronica.salaMacs.name",
      descKey: "labs.ingenieriaMecatronica.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  "ingenieria-maritima": [
    {
      nameKey: "labs.ingenieriaMaritima.labHidraulica.name",
      descKey: "labs.ingenieriaMaritima.labHidraulica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20HIDR%C3%81ULICA%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaMaritima.salaBIM.name",
      descKey: "labs.ingenieriaMaritima.salaBIM.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20BIM%201.jpg`,
    },
  ],
  "ingenieria-naval": [
    {
      nameKey: "labs.ingenieriaNaval.labHidraulica.name",
      descKey: "labs.ingenieriaNaval.labHidraulica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20HIDR%C3%81ULICA%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaNaval.salaBIM.name",
      descKey: "labs.ingenieriaNaval.salaBIM.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20BIM%201.jpg`,
    },
  ],
  "ingenieria-industrial": [
    {
      nameKey: "labs.ingenieriaIndustrial.labProcesosIndustriales.name",
      descKey: "labs.ingenieriaIndustrial.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
    {
      nameKey: "labs.ingenieriaIndustrial.salaDesignThinking.name",
      descKey: "labs.ingenieriaIndustrial.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.ingenieriaIndustrial.labMecatronica.name",
      descKey: "labs.ingenieriaIndustrial.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
  ],
  software: [
    {
      nameKey: "labs.software.salaMacs.name",
      descKey: "labs.software.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.software.salaDesignThinking.name",
      descKey: "labs.software.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.software.labMecatronica.name",
      descKey: "labs.software.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
  ],
  "ciencia-computacion": [
    {
      nameKey: "labs.cienciaComputacion.salaMacs.name",
      descKey: "labs.cienciaComputacion.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.cienciaComputacion.salaDesignThinking.name",
      descKey: "labs.cienciaComputacion.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
  ],
  "ingenieria-ciberseguridad": [
    {
      nameKey: "labs.ingenieriaCiberseguridad.salaMacs.name",
      descKey: "labs.ingenieriaCiberseguridad.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaCiberseguridad.labMecatronica.name",
      descKey: "labs.ingenieriaCiberseguridad.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
  ],
  "ingenieria-sistemas-informacion": [
    {
      nameKey: "labs.ingenieriaSistemasInformacion.salaMacs.name",
      descKey: "labs.ingenieriaSistemasInformacion.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaSistemasInformacion.salaDesignThinking.name",
      descKey: "labs.ingenieriaSistemasInformacion.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
  ],
  "ingenieria-sistemas": [
    {
      nameKey: "labs.ingenieriaSistemas.salaMacs.name",
      descKey: "labs.ingenieriaSistemas.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaSistemas.salaDesignThinking.name",
      descKey: "labs.ingenieriaSistemas.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
  ],
  "redes-telecomunicaciones": [
    {
      nameKey: "labs.redesTelecomunicaciones.salaMacs.name",
      descKey: "labs.redesTelecomunicaciones.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.redesTelecomunicaciones.labMecatronica.name",
      descKey: "labs.redesTelecomunicaciones.labMecatronica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
    },
  ],
  administracion: [
    {
      nameKey: "labs.administracion.salaDesignThinking.name",
      descKey: "labs.administracion.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.administracion.salaMacs.name",
      descKey: "labs.administracion.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  contabilidad: [
    {
      nameKey: "labs.contabilidad.salaDesignThinking.name",
      descKey: "labs.contabilidad.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.contabilidad.salaMacs.name",
      descKey: "labs.contabilidad.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  economia: [
    {
      nameKey: "labs.economia.salaDesignThinking.name",
      descKey: "labs.economia.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.economia.salaMacs.name",
      descKey: "labs.economia.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  marketing: [
    {
      nameKey: "labs.marketing.tallerAudiovisual.name",
      descKey: "labs.marketing.tallerAudiovisual.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/ESTUDIO%20DE%20TV%201.jpg`,
    },
    {
      nameKey: "labs.marketing.cabinaAudio.name",
      descKey: "labs.marketing.cabinaAudio.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Cabina%20de%20producci%C3%B3n%20de%20audio.jpg`,
    },
    {
      nameKey: "labs.marketing.salaMacs.name",
      descKey: "labs.marketing.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  gastronomia: [
    {
      nameKey: "labs.gastronomia.labTecnicasDieteticas.name",
      descKey: "labs.gastronomia.labTecnicasDieteticas.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/Laboratorio%20de%20Nutrici%C3%B3n%20y%20Diet%C3%A9tica%201.jpg`,
    },
    {
      nameKey: "labs.gastronomia.labProcesosIndustriales.name",
      descKey: "labs.gastronomia.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
  ],
  "administracion-negocios-internacionales": [
    {
      nameKey: "labs.administracionNegociosInternacionales.salaDesignThinking.name",
      descKey: "labs.administracionNegociosInternacionales.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.administracionNegociosInternacionales.salaMacs.name",
      descKey: "labs.administracionNegociosInternacionales.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  "ingenieria-economica-negocios": [
    {
      nameKey: "labs.ingenieriaEconomicaNegocios.salaDesignThinking.name",
      descKey: "labs.ingenieriaEconomicaNegocios.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.ingenieriaEconomicaNegocios.salaMacs.name",
      descKey: "labs.ingenieriaEconomicaNegocios.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  "ingenieria-empresarial": [
    {
      nameKey: "labs.ingenieriaEmpresarial.salaDesignThinking.name",
      descKey: "labs.ingenieriaEmpresarial.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.ingenieriaEmpresarial.labProcesosIndustriales.name",
      descKey: "labs.ingenieriaEmpresarial.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
    {
      nameKey: "labs.ingenieriaEmpresarial.salaMacs.name",
      descKey: "labs.ingenieriaEmpresarial.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  educacion: [
    {
      nameKey: "labs.educacion.salaDesignThinking.name",
      descKey: "labs.educacion.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.educacion.salaMacs.name",
      descKey: "labs.educacion.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  "educacion-inicial": [
    {
      nameKey: "labs.educacionInicial.salaDesignThinking.name",
      descKey: "labs.educacionInicial.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.educacionInicial.camaraGesell.name",
      descKey: "labs.educacionInicial.camaraGesell.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20GESSEL%201.jpg`,
    },
  ],
  "educacion-primaria": [
    {
      nameKey: "labs.educacionPrimaria.salaDesignThinking.name",
      descKey: "labs.educacionPrimaria.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.educacionPrimaria.salaMacs.name",
      descKey: "labs.educacionPrimaria.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  "diseno-ux": [
    {
      nameKey: "labs.disenoUx.salaMacs.name",
      descKey: "labs.disenoUx.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.disenoUx.salaDesignThinking.name",
      descKey: "labs.disenoUx.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.disenoUx.tallerAudiovisual.name",
      descKey: "labs.disenoUx.tallerAudiovisual.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/ESTUDIO%20DE%20TV%201.jpg`,
    },
  ],
  "ingenieria-diseno-grafico": [
    {
      nameKey: "labs.ingenieriaDisenoGrafico.salaMacs.name",
      descKey: "labs.ingenieriaDisenoGrafico.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaDisenoGrafico.tallerAudiovisual.name",
      descKey: "labs.ingenieriaDisenoGrafico.tallerAudiovisual.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/ESTUDIO%20DE%20TV%201.jpg`,
    },
    {
      nameKey: "labs.ingenieriaDisenoGrafico.cabinaAudio.name",
      descKey: "labs.ingenieriaDisenoGrafico.cabinaAudio.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Cabina%20de%20producci%C3%B3n%20de%20audio.jpg`,
    },
  ],
  periodismo: [
    {
      nameKey: "labs.periodismo.tallerAudiovisual.name",
      descKey: "labs.periodismo.tallerAudiovisual.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/ESTUDIO%20DE%20TV%201.jpg`,
    },
    {
      nameKey: "labs.periodismo.cabinaAudio.name",
      descKey: "labs.periodismo.cabinaAudio.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Cabina%20de%20producci%C3%B3n%20de%20audio.jpg`,
    },
    {
      nameKey: "labs.periodismo.salaMacs.name",
      descKey: "labs.periodismo.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  "ciencias-comunicacion": [
    {
      nameKey: "labs.cienciasComunicacion.tallerAudiovisual.name",
      descKey: "labs.cienciasComunicacion.tallerAudiovisual.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/ESTUDIO%20DE%20TV%201.jpg`,
    },
    {
      nameKey: "labs.cienciasComunicacion.cabinaAudio.name",
      descKey: "labs.cienciasComunicacion.cabinaAudio.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Cabina%20de%20producci%C3%B3n%20de%20audio.jpg`,
    },
    {
      nameKey: "labs.cienciasComunicacion.salaDesignThinking.name",
      descKey: "labs.cienciasComunicacion.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
  ],
  "comunicacion-publicidad": [
    {
      nameKey: "labs.comunicacionPublicidad.tallerAudiovisual.name",
      descKey: "labs.comunicacionPublicidad.tallerAudiovisual.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/ESTUDIO%20DE%20TV%201.jpg`,
    },
    {
      nameKey: "labs.comunicacionPublicidad.cabinaAudio.name",
      descKey: "labs.comunicacionPublicidad.cabinaAudio.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Cabina%20de%20producci%C3%B3n%20de%20audio.jpg`,
    },
    {
      nameKey: "labs.comunicacionPublicidad.salaDesignThinking.name",
      descKey: "labs.comunicacionPublicidad.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
  ],
  turismo: [
    {
      nameKey: "labs.turismo.salaDesignThinking.name",
      descKey: "labs.turismo.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.turismo.labProcesosIndustriales.name",
      descKey: "labs.turismo.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
  ],
  "relaciones-internacionales": [
    {
      nameKey: "labs.relacionesInternacionales.salaDesignThinking.name",
      descKey: "labs.relacionesInternacionales.salaDesignThinking.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
    },
    {
      nameKey: "labs.relacionesInternacionales.salaMacs.name",
      descKey: "labs.relacionesInternacionales.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
  ],
  "biologia-marina": [
    {
      nameKey: "labs.biologiaMarina.labProcesosIndustriales.name",
      descKey: "labs.biologiaMarina.labProcesosIndustriales.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB%20DE%20PROCESOS%20INDUSTRIALES%203.jpg`,
    },
    {
      nameKey: "labs.biologiaMarina.labHidraulica.name",
      descKey: "labs.biologiaMarina.labHidraulica.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20HIDR%C3%81ULICA%201.jpg`,
    },
  ],
  "traduccion-interpretacion": [
    {
      nameKey: "labs.traduccionInterpretacion.salaMacs.name",
      descKey: "labs.traduccionInterpretacion.salaMacs.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LABORATORIO%20DE%20COMPUTADORAS%20MAC%201.jpg`,
    },
    {
      nameKey: "labs.traduccionInterpretacion.cabinaAudio.name",
      descKey: "labs.traduccionInterpretacion.cabinaAudio.desc",
      img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/Cabina%20de%20producci%C3%B3n%20de%20audio.jpg`,
    },
  ],
};

const ALL_LABS: Lab[] = [
  {
    nameKey: "labs.all.hospitalSimulado.name",
    descKey: "labs.all.hospitalSimulado.desc",
    img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/HOSPITAL%20SIMULADO_1%202.jpg`,
  },
  {
    nameKey: "labs.all.salaAudiencias.name",
    descKey: "labs.all.salaAudiencias.desc",
    img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALADEAUDIENCIA%201.webp`,
  },
  {
    nameKey: "labs.all.tallerArquitectura.name",
    descKey: "labs.all.tallerArquitectura.desc",
    img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/TALLER%20DE%20ARQUITECTURA.jpg`,
  },
  {
    nameKey: "labs.all.salaDesignThinking.name",
    descKey: "labs.all.salaDesignThinking.desc",
    img: `${BASE}/descubre-utp/sites/consideracion/files/noticias/SALA%20DESIGN%20THINKING%203.jpg`,
  },
  {
    nameKey: "labs.all.salaBIM.name",
    descKey: "labs.all.salaBIM.desc",
    img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20BIM%201.jpg`,
  },
  {
    nameKey: "labs.all.labMecatronica.name",
    descKey: "labs.all.labMecatronica.desc",
    img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/LAB.%20DE%20MECATR%C3%93NICA%201.jpg`,
  },
  {
    nameKey: "labs.all.camaraGesell.name",
    descKey: "labs.all.camaraGesell.desc",
    img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/SALA%20GESSEL%201.jpg`,
  },
  {
    nameKey: "labs.all.tallerAudiovisual.name",
    descKey: "labs.all.tallerAudiovisual.desc",
    img: `${BASE}/descubre-utp/sites/consideracion/files/imagenes/ESTUDIO%20DE%20TV%201.jpg`,
  },
];

const CAREER_META: Record<string, { title: string; emoji: string; color: string; gradient: string }> = {
  software:          { title: "Ingeniería de Software",           emoji: "💻", color: "#166534", gradient: "linear-gradient(135deg,#052e16,#166534)" },
  medicina:          { title: "Medicina Humana",                  emoji: "🏥", color: "#0369a1", gradient: "linear-gradient(135deg,#0369a1,#0ea5e9)" },
  derecho:           { title: "Derecho",                          emoji: "⚖️", color: "#b45309", gradient: "linear-gradient(135deg,#78350f,#d97706)" },
  administracion:    { title: "Administración",                   emoji: "📊", color: "#7c3aed", gradient: "linear-gradient(135deg,#4c1d95,#7c3aed)" },
  contabilidad:      { title: "Contabilidad",                     emoji: "🧾", color: "#0891b2", gradient: "linear-gradient(135deg,#155e75,#0891b2)" },
  "ingenieria-civil":{ title: "Ingeniería Civil",                 emoji: "🏗️", color: "#92400e", gradient: "linear-gradient(135deg,#451a03,#b45309)" },
  arquitectura:      { title: "Arquitectura",                     emoji: "🏛️", color: "#1d4ed8", gradient: "linear-gradient(135deg,#1e3a8a,#3b82f6)" },
  psicologia:        { title: "Psicología",                       emoji: "🧠", color: "#6d28d9", gradient: "linear-gradient(135deg,#2e1065,#6d28d9)" },
  marketing:         { title: "Marketing",                        emoji: "📣", color: "#be185d", gradient: "linear-gradient(135deg,#4a044e,#be185d)" },
  "diseno-ux":       { title: "Diseño UX/UI",                     emoji: "🎨", color: "#db2777", gradient: "linear-gradient(135deg,#831843,#db2777)" },
  enfermeria:        { title: "Enfermería",                       emoji: "💉", color: "#0891b2", gradient: "linear-gradient(135deg,#155e75,#0891b2)" },
  "ingenieria-industrial": { title: "Ingeniería Industrial",      emoji: "⚙️", color: "#475569", gradient: "linear-gradient(135deg,#1e293b,#475569)" },
  economia:          { title: "Economía y Finanzas",               emoji: "💹", color: "#16a34a", gradient: "linear-gradient(135deg,#14532d,#16a34a)" },
  gastronomia:       { title: "Gastronomía",                      emoji: "🍳", color: "#c2410c", gradient: "linear-gradient(135deg,#7c2d12,#ea580c)" },
  periodismo:        { title: "Periodismo",                       emoji: "📰", color: "#1d4ed8", gradient: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
  "ingenieria-minas":{ title: "Ingeniería de Minas",              emoji: "⛏️", color: "#92400e", gradient: "linear-gradient(135deg,#451a03,#d97706)" },
  odontologia:       { title: "Odontología",                      emoji: "🦷", color: "#0284c7", gradient: "linear-gradient(135deg,#075985,#0284c7)" },
  "ingenieria-ambiental":{ title: "Ingeniería Ambiental",         emoji: "🌿", color: "#16a34a", gradient: "linear-gradient(135deg,#14532d,#22c55e)" },
  educacion:         { title: "Educación & Pedagogía",            emoji: "📚", color: "#7c3aed", gradient: "linear-gradient(135deg,#4c1d95,#8b5cf6)" },
  nutricion:         { title: "Nutrición y Dietética",            emoji: "🥗", color: "#16a34a", gradient: "linear-gradient(135deg,#14532d,#4ade80)" },
  turismo:           { title: "Turismo y Hotelería",              emoji: "✈️", color: "#0891b2", gradient: "linear-gradient(135deg,#155e75,#22d3ee)" },
  "relaciones-internacionales":{ title: "Relaciones Internacionales", emoji: "🌐", color: "#1d4ed8", gradient: "linear-gradient(135deg,#1e3a8a,#60a5fa)" },
  veterinaria:       { title: "Medicina Veterinaria",             emoji: "🐾", color: "#d97706", gradient: "linear-gradient(135deg,#78350f,#f59e0b)" },
  "administracion-negocios-internacionales":{ title: "Administración y Negocios Internacionales", emoji: "🌍", color: "#2563eb", gradient: "linear-gradient(135deg,#1e3a8a,#3b82f6)" },
  "biologia-marina": { title: "Biología Marina",                  emoji: "🐠", color: "#0d9488", gradient: "linear-gradient(135deg,#115e59,#14b8a6)" },
  "ciencia-computacion":{ title: "Ciencia de la Computación",     emoji: "🖥️", color: "#6d28d9", gradient: "linear-gradient(135deg,#3b0764,#8b5cf6)" },
  "ciencias-comunicacion":{ title: "Ciencias de la Comunicación", emoji: "🎙️", color: "#0891b2", gradient: "linear-gradient(135deg,#155e75,#06b6d4)" },
  "comunicacion-publicidad":{ title: "Comunicación y Publicidad", emoji: "📢", color: "#e11d48", gradient: "linear-gradient(135deg,#881337,#fb7185)" },
  "educacion-inicial":{ title: "Educación Inicial",               emoji: "🧸", color: "#f43f5e", gradient: "linear-gradient(135deg,#9f1239,#fb7185)" },
  "educacion-primaria":{ title: "Educación Primaria",             emoji: "📚", color: "#eab308", gradient: "linear-gradient(135deg,#854d0e,#facc15)" },
  "ingenieria-biomedica":{ title: "Ingeniería Biomédica",         emoji: "🦾", color: "#0ea5e9", gradient: "linear-gradient(135deg,#075985,#38bdf8)" },
  "ingenieria-ciberseguridad":{ title: "Ingeniería de Ciberseguridad", emoji: "🔐", color: "#1e293b", gradient: "linear-gradient(135deg,#0f172a,#334155)" },
  "ingenieria-diseno-grafico":{ title: "Ingeniería de Diseño Gráfico", emoji: "🎨", color: "#db2777", gradient: "linear-gradient(135deg,#831843,#f472b6)" },
  "ingenieria-sistemas-informacion":{ title: "Ingeniería de Sistemas de Información", emoji: "🗄️", color: "#0891b2", gradient: "linear-gradient(135deg,#155e75,#22d3ee)" },
  "ingenieria-sistemas":{ title: "Ingeniería de Sistemas",        emoji: "⚙️", color: "#475569", gradient: "linear-gradient(135deg,#1e293b,#64748b)" },
  "ingenieria-transporte":{ title: "Ingeniería de Transporte",    emoji: "🚆", color: "#2563eb", gradient: "linear-gradient(135deg,#1e3a8a,#60a5fa)" },
  "ingenieria-economica-negocios":{ title: "Ingeniería Económica", emoji: "📈", color: "#16a34a", gradient: "linear-gradient(135deg,#14532d,#4ade80)" },
  "ingenieria-electronica":{ title: "Ingeniería Electrónica",     emoji: "⚡", color: "#d97706", gradient: "linear-gradient(135deg,#78350f,#f59e0b)" },
  "ingenieria-empresarial":{ title: "Ingeniería Empresarial",     emoji: "🏢", color: "#7c3aed", gradient: "linear-gradient(135deg,#4c1d95,#a78bfa)" },
  "ingenieria-maritima":{ title: "Ingeniería Marítima",           emoji: "🚢", color: "#0d9488", gradient: "linear-gradient(135deg,#115e59,#2dd4bf)" },
  "ingenieria-mecanica":{ title: "Ingeniería Mecánica",           emoji: "🔧", color: "#64748b", gradient: "linear-gradient(135deg,#1e293b,#94a3b8)" },
  "ingenieria-mecatronica":{ title: "Ingeniería Mecatrónica",     emoji: "🤖", color: "#0ea5e9", gradient: "linear-gradient(135deg,#075985,#38bdf8)" },
  "ingenieria-naval":{ title: "Ingeniería Naval",                 emoji: "⚓", color: "#1d4ed8", gradient: "linear-gradient(135deg,#1e3a8a,#60a5fa)" },
  obstetricia:       { title: "Obstetricia",                       emoji: "🤰", color: "#e11d48", gradient: "linear-gradient(135deg,#881337,#fb7185)" },
  "psicologia-consumidor":{ title: "Psicología del Consumidor",   emoji: "🛍️", color: "#f43f5e", gradient: "linear-gradient(135deg,#9f1239,#fb7185)" },
  "redes-telecomunicaciones":{ title: "Redes y Telecomunicaciones", emoji: "📡", color: "#0891b2", gradient: "linear-gradient(135deg,#155e75,#22d3ee)" },
  "tecnologia-medica":{ title: "Tecnología Médica",               emoji: "🔬", color: "#0ea5e9", gradient: "linear-gradient(135deg,#075985,#38bdf8)" },
  "traduccion-interpretacion":{ title: "Traducción e Interpretación", emoji: "🌐", color: "#7c3aed", gradient: "linear-gradient(135deg,#4c1d95,#a78bfa)" },
};

function LabGallery() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const careerKey = params.get("career") ?? "";

  const labs = LABS_BY_CAREER[careerKey] ?? ALL_LABS;
  const meta = CAREER_META[careerKey];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f0f9ff_0%,#e0f2fe_100%)]">
      <Navbar />

      {/* Hero */}
      <div
        className="relative overflow-hidden px-6 py-14 text-center"
        style={{
          background: meta?.gradient ?? "linear-gradient(135deg,#1e3a8a,#3b82f6)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <p className="text-white/60 text-sm uppercase tracking-widest font-medium mb-2">
            {t("laboratorios.infraestructuraUtp")}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {meta ? `${meta.emoji} Laboratorios de ${meta.title}` : `${"🔬"} ${t("laboratorios.conoceNuestrosLaboratorios")}`}
          </h1>
          <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto">
            {t("laboratorios.instalacionesClaseMundial")}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs text-white/80 backdrop-blur-sm border border-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            {labs.length === 1
              ? t("laboratorios.unLaboratorioDisponible", { count: labs.length })
              : t("laboratorios.laboratoriosDisponibles", { count: labs.length })}
          </div>
        </motion.div>
      </div>

      {/* Gallery grid */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab, i) => (
            <motion.div
              key={lab.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52 bg-slate-100">
                <img
                  src={lab.img}
                  alt={lab.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="flex h-full items-center justify-center text-5xl">${meta?.emoji ?? "🔬"}</div>`;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div
                  className="mb-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                  style={{ background: meta?.color ?? "#1d4ed8" }}
                >
                  UTP
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-900 leading-snug">
                  {lab.name ?? t(lab.nameKey ?? "")}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  {lab.desc ?? t(lab.descKey ?? "")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href={careerKey ? `/test` : "/carreras"}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
            style={{ background: meta?.gradient ?? "linear-gradient(135deg,#1e3a8a,#3b82f6)" }}
          >
            ← {careerKey ? t("laboratorios.volverAlTest") : t("laboratorios.explorarCarreras")}
          </a>
          <p className="mt-4 text-xs text-slate-400">
            {t("laboratorios.infoOficial")}{" "}
            <a
              href="https://www.utp.edu.pe/descubre-utp/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600"
            >
              utp.edu.pe/descubre-utp
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default function LaboratoriosPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#f0f9ff,#e0f2fe)]">
          <p className="text-slate-400">{t("laboratorios.cargandoLaboratorios")}</p>
        </div>
      }
    >
      <LabGallery />
    </Suspense>
  );
}
