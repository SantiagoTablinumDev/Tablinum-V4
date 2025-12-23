import { useState, useEffect, useRef } from "react";
import styles from "./FloatingChat.module.css";
import { subespecimen } from '../../store/action'

// ----------------------------------------------------
// NUEVO COMPONENTE: Encapsula el toggle de la lista de preview
// ----------------------------------------------------
const PreviewToggle = ({ data, total }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalCount = total || 'el total';

  return (
    <div className={styles.previewContainer}>
      <button
        className={styles.previewToggle}
        onClick={() => setIsExpanded(!isExpanded)}
        title={`Click para ${isExpanded ? 'ocultar' : 'ver'} la lista de especímenes`}
      >
        <span>
          {isExpanded ? 'Ocultar' : 'Ver'} los primeros {data.length} de {totalCount} especímenes
        </span>
        <span className={styles.toggleIcon}>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <ul className={styles.previewList}>
          {data.map((item, index) => (
            <li key={index}> <a href={`/home/${item.especimennumero}`} target='_blank' >{subespecimen(item.especimennumero)}</a></li>
          ))}
        </ul>
      )}
    </div>
  );
};
// ----------------------------------------------------


export default function FloatingChat({ onSendMessage }) {
  const [open, setOpen] = useState(false);
  const [userMsg, setUserMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  const toggleChat = () => setOpen(!open);

  const sendMessage = async () => {
    if (!userMsg.trim()) return;

    const msg = userMsg.trim();

    setMessages(prev => [...prev, { from: "user", text: msg }]);
    setUserMsg("");
    setIsLoading(true);

    try {
      const res = await onSendMessage(msg);

      const newMessages = [];

      // 1. Añadir la respuesta de texto (siempre existe)
      if (res.answer) {
        newMessages.push({ from: "bot", text: res.answer });
      }

      // 2. Añadir la vista previa estructurada (si existe)
      if (res.preview && res.preview.length > 0) {
        newMessages.push({
          from: "bot",
          type: "preview", // Clave para el renderizado especial
          data: res.preview,
          total: res.total,
        });
      }

      setMessages(prev => [...prev, ...newMessages]);
    } catch (error) {
      console.error("Error en onSendMessage:", error);
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "❌ Ups, hubo un error procesando la consulta." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* FAB */}
      <button className={styles.chatFab} onClick={toggleChat}>
        💬
      </button>

      {open && (
        <div className={styles.backdrop} onClick={toggleChat}>
          <div className={styles.chatModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h5>Asistente</h5>
              <button className={styles.closeBtn} onClick={toggleChat}>×</button>
            </div>

            <div className={styles.body} ref={chatRef}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.from === "user" ? styles.msgUser : styles.msgBot
                  }
                >
                  {/* Lógica de Renderizado: Si es tipo "preview", usamos el componente Toggle */}
                  {m.type === "preview" ? (
                    <PreviewToggle data={m.data} total={m.total} />
                  ) : (typeof m.text === "string" ? (
                    <p>{m.text}</p>
                  ) : (
                    <pre>{JSON.stringify(m.text, null, 2)}</pre>
                  ))}
                </div>
              ))}
              {isLoading && (
                <div className={styles.spinnerContainer}>
                  <div className={styles.spinner}></div>
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <input
                type="text"
                className={styles.input}
                placeholder="Escribí tu consulta…"
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className={styles.sendBtn} onClick={sendMessage}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}