"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const EVENT_DATE = new Date("2026-12-12T21:00:00-03:00");

function useCountdown() {
  const calculate = () => {
    const difference = Math.max(0, EVENT_DATE.getTime() - Date.now());
    return {
      dias: Math.floor(difference / 86_400_000),
      horas: Math.floor((difference / 3_600_000) % 24),
      minutos: Math.floor((difference / 60_000) % 60),
      segundos: Math.floor((difference / 1_000) % 60),
    };
  };
  const [time, setTime] = useState(calculate);
  useEffect(() => {
    const interval = window.setInterval(() => setTime(calculate()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  return time;
}

function Pad({ value }: { value: number }) {
  return <>{String(value).padStart(2, "0")}</>;
}

export default function Home() {
  const countdown = useCountdown();
  const [panel, setPanel] = useState<"music" | "trivia" | "keep" | null>(null);
  const [toast, setToast] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const calendarUrl = useMemo(() => {
    const query = new URLSearchParams({
      action: "TEMPLATE",
      text: "Mis XV de Alma",
      dates: "20261213T000000Z/20261213T090000Z",
      details: "Te espero para compartir una noche inolvidable.",
      location: "Salón El Carmen, Raquel Español 325, Wilde",
    });
    return `https://calendar.google.com/calendar/render?${query}`;
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function submitSong(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const song = String(data.get("song") || "").trim();
    if (!song) return;
    localStorage.setItem("alma-song", song);
    setPanel(null);
    notify(`¡Anotada! “${song}” se suma a la playlist.`);
  }

  function submitMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const memory = String(data.get("memory") || "").trim();
    if (!memory) return;
    localStorage.setItem("alma-memory", memory);
    setPanel(null);
    notify("Tu mensaje quedó guardado para Alma ♡");
  }

  function checkTrivia() {
    if (!answer) return;
    setScore(answer === "b" ? 1 : 0);
  }

  return (
    <main>
      <nav className="floating-nav" aria-label="Navegación de la invitación">
        <a href="#inicio" aria-label="Ir al inicio">A</a>
        <div className="nav-dots" aria-hidden="true"><i /><i /><i /></div>
        <a href="#confirmar">RSVP</a>
      </nav>

      <section id="inicio" className="hero panel-image">
        <picture>
          <source media="(min-width: 840px)" srcSet="/alma/portada-horizontal.png" />
          <img src="/alma/portada.png" alt="Mis XV de Alma, una composición rosa con perlas y cintas" />
        </picture>
        <a className="scroll-cue" href="#cuenta"><span>DESCUBRÍ LA INVITACIÓN</span><b>↓</b></a>
      </section>

      <section id="cuenta" className="countdown-section">
        <div className="pearl-strand" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
        <p className="eyebrow">FALTA MUY POCO</p>
        <div className="countdown-grid" aria-label="Cuenta regresiva para el 12 de diciembre de 2026">
          <div className="days"><strong><Pad value={countdown.dias} /></strong><span>DÍAS</span></div>
          <div><strong><Pad value={countdown.horas} /></strong><span>HORAS</span></div>
          <div><strong><Pad value={countdown.minutos} /></strong><span>MINUTOS</span></div>
          <div><strong><Pad value={countdown.segundos} /></strong><span>SEGUNDOS</span></div>
        </div>
        <p className="tiny-note">PARA UNA NOCHE INOLVIDABLE</p>
      </section>

      <section id="fecha" className="panel-image interactive-panel">
        <img src="/alma/fecha.png" alt="12 de diciembre, de 21:00 a 06:00 horas" />
        <a className="hotspot calendar" href={calendarUrl} target="_blank" rel="noreferrer" aria-label="Agregar los XV de Alma a Google Calendar" />
      </section>

      <section id="ubicacion" className="panel-image interactive-panel">
        <img src="/alma/ubicacion.png" alt="Cómo llegar al Salón El Carmen, Raquel Español 325, Wilde" />
        <a className="hotspot map" href="https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n+El+Carmen+Raquel+Espa%C3%B1ol+325+Wilde" target="_blank" rel="noreferrer" aria-label="Ver ubicación del Salón El Carmen en Google Maps" />
      </section>

      <section id="dress-code" className="dress-section">
        <div className="ribbon ribbon-one" aria-hidden="true" />
        <div className="ribbon ribbon-two" aria-hidden="true" />
        <p className="eyebrow">DRESS CODE</p>
        <h2>Elegante</h2>
        <div className="dress-illustration" aria-hidden="true"><span>✦</span></div>
        <p>La noche pide brillos,<br />tonos suaves y tu mejor look.</p>
        <div className="dress-note"><i />El rosa queda reservado para Alma<i /></div>
      </section>

      <section id="musica" className="panel-image interactive-panel">
        <img src="/alma/musica.png" alt="Música: qué canción no puede faltar" />
        <button className="hotspot music" onClick={() => setPanel("music")} aria-label="Sumar una canción a la playlist" />
      </section>

      <section id="bloomkeep" className="panel-image interactive-panel">
        <img src="/alma/bloomkeep.png" alt="BloomKeep: compartí tus fotos y mensajes en tiempo real" />
        <button className="hotspot keep" onClick={() => setPanel("keep")} aria-label="Ingresar a BloomKeep" />
      </section>

      <section id="trivias" className="panel-image interactive-panel">
        <img src="/alma/trivias.png" alt="BloomTrivias: respondé, votá y subí al ranking" />
        <button className="hotspot trivia" onClick={() => { setPanel("trivia"); setScore(null); setAnswer(""); }} aria-label="Empezar a jugar BloomTrivias" />
      </section>

      <section id="confirmar" className="panel-image interactive-panel closing">
        <img src="/alma/cierre.png" alt="Alma te invita a celebrar sus quince años" />
        <a className="hotspot rsvp" href="https://wa.me/?text=Hola%2C%20confirmo%20mi%20asistencia%20a%20los%20XV%20de%20Alma%20%E2%99%A1" target="_blank" rel="noreferrer" aria-label="Confirmar asistencia por WhatsApp" />
        <footer><span>HECHO CON ♡ POR</span><strong>BloomDate</strong></footer>
      </section>

      {panel && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setPanel(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setPanel(null)} aria-label="Cerrar">×</button>
            {panel === "music" && <>
              <p className="modal-kicker">PLAYLIST DE ALMA</p><h2 id="modal-title">¿Qué canción no puede faltar?</h2>
              <form onSubmit={submitSong}><label>Tema o artista<input name="song" placeholder="Ej. Golden — Harry Styles" autoFocus /></label><button type="submit">SUMAR A LA LISTA</button></form>
            </>}
            {panel === "keep" && <>
              <p className="modal-kicker">BLOOMKEEP</p><h2 id="modal-title">Dejale algo lindo a Alma</h2>
              <form onSubmit={submitMemory}><label>Tu mensaje<textarea name="memory" placeholder="Un deseo, un recuerdo, unas palabras…" autoFocus /></label><button type="submit">GUARDAR MENSAJE</button></form>
            </>}
            {panel === "trivia" && <>
              <p className="modal-kicker">BLOOMTRIVIAS · 01/03</p><h2 id="modal-title">¿Cuál es el mes favorito de Alma?</h2>
              <div className="answers">
                {[['a','Enero'],['b','Diciembre'],['c','Julio']].map(([value,label]) => <button key={value} className={answer === value ? "selected" : ""} onClick={() => setAnswer(value)}><b>{value.toUpperCase()}</b>{label}</button>)}
              </div>
              {score === null ? <button className="primary" onClick={checkTrivia}>RESPONDER</button> : <p className={`result ${score ? "correct" : ""}`}>{score ? "¡Correcto! Conocés muy bien a Alma ✦" : "Casi… la respuesta era diciembre ♡"}</p>}
            </>}
          </div>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
