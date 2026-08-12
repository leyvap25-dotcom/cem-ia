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
  Granizadora:["No enfría","No mezcla","Gotea","No enciende","Ruido extraño","Producto muy líquido","Producto muy sólido","Producto no congela bien","Compresor no arranca","Motor del tambor no gira","Fuga de producto por el dispensador","Tambor trabado o atascado","Panel de control no responde","Temperatura del producto inestable","Vibración excesiva","Olor extraño en el producto","Dispensador no sale producto"],
  "Nevera / Congelador":["No enfría","Ruido extraño","Gotea agua","Escarcha excesiva","No enciende","Temperatura inestable"],
};

const SINTOMAS_OP = {
  Horno:["El horno no enciende","Hay un código de error en la pantalla","El horno gotea agua","El lavado automático no funciona","El burlete está despegado o roto","El horno quema los alimentos","La puerta no cierra bien","Hay humo o llamas dentro del horno","Ruidos fuertes o extraños","El horno tarda mucho en calentar"],
  Cafetera:["No calienta el agua","No sale café","Gotea por debajo","No enciende"],
  Granizadora:["No enfría","No mezcla","Gotea","No enciende","El producto está muy líquido","El producto está muy duro o helado","El dispensador no sale nada","Hace mucho ruido","Hay producto en el piso"],
  "Nevera / Congelador":["No enfría","Hace ruido","Tiene mucho hielo","No enciende"],
};

const ALIAS_MARCA = [
  { words:["xecc","xecc-0523","cheftop","chef top","cheftop compact","chefto"], marca:"Unox", ref:"XECC-0523-EPRM" },
  { words:["xecc-0513","cheftop 0513"], marca:"Unox", ref:"XECC-0513-EPRM" },
  { words:["xeft","xeft-04","arianna","ariana","bakerlux","ariann","xefr"], marca:"Unox", ref:"XEFT-04HS-ELDV" },
  { words:["xefr-04eu","bakerlux 04eu"], marca:"Unox", ref:"XEFR-04EU-ELDV" },
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
    nuevo:  { min: 85000000, max: 110000000, moneda:"COP" },
    usado:  { min: 35000000, max: 55000000,  moneda:"COP" },
    fuente: "Rational Colombia (cotización directa) · Referencia mercado reacondicionado USA $8,000–$15,000 USD · TRM ~$4,200",
    nota:   "Rational no publica precios — solicitar cotización a Rational Colombia o distribuidor autorizado.",
    warranty: "2 años partes, 1 año mano de obra · Compresor: 5 años",
    distribuidores: "Rational Colombia · Intecse Bogotá · Crutek Bogotá",
  },
  "Rational-SCC WE 101G": {
    nuevo:  { min: 105000000, max: 135000000, moneda:"COP" },
    usado:  { min: 45000000, max: 70000000,   moneda:"COP" },
    fuente: "Rational Colombia (cotización directa)",
    nota:   "Modelo piso — incluye pie de fábrica.",
    warranty: "2 años partes, 1 año mano de obra",
    distribuidores: "Rational Colombia · Intecse Bogotá · Crutek Bogotá",
  },
  "Turbochef-HHC2020": {
    nuevo:  { min: 110000000, max: 135000000, moneda:"COP" },
    usado:  { min: 35000000, max: 60000000,   moneda:"COP" },
    fuente: "webstaurantstore.com: $18,888 USD · +40% importación Colombia",
    nota:   "Ventless certificado UL KNLZ.",
    warranty: "12 meses desde despacho de fábrica",
    distribuidores: "Euromex Bogotá +57 601 226 4242 · Industrial Kitchen Medellín 301 471 1328",
  },
  "Bunn-ULTRA-2": {
    nuevo:  { min: 12000000, max: 18000000, moneda:"COP" },
    usado:  { min: 4000000,  max: 8000000,  moneda:"COP" },
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
  "Rational-SCC WE 101G":{
    electrico:{tension:"3N AC 400V",frecuencia:"50/60 Hz",potencia:"10.5 kW",corriente:"16 A",fusible:"3×16 A curva C",conexion:"Cable 5 hilos (3F+N+T) — tierra obligatoria.",enchufe:"Sin enchufe de serie — instalación fija"},
    agua:{presion:"150–300 kPa (1.5–3 bar) dinámica",caudal:"mín. 20 l/min",entrada:'Manguera tipo lavarropa 1/2"',desague:"Tubería Ø 50 mm (2\"), resistente a 65°C — sifón externo tipo P-trap.",calidad:"Conductividad mín. 50 µS/cm — dureza mín. 5°dH."},
    dimensiones:{ancho:"847 mm",profundidad:"771 mm",altura:"600 mm (sobremesa) o 1.835 mm (con pie)",peso:"~80 kg",capacidad:"6×1/1 GN"},
    notas:"Instalar sobre superficie plana y estable. Nivelar con pies regulables. Temperatura ambiente: +5°C a +40°C."
  },
  "Turbochef-HHC2020":{
    electrico:{tension:"AC 208–240V monofásico",frecuencia:"50/60 Hz",potencia:"14.4 kW máx",corriente:"50 A máx",fusible:"Breaker 50 A — circuito dedicado obligatorio",conexion:"NEMA 15-50P (4 pines)",enchufe:"NEMA 15-50P estándar"},
    agua:{presion:"N/A",entrada:"No requiere agua",nota:"Horno VENTLESS certificado UL KNLZ"},
    dimensiones:{ancho:"559 mm",profundidad:"1527 mm total",altura:"432 mm con patas",peso:"~68 kg",capacidad:"Cámara 508 mm (20\") ancho · Temp. máx. 288°C"},
    notes:"VENTLESS — no requiere campana extractora para alimentos no grasos. Temperatura ambiente máx: 49°C."
  },
  "Bunn-ULTRA-2":{
    electrico:{tension:"120V monofásico",frecuencia:"50/60 Hz",potencia:"1.44 kW",corriente:"12 A",fusible:"Breaker 15 A",conexion:"Cable de alimentación estándar con enchufe",enchufe:"NEMA 5-15P"},
    agua:{presion:"N/A",entrada:"Llenado manual (no requiere toma de agua)"},
    dimensiones:{ancho:"406 mm",profundidad:"622 mm",altura:"813 mm",peso:"~62 kg (vacío)",capacidad:"2 tambores · 11.4 L c/u (3 galones c/u)"},
    notas:"Granizadora Bunn Ultra-2. Temperatura ambiente de trabajo: +5°C a +35°C. Mantener espacio libre de 15 cm a cada lado para ventilación del condensador."
  },
  "Unox-XECC-0513-EPRM":{
    electrico:{
      tension:"380-415V ~3PH+N+PE / 220-240V ~3PH+PE / 220-240V ~1PH+PE (con kit)",
      frecuencia:"50/60 Hz",
      potencia:"9.4 kW (nominal de entrada: 9.0 kW)",
      corriente:"13.5 A (L1/L2), 15 A (L3) / 23 A (L1), 24.5 A (L2/L3) / 40 A (1PH)",
      fusible:"Breaker recomendado: 16 A (3PH) / 25 A (3PH Option A) / 50 A (1PH con kit)",
      conexion:"Cable recomendado: 5G x 2.5 mm² (3PH) / 4G x 4 mm² (3PH Option A) / 3G x 10 mm² (1PH) — Cable tipo H07RN-F",
      enchufe:"Cable incluido, Enchufe NO incluido"
    },
    agua:{
      presion:"150 a 600 kPa / 22 a 87 psi (1.5 a 6 Bar) dinámica",
      caudal:"Max. consumo (vapor): 6.5 l/h @ 200 kPa (1.71 gal/h @ 29 psi)",
      entrada:'Drinking water inlet: 3/4" NPT',
      desague:'Conexión de desagüe estándar con sifón tipo P-trap obligatorio.'
    },
    dimensiones:{
      ancho:"535 mm",
      profundidad:"920 mm",
      altura:"649 mm",
      peso:"~50 kg (Neto)",
      capacidad:"5 bandejas GN 1/3 — Dimensiones de la cavidad: 399 x 549 x 392 mm"
    },
    notas:"ChefTop MIND.Maps™ Compact. Espacio mínimo de instalación: 50 mm cada lado, 50 mm posterior. Nivelar el equipo con pies regulables. Entrada de agua de 3/4\" NPT.",
    docs:[{nombre:"Lista de repuestos XECC-0513-EPRM", archivo:"XECC-0513-EPRM_ES-CO_SPARE_PARTS.pdf"}]
  },
  "Unox-XECC-0523-EPRM":{
    electrico:{
      tension:"380–415V trifásico 3PH+N+PE (opción principal Colombia) / 220–240V monofásico 1PH+N+PE / 220–240V trifásico 3PH+PE",
      frecuencia:"50/60 Hz",
      potencia:"3.3 kW",
      corriente:"16 A (monofásico) / 10 A (trifásico)",
      fusible:"16 A curva C — diferencial 30 mA obligatorio",
      conexion:"Diagrama ED1407A: Trifásico 380-415V → bornes L1(1) L2(2) L3(3) N(4-5) PE(⏚) · Monofásico 220-240V → bornes L(1) N(4-5) PE(⏚) · Tierra obligatoria en todos los casos",
      enchufe:"Sin enchufe de serie — instalación fija. Cable mínimo 3×2.5 mm² (monofásico) o 5×1.5 mm² (trifásico)"
    },
    agua:{
      presion:"100–600 kPa (1–6 bar) dinámica",
      caudal:"mín. 5 l/min",
      entrada:'Racor JG 1/4" o manguera 3/8" — conexión posterior izquierda',
      desague:'Tubería Ø 30 mm mín. — resistente a 85°C — con sifón tipo P-trap obligatorio. Desagüe libre sin válvula de retención.',
      calidad:"Conductividad 125–1250 µS/cm — dureza 5–30°f (9–54 mg/l CaCO₃) — pH 6.5–8. Instalar filtro si dureza > 20°f."
    },
    dimensiones:{
      ancho:"595 mm",
      profundidad:"555 mm",
      altura:"595 mm (sin patas) / 660 mm (con patas)",
      peso:"~47 kg",
      capacidad:"5×GN 2/3 — distancia entre guías: 67 mm"
    },
    notas:"Espacio mínimo lateral: 50 mm cada lado. Espacio mínimo posterior: 50 mm. Temperatura ambiente: +10°C a +40°C. Humedad relativa máx: 90%. Nivelar con pies regulables (nivel de burbuja). Requiere campana extractora de humos. No instalar cerca de fuentes de calor externas. Verificar que el circuito eléctrico sea exclusivo para el horno.",
    docs:[{nombre:"Lista de repuestos XECC-0523-EPRM", archivo:"XECC-0523-EPRM_ES-CO_SPARE_PARTS.pdf"}]
  },
  "Unox-XEFT-04HS-ELDV":{
    electrico:{
      tension:"220–240V monofásico 1PH+PE",
      frecuencia:"50/60 Hz",
      potencia:"3.5 kW",
      corriente:"I1=15 A (I2=I3=In=0)",
      fusible:"16 A curva C — diferencial 30 mA obligatorio",
      conexion:"Cable tipo H07RN-F 3G×1.5 mm² — Sección exterior cable: Ø 10 mm — Tierra obligatoria",
      enchufe:"Sin enchufe de serie — instalación fija o clavija industrial 16A"
    },
    agua:{
      presion:"150–600 kPa (1.5–6 bar) dinámica",
      caudal:"5 l/h @ 200 kPa",
      entrada:'Conexión 3/4"-JG8 con filtro y válvula de no retorno (kit KVL1145A)',
      desague:'Tubería Ø 25 mm mín. — resistente a 85°C — con sifón P-trap obligatorio',
      calidad:"Conductividad 125–1250 µS/cm — dureza 5–30°f — pH 6.5–8"
    },
    dimensiones:{
      ancho:"765 mm",
      profundidad:"700 mm",
      altura:"555 mm",
      peso:"~46 kg",
      capacidad:"4 bandejas 460×330 mm — cámara interior 496×349×335 mm — carga máx. 18 kg — potencia nominal: 3.2 kW — IP: X4"
    },
    notas:"Horno de panadería sobremesa BakerLux Shop.Pro LED. Requiere campana extractora. Espacio mínimo lateral: 50 mm. Temperatura ambiente: +10°C a +40°C. Sistema LED iluminación cámara. Nivelar con pies regulables. Circuito eléctrico exclusivo recomendado.",
    docs:[{nombre:"Lista de repuestos XEFT-04HS-ELDV", archivo:"XEFT-04HS-ELDV_ES-CO_SPARE_PARTS.pdf"}]
  },
  "Unox-XEFR-04HS-ELDV":{
    electrico:{
      tension:"230V monofásico",
      frecuencia:"50/60 Hz",
      potencia:"3.5 kW",
      corriente:"16 A",
      fusible:"16 A curva C — diferencial 30 mA obligatorio",
      conexion:"Cable 3 hilos (F+N+T) — tierra obligatoria",
      enchufe:"Clavija Schuko 16A o instalación fija"
    },
    agua:{
      presion:"100–600 kPa (1–6 bar) dinámica",
      caudal:"mín. 3 l/min",
      entrada:'Racor JG 1/4" — conexión posterior',
      desague:'Tubería Ø 25 mm mín. — resistente a 85°C — con sifón P-trap obligatorio',
      calidad:"Conductividad 125–1250 µS/cm — dureza 5–30°f — pH 6.5–8"
    },
    dimensiones:{
      ancho:"765 mm",
      profundidad:"700 mm",
      altura:"555 mm (sin patas) / 620 mm (con patas)",
      peso:"~48 kg",
      capacidad:"4 bandejas 460×330 mm — distancia entre guías: 80 mm"
    },
    notas:"Igual al XEFT con sistema de vapor adicional MATIC. Requiere conexión de agua obligatoria para generación de vapor. Requiere campana extractora. Espacio mínimo lateral: 50 mm. Temperatura ambiente: +10°C a +40°C."
  },
  "Unox-XEFR-04EU-ELDV":{
    electrico:{
      tension:"380-415V ~3PH+N+PE / 220-240V ~3PH+PE / 220-240V ~1PH+PE",
      frecuencia:"50/60 Hz",
      potencia:"6.9 kW",
      corriente:"14 A (3PH) / 15.5 A (3PH Option A) / 30 A (1PH Option B)",
      fusible:"Breaker recomendado: 16 A (3PH) / 25 A (3PH Option A) / 32 A (1PH Option B)",
      conexion:"Cable recomendado: 5G x 1.5 mm² (3PH) / 4G x 2.5 mm² (3PH Option A) / 3G x 4 mm² (1PH Option B) — Tierra obligatoria",
      enchufe:"NOT INCLUDED (Plug no incluido)"
    },
    agua:{
      presion:"1.5 a 6 Bar / 150 a 600 kPa (22 a 87 psi) dinámica",
      caudal:"mín. 5 l/min",
      entrada:'Drinking water inlet: 3/4" NPT (female)'
    },
    dimensiones:{
      ancho:"800 mm",
      profundidad:"811 mm",
      altura:"500 mm",
      peso:"~57 kg (Neto)",
      capacidad:"4 bandejas 600x400 mm — Distancia entre guías (Tray pitch): 75 mm"
    },
    notas:"BakerLux Shop.Pro™ LED. Espacio mínimo de instalación: 50 mm cada lado, 50 mm posterior. Temperatura ambiente de trabajo: +5°C a +35°C. Nivelar el equipo con pies regulables. Entrada de agua de 3/4\" NPT hembra.",
    docs:[{nombre:"Lista de repuestos XEFR-04EU-ELDV", archivo:"XEFR-04EU-ELDV_ES-CO_SPARE_PARTS.pdf"}]
  },
  "Unox-XEVC-0511-GPRM":{
    electrico:{
      tension:"230V monofásico",
      frecuencia:"50/60 Hz",
      potencia:"0.5 kW eléctrico (motor + control) + quemador gas",
      corriente:"6 A",
      fusible:"10 A curva C — diferencial 30 mA obligatorio",
      conexion:"Cable 3 hilos (F+N+T) — tierra obligatoria",
      enchufe:"Clavija Schuko 10A o instalación fija"
    },
    agua:{
      presion:"100–600 kPa (1–6 bar) dinámica",
      caudal:"mín. 5 l/min",
      entrada:'Racor JG 1/4" o manguera 3/8" — conexión posterior izquierda',
      desague:'Tubería Ø 30 mm mín. — resistente a 85°C — con sifón tipo P-trap obligatorio',
      calidad:"Conductividad 125–1250 µS/cm — dureza 5–30°f — pH 6.5–8"
    },
    gas:{
      presion_natural:"17–25 mbar (gas natural G20)",
      presion_propano:"25–37 mbar (GLP G30/G31)",
      potencia_termica:"9.3 kW (gas natural) / 9.3 kW (GLP)",
      conexion:'Tubería rígida o flexible certificada — rosca 1/2" — llave de corte obligatoria accesible',
      nota:"Verificar presión de red antes de instalar. Ajustar inyectores según tipo de gas de la instalación. Prueba de estanqueidad obligatoria."
    },
    dimensiones:{
      ancho:"847 mm",
      profundidad:"771 mm",
      altura:"600 mm (sobremesa) / con pie de horno: consultar",
      peso:"~80 kg",
      capacidad:"5×GN 1/1 — distancia entre guías: 67 mm"
    },
    notas:"Horno a gas — requiere instalador certificado en gas. Requiere campana extractora con extracción mínima de 500 m³/h. Espacio mínimo lateral: 50 mm. Temperatura ambiente: +10°C a +40°C. No instalar en sótanos o espacios sin ventilación natural."
  }
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
    {titulo:"Zanolli Synthesis — Limpieza diaria",alerta:"⚠️ NUNCA usar chorro de agua. NUNCA detergentes con cloro ni abrasivos.",pasos:["Apagar con ON/OFF and esperar que ventilador y banda se detengan solos (<150°C).","Cajones entrada/salida: retirar y limpiar cada 4 horas de operación.","Limpiar banda con guantes y rasqueta mientras está tibia.","Cristales: esperar que estén completamente fríos antes de limpiar.","Exterior acero inox: paño húmedo con jabón suave NO abrasivo.","Cerrar la llave de gas al finalizar el turno."]},
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
  {code:"AF02 – Termostato de seguridad",nivel:"CRÍTICO",desc:"Termostato de seguridad de 320°C disparado.",pasos:["Apagar y esperar enfriamiento completo (mínimo 30 min).","Medir resistencia: entre pin 4 y 5 de P6 — debe ser cero ohmios en frío.","Si no hay continuidad → reemplazar KTR1136A ($405.000)."]},
  {code:"AF03 – Sonda de temperatura",nivel:"CRÍTICO",desc:"Sondas CMB1 desconectadas o dañadas (PT100).",pasos:["Verificar conexión de sondas a sockets P14.","Medir resistencia: 110 Ω a 25°C.","Si fuera de rango → reemplazar KTR1105A ($540.000)."]},
  {code:"AF04 – Comunicación placa",nivel:"CRÍTICO",desc:"Error comunicación RJ45 entre placa control y placa potencia.",pasos:["Verificar que el cable RJ45 esté bien conectado en ambos extremos.","Medir continuidad pin a pin del cable bus.","Sin continuidad → reemplazar KCE1095A ($180.000)."]},
  {code:"AF08 – Motor parado (tacómetro)",nivel:"CRÍTICO",desc:"El sensor tacométrico no detecta rotación del motor.",pasos:["Verificar que el imán del tacómetro esté instalado en el eje.","Verificar resistores de frenado: 75Ω (cables amarillos) y 27.5Ω (cables rojos).","Si resistores OK → verificar motor y capacitor."]},
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
  {code:"F8 – High Limit Tripped",nivel:"CRÍTICO",desc:"El termostato de alto límite disparó (572°F/300°C).",pasos:["Apagar and dejar enfriar completamente.","Limpiar el horno completamente — 80% de F8 se deben a falta de limpieza.","Verificar SSR NGC-3005 por posible cortocircuito."]},
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
  // ════════════════════════════════════════════════════════════════════════
  // UNOX XECC-0523-EPRM — ChefTop MIND.Maps PLUS Compact — Lista completa PDF
  // ════════════════════════════════════════════════════════════════════════
  {cod:"KCE1052A", desc:"Kit cable conexión control USB MM L=650 — Cable conexión control-USB MM 750mm",                                                      precio:225000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KCE1096A", desc:"Kit cable bus microfit 4 polos 3 metros",                                                                                            precio:202500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KCE1355A", desc:"Kit cable 5×2.5 mmq L1.5mt — Cable H07RNF 5G2.5 L2.1mt",                                                                          precio:292500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KCN1003A", desc:"Kit condensador motor 6.3 µF — Condensa 6.3uF + tuerca M8 + arandela dentada D8. Repara AF01",                                      precio:135000,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"B"},
  {cod:"KCR1105A", desc:"Kit bisagras cristal interior MIND.Maps PLUS — Bisagra cristal int doble inox sup + inf + tornillos",                               precio:202500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KEL1438A", desc:"Kit electroválvula vapor 5+9 barbed — Electroválvula vapor + abrazadera tubería D11.5-12.5",                                        precio:382500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KGN1656A", desc:"Kit goma puerta XECC-0513/0523 — Premontado KGN1656. Consumible.",                                                                  precio:256500,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"B", vidaUtil:"CONSUMIBLE"},
  {cod:"KLP1030A", desc:"Kit barra luces LED L400 E468 — Barra iluminación LED MM L400 E468",                                                                precio:585000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KMG1099A", desc:"Kit manilla completa MIND.Maps-M — Ensamble manija MMc + tornillos plástico 4×16 + cubre tornillos",                               precio:301500,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"B"},
  {cod:"KMR1004A", desc:"Kit bornera 7 7FTW 1+2+3/4+5+6 — Caja conexiones 7 polos 41A 450V",                                                               precio:117000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KMT1012A", desc:"Kit motor 330W eje cónico D12 — Motor 330W 230V + máscara centrado + disco sellado + goma portamotor + tornillos + imán",          precio:1350000, marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"A", vidaUtil:"60 meses", tiempoCambio:2.5},
  {cod:"KPE1057B", desc:"Kit panel control capacitivo MM PLUS — Panel control capacitivo + cable microfit + tornillos + bolsa ESD + separador + bisagras retrofit", precio:4275000, marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"A", vidaUtil:"DAÑO/72", tiempoCambio:1},
  {cod:"KPE1059A", desc:"Kit soporte USB-Reset MIND.Maps — Premontaje soporte USB-Reset MM + tornillos + bolsa ESD",                                         precio:382500,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"B"},
  {cod:"KPE1710B", desc:"Kit sensor número de giros motor — Sensor modular num giros + dirección + tornillo + imán medida",                                  precio:247500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KPE2037A", desc:"Kit tarjeta potencia MIND.Maps ONE — Tarjeta potencia + tornillos niquelados M4×6 + bolsa ESD + soporte tarjeta",                  precio:2160000, marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"A", vidaUtil:"DAÑO", tiempoCambio:1.5},
  {cod:"KRS1150A", desc:"Kit resistencia 4.9kW RS1090A — Goma resistencia 100×22 + resistencia circular 4.9kW + silicona + tornillos. Repara calentamiento", precio:990000,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"B", vidaUtil:"DAÑO/60", tiempoCambio:6},
  {cod:"KRS1216A", desc:"Kit resistencia 147W 105V 1 espira — Goma RS frenada + res plana 147W 105V + silicona + tornillos",                                precio:427500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KRS1217A", desc:"Kit resistencia plana 100W 60V 1 espira — Goma RS frenada + res plana 100W 60V + silicona + tornillos",                            precio:405000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KSB1016A", desc:"Kit tanque detergente 3L + rompe gofre",                                                                                            precio:675000,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"B"},
  {cod:"KSN1031A", desc:"Kit sonda al corazón monopunto L2000 — Tapa + burlete sellado + silicona + sonda corazón monopunto L2000 sin racor + tornillos",   precio:1080000, marca:"Unox", ref:"XECC-0523-EPRM", vidaUtil:"CONSUMIBLE"},
  {cod:"KTR1002A", desc:"Kit sonda temperatura UL PT100 L1000 — Goma sonda NTC + silicona + TR1002A1 + tornillos + tapa sonda CT BT",                       precio:495000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KTR1003B", desc:"Kit sonda temperatura L2000 US MM — Goma sonda + silicona + sonda UL PT100 L2000 USA + tornillos + tapas sonda",                   precio:630000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KTR1105A", desc:"Kit sonda temperatura PT100 L1000 — Plaquita silicona + burlete + goma sonda + silicona + sonda PT100 L1000 + tornillos + tapas. Repara AF03", precio:540000, marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"A", vidaUtil:"CONSUMIBLE"},
  {cod:"KTR1106B", desc:"Kit sonda temperatura L2000 MIND.Maps — Goma sonda + silicona + sonda PT100 L2000 + tornillos + tapas sonda",                      precio:540000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KTR1136A", desc:"Kit termostato seguridad 318°C -0/+24 — Tapa bulbo + goma sonda + silicona + termostato 318°C + tornillos. Repara AF02",           precio:405000,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"A", vidaUtil:"72 meses", tiempoCambio:2},
  {cod:"KTR1150A", desc:"Kit sonda temperatura PT100 L2000 Evereo — Conexión 4P + goma sonda + sonda PT100 3F CLA L2000 + tapa",                            precio:450000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KTR1150B", desc:"Kit sonda temperatura PT1000 L1200 — Goma sonda + sonda PT1000 CLA L1200 + tornillo + tapa",                                       precio:495000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVE1020B", desc:"Kit micropuerta — Cable adaptador minifit + microinterruptor puerta magnético + imán D22.9mm + tuerca M10",                        precio:180000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVE1115A", desc:"Kit minicontactor cuadripolar 20A 230V — Minicontactor 20A 230V + clips sujeción",                                     precio:247500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVE1639A", desc:"Kit transformador 12Vac 60VA — Transformador 230-12VAC 60VA + tornillos autoperforantes",                                          precio:382500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVL1037A", desc:"Kit brazo giratorio de lavado — Brazo de lavado",                                                                                  precio:508500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVL1211A", desc:"Kit sistema lavado Compact ONE y 0523-EP — Abrazaderas + soporte tubo D6-D8 + conjunto lavado ONE EU Compact",                     precio:1260000, marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"B", vidaUtil:"48 meses", tiempoCambio:2},
  {cod:"KVL1310A", desc:"Kit grupo tanque recirculación completo CBX — CBX Tank Assembly",                                                                   precio:3240000, marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVL1315A", desc:"Kit tanque recirculación sin bombas CBX — CBX Recirculation Box + rondanas + tornillos",                                           precio:1845000, marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVM1630A", desc:"Kit tapón aprieta cristal interior 10 uds — Tapón empuja-vidrio interior (10 pz)",                                                 precio:103500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVM1631A", desc:"Kit tapón aprieta cristal interior PLUS 10 uds — Tapón empuja cristal interno PLUS (10 pz)",                                       precio:103500,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVM2312A", desc:"Kit tubo perfil goteo izquierdo MM — Tornillo + tubo izq descarga gotas MM",                                                       precio:54000,   marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVM2377A", desc:"Kit válvula Venturi MM 220V — Brida abrazatubo + tubo EPDM + venturi ventilador 0.12M + ensamble Venturi 220V",                    precio:540000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVN1130A", desc:"Kit motor LUX ≤08.2017/L.MISS/S.5/5E — Disco sellado + goma portamotor + arandela + tuerca inox + anillo ajuste + motor 330W 230V", precio:1440000, marca:"Unox", ref:"XECC-0523-EPRM"},
  {cod:"KVN1165A", desc:"Kit turbina refrigeración 230V MM/S.5E ADV — Tornillos + soporte turbina CT BT + turbina refrigeración 230V",                     precio:450000,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"B", vidaUtil:"60 meses", tiempoCambio:0.5},
  {cod:"KVN1171A", desc:"Kit turbina D195 H60 8 paletas tuerca M8 — Tornillo M6×12 + arandela + ventilador D195 H60 8 paletas",                            precio:765000,  marca:"Unox", ref:"XECC-0523-EPRM", criticidad:"A", vidaUtil:"72 meses", tiempoCambio:1.5},
  {cod:"KVN1179A", desc:"Kit turbina refrigeración 40×40×20mm 12Vcc — Ventilador axial 40×40×20mm 12Vcc",                                                  precio:180000,  marca:"Unox", ref:"XECC-0523-EPRM"},
  // ════════════════════════════════════════════════════════════════════════
  // UNOX XEFT-04HS-ELDV — BakerLux Shop.Pro LED — Lista completa PDF
  // ════════════════════════════════════════════════════════════════════════
  {cod:"KCE1095A", desc:"Kit cable bus 4 polos 2M potencia-control — Cable bus microfit 4 polos 2 metros. Repara AF04",                                    precio:180000,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"B"},
  {cod:"KCN1003A", desc:"Kit condensador motor 6.3 µF — Condensador 6.3uF + tuerca M8 + arandela dentada D8. Repara AF01",                                precio:135000,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"B"},
  {cod:"KCR1112A", desc:"Kit bisagra plegable SP Arianna-Elena — Bisagra puerta giratoria SP + tornillos M5×10",                                          precio:225000,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"B", vidaUtil:"60 meses"},
  {cod:"KEL1251A", desc:"Kit electroválvula 1 vía JG D8-D10 — Electroválvula H2O 1 vía RID marrón",                                                      precio:292500,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"B", vidaUtil:"48 meses"},
  {cod:"KGN1352A", desc:"Kit goma puerta 04HS / XF-XFT13 — Premontaje KGN1352A. Consumible.",                                                            precio:211500,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"B", vidaUtil:"CONSUMIBLE"},
  {cod:"KLP1050A", desc:"Kit barra luces LED L180 — Barra ilum LED L180 SP completa + arandela + tornillo + bolsa ESD",                                  precio:382500,  marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KMR1025A", desc:"Kit conector 3 polos — Bornera 3 fases 450V 41A + tierra",                                                                      precio:72000,   marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KMT1012A", desc:"Kit motor 330W eje cónico D12 — Motor 330W 230V + máscara centrado + disco sellado + goma portamotor + tornillos + imán",       precio:1350000, marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"A", vidaUtil:"60 meses", tiempoCambio:2.5},
  {cod:"KPE2260A", desc:"Kit tarjeta potencia BLSP/Speed.Pro/Zero — Power board 230V + tornillos + chasis tarjeta + bolsa ESD + clips fijación",         precio:990000,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"A", vidaUtil:"DAÑO/72", tiempoCambio:1},
  {cod:"KRS1283B", desc:"Kit resistencia 3000W 230V + 260W 135V 4 espiras — Goma resistencia + res circ 3200W + silicona + tornillos",                   precio:765000,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"A", vidaUtil:"48 meses", tiempoCambio:2},
  {cod:"KTR1105A", desc:"Kit sonda temperatura PT100 L1000 — Plaquita silicona + burlete + goma sonda + silicona + sonda PT100 L1000 + tornillos + tapas. Repara AF03", precio:540000, marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"A", vidaUtil:"CONSUMIBLE"},
  {cod:"KTR1136A", desc:"Kit termostato seguridad 318°C -0/+24 — Tapa bulbo + goma sonda + silicona + termostato + tornillos. Repara AF02",              precio:405000,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"A", vidaUtil:"72 meses", tiempoCambio:2},
  {cod:"KVE1115A", desc:"Kit minicontactor cuadripolar 20A 230V — Minicontactor 20A 230V + clips sujeción",                                              precio:247500,  marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KVE1295A", desc:"Kit microinterruptor puerta/filtro 16A 230V",                                                                                   precio:180000,  marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KVL1145A", desc:"Kit conexión 3/4-JG8 con filtro y VNR — VL1145A1. Recomendado para entrada de agua",                                           precio:225000,  marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KVM1630A", desc:"Kit tapón aprieta cristal interior 10 uds — Tapón empuja-vidrio interior",                                                      precio:103500,  marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KVM1631A", desc:"Kit tapón aprieta cristal interior PLUS 10 uds — Tapón empuja cristal interno PLUS",                                            precio:103500,  marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KVM2456A", desc:"Kit 2 uds terminal maneta BL Shop.Pro — Tornillos inox 5×25 + terminal maneta BL Shop.Pro",                                    precio:139500,  marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KVN1130A", desc:"Kit motor LUX ≤08.2017/L.MISS/S.5/5E — Disco sellado + goma portamotor + arandela + tuerca inox + anillo ajuste + motor 330W", precio:1440000, marca:"Unox", ref:"XEFT-04HS-ELDV"},
  {cod:"KVN1172A", desc:"Kit turbina D195 H40 8 aspas tuerca M8 — Tornillo M6×12 + arandela + ventilador D195 H40 8 paletas",                           precio:553500,  marca:"Unox", ref:"XEFT-04HS-ELDV", criticidad:"A", vidaUtil:"72 meses", tiempoCambio:1.5},
  {cod:"KVN1175A", desc:"Kit ventilador refrigeración 120×120 230V — Ventilador enfriamiento 120×120 230V 50/60Hz",                                     precio:247500,  marca:"Unox", ref:"XEFT-04HS-ELDV"},
  // ─── UNOX — Repuestos comunes otros modelos ───────────────────────────────
  {cod:"KPE1463A", desc:"Kit tarjeta de poder BLSP/Speed.Pro",                                                                                               precio:null,    marca:"Unox", ref:"XEFR-04HS-ELDV", criticidad:"A"},
  {cod:"KPE2107A", desc:"Kit panel de control LED",                                                                                                          precio:null,    marca:"Unox", ref:"XEFR-04HS-ELDV", criticidad:"A"},
  {cod:"KMN1172A", desc:"Kit ventilador D195 H60 8 aspas",                                                                                                  precio:null,    marca:"Unox", ref:"XEFR-04HS-ELDV", criticidad:"A"},
  {cod:"KRS1283B", desc:"Kit resistencia 3000W 230V + 260W 135V 4 espiras — Goma resistencia + silicona",                                                  precio:765000,  marca:"Unox", ref:"XEFR-04HS-ELDV", criticidad:"A", vidaUtil:"48 meses"},
  {cod:"KVT1330A", desc:"Kit cristal interno Arianna",                                                                                                      precio:null,    marca:"Unox", ref:"XEFR-04HS-ELDV", criticidad:"A"},
  {cod:"KCR1112A", desc:"Kit bisagra puerta plegable SP Arianna-Elena",                                                                                     precio:225000,  marca:"Unox", ref:"XEFR-04HS-ELDV", criticidad:"B"},
  {cod:"KEL1251A", desc:"Kit electroválvula 1 vía JG D8-D10 — Humedad",                                                                                    precio:292500,  marca:"Unox", ref:"XEFR-04HS-ELDV", criticidad:"B"},
  {cod:"KGN1352A", desc:"Kit goma puerta LM Arianna / Armarios BT — Consumible",                                                                           precio:211500,  marca:"Unox", ref:"XEFR-04HS-ELDV", criticidad:"B", vidaUtil:"CONSUMIBLE"},
  {cod:"KGN1629A", desc:"Kit goma puerta ChefTop 0511",                                                                                                     precio:382500,  marca:"Unox", ref:"XEVC-0511-GPRM"},
  {cod:"KGN1631A", desc:"Kit goma puerta ChefTop 1011",                                                                                                     precio:405000,  marca:"Unox", ref:"XEVC-0511-GPRM"},
  {cod:"KCE1095A", desc:"Kit cable bus 4 polos 2M potencia-control — Repara AF04",                                                                         precio:180000,  marca:"Unox", criticidad:"B"},
  // ─── RATIONAL ─────────────────────────────────────────────────────────────
  {cod:"20.02.550P", desc:"Burlete puerta SCC WE 61G",                                                                                                      precio:290771,  marca:"Rational"},
  {cod:"20.02.552P", desc:"Burlete puerta SCC WE 101G",                                                                                                     precio:333391,  marca:"Rational"},
  {cod:"20.00.399P", desc:"Burlete puerta SCC WE 202",                                                                                                      precio:432629,  marca:"Rational"},
  {cod:"40.05.654P", desc:"Filtro entrada de aire LM1 LM2",                                                                                                 precio:65153,   marca:"Rational"},
  {cod:"87.00.279",  desc:"Kit termostato seguridad bilímite 360°C",                                                                                        precio:265905,  marca:"Rational"},
  // ─── TURBOCHEF ────────────────────────────────────────────────────────────
  {cod:"CON-7013",   desc:"BMSC — Blower Motor Speed Controller (repara F1)",                                                                               precio:1350000, marca:"Turbochef"},
  {cod:"HHC-6517-2", desc:"RTD sonda temperatura cámara (repara F7)",                                                                                       precio:450000,  marca:"Turbochef"},
  {cod:"NGC-3005",   desc:"Relay estado sólido dual 40A 240VAC (repara F8)",                                                                                precio:600000,  marca:"Turbochef"},
  {cod:"HCT-4143",   desc:"Cadena conveyor #35 52 eslabones (repara F9)",                                                                                   precio:75000,   marca:"Turbochef"},
  {cod:"102075",     desc:"Termostato alto límite 572°F reset manual (repara F8)",                                                                          precio:790000,  marca:"Turbochef"},
  {cod:"HCT-4067",   desc:"Filtro de aire trasero HHC (previene F6)",                                                                                      precio:73000,   marca:"Turbochef"},
  // ─── ZANOLLI ──────────────────────────────────────────────────────────────
  {cod:"TERM0005",   desc:"Termostato seguridad 500°C reset manual (repara OVER)",                                                                          precio:605000,  marca:"Zanolli"},
  {cod:"TERM0049",   desc:"Sonda PT1000 temperatura cámara — ~1100Ω a 25°C",                                                                               precio:420000,  marca:"Zanolli"},
  {cod:"ELET0676",   desc:"Tarjeta base electrónica (scheda base)",                                                                                         precio:1350000, marca:"Zanolli"},
  {cod:"MOTO0052",   desc:"Motor banda conveyor (repara BELT)",                                                                                             precio:1050000, marca:"Zanolli"},
  // ─── BUNN ─────────────────────────────────────────────────────────────────
  {cod:"01082.0000", desc:"Sprayhead 6 hoyos Bunn VPR",                                                                                                    precio:22000,   marca:"Bunn"},
  {cod:"04236.1000", desc:"Kit calentador tanque 1320W 120V VPR",                                                                                          precio:176000,  marca:"Bunn"},
  {cod:"34245.0000", desc:"Kit mantenimiento preventivo Ultra-2 (sellos, empaques)",                                                                       precio:280000,  marca:"Bunn"},
  {cod:"44039.1000", desc:"Tarjeta de control principal CBA Ultra-2",                                                                                      precio:1016000, marca:"Bunn"},
];

const formatPrecio = (n) => {
  if (n === null || n === undefined) return "Cotizar";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(n);
};

const card = (extra = {}) => ({
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: "12px",
  padding: "16px",
  ...extra,
});

const btn = (variant = "primary", size = "md") => {
  const isOutline = variant === "outline";
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: size === "sm" ? "5px 12px" : "10px 18px",
    fontSize: size === "sm" ? "11px" : "13px",
    fontWeight: "700",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "inherit",
    border: isOutline ? `1px solid ${C.border}` : "none",
    background: variant === "primary" ? C.accent : isOutline ? C.white : "transparent",
    color: variant === "primary" ? "#fff" : C.text,
  };
};

const tagS = (color = "blue") => {
  const map = {
    blue: [C.accent, C.al],
    red: [C.red, C.rl],
    green: [C.green, C.gl],
    yellow: [C.yellow, C.yl],
    gray: [C.muted, "#f3f4f6"],
  };
  const [col, bg] = map[color] || map.blue;
  return {
    fontSize: "10px",
    fontWeight: "800",
    padding: "3px 8px",
    borderRadius: "20px",
    color: col,
    background: bg,
  };
};

const LogoCEM = ({ size = 44 }) => {
  const height = Math.round(size * 0.88);
  return (
    <svg width={size} height={height} viewBox="0 0 280 247" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,247 28,175 48,210 22,247" fill="#e8432d" />
      <polygon points="232,247 256,175 278,247" fill="#e8432d" />
      <polygon points="38,247 139,8 240,247" fill="#e8432d" />
      <polygon points="139,8 124,50 133,40 139,50 145,40 154,50 139,8" fill="white" />
      <text x="26" y="238" fontFamily="Impact,Arial Black,sans-serif" fontWeight="900" fontSize="105" fill="#1a3d4a" letterSpacing="-3">CEM</text>
      <text x="22" y="234" fontFamily="Impact,Arial Black,sans-serif" fontWeight="900" fontSize="105" fill="#2d5f6e" letterSpacing="-3">CEM</text>
    </svg>
  );
};

const TEAMS_URL = "https://teams.microsoft.com/l/chat/0/0?users=pablo.leyva@terpel.com&message=Hola%20Pablo%2C%20tengo%20una%20sugerencia%20%2F%20pregunta%20sobre%20el%20CEM%20IA%20Assistant%3A%20";
const MAIL_URL  = "mailto:pablo.leyva@terpel.com?subject=Sugerencia%20CEM%20IA%20Assistant&body=Hola%20Pablo%2C%20";

function BtnSugerencias() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowMenu(v => !v)}
        title="Preguntas y sugerencias"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 9,
          background: "#f0fdf4", border: "1px solid #86efac",
          cursor: "pointer", fontSize: 16, flexShrink: 0,
          fontFamily: "inherit", padding: 0,
        }}
      >
        💬
      </button>
      {showMenu && (
        <>
          <div
            onClick={() => setShowMenu(false)}
            style={{ position: "fixed", inset: 0, zIndex: 199 }}
          />
          <div style={{
            position: "absolute", right: 0, top: 38, zIndex: 200,
            background: "#fff", border: "1px solid #e4e8f0",
            borderRadius: 12, padding: 8, minWidth: 220,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", padding: "4px 8px 8px", letterSpacing: 0.5 }}>
              PREGUNTAS Y SUGERENCIAS
            </div>
            <a
              href={TEAMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8, textDecoration: "none",
                background: "#eff6ff",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "#2563eb", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 17, flexShrink: 0,
              }}>💼</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>Escribir por Teams</div>
                <div style={{ fontSize: 10, color: "#3b82f6" }}>pablo.leyva@terpel.com</div>
              </div>
            </a>
            <div style={{ height: 6 }} />
            <a
              href={MAIL_URL}
              onClick={() => setShowMenu(false)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8, textDecoration: "none",
                background: "#f0fdf4",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "#16a34a", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 17, flexShrink: 0,
              }}>✉️</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>Enviar correo</div>
                <div style={{ fontSize: 10, color: "#16a34a" }}>pablo.leyva@terpel.com</div>
              </div>
            </a>
            <div style={{ height: 6 }} />
            <div style={{ fontSize: 9, color: "#94a3b8", padding: "4px 8px", textAlign: "center", borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
              CEM IA Assistant · Centro de Excelencia de Mantenimiento
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const TABS_TECNICO = [
  { id: "inicio", icon: "🏠", label: "Inicio" },
  { id: "chat", icon: "🤖", label: "CEM Bot" },
  { id: "planes", icon: "📋", label: "Planes" },
  { id: "instalacion", icon: "⚡", label: "Instalación" },
  { id: "limpieza", icon: "🧹", label: "Limpieza" },
  { id: "repuestos", icon: "🔩", label: "Repuestos" },
  { id: "referencias", icon: "📑", label: "Refs" },
  { id: "stats", icon: "📊", label: "Stats" },
  { id: "guia", icon: "📖", label: "Guía" },
];

const TABS_OPERADOR = [
  { id: "inicio_op", icon: "🏠", label: "Inicio" },
  { id: "chat_op", icon: "💬", label: "Consultar" },
  { id: "limpieza", icon: "🧹", label: "Limpieza" },
  { id: "consejos", icon: "💡", label: "Consejos" },
];

const SK = "cem_fallas_v4";

const loadF = () => {
  try {
    const d = localStorage.getItem(SK);
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
};

const saveF = (d) => {
  try {
    localStorage.setItem(SK, JSON.stringify(d));
  } catch {}
};

const fetchFallas = async () => {
  try {
    const r = await fetch("/api/fallas");
    if (!r.ok) return loadF();
    return await r.json();
  } catch {
    return loadF();
  }
};

const postFalla = async (f) => {
  const intentar = async () => {
    const r = await fetch("/api/fallas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f)
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  };
  try {
    await intentar();
  } catch {
    setTimeout(async () => {
      try { await intentar(); } catch {}
    }, 2000);
  }
};

const deleteFallas = async (indices, pin) => {
  return { ok: true };
};

const TutorialLinks = ({ tutoriales }) => {
  if (!tutoriales || tutoriales.length === 0) return null;
  return (
    <div style={{ marginTop: 10, padding: "10px 12px", background: "#fef9c3", borderRadius: 8, border: "1px solid #fde047" }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#854d0e", marginBottom: 6 }}>📺 TUTORIALES RECOMENDADOS</div>
      {tutoriales.map((t, i) => (
        <a key={i} href={t.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < tutoriales.length - 1 ? "1px solid #fde047" : "none", textDecoration: "none" }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>▶️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#1d4ed8" }}>{t.titulo}</div>
            <div style={{ fontSize: 9, color: C.muted }}>{t.desc}{t.duracion ? ` · ${t.duracion}` : ""}</div>
          </div>
          <span style={{ fontSize: 10, color: C.light }}>›</span>
        </a>
      ))}
    </div>
  );
};

const CONTACTOS_ST = {
  Rational: {
    oficial: [
      { nombre: "Rational Colombia", tipo: "🏢 Oficial", tel: "+57 601 743 3837", ws: "https://wa.me/573173723134", web: "https://www.rational-online.co", ciudad: "Bogotá", nota: "Servicio técnico oficial para toda Colombia." },
    ],
    especializados: [
      { nombre: "Influmax SAS", tipo: "🔧 Certificado", tel: "322 248 7631", ws: "https://wa.me/573222487631", web: "", ciudad: "Bogotá", nota: "Rational / Unox · Contacto: Guillermo Blanco" },
      { nombre: "Tecnobread SAS", tipo: "🔧 Certificado", tel: "317 365 6619", ws: "https://wa.me/573173656619", web: "", ciudad: "Bogotá", nota: "Rational / Unox · Contacto: Katerinne Campos" },
      { nombre: "Industrial Kitchen SAS", tipo: "🔧 Certificado", tel: "301 471 1328", ws: "https://wa.me/573014711328", web: "", ciudad: "Medellín", nota: "Rational / Turbochef / Bunn" },
      { nombre: "TEESA", tipo: "🔧 Certificado", tel: "316 243 2974", ws: "https://wa.me/573162432974", web: "", ciudad: "Cali", nota: "Unox / Bunn / Rational" },
    ],
  },
  Unox: {
    oficial: [
      { nombre: "Exhibir Equipos Colombia", tipo: "🏢 Oficial", tel: "320 232 4781", ws: "https://wa.me/573202324781", web: "https://exhibirequipos.com", ciudad: "Bogotá", nota: "Distribuidor directo Unox Colombia." },
    ],
    especializados: [
      { nombre: "Crutek", tipo: "🏆 PLATINUM", tel: "310 476 2771", ws: "https://wa.me/573104762771", web: "", ciudad: "Bogotá", nota: "Unox (Platinum) / Bunn" },
      { nombre: "Intecse", tipo: "🏆 PLATINUM", tel: "321 494 7580", ws: "https://wa.me/573214947580", web: "", ciudad: "Bogotá", nota: "Unox (Platinum) / Rational" },
      { nombre: "Soluciones Tesla", tipo: "🏆 PLATINUM", tel: "300 444 7500", ws: "https://wa.me/573004447500", web: "", ciudad: "Medellín", nota: "Unox (Platinum) / Rational" },
      { nombre: "TEESA", tipo: "🥇 GOLD", tel: "316 243 2974", ws: "https://wa.me/573162432974", web: "", ciudad: "Cali", nota: "Unox (Gold) / Bunn / Rational" },
    ],
  },
  Turbochef: {
    oficial: [
      { nombre: "Euromex Equipos Industriales", tipo: "🏢 Distribuidor", tel: "+57 601 226 4242", ws: "https://wa.me/573142264242", web: "https://euromex.com.co", ciudad: "Bogotá", nota: "Distribuidor y servicio técnico oficial Turbochef." },
    ],
    especializados: [
      { nombre: "Industrial Kitchen SAS", tipo: "🔧 Certificado", tel: "301 471 1328", ws: "https://wa.me/573014711328", web: "", ciudad: "Medellín", nota: "Rational / Turbochef / Bunn" },
    ],
  },
  Bunn: {
    oficial: [
      { nombre: "Exhibir Equipos Colombia", tipo: "🏢 Oficial", tel: "320 232 4781", ws: "https://wa.me/573202324781", web: "", ciudad: "Bogotá", nota: "Unox / Bunn / Granizadoras." },
    ],
    especializados: [
      { nombre: "Crutek", tipo: "🏆 PLATINUM", tel: "310 476 2771", ws: "https://wa.me/573104762771", web: "", ciudad: "Bogotá", nota: "Unox (Platinum) / Bunn" },
      { nombre: "Juan Santacolomba", tipo: "🔧 Certificado", tel: "323 575 2403", ws: "https://wa.me/573235752403", web: "", ciudad: "Pereira", nota: "Bunn / Repuestos Originales" },
    ],
  },
};

const googleST = (marca, ciudad) => `https://www.google.com/search?q=servicio+tecnico+${encodeURIComponent(marca)}+Colombia+${encodeURIComponent(ciudad)}+certificado`;

function ContactCard({ marca, ciudad }) {
  const data = CONTACTOS_ST[marca];
  if (!data) {
    return (
      <div style={{ marginTop: 8, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "12px 13px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#c2410c", marginBottom: 6 }}>📍 Servicio técnico {marca}</div>
        <a href={googleST(marca, ciudad || "")} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 11px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 15 }}>🔍</span>
          <div><div style={{ fontSize: 11, fontWeight: 700, color: "#c2410c" }}>Buscar en Google</div></div>
          <span style={{ marginLeft: "auto", color: C.light, fontSize: 12 }}>›</span>
        </a>
      </div>
    );
  }
  const todos = [...(data.oficial || []), ...(data.especializados || [])];
  const cidLow = (ciudad || "").toLowerCase();
  const enCiudad = cidLow ? todos.filter(c => c.ciudad.toLowerCase().includes(cidLow) || cidLow.includes(c.ciudad.toLowerCase())) : [];
  const resto = todos.filter(c => !enCiudad.includes(c));
  const badgeStyle = (tipo) => {
    if (tipo.includes("PLATINUM")) return { background: "#ede9fe", color: "#5b21b6", border: "1px solid #c4b5fd" };
    if (tipo.includes("GOLD"))     return { background: "#fef9c3", color: "#a16207", border: "1px solid #fde047" };
    if (tipo.includes("Oficial"))  return { background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd" };
    return { background: "#dcfce7", color: "#15803d", border: "1px solid #86efac" };
  };
  const Item = ({ c }) => (
    <div style={{ background: C.white, borderRadius: 8, padding: "10px 11px", marginBottom: 6, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
        <span style={{ ...badgeStyle(c.tipo), fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{c.tipo}</span>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.text }}>{c.nombre}</div>
      </div>
      {c.nota && <div style={{ fontSize: 10, color: "#374151", marginBottom: 6, background: "#f8fafc", borderRadius: 6, padding: "5px 8px" }}>{c.nota} · {c.ciudad}</div>}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {c.tel && <a href={`tel:+57${c.tel.replace(/[\s\-]/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 4, background: C.gl, color: C.green, fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 6, textDecoration: "none" }}>📞 {c.tel}</a>}
        {c.ws && <a href={c.ws} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#15803d", fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 6, textDecoration: "none" }}>💬 WA</a>}
        {c.web && <a href={c.web} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, background: C.al, color: C.accent, fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 6, textDecoration: "none" }}>🌐 Web</a>}
      </div>
    </div>
  );
  return (
    <div style={{ marginTop: 8, background: "#f0fdf4", border: "1px solid #16a34a44", borderRadius: 12, padding: "12px 13px" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: C.green, marginBottom: 6 }}>📍 SERVICIO TÉCNICO {marca.toUpperCase()} {cidLow ? `· ${ciudad}` : ""}</div>
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "9px 11px", marginBottom: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
        <div style={{ fontSize: 10, color: "#92400e", lineHeight: 1.6 }}>
          <strong>Solo puedes contratar proveedores activos en Coupa.</strong> La lista de proveedores habilitados se publicará en la próxima actualización. En junio se espera tener un contrato con uno o más proveedores de servicio técnico. Por ahora, verifica en Coupa antes de generar la orden.
        </div>
      </div>
      {enCiudad.length > 0 && <>{enCiudad.map((c, i) => <Item key={"l" + i} c={c} />)}</>}
      {resto.slice(0, 3).map((c, i) => <Item key={"r" + i} c={c} />)}
      <a href={googleST(marca, ciudad)} target="_blank" rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, padding: "8px 11px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, textDecoration: "none" }}>
        <span>🔍</span>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#c2410c" }}>Buscar más en Google</div>
        <span style={{ marginLeft: "auto", color: C.light, fontSize: 12 }}>›</span>
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
        const res = await fetch(window.location.href, { method: "HEAD", cache: "no-store" });
        const serverEtag = res.headers.get("etag") || "";
        const storedEtag = sessionStorage.getItem("cem_etag") || "";
        if (!storedEtag) { if (serverEtag) sessionStorage.setItem("cem_etag", serverEtag); }
        else if (serverEtag && serverEtag !== storedEtag) setHayUpdate(true);
      } catch (_) {}
      finally { setChecking(false); }
    };
    check();
    const t = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const currentVersion = "v3.3 · " + (
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP
      ? new Date(process.env.NEXT_PUBLIC_BUILD_TIMESTAMP).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "2-digit" })
      : new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "2-digit" })
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
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (e) => {
        if (e.data?.type === "SW_UPDATED") { window.location.reload(); }
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
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(234,88,12,0.2)", border: "1px solid rgba(251,146,60,0.5)", borderRadius: 8, padding: "7px 12px", marginBottom: 8 }}>
      <span style={{ fontSize: 14 }}>📡</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fb923c" }}>Sin conexión</div>
        <div style={{ fontSize: 10, color: "rgba(251,146,60,0.8)" }}>CEM Bot no disponible · Tablas de errores y repuestos funcionan offline</div>
      </div>
    </div>
  );
}

function UpdateBanner({ hayUpdate, checking, currentVersion, recargar, dark = false }) {
  if (hayUpdate) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: dark ? "rgba(37,99,235,0.25)" : "#eff6ff", border: dark ? "1px solid rgba(147,197,253,0.4)" : "1px solid #93c5fd", borderRadius: 12, padding: "10px 13px", cursor: "pointer", marginTop: dark ? 12 : 0 }} onClick={recargar}>
        <div style={{ width: 32, height: 32, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🔄</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: dark ? "#93c5fd" : "#1d4ed8" }}>Actualización disponible</div>
          <div style={{ fontSize: 10, color: dark ? "rgba(147,197,253,0.8)" : "#3b82f6", marginTop: 1 }}>Toca aquí para recargar</div>
        </div>
        <div style={{ background: "#2563eb", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>Actualizar</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: dark ? "5px 2px" : "4px 0" }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: checking ? "#f97316" : "#16a34a", flexShrink: 0 }} />
      <span style={{ fontSize: 9, color: darkQuiero proporcionar más información, pero he alcanzado el límite de respuestas. ¿Tienes alguna pregunta específica que quieras que te responda?
