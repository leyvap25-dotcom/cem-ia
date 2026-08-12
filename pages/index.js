import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";

// ─── COLORES ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#f7f8fc", white:"#fff", border:"#e4e8f0",
  accent:"#2563eb", al:"#eff6ff",
  red:"#dc2626", rl:"#fef2f2",
  green:"#16a34a", gl:"#f0fdf4",
  yellow:"#d97706", yl:"#fffbeb",
  purple:"#7c3aed", pl:"#f5f3ff",
  text:"#111827", muted:"#6b7280", light:"#9ca3af",
};

const EQUIPO_SVG = {
  IMG_00:"data:image/jpeg;base64,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...`,
  IMG_12:"data:image/jpeg;base64,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",
  IMG_13:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjYwIDE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjgiIHk9IjM1IiB3aWR0aD0iMjQ0IiBoZWlnaHQ9IjgyIiByeD0iOCIgZmlsbD0iIzM3NDE1MSIvPjx0ZXh0IHg9IjEzMCIgeT0iODMiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2MGE1ZmAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVOT1ggQ09NUEFDVDwvdGV4dD48L3N2Zz4=",
};

const EQUIPOS = [
  { tipo:"Horno", icon:"🔥", marcas:[
    { nombre:"Rational", refs:[
      { ref:"SCC WE 61G",         favorito:false, img:EQUIPO_SVG.IMG_00, desc:"SelfCookingCenter · 6×1/1 GN · Gas · Piso" },
      { ref:"SCC WE 101G",        favorito:false, img:EQUIPO_SVG.IMG_12, desc:"SelfCookingCenter · 10×1/1 GN · Gas · Piso" },
      { ref:"SCC XS 6 2/3 E",     favorito:false, img:EQUIPO_SVG.IMG_01, desc:"iCombi Pro XS · 6×2/3 GN · Eléctrico · Sobremesa" },
      { ref:"SCC XS UV Plus",     favorito:false, img:EQUIPO_SVG.IMG_01, desc:"iCombi XS UV Plus · 6×2/3 GN · Conexión red" },
    ]},
    { nombre:"Unox", refs:[
      { ref:"XECC-0513-EPRM",     favorito:false, img:EQUIPO_SVG.IMG_13, desc:"ChefTop MIND.Maps™ PLUS Compact · 5×GN 1/3 · Eléctrico" },
      { ref:"XECC-0523-EPRM",     favorito:false, img:EQUIPO_SVG.IMG_02, desc:"ChefTop MIND.Maps™ PLUS Compact · 5×GN 2/3 · Eléctrico" },
      { ref:"XEFT-04HS-ELDV",     favorito:false, img:EQUIPO_SVG.IMG_03, desc:"Arianna BakerLux Shop.Pro™ LED · 4×460×330 · 3.5 kW" },
      { ref:"XEFR-04HS-ELDV",     favorito:false, img:EQUIPO_SVG.IMG_10, desc:"Arianna BakerLux Shop.Pro™ LED · con vapor" },
      { ref:"XEFR-04EU-ELDV",     favorito:false, img:EQUIPO_SVG.IMG_03, desc:"BakerLux Shop.Pro™ LED · 4×600×400 · Eléctrico" },
      { ref:"XEVC-0511-GPRM",     favorito:false, img:EQUIPO_SVG.IMG_11, desc:"ChefTop MIND.Maps™ ONE · 5×GN 1/1 · Gas" },
    ]},
    { nombre:"Zanolli", refs:[
      { ref:"Synthesis 08/50 Gas", favorito:false, img:EQUIPO_SVG.IMG_04, desc:"Horno túnel pizza · Banda 50 cm · Gas" },
      { ref:"Synthesis 06/40 Gas", favorito:false, img:EQUIPO_SVG.IMG_04, desc:"Horno túnel pizza · Banda 40 cm · Gas" },
    ]},
    { nombre:"Turbochef", refs:[
      { ref:"HHC2020",  favorito:false, img:EQUIPO_SVG.IMG_05, desc:"High h Conveyor 2020 · Alta velocidad · Ventless" },
      { ref:"HHC1618",  favorito:false, img:EQUIPO_SVG.IMG_06, desc:"High h Conveyor 1618 · Alta velocidad · Ventless" },
    ]},
  ]},
  { tipo:"Cafetera", icon:"☕", marcas:[
    { nombre:"Bunn", refs:[
      { ref:"VPR",        favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Pour-over · 2 warmers · 120V · 1575W" },
      { ref:"AXIOM",      favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Doble decanter · pantalla digital" },
      { ref:"TF DBC",     favorito:false, img:EQUIPO_SVG.IMG_07, desc:"ThermoFresh DBC · acero inox" },
      { ref:"TF SERVER",  favorito:false, img:EQUIPO_SVG.IMG_07, desc:"ThermoFresh Server · dispensador térmico" },
      { ref:"CW15-APS",   favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Cafetera goteo automática · 1 tanque · 120V · 1700W" },
      { ref:"CW15-ADS",   favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Cafetera goteo automática · 1 tanque · variante ADS" },
      { ref:"ICB-DV",     favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Cafetera goteo automática · dual voltage · 120V" },
      { ref:"ICB DU",     favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Cafetera goteo automática · modelo DU" },
    ]},
    { nombre:"Rancilio", refs:[
      { ref:"Lasse",           favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Cafetera capuchino automática · 1 grupo" },
      { ref:"CLASSE 5 USB 2/C",favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Cafetera espresso 2 grupos · digital · USB" },
      { ref:"S2",              favorito:false, img:EQUIPO_SVG.IMG_07, desc:"Cafetera espresso 2 grupos · manual" },
    ]},
  ]},
  { tipo:"Granizadora", icon:"🧊", marcas:[
    { nombre:"Bunn", refs:[
      { ref:"ULTRA-2", favorito:false, img:EQUIPO_SVG.IMG_08, desc:"2 tambores · 4.7 L c/u · 120V" },
      { ref:"ULTRA-1", favorito:false, img:EQUIPO_SVG.IMG_09, desc:"1 tambor · 4.7 L · compacta" },
      { ref:"FMD",     favorito:false, img:EQUIPO_SVG.IMG_08, desc:"3 tambores · alta producción" },
    ]},
  ]},
  { tipo:"Nevera / Congelador", icon:"❄️", marcas:[
    { nombre:"Imbera", refs:[
      { ref:"G326-D2",              favorito:false, img:"", desc:"Nevera vertical 1 puerta · exhibición bebidas" },
      { ref:"G342",                 favorito:false, img:"", desc:"Nevera vertical 2 puertas · exhibición bebidas" },
      { ref:"CV18-F1",              favorito:false, img:"", desc:"Congelador horizontal 1 puerta abatible" },
      { ref:"VR08-E1",              favorito:false, img:"", desc:"Nevera vertical bajo mostrador" },
      { ref:"VR20",                 favorito:false, img:"", desc:"Nevera vertical 1 puerta" },
      { ref:"VR09 OC-E1 P2D115BG", favorito:false, img:"", desc:"Nevera vertical open cooler" },
      { ref:"NF11-B1-P2D115BGCFN", favorito:false, img:"", desc:"Nevera de aguila light" },
      { ref:"FV20PP",               favorito:false, img:"", desc:"Nevera vertical 2 puertas" },
      { ref:"6326-D2 E2D115BGCIR",  favorito:false, img:"", desc:"Nevera vertical exhibidora" },
      { ref:"G319 OC",              favorito:false, img:"", desc:"Refrigerador open cooler" },
      { ref:"VR20-D1",              favorito:false, img:"", desc:"Refrigerador vertical 1 puerta" },
    ]},
    { nombre:"Parker", refs:[
      { ref:"LRB-771PC",            favorito:false, img:"", desc:"Refrigerador vertical 1 ala" },
      { ref:"LRB-771PC-HC",         favorito:false, img:"", desc:"Refrigerador vertical 1 ala HC" },
      { ref:"LRB-1471 PC",          favorito:false, img:"", desc:"Refrigerador vertical 2 alas" },
      { ref:"LFB-771PC",            favorito:false, img:"", desc:"Congelador vertical 1 ala" },
      { ref:"LFB-1471PC",           favorito:false, img:"", desc:"Congelador vertical 2 alas" },
      { ref:"LUCR48",               favorito:false, img:"", desc:"Nevera bajo mostrador 48 pulgadas" },
      { ref:"LUCR27",               favorito:false, img:"", desc:"Nevera bajo mostrador 27 pulgadas" },
      { ref:"LUCR72-HC",            favorito:false, img:"", desc:"Nevera bajo mostrador 72 pulgadas HC" },
      { ref:"LUCF48-HC_PK126",      favorito:false, img:"", desc:"Congelador bajo mostrador 48 pulgadas" },
      { ref:"LUCF27-HC_PK126",      favorito:false, img:"", desc:"Congelador bajo mostrador 27 pulgadas" },
      { ref:"LST27",                favorito:false, img:"", desc:"Nevera bajo mostrador 27 pulgadas" },
      { ref:"LST48",                favorito:false, img:"", desc:"Nevera bajo mostrador 48 pulgadas" },
      { ref:"ASUB-28-P8",           favorito:false, img:"", desc:"Nevera topinera bajo mostrador" },
      { ref:"AB-23F",               favorito:false, img:"", desc:"Nevera bajo mostrador 23 pulgadas" },
      { ref:"LFR 147IDC",           favorito:false, img:"", desc:"Congelador vertical 2 alas" },
    ]},
    { nombre:"Turbo Air", refs:[
      { ref:"TGM-48RB",             favorito:false, img:"", desc:"Refrigerador vertical 2 alas gaseosas" },
      { ref:"TGM-69RB",             favorito:false, img:"", desc:"Nevera vertical 2 puertas · 69 pulgadas" },
      { ref:"TGM-72RSB-N",          favorito:false, img:"", desc:"Nevera vertical 2 puertas · 72 pulgadas" },
      { ref:"TGM-69RB-N",           favorito:false, img:"", desc:"Nevera vertical 2 puertas · nueva serie N" },
      { ref:"TGM-48R-N",            favorito:false, img:"", desc:"Nevera vertical 48 pulgadas serie N" },
      { ref:"TUR-28SD",             favorito:false, img:"", desc:"Nevera baja bajo mostrador 28 pulgadas" },
      { ref:"TUR-48SD",             favorito:false, img:"", desc:"Nevera baja 2 puertas 48 pulgadas" },
      { ref:"TUF-28SD",             favorito:false, img:"", desc:"Nevera bajo mostrador 28 pulgadas" },
      { ref:"TUF-28SD-N",           favorito:false, img:"", desc:"Nevera bajo mostrador 28 pulgadas serie N" },
      { ref:"TST-28SD",             favorito:false, img:"", desc:"Nevera bajo mostrador corredera" },
      { ref:"TSF-28D",              favorito:false, img:"", desc:"Nevera bajo mostrador 28 pulgadas corredera" },
      { ref:"TSF-49SD",             favorito:false, img:"", desc:"Nevera bajo mostrador 49 pulgadas" },
      { ref:"TSF-49SD-N",           favorito:false, img:"", desc:"Refrigerador bajo mostrador 49 pulgadas N" },
      { ref:"TSF-23SD-N",           favorito:false, img:"", desc:"Refrigerador bajo mostrador 23 pulgadas N" },
      { ref:"
