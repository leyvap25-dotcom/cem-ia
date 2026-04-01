import { useState, useRef, useEffect, useCallback } from "react";
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

// Cada ref es un objeto: { ref, favorito, img, desc }
// favorito:true = badge ⭐ CEM + aparece en filtro favoritos
const EQUIPOS = [
  { tipo:"Horno", icon:"🔥", marcas:[
    { nombre:"Rational", refs:[
      { ref:"SCC WE 6×1/1 GN",  favorito:false, img:"https://images.tundrafmp.com/fit-in/700x700/filters:fill(white)/product_images/original_images/RATIONAL-iCombi-Pro-10-11-E_main.jpg", desc:"Combi 6 bandejas GN 1/1 · 10.5 kW · 3F" },
      { ref:"SCC WE 10×1/1 GN", favorito:true,  img:"https://images.tundrafmp.com/fit-in/700x700/filters:fill(white)/product_images/original_images/RATIONAL-iCombi-Pro-10-11-E_main.jpg", desc:"Combi 10 bandejas GN 1/1 · 18.5 kW · 3F" },
      { ref:"SCC WE 20×1/1 GN", favorito:false, img:"https://images.tundrafmp.com/fit-in/700x700/filters:fill(white)/product_images/original_images/RATIONAL-iCombi-Pro-10-11-E_main.jpg", desc:"Combi 20 bandejas GN 1/1 · 3F" },
      { ref:"SCC XS",            favorito:true,  img:"https://www.metos.com/media/catalog/product/r/a/rational_icombi_pro_xs_6_2_3_electric_1.jpg", desc:"iCombi XS · Compacto · 6×2/3 GN" },
    ]},
    { nombre:"Unox", refs:[
      { ref:"XEVC-0523-E1R",         favorito:false, img:"https://www.unox.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/x/a/xavc-0513-eprm.jpg", desc:"ChefTop ONE · 5 bandejas GN 2/3" },
      { ref:"XEVC-1011-EPR",         favorito:false, img:"https://www.unox.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/x/a/xavc-0513-eprm.jpg", desc:"ChefTop ONE · 10 bandejas GN 1/1" },
      { ref:"ChefTop",               favorito:true,  img:"https://www.unox.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/x/a/xavc-0513-eprm.jpg", desc:"ChefTop MIND.Maps · 5 GN 1/1" },
      { ref:"BakerTop",              favorito:false, img:"https://www.unox.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/x/a/xabc-05fs-eprm.jpg", desc:"BakerTop MIND.Maps · Panadería" },
      { ref:"Arianna (XEFR-04HS)",   favorito:true,  img:"https://store.cedarhospitality.com/96216-medium_default/unox-arianna-4-tray-oven-xeft-04hs-etlv.jpg", desc:"Arianna · 4 bandejas 460×330 · 3.5 kW" },
      { ref:"Stefania (XEFR-03HS)",  favorito:false, img:"https://cdn.habitium.com/ie/2251864-home_default/bakerlux-shop-pro-arianna-unox-professional-electric-oven-for-frozen-baked-goods.jpg", desc:"Stefania · 3 bandejas 460×330" },
      { ref:"Elena (XEFR-03EU)",     favorito:false, img:"https://cdn.habitium.com/ie/2251864-home_default/bakerlux-shop-pro-arianna-unox-professional-electric-oven-for-frozen-baked-goods.jpg", desc:"Elena · 3 bandejas GN 1/1" },
      { ref:"Rossella (XEFR-04EU)",  favorito:false, img:"https://cdn.habitium.com/ie/2251864-home_default/bakerlux-shop-pro-arianna-unox-professional-electric-oven-for-frozen-baked-goods.jpg", desc:"Rossella · 4 bandejas GN 1/1" },
      { ref:"Vittoria (XEFR-06EU)",  favorito:false, img:"https://cdn.habitium.com/ie/2251864-home_default/bakerlux-shop-pro-arianna-unox-professional-electric-oven-for-frozen-baked-goods.jpg", desc:"Vittoria · 6 bandejas GN 1/1" },
      { ref:"Camilla (XEFR-10EU)",   favorito:false, img:"https://cdn.habitium.com/ie/2251864-home_default/bakerlux-shop-pro-arianna-unox-professional-electric-oven-for-frozen-baked-goods.jpg", desc:"Camilla · 10 bandejas GN 1/1" },
    ]},
    { nombre:"Zanolli", refs:[
      { ref:"Synthesis 5/50", favorito:false, img:"https://m.media-amazon.com/images/I/71VFX2cq4AL._AC_SL1000_.jpg", desc:"Horno túnel pizza · banda 50 cm" },
      { ref:"Synthesis 8/75", favorito:false, img:"https://m.media-amazon.com/images/I/71VFX2cq4AL._AC_SL1000_.jpg", desc:"Horno túnel pizza · banda 75 cm" },
      { ref:"Teorema",        favorito:false, img:"https://m.media-amazon.com/images/I/71VFX2cq4AL._AC_SL1000_.jpg", desc:"Horno rotativo Zanolli" },
      { ref:"Pizza Express",  favorito:false, img:"https://m.media-amazon.com/images/I/71VFX2cq4AL._AC_SL1000_.jpg", desc:"Horno express pizza" },
    ]},
    { nombre:"Turbochef", refs:[
      { ref:"HHC2020",   favorito:false, img:"https://www.turbochef.com/wp-content/uploads/2019/02/HHC2020_main.jpg", desc:"Alta velocidad · 6.7 kW · ventless" },
      { ref:"HHC2620",   favorito:false, img:"https://www.turbochef.com/wp-content/uploads/2019/02/HHC2020_main.jpg", desc:"Alta velocidad amplio" },
      { ref:"Sota",      favorito:false, img:"https://www.turbochef.com/wp-content/uploads/2019/02/HHC2020_main.jpg", desc:"Compacto · ventless" },
      { ref:"Fire",      favorito:false, img:"https://www.turbochef.com/wp-content/uploads/2019/02/HHC2020_main.jpg", desc:"Fire · sin extracción" },
    ]},
  ]},
  { tipo:"Cafetera", icon:"☕", marcas:[
    { nombre:"Bunn", refs:[
      { ref:"VPR",            favorito:false, img:"https://www.bunn.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/v/p/vpr-0.jpg",         desc:"Por gravedad · 1.9 L · 120V" },
      { ref:"AXIOM",          favorito:false, img:"https://www.bunn.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/a/x/axiom-0001.jpg",    desc:"Doble decanter · digital" },
      { ref:"Infusion Series",favorito:false, img:"https://www.bunn.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/t/itcb-dv-0.jpg",    desc:"Té y café · programable" },
      { ref:"TF DBC",         favorito:false, img:"https://www.bunn.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/t/f/tf-dbc-black-0.jpg",desc:"ThermoFresh DBC · acero inox" },
    ]},
  ]},
  { tipo:"Granizadora", icon:"🧊", marcas:[
    { nombre:"Bunn", refs:[
      { ref:"ULTRA-2", favorito:true,  img:"https://www.bunn.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/u/l/ultra-2-hp-0001.jpg", desc:"2 tambores 4.7 L c/u · 120V" },
      { ref:"ULTRA-1", favorito:true,  img:"https://www.bunn.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/u/l/ultra-1-0001.jpg",    desc:"1 tambor 4.7 L · compacta" },
      { ref:"FMD",     favorito:false, img:"https://www.bunn.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/f/m/fmd-3-0001.jpg",       desc:"3 tambores · alta producción" },
    ]},
  ]},
  { tipo:"Nevera / Congelador", icon:"❄️", marcas:[
    { nombre:"General", refs:[
      { ref:"Refrigerador vertical",  favorito:false, img:"https://images.tundrafmp.com/fit-in/700x700/filters:fill(white)/product_images/original_images/TRUE-T-49-HC_main.jpg", desc:"Refrigerador vertical comercial" },
      { ref:"Congelador horizontal",  favorito:false, img:"https://images.tundrafmp.com/fit-in/700x700/filters:fill(white)/product_images/original_images/TRUE-T-49-HC_main.jpg", desc:"Congelador tipo cofre" },
      { ref:"Vitrina fría",           favorito:false, img:"https://images.tundrafmp.com/fit-in/700x700/filters:fill(white)/product_images/original_images/TRUE-T-49-HC_main.jpg", desc:"Vitrina refrigerada exhibición" },
    ]},
  ]},
];
// Helpers para compatibilidad con código existente que usa refs como strings
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

// Síntomas simplificados para operadores
const SINTOMAS_OP = {
  Horno:["El horno no enciende","Hay un código de error en la pantalla","El horno gotea agua","El lavado automático no funciona","El burlete está despegado o roto","El horno quema los alimentos","La puerta no cierra bien","Hay humo o llamas dentro del horno","Ruidos fuertes o extraños","El horno tarda mucho en calentar"],
  Cafetera:["No calienta el agua","No sale café","Gotea por debajo","No enciende"],
  Granizadora:["No enfría","No mezcla","Gotea","No enciende"],
  "Nevera / Congelador":["No enfría","Hace ruido","Tiene mucho hielo","No enciende"],
};

const ALIAS_MARCA = [
  { words:["chefto","cheftop","chef top","cheff","cheto","jefftop","sheftop","cheftob","chetop","xeftop","jeftop","cheftoop","chefttop","chetop","cheftob"], marca:"Unox", ref:"ChefTop" },
  { words:["bakertop","baker","baketop","bakertob","bejertop"], marca:"Unox", ref:"BakerTop" },
  { words:["arianna","ariana","ariama","ariann"], marca:"Unox", ref:"Arianna (XEFR-04HS)" },
  { words:["stefania","stefanía","estefania"], marca:"Unox", ref:"Stefania (XEFR-03HS)" },
  { words:["rational","racional","rasional"], marca:"Rational", ref:null },
  { words:["icombi","icomby","combi pro","selfcooking","scc"], marca:"Rational", ref:"SCC WE 10×1/1 GN" },
  { words:["unox"], marca:"Unox", ref:null },
  { words:["zanolli","zanoli","zanoly"], marca:"Zanolli", ref:null },
  { words:["turbochef","turbo chef","turboshef","turbocheff","turbo"], marca:"Turbochef", ref:null },
  { words:["hhc"], marca:"Turbochef", ref:"HHC2020" },
  { words:["bunn","bun"], marca:"Bunn", ref:null },
  { words:["ultra-2","ultra2","ultra 2"], marca:"Bunn", ref:"ULTRA-2" },
];
const ALIAS_TIPO = [
  { words:["horno","oven","combi","convector"], tipo:"Horno" },
  { words:["cafetera","cafe","coffee","espresso"], tipo:"Cafetera" },
  { words:["granizadora","granizado","slush","frozen"], tipo:"Granizadora" },
  { words:["nevera","refri","refrigerador","congelador"], tipo:"Nevera / Congelador" },
];

const extraerPorReglas = (texto) => {
  const t = texto.toLowerCase().replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u");
  let tipo=null, marca=null, ref=null;
  for (const a of ALIAS_TIPO) { if (a.words.some(w=>t.includes(w))) { tipo=a.tipo; break; } }
  for (const a of ALIAS_MARCA) { if (a.words.some(w=>t.includes(w))) { marca=a.marca; if(a.ref)ref=a.ref; if(!tipo){const eq=EQUIPOS.find(e=>e.marcas.some(m=>m.nombre===a.marca));if(eq)tipo=eq.tipo;} break; } }
  return {tipo,marca,ref};
};

// ─── COMPONENTE: catálogo de referencias con foto y badge favorito ────────────
function RefCatalog({ marca, onSelect, mostrarOtra=true }) {
  const [soloFav, setSoloFav] = useState(false);
  if (!marca) return null;
  const refsRaw = marca.refs || [];
  const tieneFav = refsRaw.some(r => isRefFav(r));
  const lista = soloFav ? refsRaw.filter(r => isRefFav(r)) : refsRaw;
  return (
    <div>
      {tieneFav && (
        <div style={{display:"flex",gap:6,marginBottom:10}}>
          <button onClick={()=>setSoloFav(false)} style={{...btn(!soloFav?"primary":"outline","sm")}}>Todos</button>
          <button onClick={()=>setSoloFav(true)}  style={{...btn(soloFav?"primary":"outline","sm")}}>⭐ Favoritos CEM</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {lista.map(r => {
          const refStr = getRefStr(r);
          const img    = getRefImg(r);
          const desc   = getRefDesc(r);
          const fav    = isRefFav(r);
          return (
            <div key={refStr} onClick={()=>onSelect(refStr)}
              style={{background:C.white,border:`1.5px solid ${fav?"#f59e0b":C.border}`,borderRadius:12,overflow:"hidden",cursor:"pointer",position:"relative",boxShadow:fav?"0 2px 10px rgba(245,158,11,0.18)":"0 1px 3px rgba(0,0,0,0.05)"}}>
              {fav && (
                <div style={{position:"absolute",top:6,right:6,background:"#f59e0b",color:"#fff",fontSize:8,fontWeight:800,padding:"2px 7px",borderRadius:20,zIndex:2,letterSpacing:0.3}}>
                  ⭐ CEM
                </div>
              )}
              <div style={{width:"100%",height:90,background:"#f8faff",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                {img ? (
                  <img src={img} alt={refStr}
                    style={{width:"100%",height:"100%",objectFit:"contain",padding:6}}
                    onError={e=>{e.target.style.display="none";e.target.parentNode.innerHTML='<div style="font-size:32px;color:#9ca3af">🔧</div>';}}
                  />
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

// ─── TUTORIALES DE YOUTUBE ─────────────────────────────────────────────────────
// Links curados y verificados por canal oficial o fuentes de confianza
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
    { titulo:"Unox MIND.Maps — Cómo limpiar tu horno (oficial)", url:"https://www.youtube.com/c/UnoxSpa", desc:"Canal oficial Unox", duracion:"" },
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
    { titulo:"Bunn ULTRA granizadora — Limpieza completa", url:"https://www.youtube.com/results?search_query=bunn+ultra+granizadora+slush+machine+cleaning", desc:"Búsqueda YouTube", duracion:"" },
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

// ─── INSTALACION ──────────────────────────────────────────────────────────────
const INSTALACION = {
  "Rational-SCC WE 6×1/1 GN":{ electrico:{tension:"3N AC 400V",frecuencia:"50/60 Hz",potencia:"10.5 kW",corriente:"16 A",fusible:"3×16 A",conexion:"5 hilos (3F+N+T) — línea de puesta a tierra obligatoria"},agua:{presion:"150–300 kPa (1.5–3 bar) dinámica",caudal:"20 l/min mín. para XS/61",conexion:'Manguera tipo lavarropa 1/2" con conector hembra rosca 3/4" — llave de corte independiente',desague:"Tubería diámetro 2\", material resistente a 65°C — SCC requiere sifón externo, iCombi NO requiere sifón",temp:"máx. 30°C — agua fría potable"},dimensiones:{ancho:"847 mm",profundidad:"771 mm",altura:"600 mm",peso:"80 kg",capacidad:"6×1/1 GN"},notas:"Distancia mínima pared posterior: 50 mm. Campana extractora: mín. 400 mm entre escape del equipo y filtros de grasa de la campana. Conductividad mínima del agua: 50 µS (dureza mín. 5°dH, mín. 90 ppm). Presión gas natural: 18–25 mbar / Gas propano: 25–57 mbar."},
  "Rational-SCC WE 10×1/1 GN":{ electrico:{tension:"3N AC 400V",frecuencia:"50/60 Hz",potencia:"18.5 kW",corriente:"32 A",fusible:"3×32 A",conexion:"5 hilos (3F+N+T) — conexión fija recomendada"},agua:{presion:"150–300 kPa (1.5–3 bar) dinámica",caudal:"20 l/min mín.",conexion:'Manguera tipo lavarropa 1/2" con conector hembra rosca 3/4" — llave de corte independiente',desague:"Tubería diámetro 2\", material resistente a 65°C — SCC requiere sifón externo",temp:"máx. 30°C — agua fría potable"},dimensiones:{ancho:"847 mm",profundidad:"771 mm",altura:"1000 mm",peso:"120 kg",capacidad:"10×1/1 GN"},notas:"Campana extractora: mín. 400 mm entre escape y filtros de grasa. Conductividad mínima del agua: 50 µS. Filtro en acometida de agua recomendado."},
  "Unox-Arianna (XEFR-04HS)":{ electrico:{tension:"1F / 230V",frecuencia:"50/60 Hz",potencia:"3.5 kW",corriente:"Ver placa",fusible:"Diferencial 0.03A tipo A + disyuntor cat. III",conexion:"Cable + enchufe Schuko de fábrica"},agua:{presion:"150–600 kPa (recomendada 200 kPa)",caudal:"mín. 300 l/h",conexion:"Reductor de presión integrado",desague:"Parte trasera — pendiente mín. 4°, tubo resistente a 90°C",temp:"máx. 30°C"},dimensiones:{ancho:"1053 mm",profundidad:"674 mm",altura:"585 mm",peso:"Ver placa",capacidad:"4 bandejas 460×330"},notas:"Temperatura ambiente +5°C a +35°C. Distancia mín. 5 cm. NUNCA en el piso directamente."},
  "Unox-BakerTop":{ electrico:{tension:"3N AC 400V / 220-240V",frecuencia:"50/60 Hz",potencia:"Según modelo",corriente:"Según modelo",fusible:"Diferencial 0.03A tipo A + magnetotérmico cat. III",conexion:"5 hilos (3F+N+T)"},agua:{presion:"150–600 kPa",caudal:"mín. 300 l/h",conexion:'3/4" NPT',desague:"Sifón tipo, inclinación mín. 4%",temp:"máx. 30°C"},dimensiones:{ancho:"860 mm",profundidad:"967 mm",altura:"675–1163 mm",peso:"90–148 kg",capacidad:"4, 6, 10 bandejas 600×400"},notas:"Agua de vapor: dureza ≤ 8°dH. Mantenimiento anual obligatorio."},
  "Turbochef-HHC2020":{ electrico:{tension:"AC 208–240V",frecuencia:"50/60 Hz",potencia:"6.7 kW",corriente:"32 A",fusible:"32 A",conexion:"2 hilos + tierra"},agua:{presion:"N/A",caudal:"N/A",conexion:"No requiere",desague:"No requiere",temp:"N/A"},dimensiones:{ancho:"559 mm",profundidad:"813 mm",altura:"584 mm",peso:"60 kg",capacidad:"Horno alta velocidad"},notas:"No requiere agua ni extracción especial."},
  "Bunn-VPR":{ electrico:{tension:"AC 120V/240V",frecuencia:"50/60 Hz",potencia:"1.55 kW",corriente:"13 A",fusible:"15 A",conexion:"2 hilos + tierra"},agua:{presion:"20–90 psi",caudal:"2 l/min",conexion:'1/4" tubing',desague:"Bandeja con desagüe",temp:"Fría"},dimensiones:{ancho:"279 mm",profundidad:"457 mm",altura:"432 mm",peso:"5.2 kg",capacidad:"1.9 L/jarra"},notas:"Requiere toma de agua fría y drenaje de bandeja."},
  "Bunn-ULTRA-2":{ electrico:{tension:"AC 120V",frecuencia:"60 Hz",potencia:"0.93 kW",corriente:"8 A",fusible:"15 A",conexion:"2 hilos + tierra"},agua:{presion:"20–90 psi",caudal:"2 l/min",conexion:'1/4" tubing',desague:"Bandeja frontal",temp:"Fría filtrada"},dimensiones:{ancho:"368 mm",profundidad:"508 mm",altura:"686 mm",peso:"22 kg",capacidad:"2×4.7 L"},notas:"Agua fría filtrada. Limpiar condensador mensualmente."},
};

const PLANES = {
  "Rational-SCC WE 10×1/1 GN":{ diario:["Ejecutar CleanJet+Care al finalizar jornada (nivel según suciedad)","Limpiar burlete de puerta con paño húmedo — verificar que no esté dañado","Limpiar bandeja recogegotas de la puerta: hacer circular 1-2 litros de agua tibia","Verificar que el desagüe no esté obstruido","No dejar residuos de comida en la cámara — riesgo de obstrucción del desagüe"], semanal:["Limpiar filtro de aire con solución jabonosa suave (<80°C) y dejar secar","Revisar chapa deflectora y bastidores colgantes — deben estar bien fijos","Limpiar cristal de puerta con paño suave y húmedo — NO usar químicos","Inspeccionar estado del burlete — reemplazar si tiene grietas o deformaciones"], mensual:["Descalcificar boquilla de humidificación si hay incrustaciones","Revisar sonda térmica — verificar inserción y estado del cable","Verificar presión dinámica del agua: 1.5–3 bar","Verificar conductividad del agua: mín. 50 µS (dureza mín. 5°dH)"], semestral:["Cambiar burlete si hay deterioro (ver guía de cambio de burlete)","Revisión técnica por servicio certificado Rational — verificar consumibles"], anual:["Inspección general certificada por técnico Rational","Reemplazar consumibles según uso: burlete (1-3 según intensidad), filtro de aire (1-2), junta caldera (1-2)","Pastillas Cleaner: consumo aprox. 0.7 baldes/año (uso ligero) a 1 balde/año (uso intenso)","Pastillas Care: consumo aprox. 0.3–0.5 baldes/año según intensidad de uso"] },
  "Unox-ChefTop":{ diario:["Ejecutar ciclo de limpieza con UNOX Det&Rinse al finalizar jornada","Retirar TODAS las bandejas antes del ciclo de lavado","Verificar grifo de agua abierto","Verificar tanque de detergente lleno y bien instalado","Limpiar junta de puerta visualmente","Verificar que la chimenea no esté obstruida"], semanal:["Inspeccionar interior de cámara: manchas, incrustaciones, corrosión","Verificar sello de puerta","Verificar P-trap del desagüe: llenar con agua si está seco","Limpiar filtro mecánico de agua"], mensual:["Verificar presión de agua: entrada 1.5-6 bar, salida reductor ~2.3 bar","Verificar válvulas solenoides EL1, EL2, EG1, EG2","Revisar P-trap y sistema de drenaje","Verificar calibración del horno en Service Menu (PIN: 99857)"], trimestral:["Limpiar chimenea con cepillo metálico","Verificar capacitores de motores: valor esperado 6.3 µF","Solo gas: verificar corriente de ionización 1.5-10 µA DC","Solo gas: verificar gaps electrodos — 3 mm entre electrodos"], semestral:["Actualizar firmware","Verificar contactores y elementos calefactores"], anual:["Solo gas: reemplazar empaques kit KGN1569A","Reemplazar empaque de puerta completo si hay deterioro","Evaluar calidad del agua","Respaldar parámetros en USB (PARAM_S6)"] },
  "Unox-BakerTop":{ diario:["Ejecutar ciclo de limpieza con UNOX Det&Rinse","Retirar todas las bandejas antes del lavado","Verificar grifo de agua abierto y tanque de detergente lleno"], semanal:["Inspeccionar cámara y sello de puerta","Verificar P-trap del desagüe"], mensual:["Verificar presión de agua entrada 1.5-6 bar","Verificar válvulas solenoides EL1, EL2, EG1, EG2"], semestral:["Actualizar firmware","Revisar contactores y elementos calefactores"], anual:["Solo gas: reemplazar empaques kit KGN1569A","Respaldo de parámetros en USB","Evaluar calidad del agua"] },
};
const PLAN_GEN = { diario:["Limpiar exteriores","Verificar funcionamiento básico"], semanal:["Limpiar filtros accesibles"], mensual:["Inspección visual de mangueras"], semestral:["Revisión por técnico"], anual:["Mantenimiento preventivo completo"] };

// ─── CONSEJOS OPERADOR ────────────────────────────────────────────────────────
const CONSEJOS_OP = [
  {
    icono:"🔥", titulo:"Horno — Antes de arrancar",
    consejos:[
      "Verifica que el grifo de agua azul esté abierto (detrás o debajo del equipo).",
      "El tanque de detergente debe estar lleno antes de iniciar la jornada.",
      "Nunca metas bandejas de aluminio en el horno — dañan el interior.",
      "No salar la comida dentro del horno — la sal corroe el acero inoxidable.",
    ]
  },
  {
    icono:"🧹", titulo:"Horno — Limpieza al cerrar",
    consejos:[
      "Retira TODAS las bandejas antes de iniciar el ciclo de lavado.",
      "Selecciona el nivel de lavado según qué tan sucio está el horno.",
      "No abras la puerta durante el ciclo de lavado — el vapor está muy caliente.",
      "Al terminar, deja la puerta entreabierta para ventilar y evitar malos olores.",
    ]
  },
  {
    icono:"🚪", titulo:"Cuidado de la puerta y burlete",
    consejos:[
      "Cierra la puerta con suavidad — los golpes dañan el burlete y las bisagras.",
      "Limpia el burlete (caucho negro alrededor de la puerta) con paño húmedo todos los días.",
      "Si ves que el burlete está despegado o roto, avisa a mantenimiento ese mismo día.",
      "No cuelgues trapos ni nada en la manija de la puerta.",
    ]
  },
  {
    icono:"❌", titulo:"Lo que NUNCA debes hacer",
    consejos:[
      "❌ Nunca uses lejía ni cloro dentro del horno.",
      "❌ Nunca uses estropajos metálicos ni virutas de acero.",
      "❌ Nunca apagues el horno jalando el cable.",
      "❌ Nunca llenes el tanque de detergente con un producto diferente al aprobado.",
      "❌ Nunca dejes comida adentro del horno al cerrar — genera olores y obstruye el desagüe.",
    ]
  },
  {
    icono:"☕", titulo:"Cafetera Bunn — Cuidado diario",
    consejos:[
      "Retira la canasta de filtro y lávala con agua y jabón al final del día.",
      "No dejes café viejo en la jarra — acidifica y mancha.",
      "Limpia el cabezal de distribución con cepillo suave.",
      "Reporta si hay goteo debajo de la máquina — puede dañar el equipo y el mueble.",
    ]
  },
  {
    icono:"🧊", titulo:"Granizadora Bunn — Cuidado diario",
    consejos:[
      "Vacía el producto al cerrar si el equipo va a estar apagado más de 4 horas.",
      "Limpia el tambor con agua tibia y jabón neutro — enjuaga muy bien.",
      "Nunca mojes el compresor ni las zonas eléctricas.",
      "Si el producto está muy líquido o muy sólido, avisa a mantenimiento.",
    ]
  },
  {
    icono:"❄️", titulo:"Nevera/Congelador — Cuidado diario",
    consejos:[
      "No dejes la puerta abierta más de 30 segundos — genera escarcha.",
      "No metas comida caliente — baja la temperatura del equipo.",
      "Si hay mucho hielo acumulado, avisa a mantenimiento — no lo raspes con metal.",
      "Limpia los derrames inmediatamente — generan olores y bacterias.",
    ]
  },
  {
    icono:"🚨", titulo:"Cuando debes llamar a mantenimiento YA",
    consejos:[
      "🔴 Hay humo, llamas o chispas dentro del equipo.",
      "🔴 Hay olor a gas o a quemado eléctrico.",
      "🔴 El equipo hace un ruido muy fuerte o inusual.",
      "🔴 Hay un error en pantalla con número (Service XX, AF0X, WF0X).",
      "🔴 Hay agua en el piso alrededor del equipo.",
      "✅ Para todo lo demás, intenta el CEM Bot primero.",
    ]
  },
];

const LIMPIEZAS_DATA = {
  Horno:[
    {titulo:"Rational SCC/iCombi — Limpieza diaria (operador)",alerta:"⚠️ Usar guantes y delantal. NO limpiar con el horno caliente por encima de 75°C.",pasos:["Al finalizar la jornada, retirar TODAS las bandejas, parrillas y contenedores de la cámara.","Seleccionar el ciclo de limpieza CleanJet+Care desde el panel. Elegir nivel según suciedad: Nivel 1-2 para suciedad ligera, Nivel 3-4 para suciedad media, Nivel 5-6 para suciedad fuerte.","iCombi Pro: colocar pastilla verde (detergente) en el tamiz del piso. Colocar pastillas azules CareControl en el cajón CareControl.","SCC: colocar pastilla roja/plateada en el canasto del bafle. Colocar pastillas CareControl en el cajón.","Cerrar bien la puerta y pulsar Inicio. NO abrir durante el ciclo.","Al terminar: limpiar la bandeja recogegotas de la puerta con 1-2 litros de agua tibia.","Dejar la puerta entreabierta al final del día para ventilar y evitar malos olores.","⚠️ Si no se limpia a diario el residuo de grasa puede generar humo, mal sabor en alimentos y riesgo de incendio."],tutoriales:getTutoriales("Rational","limpieza")},
    {titulo:"Rational SCC/iCombi — Productos permitidos y prohibidos",alerta:"⚠️ Usar productos incorrectos daña el acero inox, el cristal y los burletes — puede anular la garantía.",pasos:["✅ SÍ usar: pastillas CleanJet originales Rational (verde iCombi / roja SCC), pastillas CareControl originales, agua tibia con paño suave para exteriores.","✅ SÍ usar: esponja suave o paño de microfibra para limpiar la puerta, el burlete y el panel de control.","❌ NUNCA usar: limpiadores con cloro o lejía — corroen el acero inox.","❌ NUNCA usar: productos con vinagre o ácidos — atacan el burlete de silicona.","❌ NUNCA usar: estropajos metálicos, virutas de acero, esponjas abrasivas — raspan y dañan el interior.","❌ NUNCA usar: desengrasantes industriales no aprobados Rational — pueden dejar residuos tóxicos en la cámara.","❌ NUNCA usar: manguera de agua a presión para limpiar el interior o el panel eléctrico.","❌ NUNCA limpiar el cristal de la puerta con químicos — disuelven los flejes de sujeción del vidrio."]},
    {titulo:"Rational SCC/iCombi — Cuidado del burlete y cristal",alerta:"⚠️ Un burlete dañado genera pérdida de vapor, mayor consumo y posibles fallas.",pasos:["Después de cada carga: limpiar el burlete con un paño húmedo suave, por dentro y por fuera.","Revisar visualmente que el burlete no tenga grietas, rasgaduras ni partes despegadas.","Si el burlete tiene daños visibles, reportar al técnico de mantenimiento — NO continuar usando el horno si la puerta no sella bien.","Cristal exterior: limpiar solo con paño húmedo. Nunca usar químicos.","Cristal interior: abrir soltando los 2 clips de muelle (superior e inferior). Limpiar solo con paño suave y agua. Dejar enfriar antes de tocar.","Evitar golpear la puerta al cerrarla — el impacto repetido deteriora el burlete y las bisagras.","No colgar trapos ni utensilios en la manija de la puerta."],tutoriales:getTutoriales("Rational","burlete")},
    {titulo:"Unox ChefTop/BakerTop — Limpieza diaria (operador)",alerta:"⚠️ Retirar TODAS las bandejas antes del ciclo. No iniciar la limpieza con el horno lleno.",pasos:["Al finalizar la jornada, retirar TODAS las bandejas y rejillas de la cámara.","Verificar que el grifo de agua esté abierto.","Verificar que el tanque de detergente Det&Rinse esté lleno y bien instalado.","Seleccionar el ciclo de lavado desde el panel. Pulsar Inicio.","NO abrir la puerta durante el ciclo de lavado.","Al terminar: revisar que no queden residuos de producto en la cámara.","Dejar la puerta entreabierta al final del día para ventilar.","Limpiar la junta de puerta visualmente — si hay residuos, limpiar con paño húmedo."],tutoriales:getTutoriales("Unox","limpieza")},
    {titulo:"Unox ChefTop/BakerTop — Productos permitidos y prohibidos",alerta:"⚠️ El uso de productos no aprobados puede dañar los componentes y anular la garantía Unox.",pasos:["✅ SÍ usar: detergente líquido Det&Rinse Unox original en el tanque del equipo.","✅ SÍ usar: paño de microfibra húmedo para exteriores, burlete y panel.","✅ SÍ usar: agua tibia para enjuagar manualmente el interior si queda residuo.","❌ NUNCA usar: lejía, cloro ni productos clorados — corroen el acero inox de la cámara.","❌ NUNCA usar: vinagre ni productos ácidos — dañan los burletes de silicona.","❌ NUNCA usar: estropajos abrasivos ni lana de acero — raspan y dejan marcas permanentes.","❌ NUNCA usar: sprays desengrasantes de cocina directamente en la cámara — dejan residuos que contaminan alimentos.","❌ NUNCA limpiar con manguera a presión — el agua puede entrar a componentes eléctricos.","❌ NUNCA rellenar el tanque de Det&Rinse con detergente de otra marca sin aprobación Unox."]},
    {titulo:"Unox ChefTop/BakerTop — Cuidado del burlete",alerta:"⚠️ El burlete del ChefTop/BakerTop NO tiene orificios — es totalmente sellado.",pasos:["Revisar el burlete visualmente al inicio y al final de cada jornada.","Limpiar con paño húmedo suave — nunca con productos químicos.","Verificar que el burlete esté completamente encajado en la ranura todo el contorno.","Si el burlete tiene grietas, está despegado o la puerta no cierra bien: reportar al técnico de mantenimiento.","No jalar el burlete innecesariamente — se puede salir de la ranura.","Evitar golpear la puerta. Cerrar siempre con suavidad."],tutoriales:getTutoriales("Unox","burlete")},
    {titulo:"Unox Arianna — Limpieza diaria (operador)",alerta:"⚠️ Recuerda que la puerta de la Arianna cierra hacia ARRIBA, no hacia los lados.",pasos:["Al finalizar la jornada, retirar todas las bandejas y el cajón de grasas.","Limpiar el cajón recogegotas: retirarlo, vaciarlo y lavarlo con agua y jabón suave.","Limpiar el interior de la cámara con paño húmedo mientras aún está tibio (no caliente).","Limpiar el burlete con paño húmedo — tiene DOS ORIFICIOS en la parte superior, que no se deben tapar.","Limpiar el cristal exterior e interior con paño húmedo. No usar químicos.","Limpiar el exterior (acero inox) con paño húmedo siguiendo el pulido horizontal.","Verificar que la puerta cierre correctamente al terminar."]},
    {titulo:"Zanolli / Turbochef — Limpieza diaria (operador)",alerta:"⚠️ Apagar el horno y esperar al menos 30 min antes de limpiar.",pasos:["Apagar el horno completamente y esperar a que se enfríe.","Retirar la piedra refractaria (Zanolli) o la bandeja (Turbochef) con cuidado — pueden estar calientes.","Zanolli: limpiar la piedra en seco con rasqueta o cepillo de cerdas metálicas. Nunca sumergir en agua ni lavar con jabón — la piedra absorbe agua y puede romperse al calentarse.","Turbochef: limpiar el interior con el kit de limpieza propio del equipo o paño húmedo.","Limpiar el exterior con paño húmedo y jabón suave.","Limpiar la mirilla o cristal con paño húmedo. No usar abrasivos.","Verificar que la banda transportadora (si aplica) esté libre de residuos."]},
  ],
  Cafetera:[
    {titulo:"Cafetera Bunn — Limpieza diaria (operador)",alerta:"⚠️ No sumergir ninguna pieza eléctrica en agua.",pasos:["Al finalizar la jornada, retirar la canasta de filtro y lavarla con agua y jabón suave. Enjuagar bien.","Limpiar el cabezal de distribución con cepillo suave para retirar residuos de café.","Lavar el jarro o recipiente de café con agua y jabón suave. Enjuagar.","Limpiar el exterior de la cafetera con paño húmedo.","No dejar café viejo en la jarra — la acidez mancha y genera malos olores.","Revisar que el grifo y la boquilla de salida estén libres de obstrucciones."],tutoriales:getTutoriales("Bunn","limpieza")},
    {titulo:"Cafetera Bunn — Descalcificación mensual",alerta:"⚠️ Usar solo descalcificante aprobado para cafeteras. Nunca vinagre puro.",pasos:["Vaciar el depósito de agua.","Preparar solución de descalcificante según instrucciones del fabricante.","Pasar la solución por el ciclo de la cafetera.","Pasar 2-3 ciclos de agua limpia para enjuagar completamente.","Si persiste sabor a descalcificante, pasar un ciclo más de agua.","Registrar la fecha de descalcificación."]},
  ],
  Granizadora:[
    {titulo:"Granizadora Bunn — Limpieza diaria (operador)",alerta:"⚠️ Apagar y desconectar de la corriente antes de limpiar. No mojar el compresor.",pasos:["Al finalizar la jornada, vaciar el producto del tambor.","Retirar el tambor y la paleta mezcladora (si son desmontables).","Lavar el tambor con agua tibia y jabón neutro. Enjuagar muy bien — el residuo de jabón afecta el sabor.","Limpiar el interior del gabinete con paño húmedo. No mojar el compresor ni zonas eléctricas.","Limpiar las rejillas laterales o traseras del condensador con paño seco o pincel suave.","Secar bien todas las piezas antes de remontar.","Dejar la tapa abierta si el equipo quedará apagado por largo tiempo."]},
  ],
  "Nevera / Congelador":[
    {titulo:"Nevera/Congelador — Limpieza semanal (operador)",alerta:"⚠️ No raspar el hielo con objetos metálicos — daña el evaporador.",pasos:["Retirar todos los productos y guardar en zona fría temporal.","Apagar el equipo o usar modo de descongelación.","Esperar a que el hielo se derrita naturalmente. Si hay mucho hielo, colocar recipiente con agua caliente dentro (sin que toque el evaporador).","Limpiar el interior con paño húmedo y solución de bicarbonato (1 cucharada por litro de agua) — neutraliza olores.","Enjuagar con agua limpia y secar con paño seco.","Limpiar las juntas de la puerta con paño húmedo — revisar que no estén rotas ni deformadas.","Limpiar las rejillas del condensador (parte trasera o inferior) con pincel suave o aspiradora.","Devolver los productos y encender el equipo."]},
  ],
};

const ERRORES_UNOX = [
  {code:"AF01 – Motor térmico",nivel:"CRÍTICO",desc:"Termostato del motor disparó. Capacitores o motor dañados.",pasos:["Apagar equipo. Desconectar socket P2.","Medir continuidad entre pin 4 y 5.","Probar capacitores: valor esperado 6.3 µF.","Reemplazar capacitor defectuoso o motor."]},
  {code:"AF02 – Termostato seguridad",nivel:"CRÍTICO",desc:"Termostato de seguridad activado (dispara a 320°C).",pasos:["Esperar enfriamiento completo del horno.","Reiniciar termostato. Verificar fuentes externas de calor.","Desconectar socket P22, medir continuidad pin 4 y 5.","Si no hay continuidad → reemplazar termostato de seguridad."]},
  {code:"AF03 – Sonda de temperatura",nivel:"CRÍTICO",desc:"Sondas de cámara desconectadas o dañadas.",pasos:["Verificar conexión sondas a sockets P19 y P16.","Medir con multímetro: valor correcto ~110 Ω a 25°C.","Si valor incorrecto → reemplazar sonda dañada.","Si persiste → reemplazar placa de potencia."]},
  {code:"AF04 – Comunicación placa",nivel:"CRÍTICO",desc:"Error de comunicación entre placa de control y placa de potencia.",pasos:["Verificar que accesorios estén encendidos.","Medir continuidad del cable en socket P11 pin a pin.","Sin continuidad → reemplazar cable.","Con continuidad → reemplazar placa de control."]},
  {code:"AF23 – Alarma de gas",nivel:"PELIGRO",desc:"Falla en sistema de ignición o detección de llama. Solo hornos a gas.",pasos:["Verificar que se escuche chispa durante el arranque.","Verificar suministro de gas: 190-210 V DC a válvula.","Medir corriente de ionización: 1.5 a 10 µA DC.","Revisar electrodos: distancia 3 mm entre electrodos."]},
  {code:"AF24 – Válvula Pollo",nivel:"CRÍTICO",desc:"Handle de válvula Pollo en posición incorrecta.",pasos:["Durante cocción: handle VERTICAL (posición tanque).","Durante lavado: handle HORIZONTAL (posición drenaje).","Si posición correcta: verificar cableado del microswitch.","Si hay agua en conector → revisar empaque GN1587A0."]},
  {code:"AF26 – Tanque detergente",nivel:"CRÍTICO",desc:"Tanque no instalado o termostato de seguridad disparado.",pasos:["Verificar que el tanque esté bien instalado.","Medir continuidad del microswitch (cables rojos).","Si termostato disparado: esperar enfriamiento y reiniciar.","Medir continuidad socket P22 entre pin 4 y 5."]},
  {code:"WF16 – Falta de agua / EL1",nivel:"FRECUENTE",desc:"Grifo cerrado, presión insuficiente o válvula EL1 bloqueada.",pasos:["Abrir grifo de agua completamente.","Verificar presión de entrada: 1.5 a 6 bar.","Presión aguas abajo del reductor: ~2.3 bar.","Sin voltaje en EL1 → reemplazar placa. Con voltaje → revisar EL1 y EL2."]},
  {code:"WF06 – Sobrecalentamiento placa",nivel:"FRECUENTE",desc:"Temperatura de placa de potencia supera 60°C.",pasos:["Verificar que ventilador trasero recibe 230 VAC.","Verificar sentido del flujo de aire: adentro hacia afuera.","Si temperatura trasera >70°C → investigar causas."]},
  {code:"WF41 – Sin conexión internet",nivel:"MODERADO",desc:"Falla de conexión Wi-Fi o Ethernet.",pasos:["Ethernet: verificar DHCP activado, sin firewall.","Wi-Fi: verificar nombre y contraseña (no acepta comas ni °).","Si persiste: configurar IP estática.","Último recurso: reemplazar placa Wi-Fi o Ethernet."]},
  {code:"Pantalla en blanco",nivel:"SIMPLE",desc:"Panel sin imagen.",pasos:["Tocar el panel — puede estar en modo stand-by.","Medir 12V DC en conector principal.","Si no hay voltaje → reemplazar placa de control."]},
  {code:"No enciende",nivel:"MODERADO",desc:"El horno no arranca.",pasos:["Verificar fusible F2 (2A - 250V Fast Acting).","Medir 230 VAC en socket P1 entre NF y LF.","Si no hay voltaje → placa de potencia dañada.","Verificar fusible F4 (5A - 250V Time Delay)."]},
];

const ERRORES_RATIONAL = [
  {code:"Service 23/24",nivel:"CRÍTICO",desc:"Error hardware. Apagar inmediatamente.",pasos:["Apagar con interruptor 0/I.","Llamar Service Rational Colombia.","No rearmar hasta instrucciones."]},
  {code:"Service 26/27",nivel:"CRÍTICO",desc:"Falla CleanJet: válvula de esfera no encuentra posición. No es posible cocinar.",pasos:["Cancelar CleanJet en menú.","Retirar tabletas con guantes.","Verificar que la chapa deflectora y bastidores estén bien fijos — NO debe haber recipientes en la cámara.","Enjuagar con ducha de mano.","Llamar técnico si persiste."]},
  {code:"Service 32/33",nivel:"PELIGRO",desc:"Fallo del quemador de gas. Cerrar gas inmediatamente.",pasos:["Cerrar llave del gas.","Ventilar el local.","No encender hasta que llegue el técnico de gas.","Llamar técnico certificado Rational."]},
  {code:"Service 14",nivel:"LIMITADO",desc:"Solo Calor Seco disponible — problema con suministro de agua.",pasos:["Cancelar con Flecha.","Verificar grifo de agua abierto.","Verificar presión de agua: 1.5–3 bar, mín. 20 L/min.","Revisar filtros de acometida."]},
  {code:"Service 25",nivel:"FRECUENTE",desc:"CleanJet sin agua — iCareSystem no recibe la cantidad necesaria.",pasos:["Verificar grifo de agua abierto completamente.","Limpiar filtro de acometida de agua.","Verificar presión dinámica: mín. 1.5 bar.","Verificar conductividad mínima del agua: 50 µS (dureza mín. 5°dH)."]},
  {code:"Service 10/11/12",nivel:"MODERADO",desc:"Falla en generador de vapor fresco. El equipo puede seguir cocinando.",pasos:["Presionar Flecha para continuar.","Verificar suministro de agua.","Programar visita de servicio."]},
  {code:"Service 20.1 / 20.8",nivel:"CRÍTICO",desc:"Falla sensor de temperatura — no es posible cocinar.",pasos:["Apagar el equipo.","Verificar conexiones de sonda térmica.","Llamar técnico Rational certificado."]},
  {code:"Service 28.1 / 28.2 / 28.4",nivel:"CRÍTICO",desc:"Se sobrepasó límite de temperatura del generador de vapor o cámara.",pasos:["Apagar inmediatamente.","Dejar enfriar mínimo 30 minutos.","Verificar que el filtro de aire no esté obstruido.","Llamar técnico si persiste."]},
  {code:"Service 29",nivel:"FRECUENTE",desc:"Temperatura de la placa demasiado elevada — filtro de aire sucio.",pasos:["Apagar y limpiar filtro de aire.","Revisar ventilación del local.","Verificar que haya espacio mínimo de 400mm entre escape y campana."]},
  {code:"Service 31.1 / 31.2",nivel:"COMÚN",desc:"Falla sonda térmica en cámara de cocción. Se puede cocinar pero no usar la sonda.",pasos:["Verificar inserción de la sonda.","Inspeccionar cable y conector.","Programar reemplazo con técnico."]},
  {code:"Service 41",nivel:"MODERADO",desc:"Boquilla o tubo de humidificación calcificados.",pasos:["Descalcificar la boquilla de humidificación.","Verificar calidad del agua — conductividad mín. 50 µS.","Programar mantenimiento."]},
  {code:"Service 47/48",nivel:"MODERADO",desc:"Falla bomba de desagüe o circulación.",pasos:["Verificar que el desagüe no esté atascado.","Limpiar sifón/P-trap trasero.","Verificar pendiente mínima del tubo de desagüe.","Llamar técnico si persiste."]},
  {code:"Service 110/120",nivel:"CRÍTICO",desc:"Error en bomba SC o detección de agua durante limpieza automática.",pasos:["Cancelar la limpieza en curso.","Verificar suministro de agua.","Llamar técnico Rational."]},
];

const NIVEL_C = {CRÍTICO:"red",PELIGRO:"red",LIMITADO:"blue",FRECUENTE:"yellow",SIMPLE:"green",COMÚN:"blue",MODERADO:"blue"};

const REPUESTOS = [
  {cod:"KMT1012A",desc:"Motor 330W con eje cónico D12 (LUX/MIND.Maps)",precio:1350000,marca:"Unox"},
  {cod:"KPE2260A",desc:"Tarjeta potencia BLSP/Speed.Pro/Zero",precio:990000,marca:"Unox"},
  {cod:"KPE2107A",desc:"Control completo BakerLux SP LED",precio:990000,marca:"Unox"},
  {cod:"KTR1136A",desc:"Termostato de seguridad 318°C",precio:405000,marca:"Unox"},
  {cod:"KVN1172A",desc:"Turbina D195 H40 8 aspas tuerca M8",precio:553500,marca:"Unox"},
  {cod:"KRS1283B",desc:"Resistencia 3000W 230V + 260W 135V 4 espiras",precio:765000,marca:"Unox"},
  {cod:"KTR1105A",desc:"Sonda temperatura PT100 L1000",precio:540000,marca:"Unox"},
  {cod:"KVT1330A",desc:"Cristal interno BL SP Arianna",precio:315000,marca:"Unox"},
  {cod:"KCR1112A",desc:"Bisagra plegable SP Arianna-Elena",precio:225000,marca:"Unox"},
  {cod:"KCE1095A",desc:"Cable bus 4 polos 2M potencia-control",precio:180000,marca:"Unox"},
  {cod:"KEL1251A",desc:"Electroválvula 1 vía JG D8-D10",precio:292500,marca:"Unox"},
  {cod:"KGN1352A",desc:"Goma puerta LM Arianna / Armarios BT",precio:211500,marca:"Unox"},
  {cod:"KCN1003A",desc:"Condensador motor 6.3 µF",precio:135000,marca:"Unox"},
  {cod:"KPE1057B",desc:"Panel control capacitivo MIND.Maps Plus",precio:4275000,marca:"Unox"},
  {cod:"KGN1629A",desc:"Goma puerta 0511",precio:382500,marca:"Unox"},
  {cod:"KGN1630A",desc:"Goma puerta 0711",precio:360000,marca:"Unox"},
  {cod:"KGN1631A",desc:"Goma puerta 1011",precio:405000,marca:"Unox"},
  {cod:"KGN1569A",desc:"Kit empaques antorcha gas",precio:450000,marca:"Unox"},
  {cod:"KPE2038A",desc:"Tarjeta potencia MIND.Maps Plus eléctrico",precio:2700000,marca:"Unox"},
  {cod:"KRS1267A",desc:"Resistencia circular 10.5kW 230V 6 espiras",precio:1440000,marca:"Unox"},
  {cod:"KSN1031A",desc:"Sonda al corazón monopunto L2000",precio:1080000,marca:"Unox"},
  {cod:"KVL1182A",desc:"Sistema lavado ONE",precio:1215000,marca:"Unox"},
  {cod:"KVL1183A",desc:"Sistema lavado Plus 1 brazo",precio:1845000,marca:"Unox"},
  {cod:"KSB1016A",desc:"Tanque detergente 3L",precio:675000,marca:"Unox"},
  {cod:"87.00.279",desc:"Kit termostato seguridad Bilímite 360°C Línea SCC",precio:265905,marca:"Rational"},
  {cod:"20.00.399P",desc:"Burlete puerta SCC CMP 202 LM1 LM2; G",precio:432629,marca:"Rational"},
  {cod:"20.02.553P",desc:"Burlete puerta SCC CMP 102 LM1 LM2; E",precio:364915,marca:"Rational"},
  {cod:"20.02.552P",desc:"Burlete puerta SCC CMP 101 LM1 LM2; D",precio:333391,marca:"Rational"},
  {cod:"20.02.551P",desc:"Burlete puerta SCC CMP 62 LM1 LM2; C",precio:322295,marca:"Rational"},
  {cod:"20.02.550P",desc:"Burlete puerta SCC CMP 61 LM1 LM2; B",precio:290771,marca:"Rational"},
  {cod:"20.02.549P",desc:"Burlete puerta SCC CMP 623 LM1 LM2; A",precio:274895,marca:"Rational"},
  {cod:"40.07.634S",desc:"Ventilador de refrigeración LM1; B-E",precio:302948,marca:"Rational"},
  {cod:"87.01.535S",desc:"Panel de control con táctil/TFT *RAT* LM1; B-G",precio:3076206,marca:"Rational"},
  {cod:"50.02.054P",desc:"Electroválvula quíntuple con caudalímetro LM1; B-E",precio:475875,marca:"Rational"},
  {cod:"40.02.337P",desc:"Termostato de seguridad, Bilímite 215°C VCC",precio:84614,marca:"Rational"},
  {cod:"40.05.654P",desc:"Filtro entrada de aire LM1 LM2; F G",precio:65153,marca:"Rational"},
  {cod:"87.00.436",desc:"Kit de modificación *Service25* Línea SCC",precio:162285,marca:"Rational"},
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

// ─── TABS POR ROL ─────────────────────────────────────────────────────────────
const TABS_TECNICO = [
  {id:"inicio",icon:"🏠",label:"Inicio"},
  {id:"chat",icon:"🤖",label:"CEM Bot"},
  {id:"planes",icon:"📋",label:"Planes"},
  {id:"instalacion",icon:"⚡",label:"Instalación"},
  {id:"limpieza",icon:"🧹",label:"Limpieza"},
  {id:"repuestos",icon:"🔩",label:"Repuestos"},
  {id:"stats",icon:"📊",label:"Stats"},
  {id:"guia",icon:"📖",label:"Guía"},
];

const TABS_OPERADOR = [
  {id:"inicio_op",icon:"🏠",label:"Inicio"},
  {id:"chat_op",icon:"💬",label:"Consultar"},
  {id:"limpieza",icon:"🧹",label:"Limpieza"},
  {id:"consejos",icon:"💡",label:"Consejos"},
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const SK = "cem_fallas_v4";
const loadF = () => { try { const d = localStorage.getItem(SK); return d ? JSON.parse(d) : []; } catch { return []; } };
const saveF = (d) => { try { localStorage.setItem(SK, JSON.stringify(d)); } catch {} };

// ─── COMPONENTE TUTORIAL LINKS ────────────────────────────────────────────────
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

// ══════════════════════════════════════════════════════════════════════════════
// CHAT (técnico + operador)
// ══════════════════════════════════════════════════════════════════════════════
const SALUDO_TECNICO = "¡Hola! Soy el asistente técnico del **CEM**.\n\nPuedes escribirme, usar los botones o hablarme con el micrófono. También puedes **adjuntar una imagen** de la falla con el botón 📷 para que la analice.\n\nSiempre indica el **equipo**, **marca** y **referencia** para un diagnóstico preciso.\n\n¿Con qué equipo necesitas ayuda hoy?";
const SALUDO_OPERADOR = "¡Hola! Soy el asistente del **CEM**.\n\nSoy de fácil manejo — escríbeme o usa los botones para decirme qué está pasando con el equipo.\n\nPara problemas complejos o errores en pantalla, avisa a **mantenimiento**. 😊\n\n¿Con qué equipo tienes una inquietud?";

function ChatTab({ onFalla, modo="tecnico" }) {
  const [msgs, setMsgs] = useState([{ role:"bot", text:modo==="tecnico"?SALUDO_TECNICO:SALUDO_OPERADOR }]);
  const [step, setStep] = useState("tipo");
  const [sel, setSel] = useState({ tipo:null, marca:null, ref:null });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [imgData, setImgData] = useState(null); // base64 imagen adjunta
  const registrado = useRef(false);
  const msgsRef = useRef([]);
  const lastBot = useRef("");
  const recRef = useRef(null);
  const endRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { msgsRef.current = msgs; }, [msgs]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const hablar = useCallback((texto) => {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const limpio = texto.replace(/\*\*(.+?)\*\*/g,"$1").replace(/[*#💡🔍📞⛔⚠🎙🔊🔈]/g,"").replace(/\n+/g,". ").trim();
    if (!limpio) return;
    const u = new SpeechSynthesisUtterance(limpio);
    u.lang="es-ES"; u.rate=0.95; u.pitch=0.8;
    const go = () => {
      const vs = speechSynthesis.getVoices();
      const h = vs.find(v=>v.lang.startsWith("es")&&/jorge|diego|carlos/i.test(v.name)) || vs.find(v=>v.lang.startsWith("es"));
      if (h) u.voice = h;
      speechSynthesis.speak(u);
    };
    speechSynthesis.getVoices().length > 0 ? go() : (speechSynthesis.onvoiceschanged = go);
  }, []);

  const toggleMic = useCallback(() => {
    if (listening) { recRef.current?.stop(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { addMsg("bot","⚠️ Tu navegador no soporta micrófono. Usa Chrome."); return; }
    const rec = new SR();
    rec.lang="es-ES"; rec.continuous=false; rec.interimResults=false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e) => { setListening(false); if(e.error==="not-allowed") addMsg("bot","⚠️ Permiso de micrófono denegado."); };
    rec.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
    recRef.current = rec;
    try { rec.start(); } catch { setListening(false); }
  }, [listening]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result.split(",")[1];
      setImgData({ base64:b64, mediaType:file.type, name:file.name });
    };
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
    const esRational = ctx?.marca?.nombre === "Rational";
    const esUnox = ctx?.marca?.nombre === "Unox";
    const esOperador = modo === "operador";

    const systemTecnico = `Eres el asistente técnico del CEM. Responde en español colombiano técnico. Máximo 180 palabras.
Equipo: ${ctx?.tipo?.tipo||"?"} ${ctx?.marca?.nombre||""} ${ctx?.ref||""}
${esRational?"Rational SCC: 23/24=apagar ya; 32/33=cerrar gas+ventilar; 14=sin agua; 25=filtro agua; 29=filtro aire; 31=sonda; 47/48=bomba desagüe; 110/120=llamar técnico.":""}
${esUnox?"Unox: AF01=motor/capacitor; AF02=termostato 320°C; AF03=sonda 110Ω; AF04=comunicación placa; AF23=gas; WF16=agua EL1; WF06=placa caliente; WF41=red.":""}
Si el mensaje incluye una imagen, analiza qué equipo es, qué marca, referencia visible, código de error en pantalla o daño físico visible.
Responde SIEMPRE así:
Equipo detectado: [si hay imagen]
Causa: [1 línea]
Pasos: 1. 2. 3. (máx 5 pasos con valores técnicos si aplica)
Escalar: [cuándo llamar técnico]
Tip: [consejo — si aplica mencionar repuesto con código y precio en pesos colombianos]`;

    const systemOperador = `Eres el asistente de cocina del CEM. Responde en español sencillo para cocineros. Máximo 100 palabras. Sin términos técnicos complejos.
Equipo: ${ctx?.tipo?.tipo||"?"} ${ctx?.marca?.nombre||""} ${ctx?.ref||""}
Si hay imagen, describe qué ves y da un consejo simple.
Reglas: Si el problema parece eléctrico, de gas, o hay errores en pantalla con números → SIEMPRE di "llama a mantenimiento ahora".
Responde así:
¿Qué pasa?: [1 línea simple]
Puedes intentar: [1-2 pasos simples sin riesgo]
Llama a mantenimiento si: [condición clara]`;

    try {
      const prevMsgs = msgsRef.current
        .filter(m => m?.role && typeof m.text === "string" && m.text.trim())
        .slice(-4)
        .map(m => ({ role: m.role==="bot"?"assistant":"user", content: m.text.trim() }));

      let userContent;
      if (imagen) {
        userContent = [
          { type:"image", source:{ type:"base64", media_type:imagen.mediaType, data:imagen.base64 }},
          { type:"text", text: contenido?.trim() || "Analiza este equipo o falla y dime qué ves, qué equipo es, y cuál puede ser el problema." }
        ];
      } else {
        userContent = contenido.trim();
      }

      const messages = [
        ...prevMsgs.slice(-3),
        { role:"user", content:userContent }
      ];

      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:500,
          system: esOperador ? systemOperador : systemTecnico,
          messages,
        }),
      });
      const data = await res.json();
      if (data.error) { addMsg("bot", "⚠️ " + (data.error.message || data.error)); return; }
      const texto = data.content?.map(b=>b.text||"").join("").trim() || "Sin respuesta.";
      addMsg("bot", texto);
      hablar(texto);

      // Buscar tutoriales relevantes
      const tuts = getTutoriales(ctx?.marca?.nombre||"", contenido||"");
      if (tuts.length > 0 && !esOperador) {
        setTimeout(() => addMsg("bot", `📺 **Tutoriales relacionados:**\n${tuts.map(t=>`• [${t.titulo}](${t.url})`).join("\n")}`, { isTutorial:true }), 800);
      }
    } catch(e) {
      addMsg("bot", "⚠️ No se pudo conectar. Verifica tu internet e intenta de nuevo.");
    } finally { setLoading(false); setImgData(null); if(fileRef.current) fileRef.current.value=""; }
  };

  const pickTipo = (eq) => {
    setSel({ tipo:eq, marca:null, ref:null });
    addMsg("user", `${eq.icon} ${eq.tipo}`);
    if (eq.marcas.length===1) { setSel({ tipo:eq, marca:eq.marcas[0], ref:null }); addMsg("bot",`Marca **${eq.marcas[0].nombre}** ✓\n\n¿Cuál es la referencia?`); setStep("ref"); }
    else { addMsg("bot","¿Cuál es la marca?"); setStep("marca"); }
  };
  const pickMarca = (m) => { setSel(s=>({...s,marca:m})); addMsg("user",m.nombre); addMsg("bot","¿Cuál es la referencia?"); setStep("ref"); };
  const pickRef = (r) => { setSel(s=>({...s,ref:r})); addMsg("user",r); addMsg("bot",`**${sel.marca?.nombre||""} ${r}**\n\n¿Cuál es el síntoma?`); setStep("sintoma"); };
  const pickSintoma = (s) => {
    setStep("chat"); addMsg("user",s);
    const ctx = sel;
    if (!registrado.current) { registrado.current=true; onFalla({ equipo:ctx.tipo?.tipo||"Sin especificar", marca:ctx.marca?.nombre||"Sin especificar", ref:ctx.ref||"Sin especificar", sintoma:s }); }
    callIA(s, ctx);
  };
  const sendMsg = async () => {
    if (!input.trim() && !imgData || loading) return;
    const txt = input.trim(); setInput(""); setStep("chat");
    if (imgData && !txt) {
      addMsg("user", `📷 Imagen adjunta: ${imgData.name}`, { hasImg:true });
    } else if (imgData) {
      addMsg("user", `📷 ${txt}`, { hasImg:true });
    } else {
      addMsg("user", txt);
    }
    let ctx = { ...sel };
    if (!sel.tipo || !sel.marca) {
      const ex = extraerPorReglas(txt);
      if (ex.tipo || ex.marca) {
        const tO = EQUIPOS.find(e=>e.tipo===ex.tipo)||(ex.tipo?{tipo:ex.tipo,icon:"🔥"}:null);
        const mO = EQUIPOS.flatMap(e=>e.marcas).find(m=>m.nombre===ex.marca)||(ex.marca?{nombre:ex.marca}:null);
        ctx = { tipo:tO, marca:mO, ref:ex.ref||null }; setSel(ctx);
      }
    }
    if (!registrado.current) { registrado.current=true; onFalla({ equipo:ctx.tipo?.tipo||"Sin especificar", marca:ctx.marca?.nombre||"Sin especificar", ref:ctx.ref||"Sin especificar", sintoma:txt||"[imagen]" }); }
    callIA(txt||"Analiza la imagen adjunta.", ctx, imgData);
  };
  const reset = () => {
    setStep("tipo"); setSel({tipo:null,marca:null,ref:null}); registrado.current=false;
    const ini=[{role:"bot",text:modo==="tecnico"?SALUDO_TECNICO:SALUDO_OPERADOR}]; setMsgs(ini); msgsRef.current=ini;
    setImgData(null);
  };

  const renderText = (t) => {
    if (!t) return null;
    return t.split("\n").filter(Boolean).map((l,i) => {
      const linked = l.replace(/\[(.+?)\]\((https?:\/\/[^\)]+)\)/g, (_,label,url) =>
        `<a href="${url}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">${label}</a>`
      );
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
            {m.role==="bot" && <div style={{fontSize:10,color:C.light,marginBottom:2,fontWeight:600}}>CEM IA</div>}
            <div style={{background:m.role==="bot"?C.white:C.accent,color:m.role==="bot"?C.text:"#fff",padding:"10px 13px",borderRadius:m.role==="bot"?"4px 14px 14px 14px":"14px 4px 14px 14px",fontSize:13,lineHeight:1.65,border:m.role==="bot"?`1px solid ${C.border}`:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
              {m.hasImg && <div style={{fontSize:11,color:m.role==="bot"?C.muted:"rgba(255,255,255,0.8)",marginBottom:4}}>📷 Imagen adjunta</div>}
              {renderText(m.text)}
            </div>
          </div>
        ))}
        {step==="tipo" && (
          <div style={{alignSelf:"flex-start",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {EQUIPOS.map(eq=>(
              <div key={eq.tipo} onClick={()=>pickTipo(eq)} style={{...card({cursor:"pointer",textAlign:"center",padding:"14px 8px"})}}>
                <div style={{fontSize:26,marginBottom:4}}>{eq.icon}</div>
                <div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div>
              </div>
            ))}
          </div>
        )}
        {step==="marca" && sel.tipo && (
          <div style={{alignSelf:"flex-start",display:"flex",flexWrap:"wrap",gap:7}}>
            {sel.tipo.marcas.map(m=><div key={m.nombre} onClick={()=>pickMarca(m)} style={{...card({padding:"7px 13px",cursor:"pointer"}),fontSize:13,fontWeight:600}}>{m.nombre}</div>)}
          </div>
        )}
        {step==="ref" && sel.marca && (
          <div style={{alignSelf:"flex-start",width:"100%"}}>
            <RefCatalog marca={sel.marca} onSelect={pickRef} />
          </div>
        )}
        {step==="sintoma" && (
          <div style={{alignSelf:"flex-start",display:"flex",flexWrap:"wrap",gap:7}}>
            {sintomasActivos.map(s=><div key={s} onClick={()=>pickSintoma(s)} style={{...card({padding:"7px 13px",cursor:"pointer"}),fontSize:12}}>{s}</div>)}
          </div>
        )}
        {loading && <div style={{alignSelf:"flex-start",...card({padding:"10px 14px"}),fontSize:13,color:C.accent}}>Analizando…</div>}
        <div ref={endRef}/>
      </div>
      {/* Preview imagen adjunta */}
      {imgData && (
        <div style={{padding:"5px 13px",borderTop:`1px solid ${C.border}`,background:C.yl,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>📷</span>
          <span style={{fontSize:11,flex:1,color:C.yellow,fontWeight:600}}>{imgData.name}</span>
          <span onClick={()=>{setImgData(null);if(fileRef.current)fileRef.current.value="";}} style={{cursor:"pointer",color:C.red,fontSize:13}}>✕</span>
        </div>
      )}
      {step==="chat" && (
        <div style={{padding:"5px 12px 3px",display:"flex",gap:6}}>
          <div onClick={reset} style={{...card({padding:"5px 11px"}),cursor:"pointer",fontSize:11,color:C.muted}}>🔄 Nueva</div>
          {modo==="tecnico" && <div onClick={()=>{setStep("sintoma");addMsg("bot","¿Cuál es el otro síntoma?");}} style={{...card({padding:"5px 11px"}),cursor:"pointer",fontSize:11,color:C.muted}}>➕ Síntoma</div>}
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
        <button onClick={sendMsg} disabled={loading} style={{...btn("primary"),borderRadius:8,padding:"9px 14px",opacity:loading?0.6:1}}>➤</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PANTALLA DE BIENVENIDA (selección de rol)
// ══════════════════════════════════════════════════════════════════════════════
function WelcomeScreen({ onSelect }) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(135deg,#1e3a5f 0%,#2563eb 50%,#1d4ed8 100%)"}}>
      <div style={{marginBottom:20,position:"relative"}}>
        <LogoCEM size={90}/>
        <div style={{position:"absolute",top:-6,right:-10,background:"#e8432d",color:"#fff",fontSize:13,fontWeight:900,padding:"3px 9px",borderRadius:6,fontFamily:"Impact,sans-serif"}}>IA</div>
      </div>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:24,fontWeight:900,color:"#fff",marginBottom:6}}>CEM IA Assistant</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>Centro de Excelencia de Mantenimiento</div>
      </div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.9)",marginBottom:20,fontWeight:600}}>¿Quién eres hoy?</div>
      <div style={{display:"flex",flexDirection:"column",gap:14,width:"100%",maxWidth:320}}>
        <div onClick={()=>onSelect("tecnico")}
          style={{background:"#fff",borderRadius:16,padding:"20px 22px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
          <div style={{width:52,height:52,background:"#eff6ff",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🔧</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:3}}>Técnico de mantenimiento</div>
            <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>Diagnóstico, códigos de error, repuestos, planes PM, instalación</div>
          </div>
        </div>
        <div onClick={()=>onSelect("operador")}
          style={{background:"rgba(255,255,255,0.15)",borderRadius:16,padding:"20px 22px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,border:"2px solid rgba(255,255,255,0.3)"}}>
          <div style={{width:52,height:52,background:"rgba(255,255,255,0.2)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>👨‍🍳</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:"#fff",marginBottom:3}}>Operador / Cocinero</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",lineHeight:1.5}}>Limpieza, consejos diarios y reporte de fallas simples</div>
          </div>
        </div>
      </div>
      <div style={{marginTop:32,fontSize:10,color:"rgba(255,255,255,0.4)"}}>Rational · Unox · Zanolli · Turbochef · Bunn</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INICIO TÉCNICO
// ══════════════════════════════════════════════════════════════════════════════
function InicioTab({ onNav }) {
  const items = [
    {id:"chat",icon:"🤖",color:C.accent,bg:C.al,titulo:"CEM Bot",desc:"Diagnóstico por texto, voz o imagen."},
    {id:"planes",icon:"📋",color:C.green,bg:C.gl,titulo:"Planes PM",desc:"Tareas preventivas por equipo."},
    {id:"instalacion",icon:"⚡",color:C.purple,bg:C.pl,titulo:"Instalación",desc:"Requisitos eléctricos e hidráulicos."},
    {id:"limpieza",icon:"🧹",color:C.yellow,bg:C.yl,titulo:"Limpieza",desc:"Guías para operadores y técnicos."},
    {id:"repuestos",icon:"🔩",color:"#b45309",bg:"#fffbeb",titulo:"Repuestos",desc:"Precios Unox y Rational Colombia."},
    {id:"stats",icon:"📊",color:"#0891b2",bg:"#ecfeff",titulo:"Estadísticas",desc:"Registro de fallas con filtros."},
    {id:"guia",icon:"📖",color:C.red,bg:C.rl,titulo:"Guía Técnica",desc:"Códigos de error por marca."},
  ];
  return (
    <div style={{padding:20,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{textAlign:"center",marginBottom:22,paddingTop:6}}>
        <div style={{position:"relative",display:"inline-block",marginBottom:12}}>
          <LogoCEM size={80}/>
          <div style={{position:"absolute",top:-6,right:-10,background:"#e8432d",color:"#fff",fontSize:12,fontWeight:900,padding:"3px 8px",borderRadius:6,fontFamily:"Impact,sans-serif"}}>IA</div>
        </div>
        <div style={{fontSize:21,fontWeight:900,marginBottom:5}}>CEM IA Assistant</div>
        <div style={{fontSize:12,color:C.muted,lineHeight:1.6,maxWidth:300,margin:"0 auto"}}>Herramienta del <strong style={{color:C.text}}>Centro de Excelencia de Mantenimiento</strong></div>
        <div style={{display:"inline-block",marginTop:10,background:C.gl,color:C.green,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,border:`1px solid ${C.green}33`}}>🔧 Módulo técnico</div>
      </div>
      {items.map(s=>(
        <div key={s.id} onClick={()=>onNav(s.id)} style={{...card({marginBottom:9,cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px"})}}
          onMouseOver={e=>e.currentTarget.style.borderColor=s.color} onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
          <div style={{width:40,height:40,background:s.bg,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{s.titulo}</div><div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{s.desc}</div></div>
          <div style={{color:C.light,fontSize:15,paddingTop:8}}>›</div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INICIO OPERADOR
// ══════════════════════════════════════════════════════════════════════════════
function InicioOpTab({ onNav }) {
  return (
    <div style={{padding:20,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <LogoCEM size={70}/>
        <div style={{fontSize:20,fontWeight:900,marginTop:10,marginBottom:6}}>Hola 👋</div>
        <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>Este es tu espacio de ayuda para el cuidado de los equipos de cocina.</div>
      </div>
      <div onClick={()=>onNav("chat_op")} style={{...card({marginBottom:14,cursor:"pointer",padding:"18px 16px",background:C.al,border:`1px solid ${C.accent}33`,display:"flex",gap:12,alignItems:"center"})}}>
        <div style={{width:48,height:48,background:C.accent,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💬</div>
        <div>
          <div style={{fontSize:15,fontWeight:800,marginBottom:3}}>¿Hay algo raro con el equipo?</div>
          <div style={{fontSize:12,color:C.muted}}>Cuéntame qué está pasando y te ayudo o te digo a quién llamar.</div>
        </div>
      </div>
      <div onClick={()=>onNav("limpieza")} style={{...card({marginBottom:14,cursor:"pointer",padding:"18px 16px",display:"flex",gap:12,alignItems:"center"})}}>
        <div style={{width:48,height:48,background:C.yl,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🧹</div>
        <div>
          <div style={{fontSize:15,fontWeight:800,marginBottom:3}}>Guías de limpieza</div>
          <div style={{fontSize:12,color:C.muted}}>Paso a paso cómo limpiar hornos, cafeteras y más.</div>
        </div>
      </div>
      <div onClick={()=>onNav("consejos")} style={{...card({marginBottom:14,cursor:"pointer",padding:"18px 16px",display:"flex",gap:12,alignItems:"center"})}}>
        <div style={{width:48,height:48,background:C.gl,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💡</div>
        <div>
          <div style={{fontSize:15,fontWeight:800,marginBottom:3}}>Consejos diarios</div>
          <div style={{fontSize:12,color:C.muted}}>Qué hacer y qué no hacer para cuidar el equipo.</div>
        </div>
      </div>
      <div style={{...card({background:"#fef2f2",border:`1px solid ${C.red}33`,padding:"14px 16px"})}}>
        <div style={{fontSize:12,fontWeight:800,color:C.red,marginBottom:8}}>🚨 Llama a mantenimiento YA si:</div>
        {["Hay humo, llamas o chispas","Hay olor a gas o quemado","Hay agua en el piso del equipo","Aparece un número de error en pantalla"].map((item,i)=>(
          <div key={i} style={{fontSize:12,color:C.text,padding:"3px 0",display:"flex",gap:6}}>
            <span style={{color:C.red}}>•</span> {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CONSEJOS OPERADOR
// ══════════════════════════════════════════════════════════════════════════════
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
          {open===i && (
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

// ══════════════════════════════════════════════════════════════════════════════
// INSTALACIÓN, PLANES, LIMPIEZA, REPUESTOS, STATS, GUÍA (mismo que antes + tutoriales en limpieza)
// ══════════════════════════════════════════════════════════════════════════════
function InstalacionTab() {
  const [sT,setST]=useState(null); const [sM,setSM]=useState(null); const [sR,setSR]=useState(null); const [sec,setSec]=useState("electrico");
  const key=sM&&sR?`${sM.nombre}-${sR}`:null; const datos=key?INSTALACION[key]:null;
  const secs=[{id:"electrico",label:"⚡ Eléctrico"},{id:"agua",label:"💧 Agua"},{id:"dimensiones",label:"📐 Dimensiones"}];
  const campos={electrico:[["Tensión","tension"],["Frecuencia","frecuencia"],["Potencia","potencia"],["Corriente","corriente"],["Fusible","fusible"],["Conexión","conexion"]],agua:[["Presión","presion"],["Caudal","caudal"],["Conexión","conexion"],["Desagüe","desague"],["Temp. entrada","temp"]],dimensiones:[["Ancho","ancho"],["Profundidad","profundidad"],["Altura","altura"],["Peso","peso"],["Capacidad","capacidad"]]};
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:14}}>Datos de Instalación</div>
      {!sT&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>setST(eq)} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
      {sT&&!sM&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sT.icon} {sT.tipo}</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sT.marcas.map(m=><div key={m.nombre} onClick={()=>setSM(m)} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:12,fontWeight:600}}>{m.nombre}</div>)}</div><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setST(null)}>← Volver</div></div>}
      {sT&&sM&&!sR&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div><RefCatalog marca={sM} onSelect={setSR} mostrarOtra={false}/><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div></div>}
      {sR&&<div>
        <div style={{...card({background:C.pl,border:`1px solid ${C.purple}44`,marginBottom:12,padding:"11px 14px"})}}>
          <div style={{fontSize:10,color:C.purple,fontWeight:700,marginBottom:2}}>DATOS DE INSTALACIÓN</div>
          <div style={{fontSize:15,fontWeight:800}}>{sM?.nombre} {sR}</div>
          {!datos&&<div style={{fontSize:11,color:C.yellow,marginTop:3}}>⚠️ Sin datos aún</div>}
        </div>
        {datos&&<>
          <div style={{display:"flex",gap:5,marginBottom:12}}>{secs.map(s=><button key={s.id} onClick={()=>setSec(s.id)} style={{...btn(sec===s.id?"primary":"outline","sm"),flex:1}}>{s.label}</button>)}</div>
          <div style={card()}>
            {(campos[sec]||[]).map(([label,k],i)=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<campos[sec].length-1?`1px solid ${C.border}`:"none"}}>
                <span style={{fontSize:12,color:C.muted}}>{label}</span>
                <span style={{fontSize:12,fontWeight:700,textAlign:"right",maxWidth:"60%"}}>{datos[sec]?.[k]||"—"}</span>
              </div>
            ))}
          </div>
          {datos.notas&&<div style={{marginTop:10,padding:"10px 13px",background:C.yl,borderRadius:8,fontSize:11,color:C.yellow,lineHeight:1.6}}>📝 {datos.notas}</div>}
        </>}
        <div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSR(null)}>← Cambiar referencia</div>
      </div>}
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
  const datos = sT ? (LIMPIEZAS_DATA[sT.tipo]||[]).filter(item => {
    if (!sM) return true;
    const t = item.titulo.toLowerCase();
    if (!sR) return t.includes(sM.nombre.toLowerCase()) || !sT.marcas.some(m => t.includes(m.nombre.toLowerCase()));
    return t.includes(sR.toLowerCase()) || t.includes(sM.nombre.toLowerCase());
  }) : [];
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:14}}>Guías de Limpieza</div>
      {!sT && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>{setST(eq);setSM(null);setSR(null);setOpen(null);}} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
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
              {item.tutoriales && item.tutoriales.length > 0 && <TutorialLinks tutoriales={item.tutoriales}/>}
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
    ? repBase.filter(r=>{
        const q=search.toLowerCase();
        return r.cod.toLowerCase().includes(q)||r.desc.toLowerCase().split(" ").some(w=>w.length>3&&q.includes(w))||q.split(" ").some(w=>w.length>3&&r.desc.toLowerCase().includes(w));
      }).slice(0,12)
    : [];
  const grupos = [
    {label:"🚪 Burletes y juntas", items:repBase.filter(r=>/goma|burlete|junta puerta/i.test(r.desc)).slice(0,6)},
    {label:"🔧 Motores y turbinas", items:repBase.filter(r=>/motor|turbina|ventilador/i.test(r.desc)||r.cod.startsWith("KMT")||r.cod.startsWith("KVN")).slice(0,5)},
    {label:"⚡ Tarjetas y electrónica", items:repBase.filter(r=>/panel de control|tarjeta|control táctil/i.test(r.desc)||r.cod.startsWith("KPE")).slice(0,5)},
    {label:"🌡️ Sondas y termostatos", items:repBase.filter(r=>/sonda|termostato/i.test(r.desc)||r.cod.startsWith("KTR")||r.cod.startsWith("KSN")).slice(0,5)},
    {label:"💧 Válvulas y lavado", items:repBase.filter(r=>/válvula|electroválvula|limpieza|cleanjet|manguera/i.test(r.desc)||r.cod.startsWith("KVL")||r.cod.startsWith("KEL")).slice(0,5)},
    {label:"🔥 Resistencias", items:repBase.filter(r=>/resistencia|calefactor/i.test(r.desc)||r.cod.startsWith("KRS")).slice(0,5)},
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
      {!sT && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>{setST(eq);setSM(null);setSR(null);setSearch("");}} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
      {sT&&!sM&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sT.icon} {sT.tipo}</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sT.marcas.map(m=><div key={m.nombre} onClick={()=>{setSM(m);setSR(null);setSearch("");}} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:12,fontWeight:600}}>{m.nombre}</div>)}</div><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setST(null)}>← Volver</div></div>}
      {sT&&sM&&!sR&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div><RefCatalog marca={sM} onSelect={(r)=>{setSR(r);setSearch("");}} mostrarOtra={false}/><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div></div>}
      {sT&&sM&&sR&&<div>
        <div style={{...card({background:"#f8faff",border:`1px solid ${C.accent}33`,marginBottom:12,padding:"11px 14px"})}}>
          <div style={{fontSize:10,color:C.accent,fontWeight:700,marginBottom:2}}>REPUESTOS</div>
          <div style={{fontSize:15,fontWeight:800}}>{sM.nombre} {sR}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:2}}>Precios COP sin IVA · {sM.nombre==="Unox"?"Mar 2026":"Apr 2025"}</div>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Buscar repuesto ${sM.nombre}…`}
          style={{width:"100%",padding:"10px 13px",borderRadius:9,border:`1px solid ${C.border}`,fontSize:13,fontFamily:"inherit",color:C.text,background:C.bg,outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
        {search.trim().length>1 && (
          <div>
            {resultados.length===0&&<div style={{...card({textAlign:"center",padding:20,color:C.muted})}}>Sin resultados para "{search}"</div>}
            {resultados.map(r=><ItemCard key={r.cod} r={r}/>)}
          </div>
        )}
        {!search.trim() && grupos.map(g=>(
          <div key={g.label} style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>{g.label}</div>
            {g.items.map(r=><ItemCard key={r.cod} r={r}/>)}
          </div>
        ))}
        {!search.trim() && grupos.length===0 && <div style={{...card({textAlign:"center",padding:28,color:C.muted})}}>Próximamente repuestos para {sM.nombre} {sR}.</div>}
        <div style={{textAlign:"center",padding:"10px 0",fontSize:10,color:C.light,borderTop:`1px solid ${C.border}`,marginTop:8}}>
          +19% IVA no incluido · {sM.nombre==="Unox"?"info.co@unox.com":"service@rational-online.co"}
        </div>
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
  const [filtro,setFiltro]=useState("todo");
  const [vista,setVista]=useState("graficas");
  const [adminMode,setAdminMode]=useState(false);
  const [pinInput,setPinInput]=useState("");
  const [pinError,setPinError]=useState(false);
  const [showPin,setShowPin]=useState(false);
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
  const colores=["#2563eb","#16a34a","#d97706","#dc2626","#7c3aed","#0891b2","#9ca3af","#6b7280"];
  const colorFn=i=>colores[i%colores.length];
  const toggleSel=idx=>{const s=new Set(seleccionados);s.has(idx)?s.delete(idx):s.add(idx);setSeleccionados(s);};
  const borrarSeleccionados=()=>{
    if(seleccionados.size===0)return;
    if(!window.confirm(`¿Borrar ${seleccionados.size} registro(s)?`))return;
    const registrosABorrar=new Set([...seleccionados].map(i=>[...datos].reverse()[i]));
    const nuevasFallas=fallas.filter(f=>!registrosABorrar.has(f));
    onBorrar(nuevasFallas); setSeleccionados(new Set());
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
      <div style={{display:"flex",gap:5,marginBottom:12}}>
        {FILTROS.map(f=><button key={f.id} onClick={()=>setFiltro(f.id)} style={{...btn(filtro===f.id?"primary":"outline","sm")}}>{f.label}</button>)}
        <div style={{marginLeft:"auto",background:C.al,color:C.accent,fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,display:"flex",alignItems:"center"}}>{datos.length} reg.</div>
      </div>
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
              <div style={{fontSize:9,color:C.light,flexShrink:0,textAlign:"right"}}>{f.fecha?new Date(f.fecha).toLocaleDateString("es-CO",{day:"2-digit",month:"short"}):""}
              </div>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function GuiaTab() {
  const [marca, setMarca] = useState("rational");
  const [open, setOpen] = useState(null);
  const errores = marca === "rational" ? ERRORES_RATIONAL : ERRORES_UNOX;
  return (
    <div style={{padding:14,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:12}}>Guía Técnica</div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <button onClick={()=>{setMarca("rational");setOpen(null);}} style={{...btn(marca==="rational"?"primary":"outline","sm")}}>Rational SCC</button>
        <button onClick={()=>{setMarca("unox");setOpen(null);}} style={{...btn(marca==="unox"?"primary":"outline","sm")}}>Unox ChefTop</button>
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
  const [rol, setRol] = useState(null); // null = pantalla bienvenida
  const [tab, setTab] = useState("inicio");
  const [fallas, setFallas] = useState([]);

  useEffect(() => { setFallas(loadF()); }, []);

  const seleccionarRol = (r) => {
    setRol(r);
    setTab(r === "tecnico" ? "inicio" : "inicio_op");
  };

  const registrar = (f) => {
    const n = { ...f, fecha: new Date().toISOString() };
    const a = [...fallas, n];
    setFallas(a);
    saveF(a);
  };

  if (!rol) return <WelcomeScreen onSelect={seleccionarRol}/>;

  const TABS = rol === "tecnico" ? TABS_TECNICO : TABS_OPERADOR;

  return (
    <>
      <Head>
        <title>CEM IA Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <meta name="theme-color" content="#2563eb"/>
      </Head>
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",color:C.text,maxWidth:520,margin:"0 auto"}}>
        {/* Header */}
        <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:9,position:"sticky",top:0,zIndex:100}}>
          <div style={{position:"relative",flexShrink:0}}>
            <LogoCEM size={42}/>
            <div style={{position:"absolute",top:-4,right:-7,background:"#e8432d",color:"#fff",fontSize:9,fontWeight:900,padding:"2px 5px",borderRadius:4,fontFamily:"Impact,sans-serif"}}>IA</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:800}}>CEM IA Assistant</div>
            <div style={{fontSize:9,color:C.muted}}>Centro de Excelencia de Mantenimiento</div>
          </div>
          {/* Badge de rol */}
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{background:rol==="tecnico"?C.al:C.gl,color:rol==="tecnico"?C.accent:C.green,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,border:`1px solid ${rol==="tecnico"?C.accent:C.green}33`}}>
              {rol==="tecnico"?"🔧 Técnico":"👨‍🍳 Operador"}
            </div>
            <div onClick={()=>{setRol(null);}} style={{cursor:"pointer",color:C.light,fontSize:11}} title="Cambiar rol">⇄</div>
          </div>
        </div>

        {tab==="inicio"      && <InicioTab onNav={setTab}/>}
        {tab==="inicio_op"   && <InicioOpTab onNav={setTab}/>}
        {tab==="chat"        && <ChatTab onFalla={registrar} modo="tecnico"/>}
        {tab==="chat_op"     && <ChatTab onFalla={registrar} modo="operador"/>}
        {tab==="instalacion" && <InstalacionTab/>}
        {tab==="planes"      && <PlanesTab/>}
        {tab==="limpieza"    && <LimpiezaTab/>}
        {tab==="repuestos"   && <RepuestosTab/>}
        {tab==="stats"       && <StatsTab fallas={fallas} onBorrar={f=>{setFallas(f);saveF(f);}}/>}
        {tab==="guia"        && <GuiaTab/>}
        {tab==="consejos"    && <ConsejosTab/>}

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
