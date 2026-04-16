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
  IMG_00:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiNmMGY0ZjgiLz4KICA8IS0tIExlZ3MgLS0+CiAgPHJlY3QgeD0iMjgiIHk9IjE5NCIgd2lkdGg9IjE0IiBoZWlnaHQ9IjMyIiByeD0iMyIgZmlsbD0iIzk0YTNiOCIvPgogIDxyZWN0IHg9IjEwNCIgeT0iMTk0IiB3aWR0aD0iMTQiIGhlaWdodD0iMzIiIHJ4PSIzIiBmaWxsPSIjOTRhM2I4Ii8+CiAgPHJlY3QgeD0iMjIiIHk9IjIyMCIgd2lkdGg9IjExMiIgaGVpZ2h0PSI2IiByeD0iMiIgZmlsbD0iIzk0YTNiOCIvPgogIDwh",
  IMG_01:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiNmMGY0ZjgiLz4KICA8cmVjdCB4PSIxMiIgeT0iMTUiIHdpZHRoPSIxNzYiIGhlaWdodD0iMTc0IiByeD0iMTAiIGZpbGw9IiNlMmU4ZjAiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICA8cmVjdCB4PSIxOCIgeT0iMjEiIHdpZHRoPSIxNjIiIGhlaWdodD0iMTYyIiByeD0iOCIgZmlsbD0iI2Y4ZmFmYyIvPgo=",
  IMG_02:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIyMCIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjEyIiB5PSIxOCIgd2lkdGg9IjE3NiIgaGVpZ2h0PSIxNjgiIHJ4PSIxMCIgZmlsbD0iI2QxZDVkYiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjBhNWZhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DSEVGVE9QPC90ZXh0Pjwvc3ZnPg==",
  IMG_03:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIyMCIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjEwIiB5PSIzMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxNDgiIHJ4PSI4IiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5M2M1ZmQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFSSUFOTkE8L3RleHQ+PC9zdmc+",
  IMG_04:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjYwIDE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjgiIHk9IjM1IiB3aWR0aD0iMjQ0IiBoZWlnaHQ9IjgyIiByeD0iOCIgZmlsbD0iIzM3NDE1MSIvPjx0ZXh0IHg9IjEzMCIgeT0iODMiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2MGE1ZmEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPloP",
  IMG_05:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQwIDE4NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE4NSIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjEwIiB5PSIxNSIgd2lkdGg9IjIyMCIgaGVpZ2h0PSIxMzAiIHJ4PSI4IiBmaWxsPSIjMmQzNzQ4Ii8+PHRleHQgeD0iMTIwIiB5PSI4NSIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2Y5NzMxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VFVSQk9DSEVGIDIwMjA8L3RleHQ+PC9zdmc+",
  IMG_06:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjIwIDE3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjIwIiBoZWlnaHQ9IjE3NSIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjEwIiB5PSIxNSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIHJ4PSI4IiBmaWxsPSIjMmQzNzQ4Ii8+PHRleHQgeD0iMTEwIiB5PSI4MCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2Y5NzMxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VFVSQk9DSEVGIDE2MTg8L3RleHQ+PC9zdmc+",
  IMG_07:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYwIDIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjIxMCIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjIyIiB5PSIyMCIgd2lkdGg9IjExNiIgaGVpZ2h0PSIxMjYiIHJ4PSI3IiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iODAiIHk9Ijk1IiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+QlVOTjwvdGV4dD48L3N2Zz4=",
  IMG_08:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkwIDIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTkwIiBoZWlnaHQ9IjIyMCIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjE4IiB5PSIxMzIiIHdpZHRoPSIxNTQiIGhlaWdodD0iNjgiIHJ4PSI3IiBmaWxsPSIjZDFkNWRiIi8+PGVsbGlwc2UgY3g9IjU4IiBjeT0iOTUiIHJ4PSIzNiIgcnk9IjQ0IiBmaWxsPSIjYmZkYmZlIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIvPjxlbGxpcHNlIGN4PSIxMzIiIGN5PSI5NSIgcng9IjM2IiByeT0iNDQiIGZpbGw9IiNiYmY3ZDAiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+",
  IMG_09:"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTUwIDIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIyMCIgZmlsbD0iI2YwZjRmOCIvPjxyZWN0IHg9IjE1IiB5PSIxMzAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNjgiIHJ4PSI3IiBmaWxsPSIjZDFkNWRiIi8+PGVsbGlwc2UgY3g9Ijc1IiBjeT0iODgiIHJ4PSI0NCIgcnk9IjUwIiBmaWxsPSIjYmZkYmZlIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==",
};

const EQUIPOS = [
  { tipo:"Horno", icon:"🔥", marcas:[
    { nombre:"Rational", refs:[
      { ref:"SCC WE 61G",         favorito:false, img:EQUIPO_SVG.IMG_00, desc:"SelfCookingCenter · 6×1/1 GN · Gas · Piso" },
      { ref:"SCC WE 101G",        favorito:false, img:EQUIPO_SVG.IMG_00, desc:"SelfCookingCenter · 10×1/1 GN · Gas · Piso" },
      { ref:"SCC XS 6 2/3 E",     favorito:false, img:EQUIPO_SVG.IMG_01, desc:"iCombi Pro XS · 6×2/3 GN · Eléctrico · Sobremesa" },
      { ref:"SCC XS UV Plus",     favorito:false, img:EQUIPO_SVG.IMG_01, desc:"iCombi XS UV Plus · 6×2/3 GN · Conexión red" },
    ]},
    { nombre:"Unox", refs:[
      { ref:"XECC-0523-EPRM",     favorito:false, img:EQUIPO_SVG.IMG_02, desc:"ChefTop MIND.Maps™ PLUS Compact · 5×GN 2/3 · Eléctrico" },
      { ref:"XEFT-04HS-ELDV",     favorito:false, img:EQUIPO_SVG.IMG_03, desc:"Arianna BakerLux Shop.Pro™ LED · 4×460×330 · 3.5 kW" },
      { ref:"XEFR-04HS-ELDV",     favorito:false, img:EQUIPO_SVG.IMG_03, desc:"Arianna BakerLux Shop.Pro™ LED · con vapor" },
      { ref:"XEVC-0511-GPRM",     favorito:false, img:EQUIPO_SVG.IMG_02, desc:"ChefTop MIND.Maps™ ONE · 5×GN 1/1 · Gas" },
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
      { ref:"TSA 49SD-N",           favorito:false, img:"", desc:"Congelador bajo mostrador 49 pulgadas N" },
      { ref:"TSF-23SD",             favorito:false, img:"", desc:"Congelador bajo mostrador 23 pulgadas" },
      { ref:"GDM-23",               favorito:false, img:"", desc:"Refrigerador vertical 1 ala gaseosas · TRUE" },
    ]},
    { nombre:"Fogel", refs:[
      { ref:"CR-23-AC-AF-SA-HC",    favorito:false, img:"", desc:"Congelador horizontal 23 pulgadas HC" },
      { ref:"CR-49",                favorito:false, img:"", desc:"Congelador horizontal 49 pulgadas" },
      { ref:"MTR-27-FP",            favorito:false, img:"", desc:"Nevera vertical 27 pulgadas" },
      { ref:"MTR-48",               favorito:false, img:"", desc:"Nevera vertical 48 pulgadas" },
      { ref:"MTF27",                favorito:false, img:"", desc:"Congelador vertical 27 pulgadas" },
    ]},
    { nombre:"Coldline", refs:[
      { ref:"FORTE SV17 R290",      favorito:false, img:"", desc:"Nevera vertical 17 pies refrigerante R290" },
      { ref:"FORTE SV17-D",         favorito:false, img:"", desc:"Nevera vertical 17 pies" },
      { ref:"Enfriador forte su13-D",favorito:false, img:"", desc:"Enfriador vertical 13 pies" },
    ]},
    { nombre:"Electrolux", refs:[
      { ref:"EFCC15C3HQW",          favorito:false, img:"", desc:"Congelador horizontal 15 pies" },
      { ref:"EHC08-E1 P2D115BG",    favorito:false, img:"", desc:"Nevera horizontal 8 pies" },
    ]},
    { nombre:"Wonder", refs:[
      { ref:"WC-215CZ",             favorito:false, img:"", desc:"Congelador horizontal tipo pecho" },
      { ref:"WCV-430PV",            favorito:false, img:"", desc:"Nevera vertical exhibidora" },
      { ref:"WCH-415VCC",           favorito:false, img:"", desc:"Nevera horizontal exhibidora" },
    ]},
    { nombre:"Tornado", refs:[
      { ref:"HC-VC27",              favorito:false, img:"", desc:"Congelador horizontal 27 pulgadas" },
      { ref:"HC-VC27F",             favorito:false, img:"", desc:"Congelador horizontal 27 pulgadas frost free" },
      { ref:"HC- UC48",             favorito:false, img:"", desc:"Nevera bajo mostrador 48 pulgadas" },
    ]},
    { nombre:"Dukers", refs:[
      { ref:"DUC29F",               favorito:false, img:"", desc:"Nevera bajo mostrador 29 pulgadas" },
      { ref:"DUC48F",               favorito:false, img:"", desc:"Nevera bajo mostrador 48 pulgadas" },
      { ref:"DUC48R",               favorito:false, img:"", desc:"Nevera bajo mostrador 48 pulgadas · puerta ciega" },
      { ref:"D28F",                 favorito:false, img:"", desc:"Congelador bajo mostrador 28 pulgadas" },
      { ref:"D55F",                 favorito:false, img:"", desc:"Nevera bajo mostrador 55 pulgadas" },
    ]},
    { nombre:"Infrico", refs:[
      { ref:"ERV83",                favorito:false, img:"", desc:"Nevera exhibidora 2 puertas" },
      { ref:"UC27R",                favorito:false, img:"", desc:"Nevera bajo mostrador 27 pulgadas" },
    ]},
    { nombre:"Inducol", refs:[
      { ref:"W-25DBL1PV",           favorito:false, img:"", desc:"Nevera vertical 2 puertas" },
      { ref:"VV-25",                favorito:false, img:"", desc:"Nevera vertical 25 pulgadas" },
      { ref:"W-13",                 favorito:false, img:"", desc:"Nevera bajo mostrador 13 pulgadas" },
    ]},
    { nombre:"Atosa", refs:[
      { ref:"MGF8405GR",            favorito:false, img:"", desc:"Congelador horizontal 1 puerta" },
      { ref:"MBF8001GR",            favorito:false, img:"", desc:"Congelador horizontal 1 puerta" },
      { ref:"MSF8303GR",            favorito:false, img:"", desc:"Nevera bajo mostrador 3 puertas" },
    ]},
    { nombre:"Crutek", refs:[
      { ref:"HROGXX03",             favorito:false, img:"", desc:"Nevera de leche cafetera" },
      { ref:"Hr06xx",               favorito:false, img:"", desc:"Nevera de leche cafetera compacta" },
    ]},
    { nombre:"Nordik", refs:[
      { ref:"K27f",                 favorito:false, img:"", desc:"Congelador vertical 1 ala" },
      { ref:"K27R",                 favorito:false, img:"", desc:"Refrigerador vertical 1 ala" },
    ]},
    { nombre:"Hoshizaki", refs:[
      { ref:"PR67A",                favorito:false, img:"", desc:"Nevera vertical bajo mostrador" },
      { ref:"CR15-FS",              favorito:false, img:"", desc:"Congelador horizontal" },
    ]},
    { nombre:"Lux", refs:[
      { ref:"MUC48",                favorito:false, img:"", desc:"Nevera bajo mostrador 48 pulgadas" },
      { ref:"M548",                 favorito:false, img:"", desc:"Nevera bajo mostrador 48 pulgadas" },
      { ref:"LUX-CUA23",            favorito:false, img:"", desc:"Nevera vertical 1 puerta" },
    ]},
    { nombre:"Indufrial", refs:[
      { ref:"HU210-MLC",            favorito:false, img:"", desc:"Congelador horizontal 210 litros" },
      { ref:"W450_RHC",             favorito:false, img:"", desc:"Congelador horizontal 450 litros" },
    ]},
  ]},
];

const getRefStr = (r) => typeof r === "string" ? r : r.ref;
const getRefImg  = (r) => typeof r === "object" ? r.img  : null;
const getRefDesc = (r) => typeof r === "object" ? r.desc : "";
const isRefFav   = (r) => typeof r === "object" && r.favorito === true;

const SINTOMAS = {
  Horno:["Código de error en pantalla","No genera vapor","No enciende","Gotea por la puerta","Ruidos extraños","Error durante la limpieza","Autolavado no funciona","Autolavado se interrumpe","No cierra el ciclo de lavado","Sobrecalentamiento","Sonda térmica","No alcanza temperatura","Quema los alimentos","Puerta no cierra bien","Burlete dañado o despegado","Ventilador no gira","Pantalla en blanco","Olor a quemado","Temperatura irregular","No enciende quemador (gas)","Falla eléctrica","CareControl en rojo","Pequeñas explosiones o detonaciones","Goteras en la parte inferior","Fuga de agua por la base","Humo dentro de la cámara","Cristal de puerta sucio o roto","Filtro de aire sucio","Luz de la cabina no funciona","Precalentamiento muy lento","Equipo se apaga solo"],
  Cafetera:["No calienta el agua","No extrae café","Gotea","No enciende","Error en pantalla","Poca presión"],
  Granizadora:["No enfría","No mezcla","Gotea","No enciende","Ruido extraño","Producto muy líquido","Producto muy sólido"],
  "Nevera / Congelador":["No enfría","Ruido extraño","Gotea agua","Escarcha excesiva","No enciende","Temperatura inestable"],
};

const SINTOMAS_OP = {
  Horno:["El horno no enciende","Hay un código de error en la pantalla","El horno gotea agua","El lavado automático no funciona","El burlete está despegado o roto","El horno quema los alimentos","La puerta no cierra bien","Hay humo o llamas dentro del horno","Ruidos fuertes o extraños","El horno tarda mucho en calentar"],
  Cafetera:["No calienta el agua","No sale café","Gotea por debajo","No enciende"],
  Granizadora:["No enfría","No mezcla","Gotea","No enciende"],
  "Nevera / Congelador":["No enfría","Hace ruido","Tiene mucho hielo","No enciende"],
};

const ALIAS_MARCA = [
  { words:["xecc","xecc-0523","cheftop","chef top","cheftop compact","chefto"], marca:"Unox", ref:"XECC-0523-EPRM" },
  { words:["xeft","xeft-04","arianna","ariana","bakerlux","ariann","xefr"], marca:"Unox", ref:"XEFT-04HS-ELDV" },
  { words:["xevc","xevc-0511","cheftop gas"], marca:"Unox", ref:"XEVC-0511-GPRM" },
  { words:["rational","racional","rasional"], marca:"Rational", ref:null },
  { words:["scc xs","icombi xs","xs","sccxs"], marca:"Rational", ref:"SCC XS 6 2/3 E" },
  { words:["icombi","icomby","combi pro","selfcooking"], marca:"Rational", ref:"SCC WE 61G" },
  { words:["scc we 61","scc61","61g"], marca:"Rational", ref:"SCC WE 61G" },
  { words:["scc we 101","scc101","101g"], marca:"Rational", ref:"SCC WE 101G" },
  { words:["unox"], marca:"Unox", ref:null },
  { words:["zanolli","zanoli","zanoly","synthesis","08/50","06/40"], marca:"Zanolli", ref:"Synthesis 08/50 Gas" },
  { words:["turbochef","turbo chef","turboshef","turbocheff"], marca:"Turbochef", ref:null },
  { words:["hhc2020","hhc 2020","2020"], marca:"Turbochef", ref:"HHC2020" },
  { words:["hhc1618","hhc 1618","1618"], marca:"Turbochef", ref:"HHC1618" },
  { words:["bunn","bun"], marca:"Bunn", ref:null },
  { words:["ultra-2","ultra2","ultra 2"], marca:"Bunn", ref:"ULTRA-2" },
  { words:["ultra-1","ultra1","ultra 1"], marca:"Bunn", ref:"ULTRA-1" },
  { words:["cw15-aps","cw15 aps","cw15aps","cw00"], marca:"Bunn", ref:"CW15-APS" },
  { words:["cw15-ads","cw15 ads","cw15ads"], marca:"Bunn", ref:"CW15-ADS" },
  { words:["icb-dv","icbdv","icb dv","icb0","icb du"], marca:"Bunn", ref:"ICB-DV" },
  { words:["tf server","tfserver","tf dbc"], marca:"Bunn", ref:"TF SERVER" },
  { words:["rancilio","rancilo"], marca:"Rancilio", ref:null },
  { words:["lasse"], marca:"Rancilio", ref:"Lasse" },
  { words:["classe 5","clase 5","classe5","clase5"], marca:"Rancilio", ref:"CLASSE 5 USB 2/C" },
];
const ALIAS_TIPO = [
  { words:["horno","oven","combi","convector"], tipo:"Horno" },
  { words:["cafetera","cafe","coffee","espresso"], tipo:"Cafetera" },
  { words:["granizadora","granizado","slush","frozen"], tipo:"Granizadora" },
  { words:["nevera","refri","refrigerador","congelador","frio","vitrina fría","vitrina refrigerada"], tipo:"Nevera / Congelador" },
];

const extraerPorReglas = (texto) => {
  const t = texto.toLowerCase().replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u");
  let tipo=null, marca=null, ref=null;
  for (const a of ALIAS_TIPO) { if (a.words.some(w=>t.includes(w))) { tipo=a.tipo; break; } }
  for (const a of ALIAS_MARCA) { if (a.words.some(w=>t.includes(w))) { marca=a.marca; if(a.ref)ref=a.ref; if(!tipo){const eq=EQUIPOS.find(e=>e.marcas.some(m=>m.nombre===a.marca));if(eq)tipo=eq.tipo;} break; } }
  return {tipo,marca,ref};
};

function RefCatalog({ marca, onSelect, mostrarOtra=true }) {
  if (!marca) return null;
  const lista = marca.refs || [];
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {lista.map(r => {
          const refStr = getRefStr(r);
          const img    = getRefImg(r);
          const desc   = getRefDesc(r);
          return (
            <div key={refStr} onClick={()=>onSelect(refStr)}
              style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,overflow:"hidden",cursor:"pointer",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
              <div style={{width:"100%",height:90,background:"#f8faff",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                {img ? (
                  <img src={img} alt={refStr} style={{width:"100%",height:"100%",objectFit:"contain",padding:6}}
                    onError={e=>{e.target.style.display="none";e.target.parentNode.innerHTML='<div style="font-size:32px;color:#9ca3af">🔧</div>';}}/>
                ) : (
                  <div style={{fontSize:32,color:C.light}}>🔧</div>
                )}
              </div>
              <div style={{padding:"8px 9px 10px"}}>
                <div style={{fontSize:11,fontWeight:700,lineHeight:1.3,marginBottom:2,color:C.text}}>{refStr}</div>
                {desc && <div style={{fontSize:9,color:C.muted,lineHeight:1.4}}>{desc}</div>}
              </div>
            </div>
          );
        })}
        {mostrarOtra && (
          <div onClick={()=>onSelect("Otra")}
            style={{background:C.bg,border:`1.5px dashed ${C.border}`,borderRadius:12,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,minHeight:90}}>
            <div style={{fontSize:22,marginBottom:4}}>➕</div>
            <div style={{fontSize:11,color:C.muted,fontWeight:600}}>Otra</div>
          </div>
        )}
      </div>
    </div>
  );
}

const TUTORIALES = {
  "Rational-limpieza": [
    { titulo:"Rational iCombi — Limpieza CleanJet+Care (oficial)", url:"https://www.youtube.com/watch?v=mTCXtHl6v1g", desc:"Canal oficial Rational AG", duracion:"4 min" },
    { titulo:"Rational SCC — Programa de limpieza paso a paso", url:"https://www.youtube.com/results?search_query=rational+selfcookingcenter+cleanjet+limpieza+espa%C3%B1ol", desc:"Búsqueda YouTube", duracion:"" },
  ],
  "Rational-burlete": [
    { titulo:"Cambio de burlete puerta Rational SCC (técnico)", url:"https://www.youtube.com/results?search_query=rational+SCC+cambio+burlete+puerta+door+seal+replacement", desc:"Búsqueda YouTube", duracion:"" },
    { titulo:"TikTok: cambio burlete Rational (hazlo tú mismo)", url:"https://www.tiktok.com/@katerinnegalvis/video/7276128350228335878", desc:"Técnico colombiano", duracion:"1 min" },
  ],
  "Unox-limpieza": [
    { titulo:"Unox ChefTop — Ciclo de lavado Det&Rinse (oficial)", url:"https://www.youtube.com/results?search_query=unox+cheftop+limpieza+lavado+det+rinse", desc:"Búsqueda YouTube", duracion:"" },
  ],
  "Unox-burlete": [
    { titulo:"Cambio de burlete / goma de puerta Unox ChefTop", url:"https://www.youtube.com/results?search_query=unox+cheftop+cambio+goma+burlete+puerta+door+seal", desc:"Búsqueda YouTube", duracion:"" },
  ],
  "Zanolli-limpieza": [
    { titulo:"Limpieza horno de pizza Zanolli", url:"https://www.youtube.com/results?search_query=zanolli+pizza+oven+cleaning+limpieza", desc:"Búsqueda YouTube", duracion:"" },
  ],
  "Turbochef-limpieza": [
    { titulo:"TurboChef HHC — Limpieza diaria (oficial)", url:"https://www.youtube.com/results?search_query=turbochef+hhc2020+daily+cleaning+limpieza", desc:"Búsqueda YouTube", duracion:"" },
  ],
  "Bunn-limpieza": [
    { titulo:"Cafetera Bunn — Limpieza y mantenimiento", url:"https://www.youtube.com/results?search_query=bunn+coffee+maker+cleaning+maintenance", desc:"Búsqueda YouTube", duracion:"" },
  ],
  "general-burlete": [
    { titulo:"Cómo cambiar el burlete de un horno industrial", url:"https://www.youtube.com/results?search_query=cambio+burlete+horno+industrial+cocina+profesional", desc:"Búsqueda YouTube", duracion:"" },
  ],
};

const getTutoriales = (marca, sintoma) => {
  const keys = [];
  const s = (sintoma || "").toLowerCase();
  const m = (marca || "").toLowerCase();
  if (s.includes("limpieza") || s.includes("lavado") || s.includes("cleanjet") || s.includes("autolavado")) {
    if (m.includes("rational")) keys.push("Rational-limpieza");
    else if (m.includes("unox")) keys.push("Unox-limpieza");
    else if (m.includes("zanolli")) keys.push("Zanolli-limpieza");
    else if (m.includes("turbochef")) keys.push("Turbochef-limpieza");
    else if (m.includes("bunn")) keys.push("Bunn-limpieza");
  }
  if (s.includes("burlete") || s.includes("puerta no cierra") || s.includes("goma")) {
    if (m.includes("rational")) keys.push("Rational-burlete");
    else if (m.includes("unox")) keys.push("Unox-burlete");
    else keys.push("general-burlete");
  }
  return keys.flatMap(k => TUTORIALES[k] || []);
};

const PRECIOS_EQUIPO = {
  "Rational-SCC WE 61G": {
    nuevo:  { min: 85_000_000, max: 110_000_000, moneda:"COP" },
    usado:  { min: 35_000_000, max: 55_000_000,  moneda:"COP" },
    fuente: "Rational Colombia (cotización directa) · Referencia mercado reacondicionado USA $8,000–$15,000 USD · TRM ~$4,200",
    nota:   "Rational no publica precios — solicitar cotización a Rational Colombia o distribuidor autorizado.",
    warranty: "2 años partes, 1 año mano de obra · Compresor: 5 años",
    distribuidores: "Rational Colombia · Intecse Bogotá · Crutek Bogotá",
  },
  "Rational-SCC WE 101G": {
    nuevo:  { min: 105_000_000, max: 135_000_000, moneda:"COP" },
    usado:  { min: 45_000_000, max: 70_000_000,   moneda:"COP" },
    fuente: "Rational Colombia (cotización directa)",
    nota:   "Modelo piso — incluye pie de fábrica.",
    warranty: "2 años partes, 1 año mano de obra",
    distribuidores: "Rational Colombia · Intecse Bogotá · Crutek Bogotá",
  },
  "Turbochef-HHC2020": {
    nuevo:  { min: 110_000_000, max: 135_000_000, moneda:"COP" },
    usado:  { min: 35_000_000, max: 60_000_000,   moneda:"COP" },
    fuente: "webstaurantstore.com: $18,888 USD · +40% importación Colombia",
    nota:   "Ventless certificado UL KNLZ.",
    warranty: "12 meses desde despacho de fábrica",
    distribuidores: "Euromex Bogotá +57 601 226 4242 · Industrial Kitchen Medellín 301 471 1328",
  },
  "Bunn-ULTRA-2": {
    nuevo:  { min: 12_000_000, max: 18_000_000, moneda:"COP" },
    usado:  { min: 4_000_000,  max: 8_000_000,  moneda:"COP" },
    fuente: "Mercado USA ~$1,100–$1,600 USD · +35% importación Colombia",
    nota:   "Granizadora 2 tambores — mantenimiento semestral obligatorio.",
    warranty: "2 años partes · Compresor: 5 años",
    distribuidores: "Exhibir Equipos Colombia · Euromex Bogotá · Juan Santacolomba Pereira",
  },
};

const INSTALACION = {
  "Rational-SCC WE 61G":{
    electrico:{tension:"3N AC 400V",frecuencia:"50/60 Hz",potencia:"10.5 kW",corriente:"16 A",fusible:"3×16 A curva C",conexion:"Cable 5 hilos (3F+N+T) — tierra obligatoria.",enchufe:"Sin enchufe de serie — instalación fija"},
    agua:{presion:"150–300 kPa (1.5–3 bar) dinámica",caudal:"mín. 20 l/min",entrada:'Manguera tipo lavarropa 1/2"',desague:"Tubería Ø 50 mm (2\"), resistente a 65°C — sifón externo tipo P-trap.",calidad:"Conductividad mín. 50 µS/cm — dureza mín. 5°dH."},
    gas:{presion_natural:"18–25 mbar",presion_propano:"25–57 mbar",conexion:'Tubería rígida o flexible certificada rosca 3/4".'},
    dimensiones:{ancho:"847 mm",profundidad:"771 mm",altura:"600 mm (sobremesa) o 1.835 mm (con pie)",peso:"~80 kg",capacidad:"6×1/1 GN"},
    notas:"Instalar sobre superficie plana y estable. Nivelar con pies regulables. Temperatura ambiente: +5°C a +40°C."
  },
  "Turbochef-HHC2020":{
    electrico:{tension:"AC 208–240V monofásico",frecuencia:"50/60 Hz",potencia:"14.4 kW máx",corriente:"50 A máx",fusible:"Breaker 50 A — circuito dedicado obligatorio",conexion:"NEMA 15-50P (4 pines)",enchufe:"NEMA 15-50P estándar"},
    agua:{presion:"N/A",entrada:"No requiere agua",nota:"Horno VENTLESS certificado UL KNLZ"},
    dimensiones:{ancho:"559 mm",profundidad:"1527 mm total",altura:"432 mm con patas",peso:"~68 kg",capacidad:"Cámara 508 mm (20\") ancho · Temp. máx. 288°C"},
    notas:"VENTLESS — no requiere campana extractora para alimentos no grasos. Temperatura ambiente máx: 49°C."
  },
};

const PLANES = {
  "Rational-SCC WE 61G":{ diario:["Ejecutar CleanJet+Care al finalizar jornada","Limpiar burlete de puerta con paño húmedo","Limpiar bandeja recogegotas","Verificar que el desagüe no esté obstruido"], semanal:["Limpiar filtro de aire con solución jabonosa suave","Revisar chapa deflectora y bastidores","Limpiar cristal de puerta con paño húmedo"], mensual:["Descalcificar boquilla de humidificación","Revisar sonda térmica","Verificar presión dinámica del agua: 1.5–3 bar"], semestral:["Cambiar burlete si hay deterioro","Revisión técnica por empresa certificada Rational"], anual:["Inspección general por empresa certificada Rational","Reemplazar consumibles según uso"] },
  "Rational-SCC WE 101G":{ diario:["Ejecutar CleanJet+Care al finalizar jornada","Limpiar burlete con paño húmedo","Limpiar bandeja recogegotas"], semanal:["Limpiar filtro de aire","Revisar bastidores colgantes","Limpiar cristal con paño húmedo"], mensual:["Descalcificar boquilla de humidificación","Verificar presión dinámica: 1.5–3 bar"], semestral:["Revisión por empresa certificada Rational"], anual:["Inspección general certificada"] },
  "Turbochef-HHC2020":{ diario:["Apagar desde panel y esperar 'Oven Off'","DESCONECTAR corriente antes de limpiar","Retirar y lavar banda con TurboChef Cleaner #103180","Retirar y lavar jetplates con TurboChef Cleaner","Limpiar interior de cámara con paño húmedo + Cleaner"], semanal:["Limpieza profunda: desmontar TODOS los componentes","Verificar filtro de aire trasero (F6 prevención)","Verificar filtro de carbono Ventless","Inspeccionar cadena del conveyor (HCT-4143)"], mensual:["Verificar heaters en TEST MODE (clave 2433)","Verificar RTD: ~100 ohms a 0°C","Revisar log de fallas (Fault Counts Screen)"], semestral:["Revisión por técnico certificado TurboChef"], anual:["Inspección general certificada TurboChef","Evaluar cadena conveyor HCT-4143"] },
};
const PLAN_GEN = { diario:["Limpiar exteriores","Verificar funcionamiento básico"], semanal:["Limpiar filtros accesibles"], mensual:["Inspección visual de mangueras"], semestral:["Revisión por técnico"], anual:["Mantenimiento preventivo completo"] };

const CONSEJOS_OP = [
  { icono:"🔥", titulo:"Horno — Antes de arrancar", consejos:["Verifica que el grifo de agua azul esté abierto.","El tanque de detergente debe estar lleno antes de iniciar la jornada.","Nunca metas bandejas de aluminio en el horno.","No salar la comida dentro del horno."] },
  { icono:"🧹", titulo:"Horno — Limpieza al cerrar", consejos:["Retira TODAS las bandejas antes de iniciar el ciclo de lavado.","Selecciona el nivel de lavado según qué tan sucio está el horno.","No abras la puerta durante el ciclo de lavado.","Al terminar, deja la puerta entreabierta para ventilar."] },
  { icono:"🚪", titulo:"Cuidado de la puerta y burlete", consejos:["Cierra la puerta con suavidad.","Limpia el burlete con paño húmedo todos los días.","Si ves que el burlete está despegado o roto, contrata un técnico certificado especializado.","No cuelgues trapos en la manija de la puerta."] },
  { icono:"❌", titulo:"Lo que NUNCA debes hacer", consejos:["❌ Nunca uses lejía ni cloro dentro del horno.","❌ Nunca uses estropajos metálicos.","❌ Nunca apagues el horno jalando el cable.","❌ Nunca dejes comida adentro del horno al cerrar."] },
  { icono:"☕", titulo:"Cafetera Bunn — Cuidado diario", consejos:["Retira la canasta de filtro y lávala con agua y jabón al final del día.","No dejes café viejo en la jarra.","Reporta si hay goteo debajo de la máquina."] },
  { icono:"🧊", titulo:"Granizadora Bunn — Cuidado diario", consejos:["Vacía el producto al cerrar si el equipo va a estar apagado más de 4 horas.","Limpia el tambor con agua tibia y jabón neutro.","Nunca mojes el compresor ni las zonas eléctricas."] },
  { icono:"❄️", titulo:"Nevera/Congelador — Cuidado diario", consejos:["No dejes la puerta abierta más de 30 segundos.","No metas comida caliente.","Si hay mucho hielo acumulado, contrata un técnico especializado."] },
  { icono:"🚨", titulo:"Cuando debes contratar un técnico certificado YA", consejos:["🔴 Hay humo, llamas o chispas dentro del equipo.","🔴 Hay olor a gas o a quemado eléctrico.","🔴 El equipo hace un ruido muy fuerte o inusual.","🔴 Hay un error en pantalla con número (Service XX, AF0X, WF0X).","🔴 Hay agua en el piso alrededor del equipo.","✅ Para todo lo demás, intenta el CEM Bot primero."] },
];

const LIMPIEZAS_DATA = {
  Horno:[
    {titulo:"Rational SCC/iCombi — Limpieza diaria (operador)",alerta:"⚠️ Usar guantes y delantal. NO limpiar con el horno caliente por encima de 75°C.",pasos:["Al finalizar la jornada, retirar TODAS las bandejas, parrillas y contenedores de la cámara.","Seleccionar el ciclo de limpieza CleanJet+Care desde el panel.","Colocar pastilla en el tamiz o canasto según modelo.","Cerrar bien la puerta y pulsar Inicio. NO abrir durante el ciclo.","Al terminar: limpiar la bandeja recogegotas de la puerta.","Dejar la puerta entreabierta al final del día para ventilar."],tutoriales:getTutoriales("Rational","limpieza")},
    {titulo:"Rational SCC/iCombi — Cuidado del burlete y cristal",alerta:"⚠️ Un burlete dañado genera pérdida de vapor y mayor consumo.",pasos:["Después de cada carga: limpiar el burlete con un paño húmedo suave.","Revisar visualmente que el burlete no tenga grietas.","Si el burlete tiene daños visibles, contratar un técnico certificado.","Cristal exterior: limpiar solo con paño húmedo. Nunca usar químicos."],tutoriales:getTutoriales("Rational","burlete")},
    {titulo:"Unox ChefTop/BakerTop — Limpieza diaria (operador)",alerta:"⚠️ Retirar TODAS las bandejas antes del ciclo.",pasos:["Al finalizar la jornada, retirar TODAS las bandejas.","Verificar que el grifo de agua esté abierto.","Verificar que el tanque de detergente Det&Rinse esté lleno.","Seleccionar el ciclo de lavado y pulsar Inicio.","Al terminar, dejar la puerta entreabierta."],tutoriales:getTutoriales("Unox","limpieza")},
    {titulo:"Turbochef HHC2020/HHC1618 — Limpieza diaria",alerta:"⚠️ SIEMPRE desconectar corriente antes de limpiar. Usar SOLO TurboChef Cleaner #103180.",pasos:["Apagar con Back/Off. Esperar 'Oven Off' en pantalla.","DESCONECTAR el cable de corriente.","Retirar y lavar banda con TurboChef Cleaner #103180.","Retirar y lavar jetplates. NUNCA usar lana de acero.","Limpiar interior con paño húmedo + Cleaner.","Verificar filtro de carbono Ventless.","Reinstalar TODOS los componentes antes de encender."],tutoriales:getTutoriales("Turbochef","limpieza")},
    {titulo:"Zanolli Synthesis — Limpieza diaria",alerta:"⚠️ NUNCA usar chorro de agua. NUNCA detergentes con cloro ni abrasivos.",pasos:["Apagar con ON/OFF y esperar que ventilador y banda se detengan solos (<150°C).","Cajones entrada/salida: retirar y limpiar cada 4 horas de operación.","Limpiar banda con guantes y rasqueta mientras está tibia.","Cristales: esperar que estén completamente fríos antes de limpiar.","Exterior acero inox: paño húmedo con jabón suave NO abrasivo.","Cerrar la llave de gas al finalizar el turno."]},
  ],
  Cafetera:[
    {titulo:"Cafetera Bunn — Limpieza diaria (operador)",alerta:"⚠️ No sumergir ninguna pieza eléctrica en agua.",pasos:["Retirar la canasta de filtro y lavarla con agua y jabón suave.","Limpiar el cabezal de distribución con cepillo suave.","Lavar el jarro con agua y jabón. Enjuagar.","Limpiar el exterior con paño húmedo."],tutoriales:getTutoriales("Bunn","limpieza")},
  ],
  Granizadora:[
    {titulo:"Granizadora Bunn ULTRA — Limpieza diaria (operador)",alerta:"⚠️ Apagar y desconectar de la corriente antes de limpiar.",pasos:["Poner en Stand-by y desconectar de la corriente.","Vaciar el producto del tambor.","Retirar la paleta mezcladora.","Lavar tambor y paleta con agua tibia y jabón neutro. Enjuagar MUY bien.","Limpiar exterior con paño húmedo.","Limpiar rejillas de ventilación con paño seco.","Reconectar y llenar con producto fresco."]},
  ],
  "Nevera / Congelador":[
    {titulo:"Nevera/Congelador — Limpieza diaria exterior (operador)",alerta:"⚠️ No mojar el panel eléctrico ni el condensador.",pasos:["Limpiar el exterior con paño húmedo y jabón neutro.","Revisar el burlete de la puerta: debe sellar correctamente.","Limpiar el burlete con paño húmedo suave.","Verificar que la temperatura interna sea correcta: nevera 2–5°C, congelador -18°C.","Limpiar goteo o derrames dentro del equipo inmediatamente."]},
  ],
};

const ERRORES_UNOX = [
  {code:"AF01 – Motor térmico",nivel:"CRÍTICO",desc:"Protección térmica del motor disparada.",pasos:["Apagar el horno — el motor necesita enfriarse.","Verificar capacitor: valor correcto 6.3 µF. Si incorrecto → reemplazar KCN1003A ($135.000).","Verificar cableado entre placa de potencia y motor.","Si capacitor y cables OK → reemplazar motor KMT1012A ($1.350.000)."]},
  {code:"AF02 – Termostato de seguridad",nivel:"CRÍTICO",desc:"Termostato de seguridad de 320°C disparado.",pasos:["Apagar y esperar enfriamiento completo (mínimo 30 min).","Medir continuidad entre pin 4 y 5 — debe ser cero ohmios en frío.","Si no hay continuidad → reemplazar KTR1136A ($405.000)."]},
  {code:"AF03 – Sonda de temperatura",nivel:"CRÍTICO",desc:"Sondas CMB1 o CMB2 desconectadas o dañadas (PT100).",pasos:["Verificar conexión de sondas a sockets P19 y P16.","Medir resistencia: 109.73 Ω a 25°C / 119.40 Ω a 50°C / 138.50 Ω a 100°C.","Si fuera de rango → reemplazar KTR1105A ($540.000)."]},
  {code:"AF04 – Comunicación placa",nivel:"CRÍTICO",desc:"Error comunicación RJ45 entre placa control y placa potencia.",pasos:["Verificar que el cable RJ45 esté bien conectado en ambos extremos.","Medir continuidad pin a pin del cable bus KCE1095A.","Sin continuidad → reemplazar KCE1095A ($180.000)."]},
  {code:"AF08 – Motor parado (tacómetro)",nivel:"CRÍTICO",desc:"El sensor tacométrico no detecta rotación del motor.",pasos:["Verificar que el imán del tacómetro esté instalado en el eje.","Verificar resistores de frenado: 75Ω cables amarillos y 27.5Ω cables rojos.","Si resistores OK → verificar motor y capacitor."]},
  {code:"AF23 – Falla ignición gas",nivel:"PELIGRO",desc:"El horno de gas no completa la ignición del quemador.",pasos:["Verificar que haya gas: presión natural 17–25 mbar, LPG 25–37 mbar.","Medir corriente de ionización en SERIE: rango normal 4–15 µA DC.","Si hay chispa pero no prende: revisar presión de gas.","Si no hay chispa: verificar transformador de ignición y cables."]},
  {code:"WF16 – Falta de agua (EL1)",nivel:"FRECUENTE",desc:"Electroválvula EL1 no detecta agua.",pasos:["Abrir grifo de agua completamente.","Verificar presión de entrada: 1.5–6 bar.","Verificar alimentación a válvula EL1 desde la placa.","Sin voltaje en EL1 → reemplazar placa de potencia."]},
  {code:"WF19 – Sin detergente",nivel:"COMÚN",desc:"El circuito de detergente no detecta flujo.",pasos:["Verificar que el tanque de detergente esté lleno.","Verificar filtro de detergente.","Verificar bomba vibrante del detergente — debe recibir 115–130V AC."]},
  {code:"No produce vapor",nivel:"COMÚN",desc:"Horno no genera humedad durante la cocción.",pasos:["Verificar que el grifo de agua esté abierto y presión correcta.","Verificar válvulas de vapor EV1 y EV2.","Verificar que el P-trap del desagüe esté lleno con agua.","Verificar burlete de puerta."]},
];

const ERRORES_RATIONAL = [
  {code:"Service 10 – Bomba SC sin función",nivel:"CRÍTICO",desc:"La bomba SC no pudo drenar el generador de vapor.",pasos:["Verificar que la manguera de salida no esté doblada ni obstruida.","Verificar que la bomba SC recibe tensión eléctrica.","Verificar que el generador de vapor no esté calcificado.","PREVENTIVO: ejecutar ciclos CareControl regularmente."]},
  {code:"Service 14 – Electrodo sin agua",nivel:"LIMITADO",desc:"El electrodo de nivel no detecta agua — conductividad muy baja.",pasos:["Verificar conductividad del agua: MÍNIMO 50 µS/cm (dureza mín. 5°dH).","Si el agua tiene conductividad muy baja → instalar filtro apropiado."]},
  {code:"Service 25 – CleanJet sin flujo",nivel:"FRECUENTE",desc:"El CleanJet+Care no detecta flujo de agua.",pasos:["Verificar que el grifo esté completamente abierto.","Limpiar el filtro de acometida (malla de 0.5 mm).","Verificar presión dinámica: mínimo 1.5 bar.","Verificar conductividad del agua: mín. 50 µS."]},
  {code:"Service 28 – Temperatura límite excedida",nivel:"CRÍTICO",desc:"Temperatura del generador o cámara superó el límite.",pasos:["Apagar inmediatamente y dejar enfriar mínimo 30 minutos.","Verificar que el filtro de aire no esté obstruido.","Si se repite → contratar técnico certificado."]},
  {code:"Service 29 – Placa PCB caliente",nivel:"FRECUENTE",desc:"Temperatura de la PCB principal supera 85°C.",pasos:["Apagar y limpiar el filtro de aire con agua jabonosa y secar.","Verificar que el ventilador de refrigeración de la PCB funcione."]},
  {code:"Service 32 / 33 – Caja de ignición",nivel:"PELIGRO",desc:"Falla en caja de ignición — riesgo de gas sin ignición.",pasos:["CERRAR LLAVE DE GAS INMEDIATAMENTE.","Ventilar el local por al menos 15 minutos.","NO encender el equipo hasta que llegue un técnico certificado."]},
];

const ERRORES_TURBOCHEF = [
  {code:"F1 – Blower Failure",nivel:"CRÍTICO",desc:"Control no recibió señal OK del BMSC. Motor del blower trabado o BMSC dañado.",pasos:["Verificar disyuntor de pared (50A HHC2020 / 40A HHC1618).","Apagar y desconectar por 2 minutos. Reconectar y probar.","Medir bobinas del motor: Negro-Rojo=2.3-2.8 ohms.","Si BMSC tiene falla → reemplazar CON-7013."]},
  {code:"F6 – EC Over Temp",nivel:"CRÍTICO",desc:"Temperatura del compartimiento eléctrico alcanzó 158°F/70°C.",pasos:["Verificar espacio libre mínimo: 254 mm arriba, 51 mm a cada lado.","Limpiar filtros de aire traseros (HCT-4067).","Verificar que cooling fans funcionen (TC3-0433)."]},
  {code:"F7 – RTD Failure",nivel:"CRÍTICO",desc:"El RTD está abierto, en cortocircuito o fuera de rango.",pasos:["Poner RTD en agua con hielo 2 min. Medir: debe ser ~100 ohms.","Si incorrecto → reemplazar RTD HHC-6517-2."]},
  {code:"F8 – High Limit Tripped",nivel:"CRÍTICO",desc:"El termostato de alto límite disparó (572°F/300°C).",pasos:["Apagar y dejar enfriar completamente.","Limpiar el horno completamente — 80% de F8 se deben a falta de limpieza.","Verificar SSR NGC-3005 por posible cortocircuito."]},
  {code:"F9 – Belt Fault",nivel:"MODERADO",desc:"El conveyor no arrancó o está arrastrando.",pasos:["Verificar que no haya objetos obstruyendo la banda.","Revisar cadena del conveyor (HCT-4143).","Medir bobinas motor conveyor: 305-315 ohms."]},
];

const ERRORES_ZANOLLI = [
  {code:"OVER – Sobretemperatura",nivel:"CRÍTICO",desc:"Sonda 1 supera 350°C Y sonda 2 supera 450°C simultáneamente.",pasos:["Presionar cualquier tecla para silenciar la alarma.","Apagar el horno inmediatamente.","Si ocurre a temperaturas normales → contratar técnico certificado Zanolli."]},
  {code:"BELT – Falla banda transportadora",nivel:"CRÍTICO",desc:"El motor de la banda envía señales incorrectas.",pasos:["Apagar el horno y desconectar de corriente.","Inspeccionar la banda visualmente.","Contratar técnico certificado Zanolli."]},
  {code:"FLAME – Falla detección de llama (solo gas)",nivel:"PELIGRO",desc:"El control de gas no detecta llama.",pasos:["CERRAR LA LLAVE DE GAS INMEDIATAMENTE.","Ventilar el local por al menos 10 minutos.","Contratar técnico certificado en gas y equipos Zanolli."]},
  {code:"BATTERY – Batería de respaldo baja",nivel:"SIMPLE",desc:"La batería del buffer de la tarjeta base está agotada.",pasos:["Esta alarma no impide el funcionamiento del horno.","Programar el reemplazo de la batería (pila de botón en tarjeta base)."]},
];

const NIVEL_C = {CRÍTICO:"red",PELIGRO:"red",LIMITADO:"blue",FRECUENTE:"yellow",SIMPLE:"green",COMÚN:"blue",MODERADO:"blue"};

const REPUESTOS = [
  {cod:"KMT1012A",desc:"Motor 330W eje cónico D12 (LUX/MIND.Maps)",precio:1350000,marca:"Unox"},
  {cod:"KPE2260A",desc:"Tarjeta de potencia BLSP/Speed.Pro/Zero",precio:990000,marca:"Unox"},
  {cod:"KTR1136A",desc:"Termostato de seguridad 318°C (dispara AF02)",precio:405000,marca:"Unox"},
  {cod:"KVN1172A",desc:"Turbina D195 H40 8 aspas tuerca M8",precio:553500,marca:"Unox"},
  {cod:"KRS1283B",desc:"Resistencia 3000W 230V + 260W 135V 4 espiras",precio:765000,marca:"Unox"},
  {cod:"KTR1105A",desc:"Sonda temperatura PT100 L1000 (dispara AF03)",precio:540000,marca:"Unox"},
  {cod:"KGN1352A",desc:"Goma puerta LM Arianna / Armarios BT",precio:211500,marca:"Unox"},
  {cod:"KGN1656A",desc:"Goma puerta XECC-0523 Compact",precio:256500,marca:"Unox"},
  {cod:"KCN1003A",desc:"Condensador motor 6.3 µF — reparar AF01",precio:135000,marca:"Unox"},
  {cod:"KGN1629A",desc:"Goma puerta ChefTop 0511",precio:382500,marca:"Unox"},
  {cod:"KGN1631A",desc:"Goma puerta ChefTop 1011",precio:405000,marca:"Unox"},
  {cod:"KCE1095A",desc:"Cable bus 4 polos 2M potencia-control (dispara AF04)",precio:180000,marca:"Unox"},
  {cod:"KEL1251A",desc:"Electroválvula 1 vía JG D8-D10",precio:292500,marca:"Unox"},
  {cod:"20.02.550P",desc:"Burlete puerta SCC CMP 61 (SCC WE 61G)",precio:290771,marca:"Rational"},
  {cod:"20.02.552P",desc:"Burlete puerta SCC CMP 101",precio:333391,marca:"Rational"},
  {cod:"20.00.399P",desc:"Burlete puerta SCC CMP 202",precio:432629,marca:"Rational"},
  {cod:"40.05.654P",desc:"Filtro entrada de aire LM1 LM2",precio:65153,marca:"Rational"},
  {cod:"87.00.279",desc:"Kit termostato seguridad Bilímite 360°C",precio:265905,marca:"Rational"},
  {cod:"CON-7013",desc:"BMSC — Blower Motor Speed Controller (reparar F1)",precio:1350000,marca:"Turbochef"},
  {cod:"HHC-6517-2",desc:"RTD sonda temperatura cámara (reparar F7)",precio:450000,marca:"Turbochef"},
  {cod:"NGC-3005",desc:"Relay estado sólido dual 40A 240VAC (reparar F8)",precio:600000,marca:"Turbochef"},
  {cod:"HCT-4143",desc:"Cadena conveyor #35 52 eslabones (reparar F9)",precio:75000,marca:"Turbochef"},
  {cod:"102075",desc:"Termostato alto límite 572°F reset manual (reparar F8)",precio:790000,marca:"Turbochef"},
  {cod:"HCT-4067",desc:"Filtro de aire trasero HHC (previene F6)",precio:73000,marca:"Turbochef"},
  {cod:"TERM0005",desc:"Termostato seguridad 500°C reset manual (reparar OVER)",precio:605000,marca:"Zanolli"},
  {cod:"TERM0049",desc:"Sonda PT1000 temperatura cámara — medir ~1100Ω a 25°C",precio:420000,marca:"Zanolli"},
  {cod:"ELET0676",desc:"Tarjeta base electrónica (scheda base)",precio:1350000,marca:"Zanolli"},
  {cod:"MOTO0052",desc:"Motor banda conveyor (reparar BELT)",precio:1050000,marca:"Zanolli"},
  {cod:"01082.0000",desc:"Sprayhead 6 hoyos Bunn VPR",precio:22000,marca:"Bunn"},
  {cod:"04236.1000",desc:"Kit calentador tanque 1320W 120V VPR",precio:176000,marca:"Bunn"},
  {cod:"34245.0000",desc:"Kit mantenimiento preventivo Ultra-2 (sellos, empaques)",precio:280000,marca:"Bunn"},
  {cod:"44039.1000",desc:"Tarjeta de control principal CBA Ultra-2",precio:1016000,marca:"Bunn"},
];

const formatPrecio = (n) => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0}).format(n);
const card = (x={}) => ({ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:16, ...x });
const btn = (v="primary",s="md") => ({ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, padding:s==="sm"?"5px 10px":"9px 16px", fontSize:s==="sm"?11:13, fontWeight:600, borderRadius:8, cursor:"pointer", fontFamily:"inherit", border:v==="outline"?`1px solid ${C.border}`:"none", background:v==="primary"?C.accent:v==="outline"?C.white:"transparent", color:v==="primary"?"#fff":C.muted });
const tagS = (c="blue") => { const m={blue:[C.accent,C.al],red:[C.red,C.rl],green:[C.green,C.gl],yellow:[C.yellow,C.yl],gray:[C.muted,"#f3f4f6"]}; const [col,bg]=m[c]||m.blue; return {fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,color:col,background:bg}; };

const LogoCEM = ({size=44}) => (
  <svg width={size} height={size*0.88} viewBox="0 0 280 247" xmlns="http://www.w3.org/2000/svg">
    <polygon points="0,247 28,175 48,210 22,247" fill="#e8432d"/>
    <polygon points="232,247 256,175 278,247" fill="#e8432d"/>
    <polygon points="38,247 139,8 240,247" fill="#e8432d"/>
    <polygon points="139,8 124,50 133,40 139,50 145,40 154,50 139,8" fill="white"/>
    <text x="26" y="238" fontFamily="Impact,Arial Black,sans-serif" fontWeight="900" fontSize="105" fill="#1a3d4a" letterSpacing="-3">CEM</text>
    <text x="22" y="234" fontFamily="Impact,Arial Black,sans-serif" fontWeight="900" fontSize="105" fill="#2d5f6e" letterSpacing="-3">CEM</text>
  </svg>
);

// ─── BOTÓN SUGERENCIAS TEAMS ──────────────────────────────────────────────────
// Abre chat de Teams directo con Pablo con mensaje pre-llenado
const TEAMS_URL = "https://teams.microsoft.com/l/chat/0/0?users=pablo.leyva@terpel.com&message=Hola%20Pablo%2C%20tengo%20una%20sugerencia%20%2F%20pregunta%20sobre%20el%20CEM%20IA%20Assistant%3A%20";
const MAIL_URL  = "mailto:pablo.leyva@terpel.com?subject=Sugerencia%20CEM%20IA%20Assistant&body=Hola%20Pablo%2C%20";

function BtnSugerencias() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div style={{position:"relative"}}>
      <button
        onClick={() => setShowMenu(v => !v)}
        title="Preguntas y sugerencias"
        style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          width:32, height:32, borderRadius:9,
          background:"#f0fdf4", border:"1px solid #86efac",
          cursor:"pointer", fontSize:16, flexShrink:0,
          fontFamily:"inherit", padding:0,
        }}
      >
        💬
      </button>
      {showMenu && (
        <>
          {/* Overlay para cerrar */}
          <div
            onClick={() => setShowMenu(false)}
            style={{position:"fixed",inset:0,zIndex:199}}
          />
          <div style={{
            position:"absolute", right:0, top:38, zIndex:200,
            background:"#fff", border:"1px solid #e4e8f0",
            borderRadius:12, padding:8, minWidth:220,
            boxShadow:"0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <div style={{fontSize:10,fontWeight:800,color:"#64748b",padding:"4px 8px 8px",letterSpacing:0.5}}>
              PREGUNTAS Y SUGERENCIAS
            </div>
            <a
              href={TEAMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 10px", borderRadius:8, textDecoration:"none",
                background:"#eff6ff",
              }}
            >
              <div style={{
                width:32,height:32,borderRadius:8,
                background:"#2563eb",display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:17,flexShrink:0,
              }}>💼</div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8"}}>Escribir por Teams</div>
                <div style={{fontSize:10,color:"#3b82f6"}}>pablo.leyva@terpel.com</div>
              </div>
            </a>
            <div style={{height:6}}/>
            <a
              href={MAIL_URL}
              onClick={() => setShowMenu(false)}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 10px", borderRadius:8, textDecoration:"none",
                background:"#f0fdf4",
              }}
            >
              <div style={{
                width:32,height:32,borderRadius:8,
                background:"#16a34a",display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:17,flexShrink:0,
              }}>✉️</div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#15803d"}}>Enviar correo</div>
                <div style={{fontSize:10,color:"#16a34a"}}>pablo.leyva@terpel.com</div>
              </div>
            </a>
            <div style={{height:6}}/>
            <div style={{fontSize:9,color:"#94a3b8",padding:"4px 8px",textAlign:"center",borderTop:"1px solid #f1f5f9",paddingTop:8}}>
              CEM IA Assistant · Centro de Excelencia de Mantenimiento
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const TABS_TECNICO = [
  {id:"inicio",icon:"🏠",label:"Inicio"},
  {id:"chat",icon:"🤖",label:"CEM Bot"},
  {id:"planes",icon:"📋",label:"Planes"},
  {id:"instalacion",icon:"⚡",label:"Instalación"},
  {id:"limpieza",icon:"🧹",label:"Limpieza"},
  {id:"repuestos",icon:"🔩",label:"Repuestos"},
  {id:"referencias",icon:"📑",label:"Refs"},
  {id:"stats",icon:"📊",label:"Stats"},
  {id:"guia",icon:"📖",label:"Guía"},
];

const TABS_OPERADOR = [
  {id:"inicio_op",icon:"🏠",label:"Inicio"},
  {id:"chat_op",icon:"💬",label:"Consultar"},
  {id:"limpieza",icon:"🧹",label:"Limpieza"},
  {id:"consejos",icon:"💡",label:"Consejos"},
];

const SK = "cem_fallas_v4";
const loadF = () => { try { const d = localStorage.getItem(SK); return d ? JSON.parse(d) : []; } catch { return []; } };
const saveF = (d) => { try { localStorage.setItem(SK, JSON.stringify(d)); } catch {} };

const TutorialLinks = ({ tutoriales }) => {
  if (!tutoriales || tutoriales.length === 0) return null;
  return (
    <div style={{marginTop:10,padding:"10px 12px",background:"#fef9c3",borderRadius:8,border:"1px solid #fde047"}}>
      <div style={{fontSize:10,fontWeight:800,color:"#854d0e",marginBottom:6}}>📺 TUTORIALES RECOMENDADOS</div>
      {tutoriales.map((t,i) => (
        <a key={i} href={t.url} target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<tutoriales.length-1?"1px solid #fde047":"none",textDecoration:"none"}}>
          <span style={{fontSize:16,flexShrink:0}}>▶️</span>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:600,color:"#1d4ed8"}}>{t.titulo}</div>
            <div style={{fontSize:9,color:C.muted}}>{t.desc}{t.duracion?` · ${t.duracion}`:""}</div>
          </div>
          <span style={{fontSize:10,color:C.light}}>›</span>
        </a>
      ))}
    </div>
  );
};

const CONTACTOS_ST = {
  Rational: {
    oficial: [
      { nombre:"Rational Colombia", tipo:"🏢 Oficial", tel:"+57 601 743 3837", ws:"https://wa.me/573173723134", web:"https://www.rational-online.co", ciudad:"Bogotá", nota:"Servicio técnico oficial para toda Colombia." },
    ],
    especializados: [
      { nombre:"Influmax SAS", tipo:"🔧 Certificado", tel:"322 248 7631", ws:"https://wa.me/573222487631", web:"", ciudad:"Bogotá", nota:"Rational / Unox · Contacto: Guillermo Blanco" },
      { nombre:"Tecnobread SAS", tipo:"🔧 Certificado", tel:"317 365 6619", ws:"https://wa.me/573173656619", web:"", ciudad:"Bogotá", nota:"Rational / Unox · Contacto: Katerinne Campos" },
      { nombre:"Industrial Kitchen SAS", tipo:"🔧 Certificado", tel:"301 471 1328", ws:"https://wa.me/573014711328", web:"", ciudad:"Medellín", nota:"Rational / Turbochef / Bunn" },
      { nombre:"TEESA", tipo:"🔧 Certificado", tel:"316 243 2974", ws:"https://wa.me/573162432974", web:"", ciudad:"Cali", nota:"Unox / Bunn / Rational" },
    ],
  },
  Unox: {
    oficial: [
      { nombre:"Exhibir Equipos Colombia", tipo:"🏢 Oficial", tel:"320 232 4781", ws:"https://wa.me/573202324781", web:"https://exhibirequipos.com", ciudad:"Bogotá", nota:"Distribuidor directo Unox Colombia." },
    ],
    especializados: [
      { nombre:"Crutek", tipo:"🏆 PLATINUM", tel:"310 476 2771", ws:"https://wa.me/573104762771", web:"", ciudad:"Bogotá", nota:"Unox (Platinum) / Bunn" },
      { nombre:"Intecse", tipo:"🏆 PLATINUM", tel:"321 494 7580", ws:"https://wa.me/573214947580", web:"", ciudad:"Bogotá", nota:"Unox (Platinum) / Rational" },
      { nombre:"Soluciones Tesla", tipo:"🏆 PLATINUM", tel:"300 444 7500", ws:"https://wa.me/573004447500", web:"", ciudad:"Medellín", nota:"Unox (Platinum) / Rational" },
      { nombre:"TEESA", tipo:"🥇 GOLD", tel:"316 243 2974", ws:"https://wa.me/573162432974", web:"", ciudad:"Cali", nota:"Unox (Gold) / Bunn / Rational" },
    ],
  },
  Turbochef: {
    oficial: [
      { nombre:"Euromex Equipos Industriales", tipo:"🏢 Distribuidor", tel:"+57 601 226 4242", ws:"https://wa.me/573142264242", web:"https://euromex.com.co", ciudad:"Bogotá", nota:"Distribuidor y servicio técnico oficial Turbochef." },
    ],
    especializados: [
      { nombre:"Industrial Kitchen SAS", tipo:"🔧 Certificado", tel:"301 471 1328", ws:"https://wa.me/573014711328", web:"", ciudad:"Medellín", nota:"Rational / Turbochef / Bunn" },
    ],
  },
  Bunn: {
    oficial: [
      { nombre:"Exhibir Equipos Colombia", tipo:"🏢 Oficial", tel:"320 232 4781", ws:"https://wa.me/573202324781", web:"", ciudad:"Bogotá", nota:"Unox / Bunn / Granizadoras." },
    ],
    especializados: [
      { nombre:"Crutek", tipo:"🏆 PLATINUM", tel:"310 476 2771", ws:"https://wa.me/573104762771", web:"", ciudad:"Bogotá", nota:"Unox (Platinum) / Bunn" },
      { nombre:"Juan Santacolomba", tipo:"🔧 Certificado", tel:"323 575 2403", ws:"https://wa.me/573235752403", web:"", ciudad:"Pereira", nota:"Bunn / Repuestos Originales" },
    ],
  },
};

const googleST = (marca, ciudad) => `https://www.google.com/search?q=servicio+tecnico+${encodeURIComponent(marca)}+Colombia+${encodeURIComponent(ciudad)}+certificado`;

function ContactCard({ marca, ciudad }) {
  const data = CONTACTOS_ST[marca];
  if (!data) {
    return (
      <div style={{marginTop:8,background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:12,padding:"12px 13px"}}>
        <div style={{fontSize:11,fontWeight:800,color:"#c2410c",marginBottom:6}}>📍 Servicio técnico {marca}</div>
        <a href={googleST(marca,ciudad||"")} target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:6,padding:"8px 11px",background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,textDecoration:"none"}}>
          <span style={{fontSize:15}}>🔍</span>
          <div><div style={{fontSize:11,fontWeight:700,color:"#c2410c"}}>Buscar en Google</div></div>
          <span style={{marginLeft:"auto",color:C.light,fontSize:12}}>›</span>
        </a>
      </div>
    );
  }
  const todos = [...(data.oficial||[]), ...(data.especializados||[])];
  const cidLow = (ciudad||"").toLowerCase();
  const enCiudad = cidLow ? todos.filter(c=>c.ciudad.toLowerCase().includes(cidLow)||cidLow.includes(c.ciudad.toLowerCase())) : [];
  const resto = todos.filter(c=>!enCiudad.includes(c));
  const badgeStyle = (tipo) => {
    if (tipo.includes("PLATINUM")) return {background:"#ede9fe",color:"#5b21b6",border:"1px solid #c4b5fd"};
    if (tipo.includes("GOLD"))     return {background:"#fef9c3",color:"#a16207",border:"1px solid #fde047"};
    if (tipo.includes("Oficial"))  return {background:"#dbeafe",color:"#1d4ed8",border:"1px solid #93c5fd"};
    return {background:"#dcfce7",color:"#15803d",border:"1px solid #86efac"};
  };
  const Item = ({c}) => (
    <div style={{background:C.white,borderRadius:8,padding:"10px 11px",marginBottom:6,border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",gap:6,marginBottom:5}}>
        <span style={{...badgeStyle(c.tipo),fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10}}>{c.tipo}</span>
        <div style={{fontSize:12,fontWeight:800,color:C.text}}>{c.nombre}</div>
      </div>
      {c.nota && <div style={{fontSize:10,color:"#374151",marginBottom:6,background:"#f8fafc",borderRadius:6,padding:"5px 8px"}}>{c.nota} · {c.ciudad}</div>}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {c.tel && <a href={`tel:+57${c.tel.replace(/[\s\-]/g,"")}`} style={{display:"flex",alignItems:"center",gap:4,background:C.gl,color:C.green,fontSize:10,fontWeight:700,padding:"5px 10px",borderRadius:6,textDecoration:"none"}}>📞 {c.tel}</a>}
        {c.ws && <a href={c.ws} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,background:"#dcfce7",color:"#15803d",fontSize:10,fontWeight:700,padding:"5px 10px",borderRadius:6,textDecoration:"none"}}>💬 WA</a>}
        {c.web && <a href={c.web} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,background:C.al,color:C.accent,fontSize:10,fontWeight:700,padding:"5px 10px",borderRadius:6,textDecoration:"none"}}>🌐 Web</a>}
      </div>
    </div>
  );
  return (
    <div style={{marginTop:8,background:"#f0fdf4",border:"1px solid #16a34a44",borderRadius:12,padding:"12px 13px"}}>
      <div style={{fontSize:11,fontWeight:800,color:C.green,marginBottom:6}}>📍 SERVICIO TÉCNICO {marca.toUpperCase()} {cidLow?`· ${ciudad}`:""}</div>
      {/* Aviso Coupa */}
      <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"9px 11px",marginBottom:10,display:"flex",gap:8,alignItems:"flex-start"}}>
        <span style={{fontSize:14,flexShrink:0}}>⚠️</span>
        <div style={{fontSize:10,color:"#92400e",lineHeight:1.6}}>
          <strong>Solo puedes contratar proveedores activos en Coupa.</strong> La lista de proveedores habilitados se publicará en la próxima actualización. En junio CEM tendrá contrato con uno o más proveedores de servicio técnico. Por ahora, verifica en Coupa antes de generar la orden.
        </div>
      </div>
      {enCiudad.length>0 && <>{enCiudad.map((c,i)=><Item key={"l"+i} c={c}/>)}</>}
      {resto.slice(0,3).map((c,i)=><Item key={"r"+i} c={c}/>)}
      <a href={googleST(marca,ciudad)} target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",gap:6,marginTop:4,padding:"8px 11px",background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,textDecoration:"none"}}>
        <span>🔍</span>
        <div style={{fontSize:11,fontWeight:700,color:"#c2410c"}}>Buscar más en Google</div>
        <span style={{marginLeft:"auto",color:C.light,fontSize:12}}>›</span>
      </a>
    </div>
  );
}

function useUpdateCheck() {
  const [hayUpdate, setHayUpdate] = useState(false);
  const [checking, setChecking]   = useState(false);
  useEffect(() => {
    const check = async () => {
      try {
        setChecking(true);
        const res = await fetch(window.location.href, { method:"HEAD", cache:"no-store" });
        const serverEtag = res.headers.get("etag") || "";
        const storedEtag = sessionStorage.getItem("cem_etag") || "";
        if (!storedEtag) { if (serverEtag) sessionStorage.setItem("cem_etag", serverEtag); }
        else if (serverEtag && serverEtag !== storedEtag) setHayUpdate(true);
      } catch (_) {}
      finally { setChecking(false); }
    };
    check();
    const t = setInterval(check, 5*60*1000);
    return () => clearInterval(t);
  }, []);
  // La versión se calcula desde NEXT_PUBLIC_BUILD_DATE (si existe) o desde NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN
  // En cada deploy de Vercel, NEXT_PUBLIC_BUILD_DATE debe estar seteada en Settings > Env Variables
  // con valor: automático via _buildDate trick, o manualmente.
  // Solución robusta: usar BUILD_TIMESTAMP generado en next.config.js
  // NEXT_PUBLIC_BUILD_TIMESTAMP se genera automáticamente en next.config.js con new Date().toISOString()
  // Así la fecha siempre refleja cuándo Vercel hizo el último deploy — sin setear nada manualmente.
  const currentVersion = "v3.3 · " + (
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP
      ? new Date(process.env.NEXT_PUBLIC_BUILD_TIMESTAMP).toLocaleDateString("es-CO",{day:"2-digit",month:"2-digit",year:"2-digit"})
      : new Date().toLocaleDateString("es-CO",{day:"2-digit",month:"2-digit",year:"2-digit"})
  );
  const recargar = () => { sessionStorage.removeItem("cem_etag"); window.location.reload(true); };
  return { hayUpdate, checking, currentVersion, recargar };
}

function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [instalable, setInstalable] = useState(false);
  const [instalado, setInstalado] = useState(false);
  const [offline, setOffline] = useState(typeof navigator !== "undefined" ? !navigator.onLine : false);
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) { setInstalado(true); return; }
    const h = (e) => { e.preventDefault(); setDeferredPrompt(e); setInstalable(true); };
    window.addEventListener("beforeinstallprompt", h);
    window.addEventListener("appinstalled", () => { setInstalado(true); setInstalable(false); });
    window.addEventListener("offline", () => setOffline(true));
    window.addEventListener("online",  () => setOffline(false));
    // Auto-recarga cuando el SW activa una nueva versión
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (e) => {
        if (e.data?.type === "SW_UPDATED") {
          window.location.reload();
        }
      });
    }
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);
  const instalar = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalado(true);
    setDeferredPrompt(null); setInstalable(false);
  };
  return { instalable, instalado, instalar, offline };
}

function OfflineBanner({ offline }) {
  if (!offline) return null;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(234,88,12,0.2)",border:"1px solid rgba(251,146,60,0.5)",borderRadius:8,padding:"7px 12px",marginBottom:8}}>
      <span style={{fontSize:14}}>📡</span>
      <div style={{flex:1}}>
        <div style={{fontSize:11,fontWeight:700,color:"#fb923c"}}>Sin conexión</div>
        <div style={{fontSize:10,color:"rgba(251,146,60,0.8)"}}>CEM Bot no disponible · Tablas de errores y repuestos funcionan offline</div>
      </div>
    </div>
  );
}

function UpdateBanner({ hayUpdate, checking, currentVersion, recargar, dark=false }) {
  if (hayUpdate) {
    return (
      <div style={{display:"flex",alignItems:"center",gap:8,background:dark?"rgba(37,99,235,0.25)":"#eff6ff",border:dark?"1px solid rgba(147,197,253,0.4)":"1px solid #93c5fd",borderRadius:12,padding:"10px 13px",cursor:"pointer",marginTop:dark?12:0}} onClick={recargar}>
        <div style={{width:32,height:32,background:"#2563eb",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🔄</div>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:800,color:dark?"#93c5fd":"#1d4ed8"}}>Actualización disponible</div>
          <div style={{fontSize:10,color:dark?"rgba(147,197,253,0.8)":"#3b82f6",marginTop:1}}>Toca aquí para recargar</div>
        </div>
        <div style={{background:"#2563eb",color:"#fff",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20}}>Actualizar</div>
      </div>
    );
  }
  return (
    <div style={{display:"flex",alignItems:"center",gap:6,padding:dark?"5px 2px":"4px 0"}}>
      <div style={{width:7,height:7,borderRadius:"50%",background:checking?"#f97316":"#16a34a",flexShrink:0}}/>
      <span style={{fontSize:9,color:dark?"rgba(255,255,255,0.4)":"#94a3b8",fontWeight:600}}>
        {checking?"Verificando...":"✓ Actualizado · "+currentVersion}
      </span>
    </div>
  );
}

const SALUDO_TECNICO = "¡Hola! Soy el asistente técnico del **CEM**.\n\nPuedes escribirme, usar los botones o hablarme con el micrófono 🎙️. También puedes **adjuntar una imagen** 📷.\n\nSelecciona el **equipo** para comenzar el diagnóstico:";
const SALUDO_OPERADOR = "¡Hola! Soy tu asistente de cocina del **CEM** 👋\n\nEscríbeme o usa los botones para contarme qué está pasando con el equipo.\n\n¿Con qué equipo tienes una inquietud?";

function ChatTab({ onFalla, modo="tecnico" }) {
  const [msgs, setMsgs] = useState([{ role:"bot", text:modo==="tecnico"?SALUDO_TECNICO:SALUDO_OPERADOR }]);
  const [step, setStep] = useState("tipo");
  const [sel, setSel] = useState({ tipo:null, marca:null, ref:null });
  const [ubicacionMarca, setUbicacionMarca] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [imgData, setImgData] = useState(null);
  const registrado = useRef(false);
  const msgsRef = useRef([]);
  const lastBot = useRef("");
  const recRef = useRef(null);
  const endRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { msgsRef.current = msgs; }, [msgs]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  useEffect(() => {
    const saludoTxt = modo==="tecnico"
      ? "Hola. Soy el asistente técnico del CEM. Selecciona el equipo para comenzar."
      : "Hola. Soy tu asistente de cocina. ¿Con qué equipo necesitas ayuda?";
    const timer = setTimeout(() => hablar(saludoTxt), 600);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hablar = useCallback((texto) => {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const limpio = texto.replace(/\*\*(.+?)\*\*/g,"$1").replace(/[*#💡🔍📞⛔⚠🎙🔊🔈]/g,"").replace(/\n+/g,". ").trim();
    if (!limpio) return;
    const u = new SpeechSynthesisUtterance(limpio);
    u.lang="es-ES"; u.rate=0.95; u.pitch=0.8;
    const go = () => {
      const vs = speechSynthesis.getVoices();
      const h = vs.find(v=>v.lang.startsWith("es")&&/jorge|diego|carlos/i.test(v.name))||vs.find(v=>v.lang.startsWith("es"));
      if (h) u.voice = h;
      u.onstart = () => setSpeaking(true);
      u.onend = u.onerror = () => setSpeaking(false);
      speechSynthesis.speak(u);
    };
    speechSynthesis.getVoices().length>0?go():(speechSynthesis.onvoiceschanged=go);
  }, []);

  const toggleMic = useCallback(() => {
    if (listening) { recRef.current?.stop(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { addMsg("bot","⚠️ Tu navegador no soporta micrófono. Usa Chrome."); return; }
    const rec = new SR();
    rec.lang="es-ES"; rec.continuous=false; rec.interimResults=false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
    recRef.current = rec;
    try { rec.start(); } catch { setListening(false); }
  }, [listening]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgData({ base64:ev.target.result.split(",")[1], mediaType:file.type, name:file.name });
    reader.readAsDataURL(file);
  };

  const addMsg = (role, text, extra={}) => {
    const m = { role, text, ...extra };
    setMsgs(prev => { const n=[...prev,m]; msgsRef.current=n; return n; });
    if (role==="bot") lastBot.current = text;
  };

  const callIA = async (contenido, ctx, imagen=null) => {
    if (!contenido?.trim() && !imagen) return;
    setLoading(true);
    const esOperador = modo === "operador";

    const systemTecnico = `Eres el asistente técnico del CEM. Responde en español colombiano técnico. Máximo 180 palabras.
Equipo: ${ctx?.tipo?.tipo||"?"} ${ctx?.marca?.nombre||""} ${ctx?.ref||""}
Si el mensaje incluye imagen, analiza qué equipo es, marca, referencia visible, código de error o daño físico.
Responde así:
Causa: [1 línea]
Pasos: 1. 2. 3. (máx 5 pasos con valores técnicos)
Escalar: [cuándo contratar técnico certificado especializado]
Tip: [consejo con código de repuesto y precio COP si aplica]`;

    const systemOperador = `Eres el asistente de cocina del CEM. Responde en español sencillo para cocineros. Máximo 100 palabras.
Equipo: ${ctx?.tipo?.tipo||"?"} ${ctx?.marca?.nombre||""} ${ctx?.ref||""}
Si hay imagen, describe qué ves y da un consejo simple.
Si el problema es eléctrico, de gas, o hay errores con números → di SIEMPRE "contrata un técnico certificado especializado".
Responde así:
¿Qué pasa?: [1 línea]
Puedes intentar: [1-2 pasos simples]
Contrata técnico si: [condición clara]`;

    try {
      const prevMsgs = msgsRef.current.filter(m=>m?.role&&typeof m.text==="string"&&m.text.trim()&&!m.isContactCard).slice(-4).map(m=>({role:m.role==="bot"?"assistant":"user",content:m.text.trim()}));
      let userContent;
      if (imagen) {
        userContent = [
          { type:"image", source:{ type:"base64", media_type:imagen.mediaType, data:imagen.base64 }},
          { type:"text", text: contenido?.trim() || "Analiza este equipo o falla." }
        ];
      } else { userContent = contenido.trim(); }

      const res = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-haiku-4-5-20251001", max_tokens:500,
          system: esOperador ? systemOperador : systemTecnico,
          messages: [...prevMsgs.slice(-3), { role:"user", content:userContent }],
        }),
      });
      const data = await res.json();
      if (data.error) { addMsg("bot","⚠️ "+(data.error.message||data.error)); return; }
      const texto = data.content?.map(b=>b.text||"").join("").trim() || "Sin respuesta.";
      addMsg("bot", texto);
      hablar(texto);

      const tuts = getTutoriales(ctx?.marca?.nombre||"", contenido||"");
      if (tuts.length>0 && !esOperador) {
        setTimeout(()=>addMsg("bot",`📺 **Tutoriales relacionados:**\n${tuts.map(t=>`• [${t.titulo}](${t.url})`).join("\n")}`,{isTutorial:true}), 600);
      }

      const marcasSoportadas = ["Rational","Unox","Turbochef","Bunn"];
      if (!esOperador && marcasSoportadas.includes(ctx?.marca?.nombre)) {
        setTimeout(()=>{
          setUbicacionMarca(ctx?.marca?.nombre);
          addMsg("bot",`📍 **¿En qué ciudad está este equipo?**\nTe muestro empresas certificadas cerca de ti.`,{isUbicacion:true});
          setStep("ubicacion");
        }, tuts.length>0?1200:700);
      }
    } catch(e) {
      addMsg("bot","⚠️ No se pudo conectar. Verifica tu internet e intenta de nuevo.");
    } finally { setLoading(false); setImgData(null); if(fileRef.current) fileRef.current.value=""; }
  };

  const pickTipo = (eq) => {
    setSel({tipo:eq,marca:null,ref:null});
    addMsg("user",`${eq.icon} ${eq.tipo}`);
    if (eq.marcas.length===1) { setSel({tipo:eq,marca:eq.marcas[0],ref:null}); addMsg("bot",`Marca **${eq.marcas[0].nombre}** ✓\n\n¿Cuál es la referencia?`); setStep("ref"); }
    else { addMsg("bot","¿Cuál es la marca?"); setStep("marca"); }
  };
  const pickMarca = (m) => { setSel(s=>({...s,marca:m})); addMsg("user",m.nombre); addMsg("bot","¿Cuál es la referencia?"); setStep("ref"); };
  const pickRef   = (r) => { setSel(s=>({...s,ref:r})); addMsg("user",r); addMsg("bot",`**${sel.marca?.nombre||""} ${r}**\n\n¿Cuál es el síntoma?`); setStep("sintoma"); };
  const pickSintoma = (s) => {
    setStep("chat"); addMsg("user",s);
    const ctx = sel;
    if (!registrado.current) { registrado.current=true; onFalla({equipo:ctx.tipo?.tipo||"Sin especificar",marca:ctx.marca?.nombre||"Sin especificar",ref:ctx.ref||"Sin especificar",sintoma:s}); }
    callIA(s, ctx);
  };
  const pickCiudad = (ciudad) => {
    const marca = ubicacionMarca || sel?.marca?.nombre || "";
    addMsg("user",`📍 ${ciudad}`);
    setStep("chat");
    addMsg("bot",`Contactos de servicio técnico **${marca}** en tu zona:`,{isUbicacion:true});
    addMsg("bot",`__CONTACTCARD__${marca}__${ciudad}__`,{isContactCard:true,marca,ciudad});
  };

  const sendMsg = async () => {
    if (step==="ubicacion" && input.trim()) { const c=input.trim(); setInput(""); pickCiudad(c); return; }
    if (!input.trim() && !imgData || loading) return;
    const txt=input.trim(); setInput(""); setStep("chat");
    if (imgData&&!txt) addMsg("user",`📷 Imagen adjunta: ${imgData.name}`,{hasImg:true});
    else if (imgData) addMsg("user",`📷 ${txt}`,{hasImg:true});
    else addMsg("user",txt);
    let ctx={...sel};
    if (!sel.tipo||!sel.marca) {
      const ex=extraerPorReglas(txt);
      if (ex.tipo||ex.marca) {
        const tO=EQUIPOS.find(e=>e.tipo===ex.tipo)||(ex.tipo?{tipo:ex.tipo,icon:"🔥"}:null);
        const mO=EQUIPOS.flatMap(e=>e.marcas).find(m=>m.nombre===ex.marca)||(ex.marca?{nombre:ex.marca}:null);
        ctx={tipo:tO,marca:mO,ref:ex.ref||null}; setSel(ctx);
      }
    }
    if (!registrado.current) { registrado.current=true; onFalla({equipo:ctx.tipo?.tipo||"Sin especificar",marca:ctx.marca?.nombre||"Sin especificar",ref:ctx.ref||"Sin especificar",sintoma:txt||"[imagen]"}); }
    callIA(txt||"Analiza la imagen adjunta.", ctx, imgData);
  };

  const reset = () => {
    setStep("tipo"); setSel({tipo:null,marca:null,ref:null}); registrado.current=false; setUbicacionMarca(null);
    const ini=[{role:"bot",text:modo==="tecnico"?SALUDO_TECNICO:SALUDO_OPERADOR}]; setMsgs(ini); msgsRef.current=ini;
    setImgData(null);
  };

  const renderText = (t) => {
    if (!t) return null;
    return t.split("\n").filter(Boolean).map((l,i) => {
      const linked = l.replace(/\[(.+?)\]\((https?:\/\/[^\)]+)\)/g,(_,label,url)=>`<a href="${url}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">${label}</a>`);
      return <div key={i} dangerouslySetInnerHTML={{__html:linked.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")}} style={{marginBottom:3}}/>;
    });
  };

  const sintomasActivos = modo==="operador" ? (SINTOMAS_OP[sel.tipo?.tipo]||[]) : (SINTOMAS[sel.tipo?.tipo]||[]);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 110px)"}}>
      {sel.tipo && (
        <div style={{padding:"7px 14px",background:C.al,borderBottom:`1px solid ${C.border}`,display:"flex",gap:6,alignItems:"center",fontSize:12,color:C.accent,flexWrap:"wrap"}}>
          <span>{sel.tipo.icon} {sel.tipo.tipo}</span>
          {sel.marca&&<><span style={{color:C.light}}>›</span><span>{sel.marca.nombre}</span></>}
          {sel.ref&&<><span style={{color:C.light}}>›</span><span style={{fontWeight:700}}>{sel.ref}</span></>}
          <span style={{marginLeft:"auto",cursor:"pointer",color:C.muted,fontSize:11}} onClick={reset}>✕ Nueva</span>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i) => (
          <div key={i} style={{maxWidth:"85%",alignSelf:m.role==="bot"?"flex-start":"flex-end"}}>
            {m.role==="bot"&&!m.isContactCard&&<div style={{fontSize:10,color:C.light,marginBottom:2,fontWeight:600}}>CEM IA</div>}
            {m.isContactCard ? (
              <ContactCard marca={m.marca} ciudad={m.ciudad}/>
            ) : (
              <div style={{background:m.role==="bot"?C.white:C.accent,color:m.role==="bot"?C.text:"#fff",padding:"10px 13px",borderRadius:m.role==="bot"?"4px 14px 14px 14px":"14px 4px 14px 14px",fontSize:13,lineHeight:1.65,border:m.role==="bot"?`1px solid ${C.border}`:"none"}}>
                {m.hasImg&&<div style={{fontSize:11,color:m.role==="bot"?C.muted:"rgba(255,255,255,0.8)",marginBottom:4}}>📷 Imagen adjunta</div>}
                {renderText(m.text)}
              </div>
            )}
          </div>
        ))}
        {step==="tipo"&&(
          <div style={{alignSelf:"flex-start",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {EQUIPOS.map(eq=>(
              <div key={eq.tipo} onClick={()=>pickTipo(eq)} style={{...card({cursor:"pointer",textAlign:"center",padding:"14px 8px"})}}>
                <div style={{fontSize:26,marginBottom:4}}>{eq.icon}</div>
                <div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div>
              </div>
            ))}
          </div>
        )}
        {step==="marca"&&sel.tipo&&(
          <div style={{alignSelf:"flex-start",display:"flex",flexWrap:"wrap",gap:7}}>
            {sel.tipo.marcas.map(m=><div key={m.nombre} onClick={()=>pickMarca(m)} style={{...card({padding:"7px 13px",cursor:"pointer"}),fontSize:13,fontWeight:600}}>{m.nombre}</div>)}
          </div>
        )}
        {step==="ref"&&sel.marca&&(
          <div style={{alignSelf:"flex-start",width:"100%"}}>
            <RefCatalog marca={sel.marca} onSelect={pickRef}/>
          </div>
        )}
        {step==="sintoma"&&(
          <div style={{alignSelf:"flex-start",display:"flex",flexWrap:"wrap",gap:7}}>
            {sintomasActivos.map(s=><div key={s} onClick={()=>pickSintoma(s)} style={{...card({padding:"7px 13px",cursor:"pointer"}),fontSize:12}}>{s}</div>)}
          </div>
        )}
        {step==="ubicacion"&&(
          <div style={{alignSelf:"flex-start",width:"100%"}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:600}}>Selecciona tu ciudad o escríbela:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
              {["Bogotá","Medellín","Cali","Barranquilla","Bucaramanga","Dosquebradas","Manizales","Pereira","Cúcuta","Ibagué","Pasto","Montería"].map(c=>(
                <div key={c} onClick={()=>pickCiudad(c)}
                  style={{background:C.gl,border:`1px solid ${C.green}`,borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700,color:C.green}}>
                  📍 {c}
                </div>
              ))}
            </div>
            <div onClick={()=>setStep("chat")} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 14px",cursor:"pointer",fontSize:11,color:C.muted,display:"inline-block"}}>Omitir →</div>
          </div>
        )}
        {loading&&<div style={{alignSelf:"flex-start",...card({padding:"10px 14px"}),fontSize:13,color:C.accent}}>Analizando…</div>}
        <div ref={endRef}/>
      </div>
      {imgData&&(
        <div style={{padding:"5px 13px",borderTop:`1px solid ${C.border}`,background:C.yl,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>📷</span>
          <span style={{fontSize:11,flex:1,color:C.yellow,fontWeight:600}}>{imgData.name}</span>
          <span onClick={()=>{setImgData(null);if(fileRef.current)fileRef.current.value="";}} style={{cursor:"pointer",color:C.red,fontSize:13}}>✕</span>
        </div>
      )}
      {step==="chat"&&(
        <div style={{padding:"5px 12px 3px",display:"flex",gap:6,flexWrap:"wrap"}}>
          <div onClick={reset} style={{...card({padding:"5px 11px"}),cursor:"pointer",fontSize:11,color:C.muted}}>🔄 Nueva</div>
        </div>
      )}
      <div style={{display:"flex",gap:7,padding:"9px 13px",borderTop:`1px solid ${C.border}`,background:C.white,alignItems:"center"}}>
        <input type="file" accept="image/*" ref={fileRef} onChange={handleImage} style={{display:"none"}}/>
        <button onClick={()=>fileRef.current?.click()} title="Adjuntar imagen"
          style={{width:40,height:40,borderRadius:8,border:`1px solid ${imgData?C.accent:C.border}`,background:imgData?C.al:C.white,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          📷
        </button>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
          placeholder={listening?"🎙️ Escuchando…":"Describe la falla…"}
          style={{flex:1,background:listening?"#fef3c7":C.bg,border:`1px solid ${listening?"#d97706":C.border}`,color:C.text,padding:"9px 12px",fontFamily:"inherit",fontSize:13,borderRadius:8,outline:"none"}}/>
        <button onClick={toggleMic} style={{width:40,height:40,borderRadius:8,border:`1px solid ${listening?C.red:C.border}`,background:listening?C.red:C.white,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {listening?"⏹":"🎙️"}
        </button>
        <button onClick={()=>speaking?speechSynthesis.cancel():hablar(lastBot.current)}
          style={{width:40,height:40,borderRadius:8,border:`1px solid ${speaking?C.accent:C.border}`,background:speaking?C.al:C.white,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {speaking?"🔊":"🔈"}
        </button>
        <button onClick={sendMsg} disabled={loading} style={{...btn("primary"),borderRadius:8,padding:"9px 14px",opacity:loading?0.6:1}}>➤</button>
      </div>
    </div>
  );
}

const TUTORIAL_PASOS = [
  { icono:"🏠", titulo:"Pantalla de inicio", texto:"Al abrir la app verás dos opciones: Técnico especializado y Operador. Elige tu rol. Puedes cambiar de rol en cualquier momento con el botón en el encabezado." },
  { icono:"🤖", titulo:"CEM Bot — Diagnóstico inteligente", texto:"Toca CEM Bot y selecciona el equipo, la marca y la referencia. Luego elige el síntoma o escríbelo. El bot analiza la falla y te da causa, pasos de diagnóstico y valores técnicos." },
  { icono:"📷", titulo:"Diagnóstico por imagen", texto:"Toca el botón de cámara en el chat y adjunta una foto del panel de error o del daño. El bot identifica automáticamente el equipo y el problema." },
  { icono:"🎙️", titulo:"Diagnóstico por voz", texto:"Toca el micrófono y describe la falla en voz alta. El bot también puede leer la respuesta en voz alta activando el altavoz." },
  { icono:"🧹", titulo:"Guías de limpieza", texto:"En Limpieza encontrarás protocolos paso a paso para Rational, Unox, Zanolli y Turbochef. Incluye productos permitidos, prohibidos y cuidado de burletes." },
  { icono:"📋", titulo:"Planes de mantenimiento preventivo", texto:"En Planes PM selecciona el equipo y la referencia. Verás tareas organizadas por frecuencia: diario, semanal, mensual, trimestral, semestral y anual." },
  { icono:"🔩", titulo:"Catálogo de repuestos con precios", texto:"En Repuestos busca por nombre o código. Verás el precio en pesos colombianos sin IVA y el código oficial." },
  { icono:"📍", titulo:"Técnicos certificados cerca de ti", texto:"Después de cada diagnóstico el bot pregunta en qué ciudad está el equipo. Al responder, muestra contactos de empresas certificadas con teléfono y WhatsApp." },
  { icono:"💬", titulo:"Preguntas y sugerencias", texto:"El botón 💬 verde en el encabezado (siempre visible) te conecta directamente con Pablo por Teams o correo para enviar sugerencias, reportar errores o hacer preguntas sobre la app." },
];

function TutorialScreen({ onClose }) {
  const [paso, setPaso] = useState(0);
  const [leyendo, setLeyendo] = useState(false);
  const p = TUTORIAL_PASOS[paso];

  const leer = () => {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(p.titulo + ". " + p.texto);
    u.lang="es-CO"; u.rate=0.92; u.pitch=0.85;
    const go = () => {
      const vs = speechSynthesis.getVoices();
      const v = vs.find(v=>v.lang.startsWith("es")&&/jorge|diego|carlos/i.test(v.name))||vs.find(v=>v.lang.startsWith("es"));
      if (v) u.voice = v;
      u.onstart=()=>setLeyendo(true); u.onend=u.onerror=()=>setLeyendo(false);
      speechSynthesis.speak(u);
    };
    speechSynthesis.getVoices().length>0?go():(speechSynthesis.onvoiceschanged=go);
  };
  const detener = () => { speechSynthesis.cancel(); setLeyendo(false); };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.88)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:440,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,0.4)"}}>
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",padding:"20px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",fontWeight:700,letterSpacing:1,marginBottom:3}}>TUTORIAL DE USO</div>
            <div style={{fontSize:17,fontWeight:900,color:"#fff"}}>CEM IA Assistant</div>
          </div>
          <div onClick={()=>{detener();onClose();}} style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:18}}>✕</div>
        </div>
        <div style={{display:"flex",gap:5,padding:"14px 20px 0",justifyContent:"center"}}>
          {TUTORIAL_PASOS.map((_,i)=>(
            <div key={i} onClick={()=>{detener();setPaso(i);}}
              style={{width:i===paso?22:8,height:8,borderRadius:4,background:i===paso?"#2563eb":i<paso?"#93c5fd":"#e4e8f0",cursor:"pointer",transition:"all 0.3s"}}/>
          ))}
        </div>
        <div style={{padding:"20px 22px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <div style={{width:52,height:52,background:"#eff6ff",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{p.icono}</div>
            <div>
              <div style={{fontSize:9,color:"#2563eb",fontWeight:800,letterSpacing:0.5,marginBottom:2}}>PASO {paso+1} DE {TUTORIAL_PASOS.length}</div>
              <div style={{fontSize:15,fontWeight:800,color:"#111827"}}>{p.titulo}</div>
            </div>
          </div>
          <div style={{fontSize:13,color:"#374151",lineHeight:1.75,background:"#f8fafc",borderRadius:10,padding:"14px 16px",borderLeft:"3px solid #2563eb"}}>{p.texto}</div>
        </div>
        <div style={{padding:"0 22px 20px",display:"flex",gap:8}}>
          <button onClick={leyendo?detener:leer} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:10,border:`1px solid ${leyendo?"#2563eb":"#e4e8f0"}`,background:leyendo?"#eff6ff":"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,color:leyendo?"#2563eb":"#6b7280",flexShrink:0}}>
            {leyendo?"⏹ Detener":"🔈 Leer"}
          </button>
          <button onClick={()=>{detener();setPaso(p=>Math.max(0,p-1));}} disabled={paso===0}
            style={{padding:"9px 14px",borderRadius:10,border:"1px solid #e4e8f0",background:"#fff",cursor:paso===0?"default":"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,color:paso===0?"#d1d5db":"#374151",opacity:paso===0?0.5:1}}>
            ← Ant.
          </button>
          {paso<TUTORIAL_PASOS.length-1?(
            <button onClick={()=>{detener();setPaso(p=>p+1);}} style={{flex:1,padding:"9px 14px",borderRadius:10,border:"none",background:"#2563eb",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,color:"#fff"}}>Siguiente →</button>
          ):(
            <button onClick={()=>{detener();onClose();}} style={{flex:1,padding:"9px 14px",borderRadius:10,border:"none",background:"#16a34a",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,color:"#fff"}}>✓ Empezar</button>
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSelect }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const { hayUpdate, checking, currentVersion, recargar } = useUpdateCheck();
  return (
    <>
      {showTutorial && <TutorialScreen onClose={()=>setShowTutorial(false)}/>}
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 22px",background:"#0f172a"}}>
        <div style={{position:"fixed",inset:0,backgroundImage:"radial-gradient(circle at 25% 25%,#1e3a5f 0%,transparent 55%),radial-gradient(circle at 78% 75%,#1e40af 0%,transparent 55%)",opacity:0.7,pointerEvents:"none"}}/>
        <div style={{position:"relative",width:"100%",maxWidth:360}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{position:"relative",display:"inline-block",marginBottom:14}}>
              <div style={{width:84,height:84,background:"rgba(255,255,255,0.07)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.1)"}}>
                <LogoCEM size={62}/>
              </div>
              <div style={{position:"absolute",top:-6,right:-8,background:"#e8432d",color:"#fff",fontSize:10,fontWeight:900,padding:"3px 8px",borderRadius:6,fontFamily:"Impact,sans-serif"}}>IA</div>
            </div>
            <div style={{fontSize:22,fontWeight:900,color:"#fff",letterSpacing:-0.5,marginBottom:4}}>CEM IA Assistant</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Centro de Excelencia de Mantenimiento</div>
            <div style={{display:"flex",justifyContent:"center",marginTop:6}}>
              <UpdateBanner hayUpdate={false} checking={checking} currentVersion={currentVersion} recargar={recargar} dark={true}/>
            </div>
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:700,letterSpacing:1,marginBottom:10,textAlign:"center"}}>SELECCIONA TU ROL</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
            <div onClick={()=>onSelect("tecnico")} style={{background:"#fff",borderRadius:16,padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>
              <div style={{width:48,height:48,background:"#dbeafe",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🔧</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:800,color:"#0f172a",marginBottom:2}}>Técnico especializado</div>
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>Diagnóstico, errores, repuestos, PM, instalación</div>
              </div>
              <div style={{fontSize:18,color:"#cbd5e1"}}>›</div>
            </div>
            <div onClick={()=>onSelect("operador")} style={{background:"rgba(255,255,255,0.07)",borderRadius:16,padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,border:"1px solid rgba(255,255,255,0.1)"}}>
              <div style={{width:48,height:48,background:"rgba(255,255,255,0.1)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>👨‍🍳</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:2}}>Operador / Cocinero</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.4}}>Limpieza, consejos y reporte de fallas</div>
              </div>
              <div style={{fontSize:18,color:"rgba(255,255,255,0.25)"}}>›</div>
            </div>
          </div>
          {hayUpdate&&<div style={{marginBottom:12}}><UpdateBanner hayUpdate={hayUpdate} checking={checking} currentVersion={currentVersion} recargar={recargar} dark={true}/></div>}
          <div onClick={()=>setShowTutorial(true)} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 16px",cursor:"pointer",border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{width:36,height:36,background:"linear-gradient(135deg,#f97316,#dc2626)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📖</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:1}}>¿Primera vez aquí?</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Tutorial de uso · 9 pasos con audio 🔈</div>
            </div>
            <div style={{fontSize:16,color:"rgba(255,255,255,0.25)"}}>›</div>
          </div>
          <div style={{textAlign:"center",marginTop:22,fontSize:10,color:"rgba(255,255,255,0.18)"}}>Rational · Unox · Zanolli · Turbochef · Bunn</div>
        </div>
      </div>
    </>
  );
}

function InicioTab({ onNav }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const { hayUpdate, checking, currentVersion, recargar } = useUpdateCheck();
  const { instalable, instalado, instalar, offline } = usePWAInstall();
  const items = [
    {id:"chat",      icon:"🤖", color:"#2563eb", bg:"#dbeafe", titulo:"CEM Bot",        desc:"Diagnóstico por texto, voz e imagen."},
    {id:"planes",    icon:"📋", color:"#16a34a", bg:"#dcfce7", titulo:"Planes PM",       desc:"Tareas preventivas por equipo."},
    {id:"instalacion",icon:"⚡",color:"#7c3aed", bg:"#ede9fe", titulo:"Instalación",     desc:"Requisitos eléctricos, agua y gas."},
    {id:"limpieza",  icon:"🧹", color:"#d97706", bg:"#fef3c7", titulo:"Limpieza",        desc:"Protocolos y cambio de burletes."},
    {id:"repuestos", icon:"🔩", color:"#b45309", bg:"#fef9c3", titulo:"Repuestos",       desc:"Precios Unox y Rational Colombia."},
    {id:"stats",     icon:"📊", color:"#0891b2", bg:"#cffafe", titulo:"Estadísticas",    desc:"Registro de fallas con gráficas."},
    {id:"guia",      icon:"📖", color:"#dc2626", bg:"#fee2e2", titulo:"Guía Técnica",    desc:"Códigos de error por marca."},
  ];
  return (
    <>
      {showTutorial && <TutorialScreen onClose={()=>setShowTutorial(false)}/>}
      <div style={{overflowY:"auto",height:"calc(100vh - 110px)",background:"#f8fafc"}}>
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",padding:"20px 18px 16px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-18,top:-18,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:12,position:"relative"}}>
            <div style={{width:50,height:50,background:"rgba(255,255,255,0.1)",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.12)",flexShrink:0}}>
              <LogoCEM size={36}/>
            </div>
            <div>
              <div style={{fontSize:17,fontWeight:900,color:"#fff"}}>CEM IA Assistant</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:1}}>🔧 Módulo técnico · {currentVersion}</div>
            </div>
          </div>
          <div style={{marginTop:12,display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"3px 10px",fontSize:10,color:"rgba(255,255,255,0.75)",fontWeight:600}}>✅ Bot activo</div>
            <div style={{background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"3px 10px",fontSize:10,color:"rgba(255,255,255,0.75)",fontWeight:600}}>🇨🇴 Colombia</div>
            {!hayUpdate&&<UpdateBanner hayUpdate={false} checking={checking} currentVersion={currentVersion} recargar={recargar} dark={true}/>}
          </div>
          {hayUpdate&&<div style={{marginTop:10}}><UpdateBanner hayUpdate={hayUpdate} checking={checking} currentVersion={currentVersion} recargar={recargar} dark={true}/></div>}
        </div>
        <div style={{padding:"12px 14px 80px"}}>
          <OfflineBanner offline={offline}/>
          {instalable&&!instalado&&(
            <div onClick={instalar} style={{background:"linear-gradient(135deg,#064e3b,#065f46)",borderRadius:12,padding:"11px 14px",cursor:"pointer",display:"flex",gap:11,alignItems:"center",border:"1px solid rgba(52,211,153,0.3)",marginBottom:9}}>
              <div style={{width:36,height:36,background:"rgba(52,211,153,0.15)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>📲</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:800,color:"#6ee7b7",marginBottom:1}}>Instalar app offline</div>
                <div style={{fontSize:10,color:"rgba(110,231,183,0.7)"}}>Agrega a pantalla de inicio · funciona sin internet</div>
              </div>
              <div style={{fontSize:15,color:"rgba(110,231,183,0.5)"}}>›</div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
            <div onClick={()=>onNav("chat")} style={{background:"linear-gradient(135deg,#1d4ed8,#2563eb)",borderRadius:14,padding:"15px 13px",cursor:"pointer",color:"#fff"}}>
              <div style={{fontSize:22,marginBottom:5}}>🤖</div>
              <div style={{fontSize:13,fontWeight:800,marginBottom:1}}>CEM Bot</div>
              <div style={{fontSize:10,opacity:0.7}}>Diagnóstico IA</div>
            </div>
            <div onClick={()=>onNav("guia")} style={{background:"linear-gradient(135deg,#b91c1c,#dc2626)",borderRadius:14,padding:"15px 13px",cursor:"pointer",color:"#fff"}}>
              <div style={{fontSize:22,marginBottom:5}}>📖</div>
              <div style={{fontSize:13,fontWeight:800,marginBottom:1}}>Guía Técnica</div>
              <div style={{fontSize:10,opacity:0.7}}>Códigos de error</div>
            </div>
          </div>
          <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:1,marginBottom:7,paddingLeft:1}}>HERRAMIENTAS</div>
          {items.filter(s=>!["chat","guia"].includes(s.id)).map(s=>(
            <div key={s.id} onClick={()=>onNav(s.id)} style={{background:"#fff",borderRadius:12,marginBottom:7,padding:"11px 13px",cursor:"pointer",display:"flex",gap:11,alignItems:"center",border:"1px solid #f1f5f9"}}>
              <div style={{width:36,height:36,background:s.bg,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:1}}>{s.titulo}</div>
                <div style={{fontSize:10,color:"#64748b"}}>{s.desc}</div>
              </div>
              <div style={{fontSize:15,color:"#cbd5e1"}}>›</div>
            </div>
          ))}
          {/* Bloque sugerencias destacado en inicio */}
          <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",borderRadius:12,marginTop:3,padding:"13px 15px",display:"flex",gap:11,alignItems:"center",border:"1px solid #86efac"}}>
            <div style={{width:36,height:36,background:"#16a34a",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>💬</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:800,color:"#15803d",marginBottom:1}}>Preguntas y sugerencias</div>
              <div style={{fontSize:10,color:"#16a34a"}}>¿Algo que mejorar? Escríbele a Pablo por Teams o correo</div>
            </div>
            <a href={TEAMS_URL} target="_blank" rel="noopener noreferrer"
              style={{background:"#16a34a",color:"#fff",fontSize:10,fontWeight:700,padding:"6px 12px",borderRadius:8,textDecoration:"none",flexShrink:0}}>
              Teams
            </a>
          </div>
          <div onClick={()=>setShowTutorial(true)} style={{background:"linear-gradient(135deg,#fffbeb,#fef9c3)",borderRadius:12,marginTop:9,padding:"13px 15px",cursor:"pointer",display:"flex",gap:11,alignItems:"center",border:"1px solid #fde68a"}}>
            <div style={{width:36,height:36,background:"linear-gradient(135deg,#f97316,#dc2626)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>📖</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:800,color:"#92400e",marginBottom:1}}>Tutorial de uso</div>
              <div style={{fontSize:10,color:"#a16207"}}>9 pasos · texto + audio 🔈</div>
            </div>
            <div style={{fontSize:15,color:"#d97706"}}>›</div>
          </div>
          <div style={{textAlign:"center",paddingTop:14,borderTop:"1px solid #f1f5f9",marginTop:11,fontSize:10,color:"#d1d5db"}}>
            Rational · Unox · Zanolli · Turbochef · Bunn<br/><span style={{fontSize:9}}>{currentVersion}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function InicioOpTab({ onNav }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const { hayUpdate, checking, currentVersion, recargar } = useUpdateCheck();
  return (
    <>
      {showTutorial && <TutorialScreen onClose={()=>setShowTutorial(false)}/>}
      <div style={{overflowY:"auto",height:"calc(100vh - 110px)",background:"#f8fafc"}}>
        <div style={{background:"linear-gradient(135deg,#064e3b,#059669)",padding:"20px 18px 16px",position:"relative",overflow:"hidden"}}>
          <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:3}}>Hola 👋</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.55)"}}>Asistente de cocina · CEM</div>
          {hayUpdate&&<div style={{marginTop:10}}><UpdateBanner hayUpdate={hayUpdate} checking={checking} currentVersion={currentVersion} recargar={recargar} dark={true}/></div>}
          <div style={{marginTop:11,background:"rgba(0,0,0,0.15)",borderRadius:10,padding:"10px 13px"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.9)",lineHeight:1.6}}>
              🚨 Humo · olor a gas · chispas · número de error → <strong style={{color:"#fde68a"}}>contrata técnico certificado ya</strong>
            </div>
          </div>
        </div>
        <div style={{padding:"12px 14px 80px"}}>
          <div onClick={()=>onNav("chat_op")} style={{background:"linear-gradient(135deg,#1d4ed8,#2563eb)",borderRadius:14,padding:"16px 16px",cursor:"pointer",display:"flex",gap:13,alignItems:"center",marginBottom:9,boxShadow:"0 4px 14px rgba(37,99,235,0.25)"}}>
            <div style={{width:48,height:48,background:"rgba(255,255,255,0.15)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💬</div>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:2}}>¿Algo raro con el equipo?</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Cuéntame y te ayudo</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:9}}>
            <div onClick={()=>onNav("limpieza")} style={{background:"#fff",borderRadius:13,padding:"15px 13px",cursor:"pointer",border:"1px solid #f1f5f9"}}>
              <div style={{fontSize:24,marginBottom:5}}>🧹</div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:1}}>Limpieza</div>
              <div style={{fontSize:10,color:"#64748b"}}>Paso a paso</div>
            </div>
            <div onClick={()=>onNav("consejos")} style={{background:"#fff",borderRadius:13,padding:"15px 13px",cursor:"pointer",border:"1px solid #f1f5f9"}}>
              <div style={{fontSize:24,marginBottom:5}}>💡</div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:1}}>Consejos</div>
              <div style={{fontSize:10,color:"#64748b"}}>Qué sí y qué no</div>
            </div>
          </div>
          {/* Sugerencias operador */}
          <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",borderRadius:12,marginBottom:9,padding:"13px 15px",display:"flex",gap:11,alignItems:"center",border:"1px solid #86efac"}}>
            <div style={{width:36,height:36,background:"#16a34a",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>💬</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:800,color:"#15803d",marginBottom:1}}>Preguntas y sugerencias</div>
              <div style={{fontSize:10,color:"#16a34a"}}>¿Algo que mejorar en la app? Escríbele a Pablo</div>
            </div>
            <a href={TEAMS_URL} target="_blank" rel="noopener noreferrer"
              style={{background:"#16a34a",color:"#fff",fontSize:10,fontWeight:700,padding:"6px 12px",borderRadius:8,textDecoration:"none",flexShrink:0}}>
              Teams
            </a>
          </div>
          <div onClick={()=>setShowTutorial(true)} style={{background:"linear-gradient(135deg,#fffbeb,#fef9c3)",borderRadius:12,padding:"13px 15px",cursor:"pointer",display:"flex",gap:11,alignItems:"center",border:"1px solid #fde68a",marginBottom:9}}>
            <div style={{width:36,height:36,background:"linear-gradient(135deg,#f97316,#dc2626)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>📖</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:800,color:"#92400e",marginBottom:1}}>Tutorial de uso</div>
              <div style={{fontSize:10,color:"#a16207"}}>9 pasos · texto + audio 🔈</div>
            </div>
            <div style={{fontSize:15,color:"#d97706"}}>›</div>
          </div>
          <div style={{background:"#fff",borderRadius:12,padding:"13px 15px",border:"1px solid #fecaca"}}>
            <div style={{fontSize:11,fontWeight:800,color:"#dc2626",marginBottom:7}}>🚨 Contrata técnico certificado si:</div>
            {["Hay humo, llamas o chispas dentro del equipo","Hay olor a gas o a quemado eléctrico","El equipo hace un ruido muy fuerte o inusual","Aparece un número de error en la pantalla","Hay agua en el piso alrededor del equipo"].map((item,i)=>(
              <div key={i} style={{fontSize:11,color:"#374151",padding:"2px 0",display:"flex",gap:6}}>
                <span style={{color:"#dc2626",flexShrink:0}}>•</span>{item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ConsejosTab() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:14}}>💡 Consejos para Operadores</div>
      {CONSEJOS_OP.map((c,i)=>(
        <div key={i} style={{...card({marginBottom:9}),border:open===i?`1px solid ${C.accent}`:`1px solid ${C.border}`}}>
          <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",paddingBottom:open===i?10:0}}>
            <span style={{fontSize:22}}>{c.icono}</span>
            <span style={{flex:1,fontSize:13,fontWeight:700}}>{c.titulo}</span>
            <span style={{color:C.muted,fontSize:11}}>{open===i?"▲":"▼"}</span>
          </div>
          {open===i&&(
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
              {c.consejos.map((consejo,j)=>(
                <div key={j} style={{display:"flex",gap:9,marginBottom:9}}>
                  <div style={{width:22,height:22,background:consejo.startsWith("🔴")||consejo.startsWith("❌")?C.rl:C.al,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,fontWeight:700,color:consejo.startsWith("🔴")||consejo.startsWith("❌")?C.red:C.accent}}>
                    {consejo.startsWith("🔴")||consejo.startsWith("❌")?"!":"✓"}
                  </div>
                  <div style={{fontSize:12,lineHeight:1.6,paddingTop:2}}>{consejo}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function InstalacionTab() {
  const [sT,setST]=useState(null); const [sM,setSM]=useState(null); const [sR,setSR]=useState(null); const [sec,setSec]=useState("electrico");
  const key=sM&&sR?`${sM.nombre}-${sR}`:null;
  const datos=key?INSTALACION[key]:null;
  const secs=[{id:"electrico",label:"⚡ Eléctrico"},{id:"agua",label:"💧 Agua"},{id:"gas",label:"🔥 Gas"},{id:"dimensiones",label:"📐 Dimensiones"},{id:"precio",label:"💰 Precio"}].filter(s=>s.id==="precio"||!datos||datos[s.id]);
  const campos={
    electrico:[["Tensión","tension"],["Frecuencia","frecuencia"],["Potencia","potencia"],["Corriente","corriente"],["Fusible","fusible"],["Conexión","conexion"],["Enchufe","enchufe"]],
    agua:[["Presión entrada","presion"],["Caudal mínimo","caudal"],["Conexión entrada","entrada"],["Desagüe","desague"],["Temperatura","temp"],["Calidad del agua","calidad"]],
    gas:[["Presión gas natural","presion_natural"],["Presión gas propano","presion_propano"],["Conexión gas","conexion"],["Ventilación","ventilacion"],["Nota","nota"]],
    dimensiones:[["Ancho","ancho"],["Profundidad","profundidad"],["Altura","altura"],["Peso","peso"],["Capacidad","capacidad"],["Espacio libre","espacio_libre"]],
  };
  return (
    <div style={{overflowY:"auto",height:"calc(100vh - 110px)",background:"#f8fafc"}}>
      <div style={{background:"linear-gradient(135deg,#4c1d95,#7c3aed)",padding:"18px 16px 14px"}}>
        <div style={{fontSize:17,fontWeight:900,color:"#fff",marginBottom:2}}>⚡ Datos de Instalación</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Requisitos eléctricos, agua, gas y espacio</div>
      </div>
      <div style={{padding:"14px 14px 80px"}}>
        {!sT&&<div>
          <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:1,marginBottom:8}}>SELECCIONA EL TIPO DE EQUIPO</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {EQUIPOS.map(eq=>(
              <div key={eq.tipo} onClick={()=>{setST(eq);setSM(null);setSR(null);setSec("electrico");}} style={{background:"#fff",borderRadius:12,padding:"16px 10px",cursor:"pointer",textAlign:"center",border:"1px solid #f1f5f9"}}>
                <div style={{fontSize:28,marginBottom:5}}>{eq.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>{eq.tipo}</div>
              </div>
            ))}
          </div>
        </div>}
        {sT&&!sM&&<div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div onClick={()=>setST(null)} style={{cursor:"pointer",fontSize:11,color:"#2563eb",fontWeight:600}}>← Volver</div>
            <div style={{fontSize:12,color:"#64748b"}}>{sT.icon} {sT.tipo}</div>
          </div>
          {sT.marcas.map(m=>(
            <div key={m.nombre} onClick={()=>setSM(m)} style={{background:"#fff",borderRadius:12,padding:"13px 15px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,border:"1px solid #f1f5f9"}}>
              <div style={{fontSize:20}}>{sT.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{m.nombre}</div>
              <div style={{marginLeft:"auto",fontSize:15,color:"#cbd5e1"}}>›</div>
            </div>
          ))}
        </div>}
        {sT&&sM&&!sR&&<div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div onClick={()=>setSM(null)} style={{cursor:"pointer",fontSize:11,color:"#2563eb",fontWeight:600}}>← Volver</div>
            <div style={{fontSize:12,color:"#64748b"}}>{sM.nombre}</div>
          </div>
          <RefCatalog marca={sM} onSelect={(r)=>{setSR(r);setSec("electrico");}} mostrarOtra={false}/>
        </div>}
        {sR&&<div>
          <div style={{background:"linear-gradient(135deg,#4c1d95,#7c3aed)",borderRadius:12,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:700,marginBottom:1}}>DATOS DE INSTALACIÓN</div>
              <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{sM?.nombre} {sR}</div>
            </div>
            <div onClick={()=>setSR(null)} style={{cursor:"pointer",background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"5px 10px",fontSize:10,color:"#fff",fontWeight:600}}>Cambiar</div>
          </div>
          {!datos&&<div style={{background:"#fef9c3",borderRadius:10,padding:"12px 14px",border:"1px solid #fde047",fontSize:12,color:"#92400e"}}>⚠️ Sin datos específicos para esta referencia. Consultar manual o empresa certificada.</div>}
          {datos&&<>
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              {secs.map(s=>(
                <button key={s.id} onClick={()=>setSec(s.id)} style={{padding:"7px 12px",borderRadius:9,border:sec===s.id?"none":"1px solid #e4e8f0",background:sec===s.id?"#7c3aed":"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,color:sec===s.id?"#fff":"#374151"}}>{s.label}</button>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #f1f5f9",overflow:"hidden",marginBottom:10}}>
              {(campos[sec]||[]).filter(([,k])=>datos[sec]?.[k]).map(([label,k],i,arr)=>(
                <div key={k} style={{padding:"12px 14px",borderBottom:i<arr.length-1?"1px solid #f8fafc":"none",display:"flex",gap:10}}>
                  <div style={{fontSize:11,color:"#64748b",minWidth:110,flexShrink:0,paddingTop:1}}>{label}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#0f172a",lineHeight:1.5,flex:1}}>{datos[sec][k]}</div>
                </div>
              ))}
              {!(campos[sec]||[]).some(([,k])=>datos[sec]?.[k])&&<div style={{padding:"16px",textAlign:"center",color:"#94a3b8",fontSize:12}}>No aplica para este equipo</div>}
            </div>
            {datos.notas&&<div style={{background:"#fffbeb",borderRadius:10,padding:"12px 14px",border:"1px solid #fde68a"}}><div style={{fontSize:10,fontWeight:800,color:"#d97706",marginBottom:5}}>📝 NOTAS DE INSTALACIÓN</div><div style={{fontSize:12,color:"#78350f",lineHeight:1.7}}>{datos.notas}</div></div>}
            {sec==="precio"&&(()=>{
              const pk=`${sM?.nombre}-${sR}`;
              const p=PRECIOS_EQUIPO[pk];
              const fmt=(n)=>"$"+n.toLocaleString("es-CO");
              if(!p) return <div style={{background:"#f1f5f9",borderRadius:10,padding:"14px",fontSize:12,color:"#64748b"}}>⚠️ Sin datos de precio registrados. Consultar con el distribuidor.</div>;
              return (
                <div>
                  {/* Aviso precios sugeridos */}
                  <div style={{background:"#eff6ff",border:"1px solid #93c5fd",borderRadius:10,padding:"10px 13px",marginBottom:12,display:"flex",gap:9,alignItems:"flex-start"}}>
                    <span style={{fontSize:16,flexShrink:0}}>ℹ️</span>
                    <div style={{fontSize:11,color:"#1e40af",lineHeight:1.6}}>
                      <strong>Precios sugeridos por las marcas.</strong> En próximas actualizaciones publicaremos cuál de nuestros proveedores homologados en Coupa ofrece el precio más competitivo para cada equipo.
                    </div>
                  </div>
                  <div style={{background:"#f0fdf4",borderRadius:12,padding:"14px",border:"1px solid #86efac",marginBottom:10}}>
                    <div style={{fontSize:10,fontWeight:800,color:"#16a34a",marginBottom:6}}>🆕 PRECIO NUEVO (sugerido por marca)</div>
                    <div style={{fontSize:22,fontWeight:900,color:"#15803d",marginBottom:2}}>{fmt(p.nuevo.min)} – {fmt(p.nuevo.max)}</div>
                    <div style={{fontSize:10,color:"#16a34a",fontWeight:600}}>COP · Precio sugerido — sujeto a negociación con proveedor</div>
                  </div>
                  <div style={{background:"#f5f3ff",borderRadius:12,padding:"14px",border:"1px solid #c4b5fd",marginBottom:10}}>
                    <div style={{fontSize:10,fontWeight:800,color:"#7c3aed",marginBottom:6}}>🔄 PRECIO USADO / REACONDICIONADO</div>
                    <div style={{fontSize:20,fontWeight:800,color:"#6d28d9",marginBottom:2}}>{fmt(p.usado.min)} – {fmt(p.usado.max)}</div>
                    <div style={{fontSize:10,color:"#7c3aed",fontWeight:600}}>COP · Referencia mercado segunda mano</div>
                  </div>
                  <div style={{background:"#fef9c3",borderRadius:8,padding:"10px 12px",border:"1px solid #fde047",marginBottom:8}}><div style={{fontSize:10,color:"#a16207",lineHeight:1.6}}>📋 Fuente: {p.fuente}.</div></div>
                  {/* Aviso próximo comparativo */}
                  <div style={{background:"#f8fafc",border:"1px dashed #cbd5e1",borderRadius:10,padding:"11px 13px",display:"flex",gap:9,alignItems:"flex-start"}}>
                    <span style={{fontSize:15,flexShrink:0}}>🗓️</span>
                    <div style={{fontSize:11,color:"#475569",lineHeight:1.65}}>
                      <strong style={{color:"#334155"}}>Próximamente: precios por proveedor Coupa.</strong><br/>
                      En junio CEM tendrá contrato con uno o más proveedores homologados. Mientras tanto, utiliza solo los proveedores que estén activos en <strong>Coupa</strong>. La lista de proveedores habilitados se publicará en la siguiente actualización de la app.
                    </div>
                  </div>
                </div>
              );
            })()}
          </>}
        </div>}
      </div>
    </div>
  );
}

function PlanesTab() {
  const [sT,setST]=useState(null); const [sM,setSM]=useState(null); const [sR,setSR]=useState(null); const [sec,setSec]=useState("diario");
  const plan=sM&&sR?(PLANES[`${sM.nombre}-${sR}`]||PLAN_GEN):null;
  const secs=[{id:"diario",label:"📅 Diario"},{id:"semanal",label:"🗓 Semanal"},{id:"mensual",label:"📆 Mensual"},{id:"trimestral",label:"🔄 Trimestral"},{id:"semestral",label:"📆 Semestral"},{id:"anual",label:"🏆 Anual"}];
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:14}}>Planes de Mantenimiento</div>
      {!sT&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>setST(eq)} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
      {sT&&!sM&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sT.icon} {sT.tipo}</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sT.marcas.map(m=><div key={m.nombre} onClick={()=>setSM(m)} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:12,fontWeight:600}}>{m.nombre}</div>)}</div><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setST(null)}>← Volver</div></div>}
      {sT&&sM&&!sR&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div><RefCatalog marca={sM} onSelect={setSR} mostrarOtra={false}/><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div></div>}
      {plan&&sR&&<div>
        <div style={{...card({background:C.al,border:`1px solid ${C.accent}44`,marginBottom:12,padding:"11px 14px"})}}>
          <div style={{fontSize:10,color:C.accent,fontWeight:700,marginBottom:2}}>PLAN PREVENTIVO</div>
          <div style={{fontSize:15,fontWeight:800}}>{sM?.nombre} {sR}</div>
          {plan===PLAN_GEN&&<div style={{fontSize:10,color:C.yellow,marginTop:3}}>⚠️ Plan genérico</div>}
        </div>
        <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>{secs.map(s=><button key={s.id} onClick={()=>setSec(s.id)} style={{...btn(sec===s.id?"primary":"outline","sm"),flexShrink:0}}>{s.label}</button>)}</div>
        <div style={card()}>
          {(plan[sec]||[]).length===0&&<div style={{padding:16,textAlign:"center",color:C.muted,fontSize:12}}>Sin tareas para esta frecuencia.</div>}
          {(plan[sec]||[]).map((t,i)=>(
            <div key={i} style={{display:"flex",gap:9,padding:"9px 0",borderBottom:i<(plan[sec].length-1)?`1px solid ${C.border}`:"none"}}>
              <div style={{width:22,height:22,background:C.al,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:C.accent,fontWeight:700,fontSize:11}}>{i+1}</div>
              <div style={{fontSize:12,lineHeight:1.5,paddingTop:3}}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSR(null)}>← Cambiar referencia</div>
      </div>}
    </div>
  );
}

function LimpiezaTab() {
  const [sT,setST]=useState(null); const [sM,setSM]=useState(null); const [sR,setSR]=useState(null); const [open,setOpen]=useState(null);
  const refKeywords = (marca, ref) => {
    if (!marca) return [];
    const m=marca.toLowerCase(); const r=(ref||"").toLowerCase();
    if (m==="rational") return ["rational"];
    if (m==="unox") {
      if (r.includes("xeft")||r.includes("xefr")||r.includes("arianna")) return ["arianna"];
      if (r.includes("xecc")||r.includes("xevc")||r.includes("cheftop")||r.includes("bakertop")) return ["cheftop","bakertop"];
      return ["unox"];
    }
    if (m==="zanolli") return ["zanolli"];
    if (m==="turbochef") return ["turbochef","hhc"];
    if (m==="bunn") return ["bunn"];
    return [m];
  };
  const datos = sT ? (LIMPIEZAS_DATA[sT.tipo]||[]).filter(item=>{
    if (!sM) return true;
    const t=item.titulo.toLowerCase();
    const kw=refKeywords(sM.nombre, sR);
    return kw.some(k=>t.includes(k));
  }) : [];
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:14}}>Guías de Limpieza</div>
      {!sT&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>{setST(eq);setSM(null);setSR(null);setOpen(null);}} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
      {sT&&!sM&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sT.icon} {sT.tipo}</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sT.marcas.map(m=><div key={m.nombre} onClick={()=>{setSM(m);setSR(null);setOpen(null);}} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:12,fontWeight:600}}>{m.nombre}</div>)}</div><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setST(null)}>← Volver</div></div>}
      {sT&&sM&&!sR&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div><RefCatalog marca={sM} onSelect={(r)=>{setSR(r);setOpen(null);}} mostrarOtra={false}/><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div></div>}
      {sT&&sM&&sR&&<div>
        <div style={{...card({background:C.gl,border:`1px solid ${C.green}44`,marginBottom:12,padding:"11px 14px"})}}>
          <div style={{fontSize:10,color:C.green,fontWeight:700,marginBottom:2}}>GUÍAS DE LIMPIEZA</div>
          <div style={{fontSize:15,fontWeight:800}}>{sM.nombre} {sR}</div>
        </div>
        {datos.length===0&&<div style={{...card({textAlign:"center",padding:28,color:C.muted})}}>Próximamente para {sM.nombre} {sR}.</div>}
        {datos.map((item,i)=>(
          <div key={i} style={{...card({marginBottom:9}),border:open===i?`1px solid ${C.accent}`:`1px solid ${C.border}`}}>
            <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",paddingBottom:open===i?10:0}}>
              <div style={{flex:1,fontSize:13,fontWeight:700}}>{item.titulo}</div>
              <span style={{color:C.muted,fontSize:11}}>{open===i?"▲":"▼"}</span>
            </div>
            {open===i&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
              {item.alerta&&<div style={{background:C.rl,borderLeft:`3px solid ${C.red}`,borderRadius:4,padding:"7px 10px",fontSize:11,color:C.red,marginBottom:10}}>{item.alerta}</div>}
              {item.pasos.map((p,j)=><div key={j} style={{display:"flex",gap:9,marginBottom:8}}><div style={{width:20,height:20,background:C.accent,color:"#fff",fontSize:10,fontWeight:700,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{j+1}</div><div style={{fontSize:12,lineHeight:1.6,paddingTop:2}}>{p}</div></div>)}
              {item.tutoriales&&item.tutoriales.length>0&&<TutorialLinks tutoriales={item.tutoriales}/>}
            </div>}
          </div>
        ))}
        <div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSR(null)}>← Cambiar referencia</div>
      </div>}
    </div>
  );
}

function RepuestosTab() {
  const [sT,setST]=useState(null); const [sM,setSM]=useState(null); const [sR,setSR]=useState(null);
  const [search,setSearch]=useState("");
  const repBase = sM ? REPUESTOS.filter(r=>r.marca===sM.nombre) : REPUESTOS;
  const resultados = search.trim().length>1
    ? repBase.filter(r=>{const q=search.toLowerCase();return r.cod.toLowerCase().includes(q)||r.desc.toLowerCase().split(" ").some(w=>w.length>3&&q.includes(w))||q.split(" ").some(w=>w.length>3&&r.desc.toLowerCase().includes(w));}).slice(0,12)
    : [];
  const grupos = [
    {label:"🚪 Burletes y juntas", items:repBase.filter(r=>/goma|burlete|junta/i.test(r.desc)).slice(0,6)},
    {label:"🔧 Motores y turbinas", items:repBase.filter(r=>/motor|turbina|ventilador/i.test(r.desc)).slice(0,5)},
    {label:"⚡ Tarjetas y electrónica", items:repBase.filter(r=>/tarjeta|panel de control|control/i.test(r.desc)).slice(0,5)},
    {label:"🌡️ Sondas y termostatos", items:repBase.filter(r=>/sonda|termostato/i.test(r.desc)).slice(0,5)},
  ].filter(g=>g.items.length>0);
  const ItemCard = ({r}) => (
    <div style={{...card({marginBottom:7,padding:"10px 13px"})}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",gap:5,marginBottom:3,flexWrap:"wrap"}}>
            <span style={{fontSize:10,fontWeight:700,color:C.accent,background:C.al,padding:"2px 6px",borderRadius:4}}>{r.cod}</span>
            <span style={{fontSize:9,color:C.muted,background:"#f3f4f6",padding:"2px 6px",borderRadius:4}}>{r.marca}</span>
          </div>
          <div style={{fontSize:12,lineHeight:1.5,color:C.text}}>{r.desc}</div>
        </div>
        <div style={{fontSize:14,fontWeight:800,color:C.green,flexShrink:0,textAlign:"right"}}>
          {formatPrecio(r.precio)}
          <div style={{fontSize:9,color:C.muted,fontWeight:400}}>sin IVA</div>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:14}}>🔩 Repuestos</div>
      {!sT&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>{setST(eq);setSM(null);setSR(null);setSearch("");}} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
      {sT&&!sM&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sT.icon} {sT.tipo}</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sT.marcas.map(m=><div key={m.nombre} onClick={()=>{setSM(m);setSR(null);setSearch("");}} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:12,fontWeight:600}}>{m.nombre}</div>)}</div><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setST(null)}>← Volver</div></div>}
      {sT&&sM&&!sR&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div><RefCatalog marca={sM} onSelect={(r)=>{setSR(r);setSearch("");}} mostrarOtra={false}/><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div></div>}
      {sT&&sM&&sR&&<div>
        <div style={{...card({background:"#f8faff",border:`1px solid ${C.accent}33`,marginBottom:12,padding:"11px 14px"})}}>
          <div style={{fontSize:10,color:C.accent,fontWeight:700,marginBottom:2}}>REPUESTOS</div>
          <div style={{fontSize:15,fontWeight:800}}>{sM.nombre} {sR}</div>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Buscar repuesto ${sM.nombre}…`}
          style={{width:"100%",padding:"10px 13px",borderRadius:9,border:`1px solid ${C.border}`,fontSize:13,fontFamily:"inherit",color:C.text,background:C.bg,outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
        {search.trim().length>1&&(<div>{resultados.length===0&&<div style={{...card({textAlign:"center",padding:20,color:C.muted})}}>Sin resultados</div>}{resultados.map(r=><ItemCard key={r.cod} r={r}/>)}</div>)}
        {!search.trim()&&grupos.map(g=><div key={g.label} style={{marginBottom:16}}><div style={{fontSize:12,fontWeight:700,marginBottom:8}}>{g.label}</div>{g.items.map(r=><ItemCard key={r.cod} r={r}/>)}</div>)}
        <div style={{marginTop:8,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSR(null)}>← Cambiar referencia</div>
      </div>}
    </div>
  );
}

function BarChart({datos, colorFn}) {
  const mx = datos[0]?.[1] || 1;
  return (
    <div>
      {datos.map(([label,n],i)=>(
        <div key={label} style={{marginBottom:9}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
            <span style={{fontWeight:i===0?700:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"75%"}}>{label}</span>
            <span style={{fontWeight:700,color:colorFn(i),flexShrink:0,marginLeft:6}}>{n}x</span>
          </div>
          <div style={{background:C.bg,borderRadius:4,height:7,overflow:"hidden"}}>
            <div style={{background:colorFn(i),width:`${(n/mx)*100}%`,height:"100%",borderRadius:4,transition:"width 0.4s"}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

const ADMIN_PIN = "1234";
function StatsTab({ fallas, onBorrar }) {
  const [filtro,setFiltro]=useState("todo"); const [vista,setVista]=useState("graficas");
  const [adminMode,setAdminMode]=useState(false); const [pinInput,setPinInput]=useState(""); const [pinError,setPinError]=useState(false); const [showPin,setShowPin]=useState(false);
  const [seleccionados,setSeleccionados]=useState(new Set());
  const FILTROS=[{id:"todo",label:"Todo"},{id:"hoy",label:"Hoy"},{id:"semana",label:"7d"},{id:"mes",label:"30d"}];
  const ahora=new Date();
  const filtrar=lista=>{
    if(filtro==="todo")return lista;
    const dias={hoy:1,semana:7,mes:30}[filtro];
    const desde=filtro==="hoy"?new Date(ahora.getFullYear(),ahora.getMonth(),ahora.getDate()):new Date(ahora.getTime()-dias*24*60*60*1000);
    return lista.filter(f=>f.fecha&&new Date(f.fecha)>=desde);
  };
  const datos=filtrar(fallas);
  const contar=key=>Object.entries(datos.reduce((a,f)=>{const k=f[key]||"Sin dato";a[k]=(a[k]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]);
  const colores=["#2563eb","#16a34a","#d97706","#dc2626","#7c3aed","#0891b2"];
  const colorFn=i=>colores[i%colores.length];
  const toggleSel=idx=>{const s=new Set(seleccionados);s.has(idx)?s.delete(idx):s.add(idx);setSeleccionados(s);};
  const borrarSeleccionados=()=>{
    if(seleccionados.size===0)return;
    if(!window.confirm(`¿Borrar ${seleccionados.size} registro(s)?`))return;
    const reg=new Set([...seleccionados].map(i=>[...datos].reverse()[i]));
    onBorrar(fallas.filter(f=>!reg.has(f))); setSeleccionados(new Set());
  };
  const entrarAdmin=()=>{if(pinInput===ADMIN_PIN){setAdminMode(true);setShowPin(false);setPinInput("");setPinError(false);}else{setPinError(true);}};
  if(fallas.length===0)return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"calc(100vh - 110px)",padding:16,textAlign:"center"}}>
      <div style={{fontSize:44,marginBottom:10}}>📊</div>
      <div style={{fontSize:15,fontWeight:700,marginBottom:5}}>Sin datos aún</div>
      <div style={{fontSize:12,color:C.muted}}>Usa el CEM Bot para registrar consultas.</div>
    </div>
  );
  return (
    <div style={{padding:14,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:17,fontWeight:800,flex:1}}>Estadísticas</div>
        <button onClick={()=>adminMode?setAdminMode(false):setShowPin(!showPin)} style={{...btn(adminMode?"primary":"outline","sm"),fontSize:10}}>{adminMode?"🔓 Admin ON":"🔐 Admin"}</button>
      </div>
      {showPin&&!adminMode&&(
        <div style={{...card({marginBottom:12,padding:"12px 14px",background:C.yl,border:`1px solid ${C.yellow}44`})}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>🔐 PIN de administrador</div>
          <div style={{display:"flex",gap:8}}>
            <input type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&entrarAdmin()} placeholder="PIN" maxLength={6} style={{flex:1,padding:"8px 10px",borderRadius:7,border:`1px solid ${pinError?C.red:C.border}`,fontSize:14,fontFamily:"inherit",outline:"none"}}/>
            <button onClick={entrarAdmin} style={{...btn("primary","sm")}}>Entrar</button>
          </div>
          {pinError&&<div style={{fontSize:11,color:C.red,marginTop:5}}>PIN incorrecto</div>}
        </div>
      )}
      {adminMode&&<div style={{...card({marginBottom:12,padding:"9px 12px",background:C.rl,border:`1px solid ${C.red}44`})}}>
        <div style={{fontSize:11,color:C.red,fontWeight:700}}>🔓 Modo administrador activo</div>
      </div>}
      <div style={{display:"flex",gap:5,marginBottom:12}}>{FILTROS.map(f=><button key={f.id} onClick={()=>setFiltro(f.id)} style={{...btn(filtro===f.id?"primary":"outline","sm")}}>{f.label}</button>)}<div style={{marginLeft:"auto",background:C.al,color:C.accent,fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,display:"flex",alignItems:"center"}}>{datos.length} reg.</div></div>
      <div style={{display:"flex",gap:5,marginBottom:14}}>
        <button onClick={()=>setVista("graficas")} style={{...btn(vista==="graficas"?"primary":"outline","sm"),flex:1}}>📊 Gráficas</button>
        <button onClick={()=>setVista("registros")} style={{...btn(vista==="registros"?"primary":"outline","sm"),flex:1}}>📋 Registros</button>
      </div>
      {datos.length===0&&<div style={{...card({textAlign:"center",padding:28,color:C.muted})}}>Sin registros en este período.</div>}
      {vista==="graficas"&&datos.length>0&&<>
        <div style={{...card({marginBottom:12})}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>🔥 Consultas por equipo</div>
          <BarChart datos={contar("equipo")} colorFn={colorFn}/>
        </div>
        <div style={{...card({marginBottom:12})}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>🏷️ Consultas por marca</div>
          <BarChart datos={contar("marca")} colorFn={i=>colores[(i+2)%colores.length]}/>
        </div>
        <div style={card()}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>⚠️ Fallas más frecuentes</div>
          <BarChart datos={contar("sintoma").slice(0,6)} colorFn={i=>i===0?C.red:`${C.red}99`}/>
        </div>
      </>}
      {vista==="registros"&&datos.length>0&&<>
        {adminMode&&seleccionados.size>0&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,padding:"8px 12px",background:C.rl,borderRadius:8}}>
            <span style={{fontSize:12,color:C.red,fontWeight:700}}>{seleccionados.size} seleccionado(s)</span>
            <button onClick={borrarSeleccionados} style={{...btn("outline","sm"),color:C.red,borderColor:C.red,fontSize:11}}>🗑 Borrar</button>
          </div>
        )}
        <div style={card()}>
          {[...datos].reverse().map((f,i)=>(
            <div key={i} onClick={()=>adminMode&&toggleSel(i)}
              style={{display:"flex",gap:9,padding:"9px 0",borderBottom:i<datos.length-1?`1px solid ${C.border}`:"none",alignItems:"flex-start",cursor:adminMode?"pointer":"default",background:seleccionados.has(i)?"#fef2f2":"transparent",borderRadius:4}}>
              {adminMode&&<div style={{width:16,height:16,borderRadius:4,border:`2px solid ${seleccionados.has(i)?C.red:C.border}`,background:seleccionados.has(i)?C.red:"transparent",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center"}}>{seleccionados.has(i)&&<span style={{color:"#fff",fontSize:9,fontWeight:900}}>✓</span>}</div>}
              <span style={{fontSize:14,flexShrink:0}}>{EQUIPOS.find(e=>e.tipo===f.equipo)?.icon||"🔧"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:600}}>{f.equipo} · {f.marca} · {f.ref}</div>
                <div style={{fontSize:10,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.sintoma}</div>
              </div>
              <div style={{fontSize:9,color:C.light,flexShrink:0,textAlign:"right"}}>{f.fecha?new Date(f.fecha).toLocaleDateString("es-CO",{day:"2-digit",month:"short"}):""}</div>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function ReferenciasTab() {
  const [filtro, setFiltro] = useState("Todos");
  const [busq, setBusq] = useState("");
  const [descMsg, setDescMsg] = useState("");

  const allRefs = useMemo(() => {
    const lista = [];
    for (const eq of EQUIPOS) {
      for (const marca of eq.marcas) {
        for (const r of marca.refs) {
          const ref = typeof r === "string" ? r : r.ref;
          const desc = typeof r === "object" ? (r.desc||"") : "";
          lista.push({ tipo:eq.tipo, marca:marca.nombre, ref, desc });
        }
      }
    }
    return lista;
  }, []);

  const tipos = useMemo(()=>["Todos",...Array.from(new Set(allRefs.map(r=>r.tipo)))],[allRefs]);
  const filtered = useMemo(()=>{
    let list=allRefs;
    if(filtro!=="Todos") list=list.filter(r=>r.tipo===filtro);
    if(busq.trim()){const q=busq.toLowerCase();list=list.filter(r=>r.ref.toLowerCase().includes(q)||r.marca.toLowerCase().includes(q)||r.desc.toLowerCase().includes(q));}
    return list;
  },[allRefs,filtro,busq]);
  const grouped = useMemo(()=>{
    const g={};
    for(const r of filtered){if(!g[r.tipo])g[r.tipo]={};if(!g[r.tipo][r.marca])g[r.tipo][r.marca]=[];g[r.tipo][r.marca].push(r);}
    return g;
  },[filtered]);

  const buildCSV=(data)=>{const rows=[["Activo","Marca","Referencia","Descripción"]];for(const r of data)rows.push([r.tipo,r.marca,r.ref,r.desc||""]);return rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,"\"\"")}"`).join(",")).join("\n");};
  const download=(data,name)=>{const csv="\uFEFF"+buildCSV(data);const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);setDescMsg("✅ Descargado: "+name);setTimeout(()=>setDescMsg(""),3000);};

  const TIPO_COLOR={"Horno":"#f97316","Cafetera":"#8b5cf6","Granizadora":"#06b6d4","Nevera / Congelador":"#0ea5e9"};
  return (
    <div style={{padding:14,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <div style={{fontSize:17,fontWeight:800,color:C.text}}>📑 Referencias</div>
          <div style={{fontSize:10,color:C.muted,marginTop:1}}>{filtered.length} equipos encontrados</div>
        </div>
        <button onClick={()=>download(filtered,filtro==="Todos"?"CEM_Referencias_Completa.csv":`CEM_Refs_${filtro.replace(/[\s/]/g,"_")}.csv`)} style={{...btn("primary","sm"),fontSize:11,padding:"7px 13px",borderRadius:20}}>⬇ Descargar</button>
      </div>
      {descMsg&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"7px 12px",fontSize:11,color:"#16a34a",marginBottom:10,fontWeight:600}}>{descMsg}</div>}
      <input value={busq} onChange={e=>setBusq(e.target.value)} placeholder="🔍 Buscar por referencia, marca o descripción..." style={{width:"100%",boxSizing:"border-box",padding:"9px 12px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:10,outline:"none",background:C.white}}/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {tipos.map(t=>(
          <button key={t} onClick={()=>setFiltro(t)} style={{...btn(filtro===t?"primary":"outline","sm"),borderRadius:20,fontSize:10,padding:"4px 11px"}}>
            {t==="Nevera / Congelador"?"❄️ Frío":t==="Horno"?"🔥 Horno":t==="Cafetera"?"☕ Cafetera":t==="Granizadora"?"🧊 Granizadora":t}
          </button>
        ))}
      </div>
      {Object.keys(grouped).length===0?(
        <div style={{textAlign:"center",color:C.muted,fontSize:13,marginTop:40}}>Sin resultados para "{busq}"</div>
      ):(
        Object.entries(grouped).map(([tipo,marcas])=>(
          <div key={tipo} style={{marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:6,borderBottom:`2px solid ${TIPO_COLOR[tipo]||C.accent}`}}>
              <span style={{fontSize:15}}>{tipo==="Horno"?"🔥":tipo==="Cafetera"?"☕":tipo==="Granizadora"?"🧊":"❄️"}</span>
              <span style={{fontSize:13,fontWeight:800,color:C.text}}>{tipo}</span>
              <span style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{Object.values(marcas).flat().length} refs</span>
            </div>
            {Object.entries(marcas).map(([marca,refs])=>(
              <div key={marca} style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:TIPO_COLOR[tipo]||C.accent,marginBottom:5,paddingLeft:2}}>{marca} <span style={{fontWeight:400,color:C.muted}}>({refs.length})</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {refs.map((r,i)=>(
                    <div key={i} style={{...card({padding:"8px 11px",background:"#f8fafc"}),display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:TIPO_COLOR[tipo]||C.accent,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:700,color:C.text}}>{r.ref}</div>
                        {r.desc&&<div style={{fontSize:10,color:C.muted,marginTop:1}}>{r.desc}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      <div style={{height:20}}/>
    </div>
  );
}

function GuiaTab() {
  const [marca, setMarca] = useState("rational");
  const [open, setOpen] = useState(null);
  const errores = marca==="rational"?ERRORES_RATIONAL:marca==="turbochef"?ERRORES_TURBOCHEF:marca==="zanolli"?ERRORES_ZANOLLI:ERRORES_UNOX;
  return (
    <div style={{padding:14,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:12}}>Guía Técnica</div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <button onClick={()=>{setMarca("rational");setOpen(null);}} style={{...btn(marca==="rational"?"primary":"outline","sm")}}>Rational SCC</button>
        <button onClick={()=>{setMarca("unox");setOpen(null);}} style={{...btn(marca==="unox"?"primary":"outline","sm")}}>Unox ChefTop</button>
        <button onClick={()=>{setMarca("turbochef");setOpen(null);}} style={{...btn(marca==="turbochef"?"primary":"outline","sm")}}>TurboChef HHC</button>
        <button onClick={()=>{setMarca("zanolli");setOpen(null);}} style={{...btn(marca==="zanolli"?"primary":"outline","sm")}}>Zanolli Synthesis</button>
      </div>
      {errores.map((e,i)=>(
        <div key={i} style={{...card({marginBottom:7}),border:open===i?`1px solid ${C.accent}`:`1px solid ${C.border}`}}>
          <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",paddingBottom:open===i?10:0}}>
            <span style={{fontSize:14}}>{["CRÍTICO","PELIGRO"].includes(e.nivel)?"🔴":e.nivel==="SIMPLE"?"🟢":"🟡"}</span>
            <span style={{flex:1,fontSize:13,fontWeight:700}}>{e.code}</span>
            <span style={tagS(NIVEL_C[e.nivel]||"blue")}>{e.nivel}</span>
            <span style={{color:C.muted,fontSize:10,marginLeft:3}}>{open===i?"▲":"▼"}</span>
          </div>
          {open===i&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
            <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{e.desc}</div>
            {e.pasos.map((p,j)=><div key={j} style={{display:"flex",gap:9,marginBottom:7}}><div style={{width:20,height:20,background:C.accent,color:"#fff",fontSize:10,fontWeight:700,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{j+1}</div><div style={{fontSize:12,lineHeight:1.6,paddingTop:2}}>{p}</div></div>)}
          </div>}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [rol, setRol] = useState(null);
  const [tab, setTab] = useState("inicio");
  const [fallas, setFallas] = useState([]);

  useEffect(() => { setFallas(loadF()); }, []);

  const seleccionarRol = (r) => { setRol(r); setTab(r==="tecnico"?"inicio":"inicio_op"); };
  const registrar = (f) => { const n={...f,fecha:new Date().toISOString()}; const a=[...fallas,n]; setFallas(a); saveF(a); };

  if (!rol) return <WelcomeScreen onSelect={seleccionarRol}/>;

  const TABS = rol==="tecnico" ? TABS_TECNICO : TABS_OPERADOR;

  return (
    <>
      <Head>
        <title>CEM IA Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <meta name="theme-color" content="#2563eb"/>
      </Head>
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",color:C.text,maxWidth:520,margin:"0 auto"}}>

        {/* ─── HEADER STICKY — botón 💬 siempre visible ─── */}
        <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:9,position:"sticky",top:0,zIndex:100}}>
          <div style={{position:"relative",flexShrink:0}}>
            <LogoCEM size={42}/>
            <div style={{position:"absolute",top:-4,right:-7,background:"#e8432d",color:"#fff",fontSize:9,fontWeight:900,padding:"2px 5px",borderRadius:4,fontFamily:"Impact,sans-serif"}}>IA</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:800}}>CEM IA Assistant</div>
            <div style={{fontSize:9,color:C.muted}}>Centro de Excelencia de Mantenimiento</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {/* Badge de rol */}
            <div style={{background:rol==="tecnico"?C.al:C.gl,color:rol==="tecnico"?C.accent:C.green,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,border:`1px solid ${rol==="tecnico"?C.accent:C.green}33`}}>
              {rol==="tecnico"?"🔧 Técnico":"👨‍🍳 Operador"}
            </div>
            {/* ── BOTÓN SUGERENCIAS — siempre visible en header ── */}
            <BtnSugerencias/>
            {/* Cambiar rol */}
            <div onClick={()=>setRol(null)} style={{cursor:"pointer",color:C.light,fontSize:11}} title="Cambiar rol">⇄</div>
          </div>
        </div>

        {tab==="inicio"       && <InicioTab onNav={setTab}/>}
        {tab==="inicio_op"    && <InicioOpTab onNav={setTab}/>}
        {tab==="chat"         && <ChatTab onFalla={registrar} modo="tecnico"/>}
        {tab==="chat_op"      && <ChatTab onFalla={registrar} modo="operador"/>}
        {tab==="instalacion"  && <InstalacionTab/>}
        {tab==="planes"       && <PlanesTab/>}
        {tab==="limpieza"     && <LimpiezaTab/>}
        {tab==="repuestos"    && <RepuestosTab/>}
        {tab==="stats"        && <StatsTab fallas={fallas} onBorrar={f=>{setFallas(f);saveF(f);}}/>}
        {tab==="referencias"  && <ReferenciasTab/>}
        {tab==="guia"         && <GuiaTab/>}
        {tab==="consejos"     && <ConsejosTab/>}

        {/* Bottom Nav */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:520,background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"8px 2px 6px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,fontFamily:"inherit",borderTop:tab===t.id?`2px solid ${C.accent}`:"2px solid transparent"}}>
              <span style={{fontSize:15}}>{t.icon}</span>
              <span style={{fontSize:8,fontWeight:tab===t.id?700:400,color:tab===t.id?C.accent:C.light}}>{t.label}</span>
            </button>
          ))}
        </div>
        <div style={{height:65}}/>
      </div>
    </>
  );
}
