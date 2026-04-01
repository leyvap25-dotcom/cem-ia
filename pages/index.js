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

const EQUIPOS = [
  { tipo:"Horno", icon:"🔥", marcas:[
    { nombre:"Rational", refs:["SCC WE 6×1/1 GN","SCC WE 10×1/1 GN","SCC WE 20×1/1 GN","SCC XS"] },
    { nombre:"Unox", refs:["XEVC-0523-E1R","XEVC-1011-EPR","ChefTop","BakerTop","Arianna (XEFR-04HS)","Stefania (XEFR-03HS)","Elena (XEFR-03EU)","Rossella (XEFR-04EU)","Vittoria (XEFR-06EU)","Camilla (XEFR-10EU)"] },
    { nombre:"Zanolli", refs:["Synthesis 5/50","Synthesis 8/75","Teorema","Pizza Express"] },
    { nombre:"Turbochef", refs:["HHC2020","HHC2620","Sota","Fire"] },
  ]},
  { tipo:"Cafetera", icon:"☕", marcas:[{ nombre:"Bunn", refs:["VPR","AXIOM","Infusion Series","TF DBC"] }]},
  { tipo:"Granizadora", icon:"🧊", marcas:[{ nombre:"Bunn", refs:["ULTRA-2","ULTRA-1","FMD"] }]},
  { tipo:"Nevera / Congelador", icon:"❄️", marcas:[{ nombre:"General", refs:["Refrigerador vertical","Congelador horizontal","Vitrina fría"] }]},
];

const SINTOMAS = {
  Horno:["Código de error en pantalla","No genera vapor","No enciende","Gotea por la puerta","Ruidos extraños","Error durante la limpieza","Autolavado no funciona","Autolavado se interrumpe","No cierra el ciclo de lavado","Sobrecalentamiento","Sonda térmica","No alcanza temperatura","Quema los alimentos","Puerta no cierra bien","Burlete dañado o despegado","Ventilador no gira","Pantalla en blanco","Olor a quemado","Temperatura irregular","No enciende quemador (gas)","Falla eléctrica","CareControl en rojo","Pequeñas explosiones o detonaciones","Goteras en la parte inferior","Fuga de agua por la base","Humo dentro de la cámara","Cristal de puerta sucio o roto","Filtro de aire sucio","Luz de la cabina no funciona","Precalentamiento muy lento","Equipo se apaga solo"],
  Cafetera:["No calienta el agua","No extrae café","Gotea","No enciende","Error en pantalla","Poca presión"],
  Granizadora:["No enfría","No mezcla","Gotea","No enciende","Ruido extraño","Producto muy líquido","Producto muy sólido"],
  "Nevera / Congelador":["No enfría","Ruido extraño","Gotea agua","Escarcha excesiva","No enciende","Temperatura inestable"],
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

const LIMPIEZAS_DATA = {
  Horno:[
    // ── RATIONAL ──────────────────────────────────────────────────────────────
    {titulo:"Rational SCC/iCombi — Limpieza diaria (operador)",alerta:"⚠️ Usar guantes y delantal. NO limpiar con el horno caliente por encima de 75°C.",pasos:[
      "Al finalizar la jornada, retirar TODAS las bandejas, parrillas y contenedores de la cámara.",
      "Seleccionar el ciclo de limpieza CleanJet+Care desde el panel. Elegir nivel según suciedad: Nivel 1-2 para suciedad ligera, Nivel 3-4 para suciedad media, Nivel 5-6 para suciedad fuerte.",
      "iCombi Pro: colocar pastilla verde (detergente) en el tamiz del piso. Colocar pastillas azules CareControl en el cajón CareControl.",
      "SCC: colocar pastilla roja/plateada en el canasto del bafle. Colocar pastillas CareControl en el cajón.",
      "Cerrar bien la puerta y pulsar Inicio. NO abrir durante el ciclo.",
      "Al terminar: limpiar la bandeja recogegotas de la puerta con 1-2 litros de agua tibia.",
      "Dejar la puerta entreabierta al final del día para ventilar y evitar malos olores.",
      "⚠️ Si no se limpia a diario el residuo de grasa puede generar humo, mal sabor en alimentos y riesgo de incendio.",
    ]},
    {titulo:"Rational SCC/iCombi — Productos permitidos y prohibidos",alerta:"⚠️ Usar productos incorrectos daña el acero inox, el cristal y los burletes — puede anular la garantía.",pasos:[
      "✅ SÍ usar: pastillas CleanJet originales Rational (verde iCombi / roja SCC), pastillas CareControl originales, agua tibia con paño suave para exteriores.",
      "✅ SÍ usar: esponja suave o paño de microfibra para limpiar la puerta, el burlete y el panel de control.",
      "❌ NUNCA usar: limpiadores con cloro o lejía — corroen el acero inox.",
      "❌ NUNCA usar: productos con vinagre o ácidos — atacan el burlete de silicona.",
      "❌ NUNCA usar: estropajos metálicos, virutas de acero, esponjas abrasivas — raspan y dañan el interior.",
      "❌ NUNCA usar: desengrasantes industriales no aprobados Rational — pueden dejar residuos tóxicos en la cámara.",
      "❌ NUNCA usar: manguera de agua a presión para limpiar el interior o el panel eléctrico.",
      "❌ NUNCA limpiar el cristal de la puerta con químicos — disuelven los flejes de sujeción del vidrio.",
    ]},
    {titulo:"Rational SCC/iCombi — Cuidado del burlete y cristal (operador)",alerta:"⚠️ Un burlete dañado genera pérdida de vapor, mayor consumo y posibles fallas.",pasos:[
      "Después de cada carga: limpiar el burlete con un paño húmedo suave, por dentro y por fuera.",
      "Revisar visualmente que el burlete no tenga grietas, rasgaduras ni partes despegadas.",
      "Si el burlete tiene daños visibles, reportar al técnico de mantenimiento — NO continuar usando el horno si la puerta no sella bien.",
      "Cristal exterior: limpiar solo con paño húmedo. Nunca usar químicos.",
      "Cristal interior: abrir soltando los 2 clips de muelle (superior e inferior). Limpiar solo con paño suave y agua. Dejar enfriar antes de tocar.",
      "Evitar golpear la puerta al cerrarla — el impacto repetido deteriora el burlete y las bisagras.",
      "No colgar trapos ni utensilios en la manija de la puerta.",
    ]},
    {titulo:"Rational SCC/iCombi — Limpieza exterior y panel (operador)",alerta:"",pasos:[
      "Apagar el equipo y esperar que se enfríe antes de limpiar el exterior.",
      "Limpiar el acero inoxidable con paño húmedo siguiendo la dirección del pulido (horizontal) — nunca en círculos.",
      "Para manchas difíciles en acero inox: usar unas gotas de aceite mineral o limpiador específico para inox, aplicar con paño suave.",
      "Panel de control táctil: limpiar solo con paño ligeramente húmedo. No aplicar líquidos directamente.",
      "Limpiar la bandeja recogegotas debajo de la puerta diariamente — acumula grasa y agua.",
      "Limpiar la zona de desagüe del piso de la cámara: retirar el tamiz, enjuagar bajo el grifo y devolver.",
      "❌ No usar spray de agua o limpiador directamente sobre el panel de control o zonas eléctricas.",
    ]},
    // ── UNOX ──────────────────────────────────────────────────────────────────
    {titulo:"Unox ChefTop/BakerTop — Limpieza diaria (operador)",alerta:"⚠️ Retirar TODAS las bandejas antes del ciclo. No iniciar la limpieza con el horno lleno.",pasos:[
      "Al finalizar la jornada, retirar TODAS las bandejas y rejillas de la cámara.",
      "Verificar que el grifo de agua esté abierto.",
      "Verificar que el tanque de detergente Det&Rinse esté lleno y bien instalado.",
      "Seleccionar el ciclo de lavado desde el panel. Pulsar Inicio.",
      "NO abrir la puerta durante el ciclo de lavado.",
      "Al terminar: revisar que no queden residuos de producto en la cámara.",
      "Dejar la puerta entreabierta al final del día para ventilar.",
      "Limpiar la junta de puerta visualmente — si hay residuos, limpiar con paño húmedo.",
    ]},
    {titulo:"Unox ChefTop/BakerTop — Productos permitidos y prohibidos",alerta:"⚠️ El uso de productos no aprobados puede dañar los componentes y anular la garantía Unox.",pasos:[
      "✅ SÍ usar: detergente líquido Det&Rinse Unox original en el tanque del equipo.",
      "✅ SÍ usar: paño de microfibra húmedo para exteriores, burlete y panel.",
      "✅ SÍ usar: agua tibia para enjuagar manualmente el interior si queda residuo.",
      "❌ NUNCA usar: lejía, cloro ni productos clorados — corroen el acero inox de la cámara.",
      "❌ NUNCA usar: vinagre ni productos ácidos — dañan los burletes de silicona.",
      "❌ NUNCA usar: estropajos abrasivos ni lana de acero — raspan y dejan marcas permanentes.",
      "❌ NUNCA usar: sprays desengrasantes de cocina directamente en la cámara — dejan residuos que contaminan alimentos.",
      "❌ NUNCA limpiar con manguera a presión — el agua puede entrar a componentes eléctricos.",
      "❌ NUNCA rellenar el tanque de Det&Rinse con detergente de otra marca sin aprobación Unox.",
    ]},
    {titulo:"Unox ChefTop/BakerTop — Cuidado del burlete (operador)",alerta:"⚠️ El burlete del ChefTop/BakerTop NO tiene orificios — es totalmente sellado.",pasos:[
      "Revisar el burlete visualmente al inicio y al final de cada jornada.",
      "Limpiar con paño húmedo suave — nunca con productos químicos.",
      "Verificar que el burlete esté completamente encajado en la ranura todo el contorno.",
      "Si el burlete tiene grietas, está despegado o la puerta no cierra bien: reportar al técnico de mantenimiento.",
      "No jalar el burlete innecesariamente — se puede salir de la ranura.",
      "Evitar golpear la puerta. Cerrar siempre con suavidad.",
    ]},
    {titulo:"Unox Arianna — Limpieza diaria (operador)",alerta:"⚠️ Recuerda que la puerta de la Arianna cierra hacia ARRIBA, no hacia los lados.",pasos:[
      "Al finalizar la jornada, retirar todas las bandejas y el cajón de grasas.",
      "Limpiar el cajón recogegotas: retirarlo, vaciarlo y lavarlo con agua y jabón suave.",
      "Limpiar el interior de la cámara con paño húmedo mientras aún está tibio (no caliente).",
      "Limpiar el burlete con paño húmedo — tiene DOS ORIFICIOS en la parte superior, que no se deben tapar.",
      "Limpiar el cristal exterior e interior con paño húmedo. No usar químicos.",
      "Limpiar el exterior (acero inox) con paño húmedo siguiendo el pulido horizontal.",
      "Verificar que la puerta cierre correctamente al terminar.",
    ]},
    // ── ZANOLLI / TURBOCHEF ──────────────────────────────────────────────────
    {titulo:"Zanolli / Turbochef — Limpieza diaria (operador)",alerta:"⚠️ Apagar el horno y esperar al menos 30 min antes de limpiar.",pasos:[
      "Apagar el horno completamente y esperar a que se enfríe.",
      "Retirar la piedra refractaria (Zanolli) o la bandeja (Turbochef) con cuidado — pueden estar calientes.",
      "Zanolli: limpiar la piedra en seco con rasqueta o cepillo de cerdas metálicas. Nunca sumergir en agua ni lavar con jabón — la piedra absorbe agua y puede romperse al calentarse.",
      "Turbochef: limpiar el interior con el kit de limpieza propio del equipo o paño húmedo.",
      "Limpiar el exterior con paño húmedo y jabón suave.",
      "Limpiar la mirilla o cristal con paño húmedo. No usar abrasivos.",
      "Verificar que la banda transportadora (si aplica) esté libre de residuos.",
    ]},
    {titulo:"Zanolli / Turbochef — Productos permitidos y prohibidos",alerta:"",pasos:[
      "✅ SÍ usar: rasqueta de metal (sin filo) para la piedra refractaria cuando está fría.",
      "✅ SÍ usar: paño húmedo con agua tibia para exteriores e interior metálico.",
      "✅ SÍ usar: jabón neutro suave en superficies externas de acero.",
      "❌ NUNCA lavar la piedra refractaria con agua ni jabón — absorbe humedad y se rompe.",
      "❌ NUNCA usar lejía ni cloro en ninguna parte del horno.",
      "❌ NUNCA usar limpiadores en aerosol dentro de la cámara de cocción.",
      "❌ NUNCA introducir objetos metálicos en la zona de la resistencia.",
    ]},
  ],
  Cafetera:[
    {titulo:"Cafetera Bunn — Limpieza diaria (operador)",alerta:"⚠️ No sumergir ninguna pieza eléctrica en agua.",pasos:[
      "Al finalizar la jornada, retirar la canasta de filtro y lavarla con agua y jabón suave. Enjuagar bien.",
      "Limpiar el cabezal de distribución con cepillo suave para retirar residuos de café.",
      "Lavar el jarro o recipiente de café con agua y jabón suave. Enjuagar.",
      "Limpiar el exterior de la cafetera con paño húmedo.",
      "No dejar café viejo en la jarra — la acidez mancha y genera malos olores.",
      "Revisar que el grifo y la boquilla de salida estén libres de obstrucciones.",
    ]},
    {titulo:"Cafetera Bunn — Descalcificación mensual (operador con supervisión)",alerta:"⚠️ Usar solo descalcificante aprobado para cafeteras. Nunca vinagre puro.",pasos:[
      "Vaciar el depósito de agua.",
      "Preparar solución de descalcificante según instrucciones del fabricante.",
      "Pasar la solución por el ciclo de la cafetera.",
      "Pasar 2-3 ciclos de agua limpia para enjuagar completamente.",
      "Si persiste sabor a descalcificante, pasar un ciclo más de agua.",
      "Registrar la fecha de descalcificación.",
    ]},
    {titulo:"Cafetera Bunn — Productos permitidos y prohibidos",alerta:"",pasos:[
      "✅ SÍ usar: agua y jabón neutro para lavar partes desmontables.",
      "✅ SÍ usar: descalcificante líquido para cafeteras (aprobado).",
      "✅ SÍ usar: cepillo suave de silicona para el cabezal.",
      "❌ NUNCA usar lejía ni desinfectantes clorados — el residuo contamina el café.",
      "❌ NUNCA usar estropajos abrasivos en el jarro de vidrio — lo raya y puede romperse.",
      "❌ NUNCA verter agua directamente sobre componentes eléctricos.",
    ]},
  ],
  Granizadora:[
    {titulo:"Granizadora Bunn — Limpieza diaria (operador)",alerta:"⚠️ Apagar y desconectar de la corriente antes de limpiar. No mojar el compresor.",pasos:[
      "Al finalizar la jornada, vaciar el producto del tambor.",
      "Retirar el tambor y la paleta mezcladora (si son desmontables).",
      "Lavar el tambor con agua tibia y jabón neutro. Enjuagar muy bien — el residuo de jabón afecta el sabor.",
      "Limpiar el interior del gabinete con paño húmedo. No mojar el compresor ni zonas eléctricas.",
      "Limpiar las rejillas laterales o traseras del condensador con paño seco o pincel suave.",
      "Secar bien todas las piezas antes de remontar.",
      "Dejar la tapa abierta si el equipo quedará apagado por largo tiempo.",
    ]},
    {titulo:"Granizadora Bunn — Productos permitidos y prohibidos",alerta:"",pasos:[
      "✅ SÍ usar: agua tibia y jabón neutro sin fragancia para lavar el tambor.",
      "✅ SÍ usar: paño seco para limpiar el condensador y rejillas.",
      "❌ NUNCA usar lejía — el residuo contamina el producto.",
      "❌ NUNCA mojar el compresor ni las zonas eléctricas.",
      "❌ NUNCA raspar el interior del tambor con objetos metálicos.",
      "❌ NUNCA usar el tambor sin enjuagar completamente el jabón.",
    ]},
  ],
  "Nevera / Congelador":[
    {titulo:"Nevera/Congelador — Limpieza semanal (operador)",alerta:"⚠️ No raspar el hielo con objetos metálicos — daña el evaporador.",pasos:[
      "Retirar todos los productos y guardar en zona fría temporal.",
      "Apagar el equipo o usar modo de descongelación.",
      "Esperar a que el hielo se derrita naturalmente. Si hay mucho hielo, colocar recipiente con agua caliente dentro (sin que toque el evaporador).",
      "Limpiar el interior con paño húmedo y solución de bicarbonato (1 cucharada por litro de agua) — neutraliza olores.",
      "Enjuagar con agua limpia y secar con paño seco.",
      "Limpiar las juntas de la puerta con paño húmedo — revisar que no estén rotas ni deformadas.",
      "Limpiar las rejillas del condensador (parte trasera o inferior) con pincel suave o aspiradora.",
      "Devolver los productos y encender el equipo.",
    ]},
    {titulo:"Nevera/Congelador — Productos permitidos y prohibidos",alerta:"",pasos:[
      "✅ SÍ usar: solución de bicarbonato y agua para el interior.",
      "✅ SÍ usar: agua tibia con jabón neutro para estantes y cajones desmontables.",
      "✅ SÍ usar: paño seco para limpiar el condensador.",
      "❌ NUNCA usar lejía ni desinfectantes con cloro en el interior — el residuo contamina alimentos.",
      "❌ NUNCA raspar el hielo con cuchillos ni objetos metálicos — perfora el evaporador.",
      "❌ NUNCA usar agua caliente directamente sobre el evaporador.",
      "❌ NUNCA dejar la puerta abierta innecesariamente — genera acumulación de hielo.",
    ]},
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
  {code:"Service 25 / Servicio 25",nivel:"FRECUENTE",desc:"CleanJet sin agua — iCareSystem no recibe la cantidad necesaria.",pasos:["Verificar grifo de agua abierto completamente.","Limpiar filtro de acometida de agua.","Verificar presión dinámica: mín. 1.5 bar.","Verificar conductividad mínima del agua: 50 µS (dureza mín. 5°dH)."]},
  {code:"Service 10/11/12",nivel:"MODERADO",desc:"Falla en generador de vapor fresco. El equipo puede seguir cocinando.",pasos:["Presionar Flecha para continuar.","Verificar suministro de agua.","Programar visita de servicio.","Service 13: solo modo aire caliente disponible."]},
  {code:"Service 20.1 / 20.8",nivel:"CRÍTICO",desc:"Falla sensor de temperatura — no es posible cocinar.",pasos:["Apagar el equipo.","Verificar conexiones de sonda térmica.","Llamar técnico Rational certificado."]},
  {code:"Service 28.1 / 28.2 / 28.4",nivel:"CRÍTICO",desc:"Se sobrepasó límite de temperatura del generador de vapor o cámara.",pasos:["Apagar inmediatamente.","Dejar enfriar mínimo 30 minutos.","Verificar que el filtro de aire no esté obstruido.","Llamar técnico si persiste."]},
  {code:"Service 29",nivel:"FRECUENTE",desc:"Temperatura de la placa demasiado elevada — filtro de aire sucio.",pasos:["Apagar y limpiar filtro de aire.","Revisar ventilación del local.","Verificar que haya espacio mínimo de 400mm entre escape y campana."]},
  {code:"Service 31.1 / 31.2",nivel:"COMÚN",desc:"Falla sonda térmica en cámara de cocción. Se puede cocinar pero no usar la sonda.",pasos:["Verificar inserción de la sonda.","Inspeccionar cable y conector.","Programar reemplazo con técnico."]},
  {code:"Service 34.x",nivel:"MODERADO",desc:"Falla comunicación de datos interna.",pasos:["Apagar y encender nuevamente.","Si persiste llamar técnico Rational."]},
  {code:"Service 41",nivel:"MODERADO",desc:"Boquilla o tubo de humidificación calcificados — función Humidificar no disponible.",pasos:["Descalcificar la boquilla de humidificación.","Verificar calidad del agua — conductividad mín. 50 µS.","Programar mantenimiento."]},
  {code:"Service 47/48",nivel:"MODERADO",desc:"Falla bomba de desagüe o circulación.",pasos:["Verificar que el desagüe no esté atascado.","Limpiar sifón/P-trap trasero.","Verificar pendiente mínima del tubo de desagüe.","Llamar técnico si persiste."]},
  {code:"Service 110/120",nivel:"CRÍTICO",desc:"Error en bomba SC o detección de agua durante limpieza automática. No es posible cocinar.",pasos:["Cancelar la limpieza en curso.","Verificar suministro de agua.","Llamar técnico Rational."]},
  {code:"Service 27 (gas) — RESET permanente",nivel:"PELIGRO",desc:"Alimentación de gas cortada o presión insuficiente.",pasos:["Abrir llave del gas completamente.","Verificar presión: Gas Natural 18–25 mbar, Gas Propano 25–57 mbar.","Si presión correcta y persiste: llamar técnico."]},
  {code:"Precalentamiento lento o no termina",nivel:"FRECUENTE",desc:"Posible falla en una de las fases eléctricas.",pasos:["Verificar que las 3 fases del suministro eléctrico lleguen al equipo.","Revisar la conexión trifásica en el enchufe/caja de paso.","Si el voltaje es correcto y persiste: llamar técnico Rational."]},
  {code:"Falta de agua (icono grifo tachado)",nivel:"FRECUENTE",desc:"Sin suministro de agua o presión insuficiente.",pasos:["Verificar que el grifo esté abierto.","Verificar presión: 1.5–3 bar recomendado.","Revisar filtros de agua.","Verificar conductividad mín. 50 µS."]},
  {code:"No enciende (pantalla oscura)",nivel:"MODERADO",desc:"Sin energía eléctrica o protección disparada.",pasos:["Verificar que no se haya disparado el breaker o fusible del tablero.","Verificar que el interruptor del equipo esté en posición I (encendido).","Llamar técnico Rational si persiste."]},
];
const NIVEL_C = {CRÍTICO:"red",PELIGRO:"red",LIMITADO:"blue",FRECUENTE:"yellow",SIMPLE:"green",COMÚN:"blue",MODERADO:"blue"};

// ─── CATÁLOGO DE REPUESTOS CON PRECIOS (Unox Colombia - Cotización 2256431, Mar 2026) ─────
const REPUESTOS = [
  // Cotización directa Terpel
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
  {cod:"KVE1115A",desc:"Minicontactor cuadripolar 20A 230V",precio:247500,marca:"Unox"},
  {cod:"KVN1171A",desc:"Turbina D195 H60 8 paletas tuerca M8",precio:765000,marca:"Unox"},
  {cod:"KPE2037A",desc:"Tarjeta potencia MIND.Maps ONE",precio:2160000,marca:"Unox"},
  {cod:"KVT1303C",desc:"Cristal interno XECC-0513/0523 doble vidrio",precio:1485000,marca:"Unox"},
  {cod:"KMG1099A",desc:"Manilla completa MIND.Maps -M",precio:301500,marca:"Unox"},
  {cod:"KSB1016A",desc:"Tanque detergente 3L",precio:675000,marca:"Unox"},
  {cod:"KVN1165A",desc:"Turbina refrigeración 230V MM/S.5E ADV",precio:450000,marca:"Unox"},
  {cod:"KEL1140A",desc:"Electroválvula 1 vía",precio:180000,marca:"Unox"},
  {cod:"KVL1211A",desc:"Sistema lavado Compact ONE Y0523-EP",precio:1260000,marca:"Unox"},
  {cod:"KPE1059A",desc:"Soporte USB-Reset MIND.Maps",precio:382500,marca:"Unox"},
  {cod:"KRS1150A",desc:"Resistencia 4.9kW RS1090A",precio:990000,marca:"Unox"},
  {cod:"KVL0022A",desc:"Filtro detergente con VNR VL1102",precio:135000,marca:"Unox"},
  {cod:"KGN1656A",desc:"Goma puerta XECC-0513/0523",precio:256500,marca:"Unox"},
  {cod:"KSN1031A",desc:"Sonda al corazón monopunto L2000",precio:1080000,marca:"Unox"},
  // Repuestos clave adicionales del catálogo
  {cod:"KVN1025A",desc:"Turbina D196 H61 serie 3/4/Miss/Micro",precio:765000,marca:"Unox"},
  {cod:"KVN1030A",desc:"Turbina LUX ≤08.2017 / S.5 / S.5E D196",precio:1035000,marca:"Unox"},
  {cod:"KVN1035B",desc:"Motor LineMiss / LineMicro",precio:1035000,marca:"Unox"},
  {cod:"KVN1130A",desc:"Motor LUX / L.Miss / S.5 / 5E",precio:1440000,marca:"Unox"},
  {cod:"KVN1134A",desc:"Motor 330W 120V 50/60Hz",precio:1710000,marca:"Unox"},
  {cod:"KPE2038A",desc:"Tarjeta potencia MIND.Maps Plus eléctrico",precio:2700000,marca:"Unox"},
  {cod:"KPE2021C",desc:"Tarjeta potencia MIND.Maps Gas EU",precio:2722500,marca:"Unox"},
  {cod:"KRS1267A",desc:"Resistencia circular 10.5kW 230V 6 espiras",precio:1440000,marca:"Unox"},
  {cod:"KRS1180A",desc:"Resistencia 9kW 230V",precio:1350000,marca:"Unox"},
  {cod:"KRS1090A",desc:"Resistencia 2900W 230V",precio:630000,marca:"Unox"},
  {cod:"KRS1034A",desc:"Resistencia frenada 147W MM",precio:427500,marca:"Unox"},
  {cod:"KRS1036A",desc:"Resistencia frenada 100W MM Gas",precio:382500,marca:"Unox"},
  {cod:"KTR1106B",desc:"Sonda temperatura L2000 MIND.Maps",precio:540000,marca:"Unox"},
  {cod:"KTR1105A",desc:"Sonda temperatura PT100 L1000",precio:540000,marca:"Unox"},
  {cod:"KSN1000A",desc:"Sonda al corazón multipunto L1550",precio:1755000,marca:"Unox"},
  {cod:"KSN1002A",desc:"Sonda al corazón multipunto L2050",precio:1845000,marca:"Unox"},
  {cod:"KGN1629A",desc:"Goma puerta 0511",precio:382500,marca:"Unox"},
  {cod:"KGN1630A",desc:"Goma puerta 0711",precio:360000,marca:"Unox"},
  {cod:"KGN1631A",desc:"Goma puerta 1011",precio:405000,marca:"Unox"},
  {cod:"KGN1628A",desc:"Goma puerta 0311",precio:337500,marca:"Unox"},
  {cod:"KGN1659A",desc:"Goma puerta 06EU-FS/0621",precio:495000,marca:"Unox"},
  {cod:"KGN1660A",desc:"Goma puerta 10EU-FS/1021",precio:495000,marca:"Unox"},
  {cod:"KGN1658A",desc:"Goma puerta XEBC-04xx",precio:427500,marca:"Unox"},
  {cod:"KGN1569A",desc:"Kit empaques antorcha gas",precio:450000,marca:"Unox"},
  {cod:"KGN1596A",desc:"Goma puerta Stefania BL Shop.Pro",precio:247500,marca:"Unox"},
  {cod:"KGN1597A",desc:"Goma puerta Elena BL Shop.Pro",precio:315000,marca:"Unox"},
  {cod:"KGN1598A",desc:"Goma puerta Vittoria BL Shop.Pro",precio:360000,marca:"Unox"},
  {cod:"KGN1599A",desc:"Goma puerta Camilla BL Shop.Pro",precio:450000,marca:"Unox"},
  {cod:"KVL1183A",desc:"Sistema lavado Plus 1 brazo",precio:1845000,marca:"Unox"},
  {cod:"KVL1184A",desc:"Sistema lavado 2 rotores EU",precio:2160000,marca:"Unox"},
  {cod:"KVL1182A",desc:"Sistema lavado ONE (excluido 0311)",precio:1215000,marca:"Unox"},
  {cod:"KVL0014B",desc:"Reductor de presión MM ≥2017",precio:418500,marca:"Unox"},
  {cod:"KEL1170B",desc:"Bomba detergente + tubo + peso",precio:765000,marca:"Unox"},
  {cod:"KEL1175B",desc:"Bomba abrillantadora + tubo + peso",precio:765000,marca:"Unox"},
  {cod:"KCR1015A",desc:"Bisagras LineMiss Arianna",precio:405000,marca:"Unox"},
  {cod:"KCR1010A",desc:"Bisagras LineMiss Stefania",precio:382500,marca:"Unox"},
  {cod:"KCR1020B",desc:"Bisagras LineMiss Elena",precio:396000,marca:"Unox"},
  {cod:"KCR1050A",desc:"Bisagras XVC105-Rossella",precio:405000,marca:"Unox"},
  {cod:"KCR1130A",desc:"Bisagras izquierdas Speed.Pro",precio:1170000,marca:"Unox"},
  {cod:"KVT1060A",desc:"Cristal interno LineMiss Arianna",precio:360000,marca:"Unox"},
  {cod:"KVT1055A",desc:"Cristal interno LM Stefania",precio:337500,marca:"Unox"},
  {cod:"KVT1065B",desc:"Cristal interno LineMiss Elena",precio:585000,marca:"Unox"},
  {cod:"KVT1070B",desc:"Cristal interno Rossella",precio:585000,marca:"Unox"},
  {cod:"KVT1279B",desc:"Cristal interno sencillo 0311",precio:450000,marca:"Unox"},
  {cod:"KVT1280B",desc:"Cristal interno sencillo 0511",precio:585000,marca:"Unox"},
  {cod:"KVT1281B",desc:"Cristal interno sencillo 0711",precio:675000,marca:"Unox"},
  {cod:"KVT1282B",desc:"Cristal interno sencillo 1011",precio:765000,marca:"Unox"},
  {cod:"XRF011",desc:"Kit retrofit doble encendedor MIND.Maps",precio:1710000,marca:"Unox"},
  {cod:"KVG1031C",desc:"Conjunto soplete 7.5kW + bujías 0511-G",precio:2385000,marca:"Unox"},
  {cod:"KVG1032C",desc:"Antorcha 9.5kW + bujías 0711/06EU-G",precio:2250000,marca:"Unox"},
  {cod:"KVG1033C",desc:"Conjunto soplete 17.5kW + bujías 10EU",precio:2250000,marca:"Unox"},
  {cod:"KPM1000A",desc:"Bomba Ulka 230V",precio:247500,marca:"Unox"},
  {cod:"KCN1002A",desc:"Condensador CE1002A",precio:108000,marca:"Unox"},
  {cod:"KVE1634A",desc:"Interruptor magnetotérmico modular",precio:990000,marca:"Unox"},
  {cod:"KVE1670A",desc:"Relé estado sólido 25A + pad térmico",precio:603000,marca:"Unox"},
  {cod:"KVE2000A",desc:"Contactor 4P 30A 230V 50/60Hz",precio:427500,marca:"Unox"},
,
  // ─── RATIONAL (Lista precios Colombia, válida desde 01.04.2025) ─────────────
  {cod:'87.00.276',desc:'Kit de modifica., filtro de aire para la unidad del gas compl. SCC, CM',precio:3860493,cant:1,marca:'Rational'},
  {cod:'87.01.650S',desc:'Panel de control con táctil/TFT *ME* LM1; B-G desde 03/2020',precio:3133279,cant:1,marca:'Rational'},
  {cod:'87.01.648S',desc:'Panel de control con táctil/TFT *FU* LM1; B-G desde 03/2020',precio:3126849,cant:1,marca:'Rational'},
  {cod:'87.01.535S',desc:'Panel de control con táctil/TFT *RAT* LM1; B-G desde 03/2020',precio:3076206,cant:1,marca:'Rational'},
  {cod:'87.01.647S',desc:'Panel de control con táctil/TFT *BL* LM1; B-G desde 03/2020',precio:2973155,cant:1,marca:'Rational'},
  {cod:'74.00.462P',desc:'Burlete de la camara de calentamiento TJ200G desde n°47',precio:2947720,cant:1,marca:'Rational'},
  {cod:'87.01.649S',desc:'Panel de control con táctil/TFT *RH* LM1; B-G desde 03/2020',precio:2848368,cant:1,marca:'Rational'},
  {cod:'87.01.493',desc:'Tapa panel frontal con carátula *KF* SCC XS 623 bisagras a la izquierda',precio:2513212,cant:1,marca:'Rational'},
  {cod:'87.01.390',desc:'Tapa panel frontal con carátula *RAT* CMP XS 623 bisagras a la izquier-',precio:2398326,cant:1,marca:'Rational'},
  {cod:'87.01.388',desc:'Tapa panel frontal con carátula *RAT* SCC XS 623 bisagras a la izquierda',precio:2244917,cant:1,marca:'Rational'},
  {cod:'87.01.514',desc:'Tapa panel frontal con carátula *TH* SCC XS 623 bisagras a la izquierda',precio:2083428,cant:1,marca:'Rational'},
  {cod:'87.00.340',desc:'Kit electroválvula 3/8\" VCC 112P 230V desde 01/2005',precio:2034150,cant:1,marca:'Rational'},
  {cod:'60.71.452',desc:'Desviación para del filtro de aire el dúo 62/102/G',precio:1932750,cant:1,marca:'Rational'},
  {cod:'87.00.464',desc:'Kit de modificación interface Ethernet VCC 111-311 Desde 01/05',precio:1629858,cant:1,marca:'Rational'},
  {cod:'60.76.328P',desc:'Tapa del panel de control LMX; A-D desde 03/2020',precio:1342671,cant:1,marca:'Rational'},
  {cod:'60.21.218',desc:'Kit de modificación, no echador del eslabón giratorio Línea SCC,',precio:1239620,cant:1,marca:'Rational'},
  {cod:'60.22.318',desc:'Kit de modificación, no echador del eslabón giratorio Línea SCC,',precio:1113411,cant:1,marca:'Rational'},
  {cod:'40.07.132P',desc:'Arnés de energía elemento calefactor LMX; C 3AC200-480V desde',precio:817461,cant:1,marca:'Rational'},
  {cod:'87.00.261',desc:'Kit de modificación * cuerno de la señal * 201/202 desde 04/2004',precio:797773,cant:1,marca:'Rational'},
  {cod:'87.00.260',desc:'Kit de modificación * cuerno de la señal * 61-102 desde 04/2004',precio:777572,cant:1,marca:'Rational'},
  {cod:'50.02.012P',desc:'Electroválvula quíntuple con caudalímetro LM1; F-G desde 03/2020',precio:561627,cant:1,marca:'Rational'},
  {cod:'50.02.104P',desc:'Electroválvula triple con caudalímetro LM2; F G desde 03/2020',precio:482817,cant:1,marca:'Rational'},
  {cod:'50.02.054P',desc:'Electroválvula quíntuple con caudalímetro LM1; B-E desde 03/2020',precio:475875,cant:1,marca:'Rational'},
  {cod:'24.01.801S',desc:'Bandeja recojegotas SCC, CM 62/102 desde 10/2005',precio:473485,cant:1,marca:'Rational'},
  {cod:'20.00.399P',desc:'Burlete puerta SCC CMP 202, LM1 LM2; G desde 04/2004',precio:432629,cant:1,marca:'Rational'},
  {cod:'50.02.102P',desc:'Electroválvula triple con caudalímetro LM2; B-E desde 03/2020',precio:418460,cant:1,marca:'Rational'},
  {cod:'60.70.976',desc:'Pipa de cerámica del kit de modificación Línea SCC desde 04/2004',precio:411291,cant:1,marca:'Rational'},
  {cod:'20.00.398P',desc:'Burlete puerta SCC CMP 201, LM1 LM2; F desde 04/2004',precio:402983,cant:1,marca:'Rational'},
  {cod:'87.01.004',desc:'Kit de modificación interface Ethernet SCC_WE desde 09/2011 hasta',precio:379994,cant:1,marca:'Rational'},
  {cod:'87.01.004F',desc:'Kit de modificación interface Ethernet VCCM Desde 09/2011',precio:379994,cant:1,marca:'Rational'},
  {cod:'20.02.553P',desc:'Burlete puerta SCC CMP 102, LM1 LM2; E desde 04/2004',precio:364915,cant:1,marca:'Rational'},
  {cod:'40.02.754',desc:'Arnés de energía, K1 salida, 112 VCC 112 Desde 01/08',precio:359566,cant:1,marca:'Rational'},
  {cod:'20.02.552P',desc:'Burlete puerta SCC CMP 101, LM1 LM2; D desde 04/2004',precio:333391,cant:1,marca:'Rational'},
  {cod:'20.02.551P',desc:'Burlete puerta SCC CMP 62, LM1 LM2; C desde 04/2004',precio:322295,cant:1,marca:'Rational'},
  {cod:'40.07.634S',desc:'Ventilador de refrigeración LM1; B-E desde 08/2022',precio:302948,cant:1,marca:'Rational'},
  {cod:'20.02.550P',desc:'Burlete puerta SCC CMP 61, LM1 LM2; B desde 04/2004',precio:290771,cant:1,marca:'Rational'},
  {cod:'56.00.176P',desc:'Manguera succión para limpieza CleanJet SCC 201/202 desde',precio:284683,cant:1,marca:'Rational'},
  {cod:'20.02.549P',desc:'Burlete puerta SCC CMP 623, LM1 LM2; A desde 09/2016',precio:274895,cant:1,marca:'Rational'},
  {cod:'40.00.220P',desc:'Cable conexión válvula solenoide Línea SCC CM 201/202 desde',precio:274497,cant:1,marca:'Rational'},
  {cod:'87.00.279',desc:'Kit de modifica., Termostato de seguridad, Bilímite 360°C Línea SCC',precio:265905,cant:1,marca:'Rational'},
  {cod:'87.01.790S',desc:'Kit de modificación, tapa para cegar ducha de mano LM1 LM2; B-E',precio:248700,cant:1,marca:'Rational'},
  {cod:'56.00.120P',desc:'Manguera succión para limpieza Línea SCC 62/102 desde 04/2004',precio:185502,cant:1,marca:'Rational'},
  {cod:'87.00.436',desc:'Kit de modificación *Service25* Línea SCC, SCC desde 04/2004',precio:162285,cant:1,marca:'Rational'},
  {cod:'24.00.135P',desc:'Angulo superior de sujeción de la puerta Línea SCC 61-102 bisagras a',precio:149938,cant:1,marca:'Rational'},
  {cod:'40.03.661P',desc:'Estructura de montaje del ventilador de refrigeración SCC_',precio:137476,cant:1,marca:'Rational'},
  {cod:'56.00.607P',desc:'Manguera succión para limpieza CleanJet SCC_WE 62/102 desde',precio:131558,cant:1,marca:'Rational'},
  {cod:'40.00.334P',desc:'Contacto de puerta SCC, CM 61-102 bisagras a la izquierda desde',precio:130420,cant:1,marca:'Rational'},
  {cod:'40.05.839P',desc:'Cable bus RJ45 2.85m',precio:127404,cant:1,marca:'Rational'},
  {cod:'40.03.660P',desc:'Estructura de montaje del ventilador de refrigeración SCC_',precio:125697,cant:1,marca:'Rational'},
  {cod:'50.00.301P',desc:'Bandeja recojegotas SCC, CM 61/101 bisagras a la izquierda desde',precio:121202,cant:1,marca:'Rational'},
  {cod:'56.00.180',desc:'Inlet pipe CleanJet SCC line 61-202 desde 04/2004',precio:100717,cant:1,marca:'Rational'},
  {cod:'56.01.524P',desc:'Manguera succión para limpieza CleanJet Línea SCC 61/101 desde',precio:88255,cant:1,marca:'Rational'},
  {cod:'40.02.337P',desc:'Termostato de seguridad, Bilímite 215°C VCC 111-311, VCCM 211-',precio:84614,cant:1,marca:'Rational'},
  {cod:'24.01.329',desc:'Tuerca para sonda nucleo',precio:83703,cant:1,marca:'Rational'},
  {cod:'50.00.618P',desc:'Válvula solenoide simple verde VCC 112-311 200-240V Desde 01/05',precio:79322,cant:1,marca:'Rational'},
  {cod:'87.00.077',desc:'Grapas sujección para cristal interior Línea SCC, 61-202 desde',precio:77728,cant:1,marca:'Rational'},
  {cod:'56.00.175P',desc:'Manguera presión Limpieza SCC 201/202 desde 04/2004',precio:73745,cant:1,marca:'Rational'},
  {cod:'50.00.286P',desc:'Bandeja recojegotas SCC, CM 61/101 desde 04/2004',precio:71981,cant:1,marca:'Rational'},
  {cod:'40.05.654P',desc:'Filtro entrada de aire LM1 LM2; F G desde 03/2020',precio:65153,cant:1,marca:'Rational'},
  {cod:'87.00.343S',desc:'Trabar el perno para el panel de control desde 05/2008',precio:63673,cant:1,marca:'Rational'},
  {cod:'24.03.054P',desc:'Casquillo de encastre 623-102, LM1; A bisagras a la izquierda desde',precio:61056,cant:1,marca:'Rational'},
  {cod:'40.04.423P',desc:'Haz termostato de seguridad calentador VCCM 112 desde 05/2013',precio:59918,cant:1,marca:'Rational'},
  {cod:'87.01.345',desc:'Kit de modificación, soporte para el desbloqueo Carrito de transporte',precio:57869,cant:1,marca:'Rational'},
  {cod:'56.00.166P',desc:'Manguera presión Limpieza SCC 61-102 desde 04/2004',precio:57756,cant:1,marca:'Rational'},
  {cod:'24.01.188P',desc:'Drene para bandeja recojegotas SCC, CM 61-102 desde 10/2005',precio:57130,cant:1,marca:'Rational'},
  {cod:'40.04.095P',desc:'Cable bus 0.3m RJ45',precio:56048,cant:1,marca:'Rational'},
  {cod:'56.01.682S',desc:'Casquillo del tubo CleanJet LM1 LM2; B-E desde 03/2020',precio:55423,cant:1,marca:'Rational'},
  {cod:'16.01.662P',desc:'Filtro entrada de aire Línea SCC desde 04/2004',precio:53602,cant:1,marca:'Rational'},
  {cod:'50.01.146P',desc:'Válvula solenoide simple Y2 SCC, CM 200-240V desde 09/2008',precio:53431,cant:1,marca:'Rational'},
  {cod:'50.01.147P',desc:'Válvula solenoide simple Y1 CM_P 61-202 200-240V desde 09/2011',precio:53431,cant:1,marca:'Rational'},
  {cod:'50.00.316P',desc:'Válvula solenoide simple Línea SCC, línea SCC 200-240V desde',precio:53146,cant:1,marca:'Rational'},
  {cod:'87.01.774S',desc:'Kit de juntas para los cables del panel de control LMX desde 03/2020',precio:52805,cant:1,marca:'Rational'},
  {cod:'12.00.319P',desc:'Alojamiento para bomba limpieza SCC 61-102 desde 04/2004',precio:47570,cant:1,marca:'Rational'},
  {cod:'56.01.450P',desc:'Drain hose door LM1 LM2; B D bisagras a la izquierda desde 03/2020',precio:47285,cant:1,marca:'Rational'},
  {cod:'16.01.526P',desc:'Filtro entrada de aire para el lado izquierdo Línea SCC, 61/101/201/G',precio:47115,cant:1,marca:'Rational'},
  {cod:'56.00.744S',desc:'Manguera presión ø10mm 130mm',precio:46830,cant:1,marca:'Rational'},
  {cod:'40.05.424P',desc:'Filtro entrada de aire LM1 LM2; B-E desde 03/2020',precio:45977,cant:1,marca:'Rational'},
  {cod:'56.01.473P',desc:'Drain hose door LM1 LM2; C E bisagras a la izquierda desde 03/2020',precio:45920,cant:1,marca:'Rational'},
  {cod:'12.01.283S',desc:'Soporte contacto puerta Línea SCC 61-102 bisagras a la izquierda',precio:45749,cant:1,marca:'Rational'},
  {cod:'40.04.501P',desc:'Termostato de seguridad 130°',precio:44383,cant:1,marca:'Rational'},
  {cod:'24.00.151P',desc:'Perno lado superior puerta Línea SCC 61-102 bisagras a la izquierda',precio:44156,cant:1,marca:'Rational'},
  {cod:'12.00.316P',desc:'Soporte contacto puerta Línea SCC 61-102 bisagras a la izquierda',precio:43132,cant:1,marca:'Rational'},
  {cod:'56.01.454S',desc:'Caja de limpieza de emergencia de rebosadero LM1 LM2; B-E desde',precio:42961,cant:1,marca:'Rational'},
  {cod:'20.01.508P',desc:'Espaciador termostato de seguridad VCC 111-311 desde 10/09',precio:42449,cant:1,marca:'Rational'},
  {cod:'40.04.512P',desc:'Termostato de seguridad, Bilímite 205°C',precio:41709,cant:1,marca:'Rational'},
  {cod:'12.00.950P',desc:'Soporte para contacto reed puerta SCC, CM 61-102 bisagras a la',precio:41425,cant:1,marca:'Rational'},
  {cod:'24.03.788P',desc:'Tope de la puerta 61-102 bisagras a la izquierda desde 09/2016',precio:40400,cant:1,marca:'Rational'},
  {cod:'40.04.499P',desc:'Cable adaptador para bomba limpieza',precio:40173,cant:1,marca:'Rational'},
  {cod:'40.04.771P',desc:'Filtro entrada de aire SCC 623, LM1; A desde 09/2016',precio:39945,cant:1,marca:'Rational'},
  {cod:'14.01.059P',desc:'Perno lado superior puerta LM1 LM2; B-E bisagras a la izquierda desde',precio:37043,cant:1,marca:'Rational'},
  {cod:'40.02.684P',desc:'Filtro entrada de aire SCC_WE, CM_P 61-202 desde 09/2011',precio:35962,cant:1,marca:'Rational'},
  {cod:'40.00.236',desc:'Cable conexión válvula solenoide Línea SCC CM 62/101/102/E,',precio:35393,cant:1,marca:'Rational'},
  {cod:'24.00.507P',desc:'Panel soporte para cristal interior puerta SCC, CM 201/202 desde',precio:35279,cant:1,marca:'Rational'},
  {cod:'24.03.183P',desc:'Perno lado superior puerta LM1; A bisagras a la izquierda desde',precio:33913,cant:1,marca:'Rational'},
  {cod:'40.04.370P',desc:'Termostato de seguridad calentador',precio:33401,cant:1,marca:'Rational'},
  {cod:'40.02.381P',desc:'Cable conexión válvula solenoide Línea SCC CM 61/E desde 04/2006',precio:27939,cant:1,marca:'Rational'},
  {cod:'56.00.823P',desc:'Codo para manguera de aspiración CleanJet SCC 623, LM1; A desde',precio:27654,cant:1,marca:'Rational'},
  {cod:'40.01.091P',desc:'Cable bus 0.4m Línea SCC, línea VCC desde 04/2004',precio:26345,cant:1,marca:'Rational'},
  {cod:'40.04.810P',desc:'Soporte ventilador de refrigeración SCC XS 623 desde 09/2016',precio:21452,cant:1,marca:'Rational'},
  {cod:'24.03.787S',desc:'Grapas sujección para cristal interior Línea SCC, 61-202, LM1 LM2;',precio:21395,cant:1,marca:'Rational'},
  {cod:'40.02.802',desc:'Cable bus 0.2m RJ45',precio:20769,cant:1,marca:'Rational'},
  {cod:'12.00.320P',desc:'Cubierta para la abertura de la bomba de CleanJet CM 61-102 desde',precio:18493,cant:1,marca:'Rational'},
  {cod:'24.05.303S',desc:'Cubierta de la bisagra LM1 LM2; B-E desde 03/2020',precio:17582,cant:1,marca:'Rational'},
  {cod:'50.00.303P',desc:'Manguito bandeja recojegotas SCC, CM 61-102 desde 04/2004',precio:17525,cant:2,marca:'Rational'},
  {cod:'24.03.185P',desc:'Tapa de cerradura 61-102, LM1; A bisagras a la izquierda desde',precio:16843,cant:1,marca:'Rational'},
  {cod:'56.01.472P',desc:'Tapa del soporte inferior de la puerta LM1 LM2; B-E bisagras a la',precio:15136,cant:1,marca:'Rational'},
  {cod:'87.00.189',desc:'Kit de modificación que quita el sensor de temp. de la base Lìnea SCC',precio:15136,cant:1,marca:'Rational'},
  {cod:'24.00.505P',desc:'Tapa de cerradura Línea SCC 61-102 bisagras a la izquierda desde',precio:10925,cant:1,marca:'Rational'},
  {cod:'24.00.504P',desc:'Tapa de cerradura Línea SCC 61-102 *bisagras a la derecha* desde',precio:8649,cant:1,marca:'Rational'},
  {cod:'40.06.053P',desc:'Soporte para termostato de seguridad LM1 LM2; B-G desde 03/2020',precio:6031,cant:1,marca:'Rational'}
];

// Función búsqueda de repuestos
const buscarRepuesto = (query) => {
  const q = query.toLowerCase().replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u");
  return REPUESTOS.filter(r =>
    r.cod.toLowerCase().includes(q) ||
    r.desc.toLowerCase().split(" ").some(w => w.length > 3 && q.includes(w)) ||
    q.split(" ").some(w => w.length > 3 && r.desc.toLowerCase().includes(w))
  ).slice(0, 5);
};

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

const TABS = [
  {id:"inicio",icon:"🏠",label:"Inicio"},
  {id:"chat",icon:"🤖",label:"CEM Bot"},
  {id:"planes",icon:"📋",label:"Planes"},
  {id:"instalacion",icon:"⚡",label:"Instalación"},
  {id:"limpieza",icon:"🧹",label:"Limpieza"},
  {id:"repuestos",icon:"🔩",label:"Repuestos"},
  {id:"stats",icon:"📊",label:"Stats"},
  {id:"guia",icon:"📖",label:"Guía"},
];

// ─── STORAGE LOCAL (reemplaza window.storage) ─────────────────────────────────
const SK = "cem_fallas_v4";
const loadF = () => { try { const d = localStorage.getItem(SK); return d ? JSON.parse(d) : []; } catch { return []; } };
const saveF = (d) => { try { localStorage.setItem(SK, JSON.stringify(d)); } catch {} };

// ══════════════════════════════════════════════════════════════════════════════
// CHAT
// ══════════════════════════════════════════════════════════════════════════════
const SALUDO_TXT = "Hola. Soy el asistente técnico del CEM. Puedes escribirme, usar los botones o hablarme con el micrófono. Siempre dime el equipo, la marca y la referencia para darte el mejor diagnóstico. ¿Con qué equipo necesitas ayuda hoy?";
const SALUDO_DISPLAY = "¡Hola! Soy el asistente técnico del **CEM**.\n\nPuedes interactuar conmigo de 3 formas:\n✍️ **Escribiendo** en el campo de texto\n🔘 **Usando los botones** que aparecen abajo\n🎙️ **Hablándome** con el micrófono\n\nSiempre indica el **equipo**, **marca** y **referencia** para un diagnóstico preciso.\n\n¿Con qué equipo necesitas ayuda hoy?";

function ChatTab({ onFalla }) {
  const [msgs, setMsgs] = useState([{ role:"bot", text:SALUDO_DISPLAY }]);
  const [step, setStep] = useState("tipo");
  const [sel, setSel] = useState({ tipo:null, marca:null, ref:null });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const registrado = useRef(false);
  const msgsRef = useRef([{ role:"bot", text:SALUDO_DISPLAY }]);
  const lastBot = useRef(SALUDO_TXT);
  const recRef = useRef(null);
  const endRef = useRef(null);

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
      u.onstart = () => setSpeaking(true);
      u.onend = u.onerror = () => setSpeaking(false);
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

  const addMsg = (role, text) => {
    const m = { role, text };
    setMsgs(prev => { const n=[...prev,m]; msgsRef.current=n; return n; });
    if (role==="bot") lastBot.current = text;
  };

  // ── Llama al backend propio en /api/chat ──
  const callIA = async (contenido, ctx) => {
    if (!contenido?.trim()) return;
    setLoading(true);
    const esRational = ctx?.marca?.nombre === "Rational";
    const esUnox = ctx?.marca?.nombre === "Unox";
    const esChefTop = ctx?.ref?.toLowerCase().includes("cheftop") || ctx?.ref?.toLowerCase().includes("bakertop");
    const esArianna = ctx?.ref?.toLowerCase().includes("arianna");

    const system = `Eres el asistente técnico del CEM de Terpel. Responde en español colombiano simple. Máximo 180 palabras.
Equipo: ${ctx?.tipo?.tipo||"?"} ${ctx?.marca?.nombre||""} ${ctx?.ref||""}

=== PROCEDIMIENTOS DE BURLETE ===
UNOX ChefTop/BakerTop (burlete SIN orificios, sellado):
- Retirar burlete viejo, limpiar ranura.
- Unión del burlete nuevo → parte SUPERIOR centrada en la guía.
- Luego: centro inferior → lado derecho → lado izquierdo.
- Insertar de a poco del centro hacia esquinas presionando hacia adentro.
- Esquinas redondeadas: línea del burlete debe coincidir con línea guía del horno.
- Pestaña LARGA = alejada de la cabina (lado vapor). Pestaña CORTA = cerca de la cabina (lado calor).
- No debe sobrar ni cortarse.

UNOX Arianna (burlete CON DOS ORIFICIOS en la parte superior, puerta cierra hacia arriba):
- Retirar burlete viejo, limpiar ranura.
- Unión del burlete nuevo → lado IZQUIERDO del horno en la mitad de la guía. Los orificios deben quedar en la parte SUPERIOR.
- Luego: centro derecho → lado superior → lado inferior.
- Insertar de a poco del centro hacia esquinas.
- Pestaña LARGA = alejada de la cabina (vapor). Pestaña CORTA = cerca de la cabina (calor).

RATIONAL SCC/iCombi (burlete CON orificios en la parte INFERIOR, esquinas de 90 grados):
- Retirar burlete viejo, limpiar ranura con paño húmedo.
- Unión del burlete → parte SUPERIOR centrada. Los orificios deben quedar en la parte INFERIOR.
- Luego: centro inferior → lado derecho → lado izquierdo.
- Esquinas son de 90 grados (no redondeadas): asegurarse que el burlete quede recto en las esquinas.
- Insertar de a poco del centro hacia las esquinas.
- No debe sobrar ni cortarse.
- Humedecer la ranura con agua jabonosa facilita la instalación.

=== MEDICIONES TÉCNICAS UNOX ChefTop/BakerTop ===
- Sondas de temperatura: ~110 Ω a 25°C (medir en ohms con multímetro).
- Capacitores de motores: valor esperado 6.3 µF cada uno.
- Resistencias de freno: rojo=37.5 Ω, amarillo=75 Ω.
- Elemento calefactor: medir consumo por fase en amperios.
- Voltaje válvula solenoide EL1/EL2: 230 VAC desde placa.
- Corriente de ionización (solo gas): 1.5–10 µA DC.
- Presión dinámica de gas: 0 ± 0.7 mbar.
- Gaps electrodos gas: 3 mm entre electrodos, 7 mm electrodo-antorcha (piso) / 4 mm (sobremesa).
- Voltaje pantalla: 12 V DC entre cables negro y amarillo del conector principal.
- Fusible F2: 2A 250V Fast Acting. Fusible F4: 5A 250V Time Delay.
- Presión agua entrada: 1.5–6 bar. Salida reductor: ~2.3 bar.
- PIN menú servicio: 99857.

=== MEDICIONES TÉCNICAS RATIONAL SCC/iCombi ===
- Presión dinámica agua: 1.5–3 bar (150–300 kPa).
- Conductividad mínima agua: 50 µS (dureza mín. 5°dH, 90 ppm).
- Presión gas natural: 18–25 mbar. Gas propano: 25–57 mbar.
- Termostato de seguridad: dispara a ~180°C — revisar si el indicador llegó a zona roja.
- Verificar las 3 fases eléctricas si el precalentamiento es lento o no termina.
- Sonda térmica B2/B4 (combinación de fallas puede mostrar códigos combinados como 20.6, 31.12).
- Revisar bus cable si aparece error 34.x — verificar conexión y estado del cable bus.

=== PRECIOS REPUESTOS UNOX (pesos colombianos, sin IVA, Mar 2026) ===
Motor 330W D12 KMT1012A=$1.350.000 | Tarjeta pot BLSP KPE2260A=$990.000 | Tarjeta pot MM Plus KPE2038A=$2.700.000 | Tarjeta pot MM ONE KPE2037A=$2.160.000 | Panel control MM Plus KPE1057B=$4.275.000 | Termostato seg 318°C KTR1136A=$405.000 | Turbina H40 KVN1172A=$553.500 | Turbina H60 KVN1171A=$765.000 | Resistencia 3000W KRS1283B=$765.000 | Resistencia 4.9kW KRS1150A=$990.000 | Resistencia 9kW KRS1180A=$1.350.000 | Resistencia frenada KRS1034A=$427.500 | Sonda PT100 L1000 KTR1105A=$540.000 | Sonda corazón L2000 KSN1031A=$1.080.000 | Condensador 6.3µF KCN1003A=$135.000 | Electroválvula D8-D10 KEL1251A=$292.500 | Bomba detergente KEL1170B=$765.000 | Cristal int Arianna KVT1330A=$315.000 | Goma puerta Arianna KGN1352A=$211.500 | Goma puerta 0511 KGN1629A=$382.500 | Goma puerta 0711 KGN1630A=$360.000 | Goma puerta 1011 KGN1631A=$405.000 | Bisagra Arianna-Elena KCR1112A=$225.000 | Sistema lavado ONE KVL1182A=$1.215.000 | Sistema lavado Plus KVL1183A=$1.845.000 | Tanque detergente 3L KSB1016A=$675.000 | Cable bus 2M KCE1095A=$180.000 | Kit doble encendedor XRF011=$1.710.000 | Empaques gas KGN1569A=$450.000
Si preguntan precio de repuesto, menciona código y valor. Ejemplo: "cuesta $292.500 pesos". NUNCA digas dólares.

=== PRECIOS REPUESTOS RATIONAL SCC/iCombi (pesos colombianos, sin IVA, válido 01.04.2025) ===
Burlete puerta SCC 61 (20.02.550P)=$290.771 | Burlete SCC 62 (20.02.551P)=$322.295 | Burlete SCC 101 (20.02.552P)=$333.391 | Burlete SCC 102 (20.02.553P)=$364.915 | Burlete SCC 201 (20.00.398P)=$402.983 | Burlete SCC 202 (20.00.399P)=$432.629 | Burlete SCC 623 (20.02.549P)=$274.895 | Panel control iCombi (87.01.535S)=$3.076.206 | Ventilador refrig iCombi (40.07.634S)=$302.948 | Electroválvula quíntuple iCombi (50.02.054P)=$475.875 | Electroválvula triple iCombi (50.02.102P)=$418.460 | Termostato seg 215°C (40.02.337P)=$84.614 | Kit termostato 360°C (87.00.279)=$265.905 | Manguera succión CleanJet 62/102 (56.00.120P)=$185.502 | Manguera succión CleanJet 201/202 (56.00.176P)=$284.683 | Manguera presión 61-102 (56.00.166P)=$57.756 | Bandeja recogegotas 62/102 (24.01.801S)=$473.485 | Filtro aire SCC_WE (40.02.684P)=$35.962 | Filtro aire iCombi (40.05.654P)=$65.153 | Válvula solenoide (50.00.316P)=$53.146 | Cable bus RJ45 2.85m (40.05.839P)=$127.404 | Kit modificación Service25 (87.00.436)=$162.285

${esRational?"Rational SCC: 23/24=apagar ya; 32/33=cerrar gas+ventilar; 14=sin agua; 25=filtro agua; 29=filtro aire; 31=sonda; 47/48=bomba desagüe; 110/120=llamar técnico.":""}
${esUnox?"Unox: AF01=motor/capacitor; AF02=termostato 320°C; AF03=sonda 110Ω; AF04=comunicación placa; AF23=gas; WF16=agua EL1; WF06=placa caliente; WF41=red.":""}

Responde SIEMPRE así:
Causa: [1 línea]
Pasos: 1. 2. 3. (máx 5 pasos con valores técnicos si aplica)
Escalar: [cuándo llamar técnico]
Tip: [consejo — si aplica mencionar repuesto con código y precio]`;
    try {
      const prevMsgs = msgsRef.current
        .filter(m => m?.role && typeof m.text === "string" && m.text.trim())
        .slice(-4)
        .map(m => ({ role: m.role==="bot"?"assistant":"user", content: m.text.trim() }));
      const messages = prevMsgs.length > 0
        ? [...prevMsgs, { role:"user", content:contenido.trim() }]
        : [{ role:"user", content:contenido.trim() }];

      // ← Aquí llama a /api/chat (tu propio backend) en lugar de Anthropic directo
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:400, system, messages }),
      });
      const data = await res.json();
      if (data.error) { addMsg("bot", "⚠️ " + (data.error.message || data.error)); return; }
      const texto = data.content?.map(b=>b.text||"").join("").trim() || "Sin respuesta.";
      addMsg("bot", texto);
      hablar(texto);
    } catch(e) {
      addMsg("bot", "⚠️ No se pudo conectar. Verifica tu internet e intenta de nuevo.");
    } finally { setLoading(false); }
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
    if (!input.trim() || loading) return;
    const txt = input.trim(); setInput(""); setStep("chat");
    addMsg("user", txt);
    let ctx = { ...sel };
    if (!sel.tipo || !sel.marca) {
      const ex = extraerPorReglas(txt);
      if (ex.tipo || ex.marca) {
        const tO = EQUIPOS.find(e=>e.tipo===ex.tipo)||(ex.tipo?{tipo:ex.tipo,icon:"🔥"}:null);
        const mO = EQUIPOS.flatMap(e=>e.marcas).find(m=>m.nombre===ex.marca)||(ex.marca?{nombre:ex.marca}:null);
        ctx = { tipo:tO, marca:mO, ref:ex.ref||null }; setSel(ctx);
      }
    }
    if (!registrado.current) { registrado.current=true; onFalla({ equipo:ctx.tipo?.tipo||"Sin especificar", marca:ctx.marca?.nombre||"Sin especificar", ref:ctx.ref||"Sin especificar", sintoma:txt }); }
    callIA(txt, ctx);
  };
  const reset = () => {
    setStep("tipo"); setSel({tipo:null,marca:null,ref:null}); registrado.current=false;
    const ini=[{role:"bot",text:SALUDO_DISPLAY}]; setMsgs(ini); msgsRef.current=ini;
  };
  const renderText = (t) => t.split("\n").filter(Boolean).map((l,i) => (
    <div key={i} dangerouslySetInnerHTML={{__html:l.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")}} style={{marginBottom:3}}/>
  ));

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
          <div key={i} style={{maxWidth:"82%",alignSelf:m.role==="bot"?"flex-start":"flex-end"}}>
            {m.role==="bot" && <div style={{fontSize:10,color:C.light,marginBottom:2,fontWeight:600}}>CEM IA</div>}
            <div style={{background:m.role==="bot"?C.white:C.accent,color:m.role==="bot"?C.text:"#fff",padding:"10px 13px",borderRadius:m.role==="bot"?"4px 14px 14px 14px":"14px 4px 14px 14px",fontSize:13,lineHeight:1.65,border:m.role==="bot"?`1px solid ${C.border}`:"none",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
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
          <div style={{alignSelf:"flex-start",display:"flex",flexWrap:"wrap",gap:7}}>
            {[...sel.marca.refs,"Otra"].map(r=><div key={r} onClick={()=>pickRef(r)} style={{...card({padding:"7px 13px",cursor:"pointer"}),fontSize:12,color:r==="Otra"?C.muted:C.text}}>{r}</div>)}
          </div>
        )}
        {step==="sintoma" && (
          <div style={{alignSelf:"flex-start",display:"flex",flexWrap:"wrap",gap:7}}>
            {(SINTOMAS[sel.tipo?.tipo]||[]).map(s=><div key={s} onClick={()=>pickSintoma(s)} style={{...card({padding:"7px 13px",cursor:"pointer"}),fontSize:12}}>{s}</div>)}
          </div>
        )}
        {loading && <div style={{alignSelf:"flex-start",...card({padding:"10px 14px"}),fontSize:13,color:C.accent}}>Analizando…</div>}
        <div ref={endRef}/>
      </div>
      {step==="chat" && (
        <div style={{padding:"5px 12px 3px",display:"flex",gap:6}}>
          <div onClick={reset} style={{...card({padding:"5px 11px"}),cursor:"pointer",fontSize:11,color:C.muted}}>🔄 Nueva</div>
          <div onClick={()=>{setStep("sintoma");addMsg("bot","¿Cuál es el otro síntoma?");}} style={{...card({padding:"5px 11px"}),cursor:"pointer",fontSize:11,color:C.muted}}>➕ Síntoma</div>
        </div>
      )}
      <div style={{display:"flex",gap:7,padding:"9px 13px",borderTop:`1px solid ${C.border}`,background:C.white,alignItems:"center"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
          placeholder={listening?"🎙️ Escuchando…":"Describe la falla…"}
          style={{flex:1,background:listening?"#fef3c7":C.bg,border:`1px solid ${listening?"#d97706":C.border}`,color:C.text,padding:"9px 12px",fontFamily:"inherit",fontSize:13,borderRadius:8,outline:"none"}}/>
        <button onClick={toggleMic} style={{width:40,height:40,borderRadius:8,border:`1px solid ${listening?C.red:C.border}`,background:listening?C.red:C.white,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {listening?"⏹":"🎙️"}
        </button>
        <button onClick={()=>speaking?speechSynthesis.cancel():hablar(lastBot.current)} style={{width:40,height:40,borderRadius:8,border:`1px solid ${speaking?C.accent:C.border}`,background:speaking?C.al:C.white,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {speaking?"🔊":"🔈"}
        </button>
        <button onClick={sendMsg} disabled={loading} style={{...btn("primary"),borderRadius:8,padding:"9px 14px",opacity:loading?0.6:1}}>➤</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INICIO
// ══════════════════════════════════════════════════════════════════════════════
function InicioTab({ onNav }) {
  const items = [
    {id:"chat",icon:"🤖",color:C.accent,bg:C.al,titulo:"CEM Bot",desc:"Describe la falla por texto o voz."},
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
        <div style={{display:"inline-block",marginTop:10,background:C.gl,color:C.green,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,border:`1px solid ${C.green}33`}}>✅ Chat siempre disponible</div>
      </div>
      {items.map(s=>(
        <div key={s.id} onClick={()=>onNav(s.id)} style={{...card({marginBottom:9,cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px"})}}
          onMouseOver={e=>e.currentTarget.style.borderColor=s.color} onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
          <div style={{width:40,height:40,background:s.bg,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{s.titulo}</div><div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{s.desc}</div></div>
          <div style={{color:C.light,fontSize:15,paddingTop:8}}>›</div>
        </div>
      ))}
      <div style={{textAlign:"center",padding:"14px 0 6px",borderTop:`1px solid ${C.border}`,marginTop:6,fontSize:10,color:C.light}}>Rational · Unox · Zanolli · Turbochef · Bunn<br/><span style={{fontSize:9}}>{"v" + (process.env.NEXT_PUBLIC_BUILD_DATE ? new Date(process.env.NEXT_PUBLIC_BUILD_DATE).toLocaleDateString("es-CO",{day:"2-digit",month:"2-digit",year:"2-digit"})+" "+new Date(process.env.NEXT_PUBLIC_BUILD_DATE).toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"}) : "dev")}</span></div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INSTALACIÓN
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
      {sT&&sM&&!sR&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sM.refs.map(r=><div key={r} onClick={()=>setSR(r)} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:11}}>{r}</div>)}</div><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div></div>}
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

// ══════════════════════════════════════════════════════════════════════════════
// PLANES
// ══════════════════════════════════════════════════════════════════════════════
function PlanesTab() {
  const [sT,setST]=useState(null); const [sM,setSM]=useState(null); const [sR,setSR]=useState(null); const [sec,setSec]=useState("diario");
  const plan=sM&&sR?(PLANES[`${sM.nombre}-${sR}`]||PLAN_GEN):null;
  const secs=[{id:"diario",label:"📅 Diario"},{id:"semanal",label:"🗓 Semanal"},{id:"mensual",label:"📆 Mensual"},{id:"trimestral",label:"🔄 Trimestral"},{id:"semestral",label:"📆 Semestral"},{id:"anual",label:"🏆 Anual"}];
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:14}}>Planes de Mantenimiento</div>
      {!sT&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>setST(eq)} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
      {sT&&!sM&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sT.icon} {sT.tipo}</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sT.marcas.map(m=><div key={m.nombre} onClick={()=>setSM(m)} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:12,fontWeight:600}}>{m.nombre}</div>)}</div><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setST(null)}>← Volver</div></div>}
      {sT&&sM&&!sR&&<div><div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{sM.refs.map(r=><div key={r} onClick={()=>setSR(r)} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:11}}>{r}</div>)}</div><div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div></div>}
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

// ══════════════════════════════════════════════════════════════════════════════
// LIMPIEZA
// ══════════════════════════════════════════════════════════════════════════════
function LimpiezaTab() {
  const [sT,setST]=useState(null); const [sM,setSM]=useState(null); const [sR,setSR]=useState(null); const [open,setOpen]=useState(null);
  // Filtrar guías por equipo y opcionalmente por marca/ref en el título
  const datos = sT ? (LIMPIEZAS_DATA[sT.tipo]||[]).filter(item => {
    if (!sM) return true;
    const t = item.titulo.toLowerCase();
    if (!sR) return t.includes(sM.nombre.toLowerCase()) || !sT.marcas.some(m => t.includes(m.nombre.toLowerCase()));
    return t.includes(sR.toLowerCase()) || t.includes(sM.nombre.toLowerCase());
  }) : [];
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:14}}>Guías de Limpieza</div>
      {/* PASO 1 — Equipo */}
      {!sT && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>{setST(eq);setSM(null);setSR(null);setOpen(null);}} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
      {/* PASO 2 — Marca */}
      {sT&&!sM&&<div>
        <div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sT.icon} {sT.tipo}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {sT.marcas.map(m=><div key={m.nombre} onClick={()=>{setSM(m);setSR(null);setOpen(null);}} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:12,fontWeight:600}}>{m.nombre}</div>)}
        </div>
        <div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setST(null)}>← Volver</div>
      </div>}
      {/* PASO 3 — Referencia */}
      {sT&&sM&&!sR&&<div>
        <div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {sM.refs.map(r=><div key={r} onClick={()=>{setSR(r);setOpen(null);}} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:11}}>{r}</div>)}
        </div>
        <div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div>
      </div>}
      {/* CONTENIDO */}
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
            </div>}
          </div>
        ))}
        <div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSR(null)}>← Cambiar referencia</div>
      </div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════════════════════
const ADMIN_PIN = "1234"; // ← cambia este PIN

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

function StatsTab({ fallas, onBorrar }) {
  const [filtro,setFiltro]=useState("todo");
  const [vista,setVista]=useState("graficas"); // "graficas" | "registros"
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
  const topEquipos=contar("equipo");
  const topMarcas=contar("marca");
  const topRefs=contar("ref").slice(0,8);
  const topSintomas=contar("sintoma").slice(0,6);

  const colores=["#2563eb","#16a34a","#d97706","#dc2626","#7c3aed","#0891b2","#9ca3af","#6b7280"];
  const colorFn=i=>colores[i%colores.length];

  const toggleSel=idx=>{
    const s=new Set(seleccionados);
    s.has(idx)?s.delete(idx):s.add(idx);
    setSeleccionados(s);
  };
  const borrarSeleccionados=()=>{
    if(seleccionados.size===0)return;
    if(!window.confirm(`¿Borrar ${seleccionados.size} registro(s)?`))return;
    // Calcular índices reales en fallas (no en datos filtrados)
    const registrosABorrar=new Set([...seleccionados].map(i=>[...datos].reverse()[i]));
    const nuevasFallas=fallas.filter(f=>!registrosABorrar.has(f));
    onBorrar(nuevasFallas);
    setSeleccionados(new Set());
  };

  const entrarAdmin=()=>{
    if(pinInput===ADMIN_PIN){setAdminMode(true);setShowPin(false);setPinInput("");setPinError(false);}
    else{setPinError(true);}
  };

  if(fallas.length===0)return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"calc(100vh - 110px)",padding:16,textAlign:"center"}}>
      <div style={{fontSize:44,marginBottom:10}}>📊</div>
      <div style={{fontSize:15,fontWeight:700,marginBottom:5}}>Sin datos aún</div>
      <div style={{fontSize:12,color:C.muted}}>Usa el CEM Bot para registrar consultas.</div>
    </div>
  );

  return (
    <div style={{padding:14,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:17,fontWeight:800,flex:1}}>Estadísticas</div>
        <button onClick={()=>adminMode?setAdminMode(false):setShowPin(!showPin)}
          style={{...btn(adminMode?"primary":"outline","sm"),fontSize:10}}>
          {adminMode?"🔓 Admin ON":"🔐 Admin"}
        </button>
      </div>

      {/* PIN modal */}
      {showPin&&!adminMode&&(
        <div style={{...card({marginBottom:12,padding:"12px 14px",background:C.yl,border:`1px solid ${C.yellow}44`})}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>🔐 PIN de administrador</div>
          <div style={{display:"flex",gap:8}}>
            <input type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&entrarAdmin()}
              placeholder="PIN" maxLength={6}
              style={{flex:1,padding:"8px 10px",borderRadius:7,border:`1px solid ${pinError?C.red:C.border}`,fontSize:14,fontFamily:"inherit",outline:"none"}}/>
            <button onClick={entrarAdmin} style={{...btn("primary","sm")}}>Entrar</button>
          </div>
          {pinError&&<div style={{fontSize:11,color:C.red,marginTop:5}}>PIN incorrecto</div>}
        </div>
      )}

      {/* Admin banner */}
      {adminMode&&<div style={{...card({marginBottom:12,padding:"9px 12px",background:C.rl,border:`1px solid ${C.red}44`})}}>
        <div style={{fontSize:11,color:C.red,fontWeight:700}}>🔓 Modo administrador activo — puedes seleccionar y borrar registros en la pestaña Registros</div>
      </div>}

      {/* Filtros tiempo */}
      <div style={{display:"flex",gap:5,marginBottom:12}}>
        {FILTROS.map(f=><button key={f.id} onClick={()=>setFiltro(f.id)} style={{...btn(filtro===f.id?"primary":"outline","sm")}}>{f.label}</button>)}
        <div style={{marginLeft:"auto",background:C.al,color:C.accent,fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,display:"flex",alignItems:"center"}}>{datos.length} reg.</div>
      </div>

      {/* Vista toggle */}
      <div style={{display:"flex",gap:5,marginBottom:14}}>
        <button onClick={()=>setVista("graficas")} style={{...btn(vista==="graficas"?"primary":"outline","sm"),flex:1}}>📊 Gráficas</button>
        <button onClick={()=>setVista("registros")} style={{...btn(vista==="registros"?"primary":"outline","sm"),flex:1}}>📋 Registros</button>
      </div>

      {datos.length===0&&<div style={{...card({textAlign:"center",padding:28,color:C.muted})}}>Sin registros en este período.</div>}

      {/* ── GRÁFICAS ── */}
      {vista==="graficas"&&datos.length>0&&<>
        {/* Por equipo */}
        <div style={{...card({marginBottom:12})}} >
          <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>🔥 Consultas por equipo</div>
          <BarChart datos={topEquipos} colorFn={colorFn}/>
        </div>
        {/* Por marca */}
        <div style={{...card({marginBottom:12})}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>🏷️ Consultas por marca</div>
          <BarChart datos={topMarcas} colorFn={i=>colores[(i+2)%colores.length]}/>
        </div>
        {/* Por referencia */}
        <div style={{...card({marginBottom:12})}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>📌 Consultas por referencia</div>
          <BarChart datos={topRefs} colorFn={i=>colores[(i+4)%colores.length]}/>
        </div>
        {/* Por síntoma */}
        <div style={card()}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>⚠️ Consultas más frecuentes</div>
          <BarChart datos={topSintomas} colorFn={i=>i===0?C.red:`${C.red}99`}/>
        </div>
      </>}

      {/* ── REGISTROS ── */}
      {vista==="registros"&&datos.length>0&&<>
        {adminMode&&seleccionados.size>0&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,padding:"8px 12px",background:C.rl,borderRadius:8,border:`1px solid ${C.red}44`}}>
            <span style={{fontSize:12,color:C.red,fontWeight:700}}>{seleccionados.size} seleccionado(s)</span>
            <button onClick={borrarSeleccionados} style={{...btn("outline","sm"),color:C.red,borderColor:C.red,fontSize:11}}>🗑 Borrar</button>
          </div>
        )}
        <div style={card()}>
          {[...datos].reverse().map((f,i)=>(
            <div key={i} onClick={()=>adminMode&&toggleSel(i)}
              style={{display:"flex",gap:9,padding:"9px 0",borderBottom:i<datos.length-1?`1px solid ${C.border}`:"none",alignItems:"flex-start",cursor:adminMode?"pointer":"default",background:seleccionados.has(i)?"#fef2f2":"transparent",borderRadius:4,marginLeft:-4,paddingLeft:4}}>
              {adminMode&&<div style={{width:16,height:16,borderRadius:4,border:`2px solid ${seleccionados.has(i)?C.red:C.border}`,background:seleccionados.has(i)?C.red:"transparent",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {seleccionados.has(i)&&<span style={{color:"#fff",fontSize:9,fontWeight:900}}>✓</span>}
              </div>}
              <span style={{fontSize:14,flexShrink:0}}>{EQUIPOS.find(e=>e.tipo===f.equipo)?.icon||"🔧"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:600}}>{f.equipo} · {f.marca} · {f.ref}</div>
                <div style={{fontSize:10,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.sintoma}</div>
              </div>
              <div style={{fontSize:9,color:C.light,flexShrink:0,textAlign:"right"}}>
                {f.fecha?new Date(f.fecha).toLocaleDateString("es-CO",{day:"2-digit",month:"short"}):""}
              </div>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REPUESTOS
// ══════════════════════════════════════════════════════════════════════════════
function RepuestosTab() {
  const [sT,setST]=useState(null); const [sM,setSM]=useState(null); const [sR,setSR]=useState(null);
  const [search,setSearch]=useState("");

  // Filtrar repuestos según selección y búsqueda
  const repBase = sM ? REPUESTOS.filter(r=>r.marca===sM.nombre) : REPUESTOS;
  const resultados = search.trim().length>1
    ? repBase.filter(r=>{
        const q=search.toLowerCase();
        return r.cod.toLowerCase().includes(q)||r.desc.toLowerCase().split(" ").some(w=>w.length>3&&q.includes(w))||q.split(" ").some(w=>w.length>3&&r.desc.toLowerCase().includes(w));
      }).slice(0,12)
    : [];

  // Grupos para vista sin búsqueda
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
          {r.cant>1&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>Precio por {r.cant} unidades</div>}
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
      {/* PASO 1 — Equipo */}
      {!sT && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIPOS.map(eq=><div key={eq.tipo} onClick={()=>{setST(eq);setSM(null);setSR(null);setSearch("");}} style={{...card({cursor:"pointer",textAlign:"center",padding:"16px 8px"})}}><div style={{fontSize:26,marginBottom:5}}>{eq.icon}</div><div style={{fontSize:12,fontWeight:700}}>{eq.tipo}</div></div>)}</div>}
      {/* PASO 2 — Marca */}
      {sT&&!sM&&<div>
        <div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sT.icon} {sT.tipo}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {sT.marcas.map(m=><div key={m.nombre} onClick={()=>{setSM(m);setSR(null);setSearch("");}} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:12,fontWeight:600}}>{m.nombre}</div>)}
        </div>
        <div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setST(null)}>← Volver</div>
      </div>}
      {/* PASO 3 — Referencia */}
      {sT&&sM&&!sR&&<div>
        <div style={{fontSize:12,fontWeight:700,marginBottom:9,color:C.muted}}>{sM.nombre}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {sM.refs.map(r=><div key={r} onClick={()=>{setSR(r);setSearch("");}} style={{...card({padding:"8px 14px",cursor:"pointer"}),fontSize:11}}>{r}</div>)}
        </div>
        <div style={{marginTop:10,cursor:"pointer",fontSize:11,color:C.muted}} onClick={()=>setSM(null)}>← Volver</div>
      </div>}
      {/* CONTENIDO */}
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
          {open===i&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}><div style={{fontSize:12,color:C.muted,marginBottom:8}}>{e.desc}</div>{e.pasos.map((p,j)=><div key={j} style={{display:"flex",gap:9,marginBottom:7}}><div style={{width:20,height:20,background:C.accent,color:"#fff",fontSize:10,fontWeight:700,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{j+1}</div><div style={{fontSize:12,lineHeight:1.6,paddingTop:2}}>{p}</div></div>)}</div>}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("inicio");
  const [fallas, setFallas] = useState([]);

  useEffect(() => { setFallas(loadF()); }, []);

  const registrar = (f) => {
    const n = { ...f, fecha: new Date().toISOString() };
    const a = [...fallas, n];
    setFallas(a);
    saveF(a);
  };

  return (
    <>
      <Head>
        <title>CEM IA Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <meta name="theme-color" content="#2563eb"/>
        <link rel="manifest" href="/manifest.json"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="CEM IA"/>
      </Head>
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",color:C.text,maxWidth:520,margin:"0 auto"}}>
        {/* Header */}
        <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:9,position:"sticky",top:0,zIndex:100}}>
          <div style={{position:"relative",flexShrink:0}}>
            <LogoCEM size={42}/>
            <div style={{position:"absolute",top:-4,right:-7,background:"#e8432d",color:"#fff",fontSize:9,fontWeight:900,padding:"2px 5px",borderRadius:4,fontFamily:"Impact,sans-serif"}}>IA</div>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800}}>CEM IA Assistant</div>
            <div style={{fontSize:9,color:C.muted}}>Centro de Excelencia de Mantenimiento</div>
          </div>
          {fallas.length>0&&<div style={{marginLeft:"auto",background:C.al,color:C.accent,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>{fallas.length} reg.</div>}
        </div>

        {tab==="inicio"      && <InicioTab onNav={setTab}/>}
        {tab==="chat"        && <ChatTab onFalla={registrar}/>}
        {tab==="instalacion" && <InstalacionTab/>}
        {tab==="planes"      && <PlanesTab/>}
        {tab==="limpieza"    && <LimpiezaTab/>}
        {tab==="repuestos"  && <RepuestosTab/>}
        {tab==="stats"       && <StatsTab fallas={fallas} onBorrar={f=>{setFallas(f);saveF(f);}}/>}
        {tab==="guia"        && <GuiaTab/>}

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
