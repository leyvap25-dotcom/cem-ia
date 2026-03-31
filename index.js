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
  Horno:["Código de error en pantalla","No genera vapor","No enciende","Gotea por la puerta","Ruidos extraños","Error durante la limpieza","Sobrecalentamiento","Sonda térmica","No alcanza temperatura","Quema los alimentos","Puerta no cierra","Ventilador no gira","Pantalla en blanco","Olor a quemado","Temperatura irregular","No enciende quemador (gas)","Falla eléctrica","CareControl en rojo"],
  Cafetera:["No calienta el agua","No extrae café","Gotea","No enciende","Error en pantalla","Poca presión"],
  Granizadora:["No enfría","No mezcla","Gotea","No enciende","Ruido extraño","Producto muy líquido","Producto muy sólido"],
  "Nevera / Congelador":["No enfría","Ruido extraño","Gotea agua","Escarcha excesiva","No enciende","Temperatura inestable"],
};

const ALIAS_MARCA = [
  { words:["chefto","cheftop","chef top","cheff"], marca:"Unox", ref:"ChefTop" },
  { words:["bakertop","baker"], marca:"Unox", ref:"BakerTop" },
  { words:["rational","racional"], marca:"Rational", ref:null },
  { words:["scc","selfcooking"], marca:"Rational", ref:"SCC WE 10×1/1 GN" },
  { words:["unox"], marca:"Unox", ref:null },
  { words:["zanolli","zanoli"], marca:"Zanolli", ref:null },
  { words:["turbochef","turbo"], marca:"Turbochef", ref:null },
  { words:["hhc"], marca:"Turbochef", ref:"HHC2020" },
  { words:["bunn","bun"], marca:"Bunn", ref:null },
  { words:["ultra-2","ultra2"], marca:"Bunn", ref:"ULTRA-2" },
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
  "Rational-SCC WE 6×1/1 GN":{ electrico:{tension:"3N AC 400V",frecuencia:"50/60 Hz",potencia:"10.5 kW",corriente:"16 A",fusible:"3×16 A",conexion:"5 hilos (3F+N+T)"},agua:{presion:"150–600 kPa",caudal:"20 l/min",conexion:'3/4" BSP',desague:"DN 50",temp:"máx. 30°C"},dimensiones:{ancho:"847 mm",profundidad:"771 mm",altura:"600 mm",peso:"80 kg",capacidad:"6×1/1 GN"},notas:"Distancia mínima pared posterior: 50 mm. Requiere campana extractora."},
  "Rational-SCC WE 10×1/1 GN":{ electrico:{tension:"3N AC 400V",frecuencia:"50/60 Hz",potencia:"18.5 kW",corriente:"32 A",fusible:"3×32 A",conexion:"5 hilos (3F+N+T)"},agua:{presion:"150–600 kPa",caudal:"20 l/min",conexion:'3/4" BSP',desague:"DN 50",temp:"máx. 30°C"},dimensiones:{ancho:"847 mm",profundidad:"771 mm",altura:"1000 mm",peso:"120 kg",capacidad:"10×1/1 GN"},notas:"Conexión fija recomendada. Filtro en acometida de agua."},
  "Unox-Arianna (XEFR-04HS)":{ electrico:{tension:"1F / 230V",frecuencia:"50/60 Hz",potencia:"3.5 kW",corriente:"Ver placa",fusible:"Diferencial 0.03A tipo A + disyuntor cat. III",conexion:"Cable + enchufe Schuko de fábrica"},agua:{presion:"150–600 kPa (recomendada 200 kPa)",caudal:"mín. 300 l/h",conexion:"Reductor de presión integrado",desague:"Parte trasera — pendiente mín. 4°, tubo resistente a 90°C",temp:"máx. 30°C"},dimensiones:{ancho:"1053 mm",profundidad:"674 mm",altura:"585 mm",peso:"Ver placa",capacidad:"4 bandejas 460×330"},notas:"Temperatura ambiente +5°C a +35°C. Distancia mín. 5 cm. NUNCA en el piso directamente."},
  "Unox-BakerTop":{ electrico:{tension:"3N AC 400V / 220-240V",frecuencia:"50/60 Hz",potencia:"Según modelo",corriente:"Según modelo",fusible:"Diferencial 0.03A tipo A + magnetotérmico cat. III",conexion:"5 hilos (3F+N+T)"},agua:{presion:"150–600 kPa",caudal:"mín. 300 l/h",conexion:'3/4" NPT',desague:"Sifón tipo, inclinación mín. 4%",temp:"máx. 30°C"},dimensiones:{ancho:"860 mm",profundidad:"967 mm",altura:"675–1163 mm",peso:"90–148 kg",capacidad:"4, 6, 10 bandejas 600×400"},notas:"Agua de vapor: dureza ≤ 8°dH. Mantenimiento anual obligatorio."},
  "Turbochef-HHC2020":{ electrico:{tension:"AC 208–240V",frecuencia:"50/60 Hz",potencia:"6.7 kW",corriente:"32 A",fusible:"32 A",conexion:"2 hilos + tierra"},agua:{presion:"N/A",caudal:"N/A",conexion:"No requiere",desague:"No requiere",temp:"N/A"},dimensiones:{ancho:"559 mm",profundidad:"813 mm",altura:"584 mm",peso:"60 kg",capacidad:"Horno alta velocidad"},notas:"No requiere agua ni extracción especial."},
  "Bunn-VPR":{ electrico:{tension:"AC 120V/240V",frecuencia:"50/60 Hz",potencia:"1.55 kW",corriente:"13 A",fusible:"15 A",conexion:"2 hilos + tierra"},agua:{presion:"20–90 psi",caudal:"2 l/min",conexion:'1/4" tubing',desague:"Bandeja con desagüe",temp:"Fría"},dimensiones:{ancho:"279 mm",profundidad:"457 mm",altura:"432 mm",peso:"5.2 kg",capacidad:"1.9 L/jarra"},notas:"Requiere toma de agua fría y drenaje de bandeja."},
  "Bunn-ULTRA-2":{ electrico:{tension:"AC 120V",frecuencia:"60 Hz",potencia:"0.93 kW",corriente:"8 A",fusible:"15 A",conexion:"2 hilos + tierra"},agua:{presion:"20–90 psi",caudal:"2 l/min",conexion:'1/4" tubing',desague:"Bandeja frontal",temp:"Fría filtrada"},dimensiones:{ancho:"368 mm",profundidad:"508 mm",altura:"686 mm",peso:"22 kg",capacidad:"2×4.7 L"},notas:"Agua fría filtrada. Limpiar condensador mensualmente."},
};

const PLANES = {
  "Rational-SCC WE 10×1/1 GN":{ diario:["CleanJet+Care diario","Limpiar junta de puerta","Verificar desagüe"], semanal:["Limpiar filtro de aire","Revisar chapa deflectora"], mensual:["Descalcificar inyector de vapor","Revisar sonda térmica"], semestral:["Cambiar junta si hay daño"], anual:["Inspección general certificada","Descalcificación generador"] },
  "Unox-ChefTop":{ diario:["Ejecutar ciclo de limpieza con UNOX Det&Rinse al finalizar jornada","Retirar TODAS las bandejas antes del ciclo de lavado","Verificar grifo de agua abierto","Verificar tanque de detergente lleno y bien instalado","Limpiar junta de puerta visualmente","Verificar que la chimenea no esté obstruida"], semanal:["Inspeccionar interior de cámara: manchas, incrustaciones, corrosión","Verificar sello de puerta","Verificar P-trap del desagüe: llenar con agua si está seco","Limpiar filtro mecánico de agua"], mensual:["Verificar presión de agua: entrada 1.5-6 bar, salida reductor ~2.3 bar","Verificar válvulas solenoides EL1, EL2, EG1, EG2","Revisar P-trap y sistema de drenaje","Verificar calibración del horno en Service Menu (PIN: 99857)"], trimestral:["Limpiar chimenea con cepillo metálico","Verificar capacitores de motores: valor esperado 6.3 µF","Solo gas: verificar corriente de ionización 1.5-10 µA DC","Solo gas: verificar gaps electrodos — 3 mm entre electrodos"], semestral:["Actualizar firmware","Verificar contactores y elementos calefactores"], anual:["Solo gas: reemplazar empaques kit KGN1569A","Reemplazar empaque de puerta completo si hay deterioro","Evaluar calidad del agua","Respaldar parámetros en USB (PARAM_S6)"] },
  "Unox-BakerTop":{ diario:["Ejecutar ciclo de limpieza con UNOX Det&Rinse","Retirar todas las bandejas antes del lavado","Verificar grifo de agua abierto y tanque de detergente lleno"], semanal:["Inspeccionar cámara y sello de puerta","Verificar P-trap del desagüe"], mensual:["Verificar presión de agua entrada 1.5-6 bar","Verificar válvulas solenoides EL1, EL2, EG1, EG2"], semestral:["Actualizar firmware","Revisar contactores y elementos calefactores"], anual:["Solo gas: reemplazar empaques kit KGN1569A","Respaldo de parámetros en USB","Evaluar calidad del agua"] },
};
const PLAN_GEN = { diario:["Limpiar exteriores","Verificar funcionamiento básico"], semanal:["Limpiar filtros accesibles"], mensual:["Inspección visual de mangueras"], semestral:["Revisión por técnico"], anual:["Mantenimiento preventivo completo"] };

const LIMPIEZAS_DATA = {
  Horno:[{titulo:"CleanJet+Care — Rational SCC",alerta:"Usar gafas, guantes y delantal.",pasos:["Seleccionar nivel 1-6 según suciedad.","Esperar <75°C antes de iniciar.","Retirar contenedores y parrillas.","Pastillas en la chapa deflectora, NUNCA en la cámara.","Cerrar puerta y pulsar Inicio.","Revisar residuos al terminar."]}],
  Cafetera:[{titulo:"Cafetera Bunn — Diario",alerta:"No sumergir piezas eléctricas.",pasos:["Lavar canasta y filtro.","Enjuagar recipiente.","Limpiar cabezal con cepillo."]}],
  Granizadora:[{titulo:"Granizadora Bunn — Semanal",alerta:"Sin agua a presión en el compresor.",pasos:["Apagar y desconectar.","Retirar y lavar el tambor.","Limpiar interior.","Limpiar rejillas del condensador."]}],
  "Nevera / Congelador":[{titulo:"Nevera — Quincenal",alerta:"No raspar escarcha con metal.",pasos:["Apagar y desenchufar.","Retirar productos.","Limpiar con bicarbonato.","Limpiar rejillas y juntas."]}],
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
  {code:"Service 23/24",nivel:"CRÍTICO",desc:"Error hardware. Apagar inmediatamente.",pasos:["Apagar con interruptor 0/I.","Llamar Service: 03 89 57 05 55.","No rearmar hasta instrucciones."]},
  {code:"Service 26",nivel:"CRÍTICO",desc:"Falla CleanJet.",pasos:["Cancelar CleanJet en menú.","Retirar tabletas con guantes.","Enjuagar con ducha de mano."]},
  {code:"Service 32/33",nivel:"PELIGRO",desc:"Fallo de gas.",pasos:["Cerrar llave del gas.","Ventilar el local.","Llamar técnico de gas."]},
  {code:"Service 14",nivel:"LIMITADO",desc:"Solo Calor Seco.",pasos:["Cancelar con Flecha.","Verificar grifo de agua abierto."]},
  {code:"Service 25",nivel:"FRECUENTE",desc:"CleanJet sin agua.",pasos:["Verificar grifo abierto.","Limpiar filtro de acometida."]},
  {code:"Service 27",nivel:"SIMPLE",desc:"Reiniciar alimentación.",pasos:["Desconectar 5 segundos.","Reconectar y verificar."]},
  {code:"Service 29",nivel:"FRECUENTE",desc:"Sobrecalentamiento.",pasos:["Limpiar filtro de aire.","Revisar ventilación."]},
  {code:"Service 31",nivel:"COMÚN",desc:"Sonda térmica defectuosa.",pasos:["Verificar inserción de la sonda.","Inspeccionar cable."]},
  {code:"Service 10/11/12",nivel:"MODERADO",desc:"Puede seguir cocinando.",pasos:["Presionar Flecha para cancelar.","Programar visita de servicio."]},
];
const NIVEL_C = {CRÍTICO:"red",PELIGRO:"red",LIMITADO:"blue",FRECUENTE:"yellow",SIMPLE:"green",COMÚN:"blue",MODERADO:"blue"};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
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
  {id:"chat",icon:"🤖",label:"Diagnóstico"},
  {id:"planes",icon:"📋",label:"Planes"},
  {id:"instalacion",icon:"⚡",label:"Instalación"},
  {id:"limpieza",icon:"🧹",label:"Limpieza"},
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
const SALUDO_TXT = "Hola. Soy el asistente técnico del CEM. Con qué equipo necesitas ayuda hoy.";
const SALUDO_DISPLAY = "¡Hola! Soy el asistente técnico del CEM.\n\n¿Con qué equipo necesitas ayuda hoy?\n\n💡 Menciona marca y referencia para mejor diagnóstico.";

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
    const system = `Asistente técnico CEM. Español colombiano simple. Máximo 120 palabras.
Equipo: ${ctx?.tipo?.tipo||"?"} ${ctx?.marca?.nombre||""} ${ctx?.ref||""}
${esRational?"Rational SCC: 23/24=apagar ya; 26=cancelar CleanJet; 14=calor seco; 25=sin agua; 27=reiniciar 5s; 29=filtro aire; 31=sonda.":""}
Responde:
Causa: [1 línea]
Pasos: 1. 2. 3.
Escalar: [cuándo llamar]
Tip: [consejo]`;
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
        body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:300, system, messages }),
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
    {id:"chat",icon:"🤖",color:C.accent,bg:C.al,titulo:"Diagnóstico IA",desc:"Describe la falla por texto o voz."},
    {id:"instalacion",icon:"⚡",color:C.purple,bg:C.pl,titulo:"Instalación",desc:"Requisitos eléctricos e hidráulicos."},
    {id:"planes",icon:"📋",color:C.green,bg:C.gl,titulo:"Planes PM",desc:"Tareas preventivas por equipo."},
    {id:"limpieza",icon:"🧹",color:C.yellow,bg:C.yl,titulo:"Limpieza",desc:"Procedimientos para operadores."},
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
      <div style={{textAlign:"center",padding:"14px 0 6px",borderTop:`1px solid ${C.border}`,marginTop:6,fontSize:10,color:C.light}}>Rational · Unox · Zanolli · Turbochef · Bunn · v3.0</div>
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
  const [sT,setST]=useState(null); const [open,setOpen]=useState(null);
  const datos=sT?(LIMPIEZAS_DATA[sT.tipo]||[]):[];
  return (
    <div style={{padding:16,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:12}}>Guías de Limpieza</div>
      <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
        {EQUIPOS.map(eq=><button key={eq.tipo} onClick={()=>{setST(eq);setOpen(null);}} style={{...btn(sT?.tipo===eq.tipo?"primary":"outline","sm"),flexShrink:0}}>{eq.icon} {eq.tipo}</button>)}
      </div>
      {!sT&&<div style={{...card({textAlign:"center",padding:28,color:C.muted})}}>Selecciona un equipo arriba.</div>}
      {datos.length===0&&sT&&<div style={{...card({textAlign:"center",padding:28,color:C.muted})}}>Próximamente para {sT.tipo}.</div>}
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
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════════════════════
function StatsTab({ fallas }) {
  const [filtro,setFiltro]=useState("todo");
  const FILTROS=[{id:"todo",label:"Todo"},{id:"hoy",label:"Hoy"},{id:"semana",label:"7d"},{id:"mes",label:"30d"}];
  const ahora=new Date();
  const filtrar=lista=>{ if(filtro==="todo")return lista; const dias={hoy:1,semana:7,mes:30}[filtro]; const desde=filtro==="hoy"?new Date(ahora.getFullYear(),ahora.getMonth(),ahora.getDate()):new Date(ahora.getTime()-dias*24*60*60*1000); return lista.filter(f=>f.fecha&&new Date(f.fecha)>=desde); };
  const datos=filtrar(fallas);
  if(fallas.length===0)return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"calc(100vh - 110px)",padding:16,textAlign:"center"}}><div style={{fontSize:44,marginBottom:10}}>📊</div><div style={{fontSize:15,fontWeight:700,marginBottom:5}}>Sin datos aún</div><div style={{fontSize:12,color:C.muted}}>Usa el Diagnóstico IA para registrar fallas.</div></div>);
  const contar=key=>datos.reduce((a,f)=>{const k=f[key]||"Sin dato";a[k]=(a[k]||0)+1;return a;},{});
  const top=(key,n=8)=>Object.entries(contar(key)).sort((a,b)=>b[1]-a[1]).slice(0,n);
  const tS=top("sintoma"); const mx=tS[0]?.[1]||1;
  return (
    <div style={{padding:14,overflowY:"auto",height:"calc(100vh - 110px)"}}>
      <div style={{fontSize:17,fontWeight:800,marginBottom:10}}>Estadísticas</div>
      <div style={{display:"flex",gap:5,marginBottom:12}}>{FILTROS.map(f=><button key={f.id} onClick={()=>setFiltro(f.id)} style={{...btn(filtro===f.id?"primary":"outline","sm")}}>{f.label}</button>)}</div>
      {datos.length===0&&<div style={{...card({textAlign:"center",padding:28,color:C.muted})}}>Sin registros en este período.</div>}
      {datos.length>0&&<>
        <div style={{...card(),marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>🔴 Fallas más frecuentes</div>
          {tS.map(([s,n],i)=>(<div key={s} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{fontWeight:i===0?700:400}}>{s}</span><span style={{fontWeight:700,color:C.accent}}>{n}x</span></div><div style={{background:C.bg,borderRadius:3,height:5,overflow:"hidden"}}><div style={{background:i===0?C.accent:`${C.accent}66`,width:`${(n/mx)*100}%`,height:"100%"}}/></div></div>))}
        </div>
        <div style={card()}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>🕐 Últimas consultas</div>
          {[...datos].reverse().slice(0,10).map((f,i)=>(<div key={i} style={{display:"flex",gap:9,padding:"7px 0",borderBottom:i<9?`1px solid ${C.border}`:"none",alignItems:"flex-start"}}><span style={{fontSize:14,flexShrink:0}}>{EQUIPOS.find(e=>e.tipo===f.equipo)?.icon||"🔧"}</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600}}>{f.marca} · {f.ref}</div><div style={{fontSize:10,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.sintoma}</div></div><div style={{fontSize:9,color:C.light,flexShrink:0}}>{f.fecha?new Date(f.fecha).toLocaleDateString("es-CO",{day:"2-digit",month:"short"}):""}</div></div>))}
        </div>
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GUÍA
// ══════════════════════════════════════════════════════════════════════════════
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
        {tab==="stats"       && <StatsTab fallas={fallas}/>}
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
