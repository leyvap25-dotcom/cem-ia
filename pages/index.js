import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";

// --- CONSTANTES DE ESTILO ---
const COLORS = {
  bg: "#f7f8fc", white: "#fff", border: "#e4e8f0",
  accent: "#2563eb", al: "#eff6ff",
  red: "#dc2626", rl: "#fef2f2",
  green: "#16a34a", gl: "#f0fdf4",
  text: "#111827", muted: "#6b7280", light: "#9ca3af",
};

// NOTA: Para GitHub, mueve EQUIPO_SVG y EQUIPOS a un archivo /data/equipos.js
// Aquí mantengo la estructura lógica para que puedas copiar y pegar.

const LogoCEM = ({ size = 44 }) => (
  <svg width={size} height={size * 0.88} viewBox="0 0 280 247" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="38,247 139,8 240,247" fill="#e8432d"/>
    <text x="26" y="238" fontFamily="Impact" fontSize="105" fill="#1a3d4a" letterSpacing="-3">CEM</text>
    <text x="22" y="234" fontFamily="Impact" fontSize="105" fill="#2d5f6e" letterSpacing="-3">CEM</text>
  </svg>
);

// --- COMPONENTES ATÓMICOS ---
const Card = ({ children, style, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      background: COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 16,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: onClick ? "pointer" : "default",
      ...style
    }}
    onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = "translateY(-2px)")}
    onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = "translateY(0)")}
  >
    {children}
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function CEMApp() {
  const [rol, setRol] = useState(null); // 'tecnico' | 'operador'
  const [tab, setTab] = useState("inicio");
  const [history, setHistory] = useState([]);

  // Cargar historial local al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("cem_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Función para guardar fallas registradas
  const registrarFalla = (falla) => {
    const nueva = { ...falla, id: Date.now(), fecha: new Date().toISOString() };
    const actualizado = [nueva, ...history].slice(0, 50); // Guardar últimas 50
    setHistory(actualizado);
    localStorage.setItem("cem_history", JSON.stringify(actualizado));
  };

  if (!rol) return <WelcomeScreen onSelect={setRol} />;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", maxWidth: 500, margin: "0 auto", position: "relative" }}>
      <Head>
        <title>CEM IA | Confiabilidad Operacional</title>
      </Head>

      {/* Header Fijo */}
      <header style={{ 
        background: COLORS.white, 
        padding: "12px 16px", 
        display: "flex", 
        alignItems: "center", 
        borderBottom: `1px solid ${COLORS.border}`,
        position: "sticky", top: 0, zIndex: 10
      }}>
        <LogoCEM size={32} />
        <div style={{ marginLeft: 12, flex: 1 }}>
          <h1 style={{ fontSize: 14, fontWeight: 900, margin: 0 }}>CEM IA Assistant</h1>
          <span style={{ fontSize: 10, color: COLORS.muted }}>Módulo: {rol === 'tecnico' ? 'Técnico' : 'Operador'}</span>
        </div>
        <button 
          onClick={() => setRol(null)} 
          style={{ background: COLORS.al, border: "none", color: COLORS.accent, fontSize: 10, padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}
        >
          CAMBIAR ROL
        </button>
      </header>

      {/* Navegación de Contenido */}
      <main style={{ paddingBottom: 80 }}>
        {tab === "inicio" && (rol === 'tecnico' ? <InicioTecnico setTab={setTab} /> : <InicioOperador setTab={setTab} />)}
        {tab === "chat" && <ChatComponent rol={rol} onFallaRegistrada={registrarFalla} />}
        {tab === "repuestos" && <RepuestosView />}
        {/* Agrega aquí el resto de tus pestañas como componentes separados */}
      </main>

      {/* Navbar Inferior */}
      <nav style={{ 
        position: "fixed", bottom: 0, width: "100%", maxWidth: 500, 
        background: COLORS.white, borderTop: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-around", padding: "8px 0"
      }}>
        <NavButton icon="🏠" label="Inicio" active={tab === "inicio"} onClick={() => setTab("inicio")} />
        <NavButton icon="🤖" label="Chat IA" active={tab === "chat"} onClick={() => setTab("chat")} />
        {rol === 'tecnico' && <NavButton icon="🔩" label="Repuestos" active={tab === "repuestos"} onClick={() => setTab("repuestos")} />}
      </nav>
    </div>
  );
}

// --- SUB-COMPONENTES DE NAVEGACIÓN ---
const NavButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
    color: active ? COLORS.accent : COLORS.muted, cursor: "pointer", width: "25%"
  }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ fontSize: 9, fontWeight: active ? 800 : 500 }}>{label}</span>
  </button>
);

function WelcomeScreen({ onSelect }) {
  return (
    <div style={{ height: "100vh", background: "#0f172a", display: "flex", flexDirection: "center", justifyContent: "center", alignItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center", width: "100%" }}>
        <LogoCEM size={80} />
        <h2 style={{ color: "white", marginTop: 20 }}>Bienvenido al CEM</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 30 }}>Asistente de Inteligencia para Mantenimiento</p>
        <div style={{ display: "grid", gap: 12 }}>
          <button onClick={() => onSelect('tecnico')} style={welcomeBtnStyle(true)}>SOY TÉCNICO EXPERTO 🔧</button>
          <button onClick={() => onSelect('operador')} style={welcomeBtnStyle(false)}>SOY OPERADOR / COCINA 👨‍🍳</button>
        </div>
      </div>
    </div>
  );
}

const welcomeBtnStyle = (primary) => ({
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  background: primary ? COLORS.accent : "rgba(255,255,255,0.1)",
  color: "white",
  fontWeight: 800,
  fontSize: "14px",
  cursor: "pointer"
});

// --- MEJORA: COMPONENTE DE CHAT CON API ROUTE ---
function ChatComponent({ rol, onFallaRegistrada }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, rol })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.text }]);
      
      // Registrar en el historial de confiabilidad
      onFallaRegistrada({ sintoma: input, respuesta: data.text });
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "Error de conexión con la API." }]);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ height: "60vh", overflowY: "auto", marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            textAlign: m.role === 'user' ? 'right' : 'left',
            margin: "8px 0"
          }}>
            <span style={{ 
              background: m.role === 'user' ? COLORS.accent : COLORS.white,
              color: m.role === 'user' ? 'white' : COLORS.text,
              padding: "8px 12px", borderRadius: "12px", display: "inline-block",
              fontSize: 13, border: `1px solid ${COLORS.border}`
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe la falla..." 
          style={{ flex: 1, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.border}` }}
        />
        <button onClick={sendMessage} style={{ padding: "12px 20px", background: COLORS.accent, color: "white", border: "none", borderRadius: 8 }}>
          ENVIAR
        </button>
      </div>
    </div>
  );
}

// Estos componentes deben ser desarrollados basándote en tu lógica original
const InicioTecnico = ({ setTab }) => <div style={{padding: 20}}><h2>Panel de Confiabilidad</h2><p>Selecciona una herramienta abajo.</p></div>;
const InicioOperador = ({ setTab }) => <div style={{padding: 20}}><h2>Centro de Ayuda</h2><p>¿Qué ocurre con tu equipo?</p></div>;
const RepuestosView = () => <div style={{padding: 20}}><h2>Catálogo de Repuestos</h2></div>;
