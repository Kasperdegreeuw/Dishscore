import { useEffect, useRef, useState } from 'react';
import { askChatbot, chatbotReady, type ChatMessage } from './chatbot';

/**
 * Schaalt een vaste-grootte ontwerp (Figma-canvas) zodat het altijd in de
 * viewport past. Geeft een zoomfactor (max 1, nooit groter dan 1:1) terug die
 * je als `zoom` op het canvas zet. Lost op dat het ontwerp op 100% rechts
 * uitliep terwijl het op 75% wel paste.
 *
 * Geef je een `designHeight` mee, dan past het ook op viewporthoogte (handig
 * voor modals die helemaal zichtbaar moeten blijven). Laat je hem weg, dan
 * wordt alleen op breedte geschaald (handig voor een scrollbaar dashboard).
 */
function useFitZoom(designWidth: number, designHeight?: number, padding = 48) {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const calc = () => {
      let z = (window.innerWidth - padding) / designWidth;
      if (designHeight) {
        z = Math.min(z, (window.innerHeight - padding) / designHeight);
      }
      setZoom(Math.min(1, z));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [designWidth, designHeight, padding]);
  return zoom;
}

const themes = [
  'biodiversiteit',
  'gezondheid',
  'betaalbaarheid',
  'inclusiviteit',
  'emissies',
  'eerlijke keten'
];

const loadingAssets = {
  ellipsis: './assets/loading-ellipsis.svg',
  laag1: './assets/loading-layer1.svg',
  laag2: './assets/loading-layer2.svg',
  laag3: './assets/loading-layer3.svg'
};

// Scores per factor in volgorde: CO₂-uitstoot, Biodiversiteit, Betaalbaarheid, Inclusiviteit, Evenwichtige keten, Slimmer & schoner
const dashboardMeals = [
  {
    name: 'Seizoenssalade',
    details: 'Loksaal - Vegetarisch - Seizoen',
    image: './assets/meal-seizoenssalade.jpg',
    scores: [90, 85, 75, 80, 82, 88],
  },
  {
    name: 'Kipfilet + rijst',
    details: 'Scharrelkip NL - €4,10 - 0,90kg',
    image: './assets/meal-kipfilet.jpg',
    scores: [65, 60, 78, 72, 70, 68],
  },
  {
    name: 'Vegan burger',
    details: 'Erwteneiwit - €3,80 - 0,42kg',
    image: './assets/meal-vegan-burger.jpg',
    scores: [82, 88, 68, 85, 78, 84],
  },
  {
    name: 'Linzensoep',
    details: 'Peulvruchten - €2,90 - 0,18kg',
    image: './assets/meal-linzensoep.jpg',
    scores: [88, 80, 90, 78, 70, 76],
  },
  {
    name: 'Zalm + groente',
    details: 'MSC-gecertificeerd - €5,60 - 0,60kg',
    image: './assets/meal-zalm.jpg',
    scores: [72, 75, 60, 70, 85, 72],
  },
];

const factors = [
  { name: 'CO₂-uitstoot',       color: '#002caf' },
  { name: 'Biodiversiteit',      color: '#1770dd' },
  { name: 'Betaalbaarheid',      color: '#ffa526' },
  { name: 'Inclusiviteit',       color: '#af66f1' },
  { name: 'Evenwichtige keten',  color: '#f7328c' },
  { name: 'Slimmer & schoner',   color: '#1a3e73' },
];

const dashboardCards = [
  {
    title: 'Hoogste verschil',
    value: '+13 pt',
    note: 'Verbruik/uitstoot t.o.v Seizoenssalade',
    accent: 'blue',
    icon: './assets/card-icon-diff.svg'
  },
  {
    title: 'Kleinste verschil',
    value: '+5 pt',
    note: 'Betaalbaarheid is vrijwel gelijk',
    accent: 'euro',
    icon: './assets/card-icon-euro.svg'
  },
  {
    title: 'CO₂ uitstoot / portie',
    value: '0,42 kg',
    note: '+0,18 kg t.o.v. Seizoenssalade',
    accent: 'leaf',
    icon: './assets/card-icon-leaf.svg'
  },
  {
    title: 'Geschatte kostprijs',
    value: '€3,80',
    note: 'Binnen kantinemarge',
    accent: 'card',
    icon: './assets/card-icon-card.svg'
  }
];

const dashboardIcons = {
  filters: './assets/icon-filters.svg',
  dropdown: './assets/icon-dropdown.svg'
};

const chatbotAssets = {
  robot: './assets/chatbot-robot.png',
  close: './assets/chatbot-close.png',
  send: './assets/chatbot-send.svg',
};

const chatSuggestions = [
  'Welke maaltijd scoort het best op CO₂-uitstoot?',
  'Geef mij tips om de score van de Vegan burger te verbeteren',
  'Vergelijk betaalbaarheid tussen maaltijden',
  "Welke thema's hebben de grootste impact?",
];

const addDishAssets = {
  searchIcon: './assets/adddish-search.png',
  filterIcon: './assets/adddish-filter.png',
  flameIcon: './assets/icon-flame.png',
  backArrow: './assets/adddish-back-arrow.png',
  sidebarThumb1: './assets/adddish-thumb1.png',
  sidebarThumb2: './assets/adddish-thumb2.png',
  sidebarThumb3: './assets/adddish-thumb3.png',
  iconScore:  './assets/adddish-icon-score.svg',
  iconCo2:    './assets/adddish-icon-co2.svg',
  iconPrijs:  './assets/adddish-icon-prijs.svg',
  iconTrash:  './assets/adddish-icon-trash.svg',
  iconArrow:  './assets/adddish-icon-arrow.svg',
};

const detailAssets = {
  radarFill:    './assets/detail-radar-fill.svg',
  co2Dot:       './assets/detail-co2-dot.svg',
  arrowRight:   './assets/detail-arrow-right.svg',
  alt1Image:    './assets/detail-alt1.jpg',
  alt2Image:    './assets/detail-alt2.jpg',
  infoIcon:     './assets/icon-flame.png',
  vsCircle:     './assets/detail-vs-circle.svg',
};

const tallMealCards = [
  {
    name: 'Seizoensalade',
    description: 'Lokaal - vegetarisch - seizoen',
    co2: '0,18 kg',
    price: '€2/100',
    image: './assets/meal-seizoenssalade.jpg',
    badge: 'Beste match',
  },
  {
    name: 'Linzensoep',
    description: 'Lokaal - vegetarisch - peulvruchten',
    co2: '0,3 kg',
    price: '€2/100',
    image: './assets/meal-linzensoep.jpg',
    badge: null,
  },
  {
    name: 'Groentecurry',
    description: 'Biologisch - vegetarisch - seizoen',
    co2: '0,18 kg',
    price: '€2/100',
    image: './assets/meal-groentecurry.jpg',
    badge: null,
  },
  {
    name: 'Capresesalade',
    description: 'Lokaal - vegetarisch - italiaans',
    co2: '0,18 kg',
    price: '€2/100',
    image: './assets/meal-capresesalade.jpg',
    badge: null,
  },
];

const wideMealCards = [
  {
    name: 'Linzensoep',
    description: 'Lokaal - vegetarisch - seizoen',
    price: '€2,30',
    image: './assets/meal-linzensoep.jpg',
  },
  {
    name: 'Bonensoep',
    description: 'Lokaal - vegetarisch - seizoen',
    price: '€2,30',
    image: './assets/meal-bonensoep.jpg',
  },
  {
    name: 'Tomatensoep',
    description: 'Lokaal - vegetarisch - seizoen',
    price: '€2,30',
    image: './assets/meal-tomatensoep.jpg',
  },
  {
    name: 'Volkoren wrap',
    description: 'Lokaal - vegetarisch - seizoen',
    price: '€2,30',
    image: './assets/meal-volkoren-wrap.jpg',
  },
];

export default function App() {
  const [orderedThemes, setOrderedThemes] = useState(themes);
  const [draggedTheme, setDraggedTheme] = useState<string | null>(null);
  const [screen, setScreen] = useState<'onboarding' | 'loading' | 'dashboard'>('onboarding');

  useEffect(() => {
    if (screen !== 'loading') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setScreen('dashboard');
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [screen]);

  function moveTheme(sourceTheme: string, targetTheme: string) {
    if (sourceTheme === targetTheme) {
      return;
    }

    setOrderedThemes((currentThemes) => {
      const nextThemes = [...currentThemes];
      const sourceIndex = nextThemes.indexOf(sourceTheme);
      const targetIndex = nextThemes.indexOf(targetTheme);

      if (sourceIndex === -1 || targetIndex === -1) {
        return currentThemes;
      }

      nextThemes.splice(sourceIndex, 1);
      nextThemes.splice(targetIndex, 0, sourceTheme);
      return nextThemes;
    });
  }

  if (screen === 'loading') {
    return <LoadingScreen />;
  }

  if (screen === 'dashboard') {
    return <DashboardScreen />;
  }

  return (
    <main className="page-shell">
      <div className="background-orbit background-orbit-left" aria-hidden="true" />
      <div className="background-orbit background-orbit-right" aria-hidden="true" />
      <div className="background-arc background-arc-top" aria-hidden="true" />
      <div className="background-arc background-arc-bottom" aria-hidden="true" />

      <section className="page-card">
        <header className="brand-block">
          <div className="dish-logo" aria-label="Dish Score">
            <span className="dish-logo__shadow" aria-hidden="true"><span>Dish </span><span>Score.</span></span>
            <span className="dish-logo__main"><span>Dish </span><span>Score.</span></span>
          </div>
        </header>

        <section className="intro-card" aria-labelledby="intro-title">
          <div className="intro-card__glow" aria-hidden="true" />
          <p id="intro-title" className="intro-copy">
            Goedendag en welkom bij Dishscore.
            <br />
            Voordat we beginnen hebben we eerst nog wat informatie nodig.
          </p>
        </section>

        <section className="form-section">
          <label className="field">
            <span className="field-label">Wat is de naam van uw organisatie?</span>
            <input className="text-input" type="text" placeholder="..." />
          </label>

          <label className="field">
            <span className="field-label">Type organisatie?</span>
            <select className="select-input" defaultValue="">
              <option value="" disabled>
                Kies uit
              </option>
              <option>Bedrijf</option>
              <option>Overheid</option>
              <option>Onderwijs</option>
              <option>Zorg</option>
              <option>Non-profit</option>
            </select>
          </label>

          <div className="divider" aria-hidden="true" />

          <div className="ranking-area">
            <div className="ranking-heading">
              <p className="ranking-title">Sleep deze 6 thema&apos;s op volgorde van prioriteit</p>
              <p className="ranking-subtitle">Klik of sleep om de volgorde later aan te passen.</p>
            </div>

            <div className="ranking-grid" role="list" aria-label="Prioriteitsvolgorde thema&apos;s">
              {orderedThemes.map((theme, index) => (
                <div
                  key={theme}
                  className={`ranking-row${draggedTheme === theme ? ' ranking-row--dragging' : ''}`}
                  role="listitem"
                  aria-label={`${index + 1}. ${theme}`}
                  draggable
                  onDragStart={() => setDraggedTheme(theme)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedTheme) {
                      moveTheme(draggedTheme, theme);
                    }
                  }}
                  onDragEnd={() => setDraggedTheme(null)}
                >
                  <div className="rank-chip">{index + 1}</div>
                  <div className="drag-handle" aria-hidden="true" />
                  <div className="theme-pill">
                    <span>{theme}</span>
                    <span className="theme-pill__grab" aria-hidden="true">
                      ⋮⋮
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="actions-row">
            <button className="finish-button" type="button" onClick={() => setScreen('loading')}>
              Afronden
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

const filterScoreIndex: Record<string, number> = {
  'gezondheid':     5,
  'biodiversiteit': 1,
  'betaalbaarheid': 2,
  'inclusiviteit':  3,
  'emissies':       0,
  'eerlijke keten': 4,
};

function BarChart({ blueScore, orangeScore, blueLabel, orangeLabel }: {
  blueScore: number; orangeScore: number; blueLabel: string; orangeLabel: string;
}) {
  const W = 600, H = 280, pad = { top: 20, right: 40, bottom: 50, left: 50 };
  const chartH = H - pad.top - pad.bottom;
  const chartW = W - pad.left - pad.right;
  const barW = 70, gap = 100;
  const totalBars = barW * 2 + gap;
  const startX = pad.left + (chartW - totalBars) / 2;

  const oH = (orangeScore / 100) * chartH;
  const bH = (blueScore / 100) * chartH;
  const baseY = pad.top + chartH;

  const gridVals = [25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" style={{ display: 'block' }}>
      {gridVals.map(v => {
        const y = baseY - (v / 100) * chartH;
        return (
          <g key={v}>
            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#e8eef6" strokeWidth="1" />
            <text x={pad.left - 6} y={y + 3} textAnchor="end" fontSize="11" fill="#6f7785" fontFamily="sans-serif">{v}</text>
          </g>
        );
      })}
      <line x1={pad.left} y1={baseY} x2={W - pad.right} y2={baseY} stroke="#ccc" strokeWidth="1" />
      <rect x={startX} y={baseY - oH} width={barW} height={oH} fill="#ed6c25" rx={6} />
      <rect x={startX + barW + gap} y={baseY - bH} width={barW} height={bH} fill="#1a3e73" rx={6} />
      <text x={startX + barW / 2} y={baseY + 18} textAnchor="middle" fontSize="11" fill="#333" fontFamily="sans-serif">{orangeLabel}</text>
      <text x={startX + barW + gap + barW / 2} y={baseY + 18} textAnchor="middle" fontSize="11" fill="#333" fontFamily="sans-serif">{blueLabel}</text>
    </svg>
  );
}

function RadarChart({ blueScores, orangeScores, compact }: { blueScores: number[]; orangeScores: number[]; compact?: boolean }) {
  const cx = 330, cy = 200, R = 135;

  function pt(angleDeg: number, r: number): [number, number] {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function hexPath(r: number) {
    return factors
      .map((_, i) => {
        const [x, y] = pt(i * 60, r);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z';
  }

  function dataPath(values: number[]) {
    return values
      .map((v, i) => {
        const [x, y] = pt(i * 60, R * v / 100);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z';
  }

  return (
    <svg viewBox={compact ? "50 5 530 395" : "0 0 820 400"} xmlns="http://www.w3.org/2000/svg" width="100%" aria-hidden="true">
      {[20, 40, 60, 80, 100].map(pct => (
        <path key={pct} d={hexPath(R * pct / 100)} fill="none" stroke="rgba(93,104,123,0.22)" strokeWidth="1" />
      ))}
      {factors.map((_, i) => {
        const [x, y] = pt(i * 60, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(93,104,123,0.22)" strokeWidth="1" />;
      })}
      {[20, 40, 60, 80, 100].map(pct => {
        const [x, y] = pt(0, R * pct / 100);
        return <text key={pct} x={x + 5} y={y + 4} fontSize="10" fill="#3d3d3a" opacity="0.6">{pct}</text>;
      })}
      <path d={dataPath(blueScores)} fill="rgba(26,62,115,0.15)" stroke="rgb(26,62,115)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={dataPath(orangeScores)} fill="rgba(237,108,37,0.12)" stroke="rgb(237,108,37)" strokeWidth="1.5" strokeLinejoin="round" />
      {factors.map((_, i) => {
        const [bx, by] = pt(i * 60, R * blueScores[i] / 100);
        const [ox, oy] = pt(i * 60, R * orangeScores[i] / 100);
        return (
          <g key={i}>
            <circle cx={bx} cy={by} r="4" fill="rgb(26,62,115)" />
            <circle cx={ox} cy={oy} r="4" fill="rgb(237,108,37)" />
          </g>
        );
      })}
      {factors.map((factor, i) => {
        const angle = i * 60;
        const [lx, ly] = pt(angle, R + 40);
        const isLeft = angle > 180 && angle < 360;
        const isRight = angle > 0 && angle < 180;
        const anchor = isLeft ? 'end' : isRight ? 'start' : 'middle';
        return (
          <g key={i}>
            <text x={lx} y={ly} fontSize="12" fill="#141413" textAnchor={anchor}>{factor.name}</text>
            <text x={lx} y={ly + 15} fontSize="11" fill="#1a3e73" textAnchor={anchor}>
              {blueScores[i]}{' '}
              <tspan fill="#777">/</tspan>
              {' '}
              <tspan fill="#ed6c25">{orangeScores[i]}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ChatbotPanel({ open, onClose, selectedMeal }: { open: boolean; onClose: () => void; selectedMeal: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll naar het laatste bericht.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    if (!chatbotReady) {
      setError('Geen API-key ingesteld. Voeg VITE_ANTHROPIC_API_KEY toe in .env.local.');
      return;
    }
    setInput('');
    setError(null);
    const next: ChatMessage[] = [...messages, { role: 'user', text: content }];
    setMessages(next);
    setLoading(true);
    try {
      const reply = await askChatbot(next, selectedMeal);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setError('Er ging iets mis bij het ophalen van een antwoord. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  }

  const hasConversation = messages.length > 0;

  return (
    <>
      <div
        className={`chatbot-backdrop${open ? ' chatbot-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <button
        className={`chatbot-panel__peek-robot${open ? ' chatbot-panel__peek-robot--open' : ''}`}
        type="button"
        onClick={onClose}
        aria-label="Chatbot sluiten"
      >
        <img src={chatbotAssets.robot} alt="" />
      </button>
      <aside className={`chatbot-panel${open ? ' chatbot-panel--open' : ''}`} aria-label="Chatbot">

        <header className="chatbot-panel__header">
          <img className="chatbot-panel__header-robot" src={chatbotAssets.robot} alt="" aria-hidden="true" />
          <div className="chatbot-panel__header-text">
            <p className="chatbot-panel__title">Chatbot</p>
            <p className="chatbot-panel__subtitle">Je Dish Score assistent</p>
          </div>
          <button className="chatbot-panel__close" type="button" onClick={onClose} aria-label="Sluiten">
            <img src={chatbotAssets.close} alt="" />
          </button>
        </header>

        <div className="chatbot-panel__divider" />

        <div className="chatbot-panel__context">{selectedMeal} · Week 22</div>

        <div className="chatbot-panel__messages" ref={scrollRef}>
          {!hasConversation && (
            <>
              <div className="chatbot-panel__intro">
                <div className="chatbot-panel__intro-avatar">
                  <img src={chatbotAssets.robot} alt="Dish Score assistent" />
                </div>
              </div>

              <div className="chatbot-panel__suggestions">
                {chatSuggestions.map((q) => (
                  <button
                    key={q}
                    className="chatbot-suggestion"
                    type="button"
                    onClick={() => send(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`chatbot-bubble chatbot-bubble--${m.role}`}>
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="chatbot-bubble chatbot-bubble--assistant chatbot-bubble--typing">
              <span /><span /><span />
            </div>
          )}

          {error && <div className="chatbot-panel__error">{error}</div>}
        </div>

        <form
          className="chatbot-panel__input-row"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            type="text"
            className="chatbot-panel__input"
            placeholder="Typ je bericht...."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="chatbot-panel__send" aria-label="Versturen" disabled={loading}>
            <img src={chatbotAssets.send} alt="" />
          </button>
        </form>
      </aside>
    </>
  );
}

type ScenarioItem = { name: string; desc: string; image: string };
type TallMealCard = typeof tallMealCards[0];

const initialScenario: ScenarioItem[] = [
  { name: 'Seizoenssalade', desc: 'Lokaal - Vegetarisch', image: addDishAssets.sidebarThumb1 },
  { name: 'Groentecurry',   desc: 'Biologisch - Vegetarisch', image: addDishAssets.sidebarThumb2 },
  { name: 'Linzensoep',     desc: 'Lokaal - Vegetarisch', image: addDishAssets.sidebarThumb3 },
];

type AddDishModalProps = {
  open: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  scenario: ScenarioItem[];
  addMeal: (name: string, desc: string, image: string) => void;
  removeMeal: (name: string) => void;
  onSelectDish: (dish: TallMealCard) => void;
};

function AddDishModal({ open, onClose, onOpenChat, scenario, addMeal, removeMeal, onSelectDish }: AddDishModalProps) {
  // Alleen op breedte schalen zodat de tekst leesbaar groot blijft; is de modal
  // hoger dan het scherm, dan scrollt de overlay (zie .add-dish-overlay).
  const canvasZoom = useFitZoom(1293);
  if (!open) return null;

  const inScenario = (name: string) => scenario.some(s => s.name === name);

  return (
    <div className="add-dish-overlay">
      <div className="add-dish-canvas-wrap" style={{ zoom: canvasZoom }}>
        <button className="add-dish-back" type="button" onClick={onClose}>
          <span className="add-dish-back__arrow">
            <img src={addDishAssets.backArrow} alt="" />
          </span>
          Vorige
        </button>

        <div className="add-dish-modal">
          <button className="add-dish-close" type="button" onClick={onClose} aria-label="Sluiten">×</button>

          <div className="add-dish-main">
            <h2 className="add-dish-modal-title">Gerecht toevoegen</h2>

            <div className="add-dish-search-row">
              <div className="add-dish-search-input">
                <img src={addDishAssets.searchIcon} alt="" />
                <input type="text" placeholder="Zoek op naam, ingredient of label" />
              </div>
              <button type="button" className="add-dish-wissen">Wissen</button>
              <div className="add-dish-sort">
                <span className="add-dish-sort__label">Sorteren op</span>
                <span className="add-dish-sort__value">Aanbevolen</span>
                <span className="add-dish-sort__caret">›</span>
              </div>
            </div>

            <h3 className="add-dish-filters-title">Filters</h3>
            <div className="add-dish-filter-chips">
              <button type="button" className="add-dish-chip add-dish-chip--active">Past bij mijn profiel</button>
              {['Gezondheid', 'Betaalbaarheid', 'Inclusiviteit', 'Diversiteit', 'Emissies', 'Eerlijke keten'].map((f) => (
                <button key={f} type="button" className="add-dish-chip">
                  <img src={addDishAssets.filterIcon} alt="" />
                  {f}
                </button>
              ))}
            </div>

            <h3 className="add-dish-section-title">
              Aanbevolen voor jouw profiel
              <img src={addDishAssets.flameIcon} alt="" />
            </h3>

            <div className="add-dish-tall-cards">
              {tallMealCards.map((card) => (
                <article key={card.name} className={`add-meal-tall-card${inScenario(card.name) ? ' add-meal-tall-card--added' : ''}`} onClick={() => onSelectDish(card)} style={{ cursor: 'pointer' }}>
                  <div className="add-meal-tall-card__img-wrap">
                    <img src={card.image} alt={card.name} />
                    {card.badge && <span className="add-meal-tall-card__badge">{card.badge}</span>}
                  </div>
                  <div className="add-meal-tall-card__body">
                    <h4 className="add-meal-tall-card__name">{card.name}</h4>
                    <p className="add-meal-tall-card__desc">{card.description}</p>
                    <div className="add-meal-tall-card__footer">
                      <div className="add-meal-tall-card__co2-col">
                        <span className="add-meal-tall-card__co2-label">CO2</span>
                        <span className="add-meal-tall-card__co2-val">{card.co2}</span>
                      </div>
                      <div className="add-meal-tall-card__price-col">
                        <span className="add-meal-tall-card__price-label">/100</span>
                        <span className="add-meal-tall-card__price-val">{card.price}</span>
                      </div>
                      <button
                        type="button"
                        className="add-meal-tall-card__add"
                        aria-label={inScenario(card.name) ? 'Verwijderen uit scenario' : 'Toevoegen aan scenario'}
                        onClick={(e) => { e.stopPropagation(); inScenario(card.name) ? removeMeal(card.name) : addMeal(card.name, card.description, card.image); }}
                      >
                        {inScenario(card.name) ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <h3 className="add-dish-section-title add-dish-section-title--sm">Betaalbare opties</h3>

            <div className="add-dish-wide-cards">
              {wideMealCards.map((card) => (
                <article key={card.name} className="add-meal-wide-card">
                  <img src={card.image} alt={card.name} className="add-meal-wide-card__image" />
                  <div className="add-meal-wide-card__body">
                    <h4 className="add-meal-wide-card__name">{card.name}</h4>
                    <p className="add-meal-wide-card__desc">{card.description}</p>
                    <p className="add-meal-wide-card__price">{card.price}</p>
                  </div>
                  <button
                    type="button"
                    className="add-meal-wide-card__add"
                    aria-label={inScenario(card.name) ? 'Verwijderen uit scenario' : 'Toevoegen aan scenario'}
                    onClick={() => inScenario(card.name) ? removeMeal(card.name) : addMeal(card.name, card.description, card.image)}
                  >
                    {inScenario(card.name) ? '✓' : '+'}
                  </button>
                </article>
              ))}
            </div>
          </div>

          <aside className="add-dish-sidebar">
            <div className="add-dish-sidebar-panel">
              <div className="add-dish-sidebar-header">
                <h3>Toegevoegd aan scenario</h3>
                <span className="add-dish-sidebar-badge">{scenario.length}</span>
              </div>

              <div className="add-dish-sidebar-scroll">
                {scenario.length === 0 && (
                  <p className="add-dish-sidebar-empty">Nog geen gerechten toegevoegd.</p>
                )}

                {scenario.map((item) => (
                  <div key={item.name} className="add-dish-sidebar-item">
                    <img src={item.image} alt="" className="add-dish-sidebar-item__img" />
                    <div className="add-dish-sidebar-item__info">
                      <p className="add-dish-sidebar-item__name">{item.name}</p>
                      <p className="add-dish-sidebar-item__desc">{item.desc}</p>
                    </div>
                    <button type="button" className="add-dish-sidebar-item__remove" aria-label="Verwijderen" onClick={() => removeMeal(item.name)}>×</button>
                  </div>
                ))}
              </div>

              {scenario.length > 0 && (
                <>
                  <div className="add-dish-sidebar-divider" />
                  <div className="add-dish-sidebar-stats">
                    <div className="add-dish-sidebar-stats__row">
                      <span className="add-dish-sidebar-stats__left">
                        <img className="add-dish-sidebar-stats__icon" src={addDishAssets.iconScore} alt="" />
                        Gemiddelde score
                      </span>
                      <span className="add-dish-sidebar-stats__score">88/100</span>
                    </div>
                    <div className="add-dish-sidebar-stats__row">
                      <span className="add-dish-sidebar-stats__left">
                        <img className="add-dish-sidebar-stats__icon" src={addDishAssets.iconCo2} alt="" />
                        Gem. CO₂-uitstoot / portie
                      </span>
                      <span className="add-dish-sidebar-stats__value">0,26 kg</span>
                    </div>
                    <div className="add-dish-sidebar-stats__row">
                      <span className="add-dish-sidebar-stats__left">
                        <img className="add-dish-sidebar-stats__icon" src={addDishAssets.iconPrijs} alt="" />
                        Gem. prijs / portie
                      </span>
                      <span className="add-dish-sidebar-stats__value">€3,20</span>
                    </div>
                  </div>
                  <button type="button" className="add-dish-sidebar-confirm">
                    Scenario bekijken
                    <img src={addDishAssets.iconArrow} alt="" className="add-dish-sidebar-confirm__arrow" />
                  </button>
                  <button type="button" className="add-dish-sidebar-clear" onClick={() => { removeMeal('__clear_all__'); }}>
                    <img src={addDishAssets.iconTrash} alt="" className="add-dish-sidebar-clear__icon" />
                    Lijst wissen
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>

        {/* Chatbot trigger — positioned at the bottom-right corner of the modal */}
        <button className="add-dish-chatbot-btn" type="button" aria-label="Chatbot openen" onClick={onOpenChat}>
          <img alt="Chatbot assistent" src={chatbotAssets.robot} />
        </button>
      </div>
    </div>
  );
}

function AltDishCard({ image, label, name, co2, co2Label, price, priceLabel, score1, score1Label, score2, score2Label }: {
  image: string; label: string; name: string;
  co2: string; co2Label: string; price: string; priceLabel: string;
  score1: string; score1Label: string; score2: string; score2Label: string;
}) {
  return (
    <div className="detail-alt-card">
      <div className="detail-alt-card__imgwrap">
        <img src={image} alt={name} />
        <span className="detail-alt-card__label">{label}</span>
      </div>
      <div className="detail-alt-card__body">
        <p className="detail-alt-card__name">{name}</p>
        <div className="detail-alt-card__tags">
          <span className="detail-tag detail-tag--green">Vegan</span>
          <span className="detail-tag detail-tag--blue">Lokaal</span>
          <span className="detail-tag detail-tag--orange">Seizoensgebonden</span>
        </div>
        <div className="detail-alt-card__stats">
          <div className="detail-alt-stat">
            <span className="detail-alt-stat__label">CO₂</span>
            <span className="detail-alt-stat__value">{co2}</span>
            <span className="detail-alt-stat__pill detail-alt-stat__pill--green">{co2Label}</span>
          </div>
          <div className="detail-alt-stat">
            <span className="detail-alt-stat__label">Prijs</span>
            <span className="detail-alt-stat__value">{price}</span>
            <span className="detail-alt-stat__pill detail-alt-stat__pill--green">{priceLabel}</span>
          </div>
          <div className="detail-alt-stat">
            <span className="detail-alt-stat__label">Gezond.</span>
            <span className="detail-alt-stat__value">{score1}</span>
            <span className="detail-alt-stat__pill detail-alt-stat__pill--green">{score1Label}</span>
          </div>
          <div className="detail-alt-stat">
            <span className="detail-alt-stat__label">Biodiv.</span>
            <span className="detail-alt-stat__value">{score2}</span>
            <span className="detail-alt-stat__pill detail-alt-stat__pill--green">{score2Label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ open, dish, onClose, inScenario, addMeal, removeMeal, onOpenChat }: {
  open: boolean;
  dish: TallMealCard | null;
  onClose: () => void;
  inScenario: (name: string) => boolean;
  addMeal: (name: string, desc: string, image: string) => void;
  removeMeal: (name: string) => void;
  onOpenChat?: () => void;
}) {
  if (!open || !dish) return null;

  const added = inScenario(dish.name);

  return (
    <div className="detail-overlay">
      <div className="background-orbit background-orbit-left" aria-hidden="true" />
      <div className="background-orbit background-orbit-right" aria-hidden="true" />
      <div className="background-arc detail-arc-top" aria-hidden="true" />
      <div className="background-arc detail-arc-bottom" aria-hidden="true" />

      <div className="detail-scroll">
      <div className="detail-page-header">
        <button className="detail-back-pill" type="button" onClick={onClose}>
          <img src={addDishAssets.backArrow} alt="" className="detail-back-pill__arrow" />
          Terug naar overzicht
        </button>
        <div className="dish-logo detail-logo" aria-label="Dish Score">
          <span className="dish-logo__shadow" aria-hidden="true"><span>Dish </span><span>Score.</span></span>
          <span className="dish-logo__main"><span>Dish </span><span>Score.</span></span>
        </div>
        <div style={{ width: 232 }} />
      </div>

      <div className="detail-body">
        {/* Left column: image+info + two bottom cards */}
        <div className="detail-left-content">
          <div className="detail-top">
            <div className="detail-dish-image">
              <img src={dish.image} alt={dish.name} />
            </div>
            <div className="detail-info">
              <h1 className="detail-name">{dish.name}</h1>
              <div className="detail-tags">
                <span className="detail-tag detail-tag--green">Vegan</span>
                <span className="detail-tag detail-tag--blue">Lokaal</span>
                <span className="detail-tag detail-tag--orange">Seizoensgebonden</span>
              </div>
              <p className="detail-description">Frisse salade met seizoensgroenten, kikkererwten, noten en een citroen-tahindressing.</p>
              <div className="detail-score-divider" />
              <p className="detail-score-label">Totaal score</p>
              <div className="detail-score-row">
                <span className="detail-score__number">90</span>
                <span className="detail-score__total">/100</span>
              </div>
              <button
                type="button"
                className={`detail-add-btn${added ? ' detail-add-btn--added' : ''}`}
                onClick={() => added ? removeMeal(dish.name) : addMeal(dish.name, dish.description, dish.image)}
              >
                {added ? '✓ Toegevoegd aan scenario' : '+ Gerecht toevoegen'}
              </button>
            </div>
          </div>

          <div className="detail-bottom-cards">
            <div className="detail-card detail-impact">
              <h2 className="detail-card-title">
                Impact op de 6 factoren
                <img src={detailAssets.infoIcon} alt="" className="detail-card-title__icon" />
              </h2>
              <RadarChart
                blueScores={[90, 85, 75, 80, 82, 88]}
                orangeScores={[77, 78, 70, 72, 75, 80]}
                compact
              />
            </div>

            <div className="detail-card detail-costs">
              <h2 className="detail-card-title">
                Kosten &amp; uitstoot per portie
                <img src={detailAssets.infoIcon} alt="" className="detail-card-title__icon" />
              </h2>
              <div className="detail-costs-table">
                <div className="detail-costs-row"><span>Inkoopprijs</span><span>€2,90</span></div>
                <div className="detail-costs-row"><span>Verkoopprijs</span><span>€4,20</span></div>
                <div className="detail-costs-row detail-costs-row--divider" />
                <div className="detail-costs-row"><span>Marge</span><span className="detail-costs-row__marge">€1,30</span></div>
              </div>
              <div className="detail-co2-block">
                <div className="detail-co2-block__header">
                  <span>CO₂-uitstoot</span>
                  <span className="detail-co2-block__low">25% lager dan gemiddeld</span>
                </div>
                <p className="detail-co2-block__value">0,18 kg</p>
              </div>
              <p className="detail-co2-chart-label"><strong>CO₂-uitstoot vergelijking </strong><span>(kg per portie)</span></p>
              <div className="detail-co2-bar-wrap">
                <div className="detail-co2-gradient-bar" />
                <img src={detailAssets.co2Dot} alt="" className="detail-co2-bar__dot" />
              </div>
              <div className="detail-co2-bar-legend">
                <div><span>0.10</span><br /><small>Laagste</small></div>
                <div><span>0.25</span><br /><small>Gemiddeld</small></div>
                <div><span>0.60</span><br /><small>Hoogste</small></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: alternatieven + ingrediënten stacked */}
        <div className="detail-right-content">
          <div className="detail-card detail-alternatives">
            <h2 className="detail-card-title">
              <img src={detailAssets.infoIcon} alt="" className="detail-card-title__icon" />
              Alternatieven
            </h2>
            <AltDishCard
              image={detailAssets.alt1Image}
              label="Huidig gerecht"
              name="Linzensoep"
              co2="0,18 kg" co2Label="Zeer laag"
              price="€2,40" priceLabel="Voordelig"
              score1="85 /100" score1Label="Goed"
              score2="90 /100" score2Label="Zeer hoog"
            />
            <div className="detail-alt-vs">
              <span>VS</span>
            </div>
            <AltDishCard
              image={detailAssets.alt2Image}
              label="Alternatief"
              name="Pompoensoep"
              co2="0,12 kg" co2Label="Zeer laag"
              price="€2,20" priceLabel="Voordelig"
              score1="90 /100" score1Label="Goed"
              score2="90 /100" score2Label="Zeer hoog"
            />
            <button type="button" className="detail-compare-btn">Vergelijk met alternatief</button>
          </div>

          <div className="detail-card detail-ingredients">
            <h2 className="detail-card-title">
              Ingrediënten &amp; herkomst
              <img src={detailAssets.infoIcon} alt="" className="detail-card-title__icon" />
            </h2>
            <div className="detail-ingredients-list">
              {[
                { name: 'Gemengde sla',             origin: 'Nederland', pct: '30%' },
                { name: 'Komkommer',                origin: 'Nederland', pct: '10%' },
                { name: 'Cherrytomaten',            origin: 'Nederland', pct: '' },
                { name: 'Kikkererwten',             origin: 'Europa',    pct: '' },
                { name: 'Notenmix',                 origin: 'Europa',    pct: '' },
                { name: 'Dressing (citroen tahin)', origin: 'Balesh',    pct: '' },
              ].map((ing) => (
                <div key={ing.name} className="detail-ingredients-row">
                  <span className="detail-ingredients-row__name">{ing.name}</span>
                  <span className="detail-ingredients-row__origin">{ing.origin}</span>
                  <span className="detail-ingredients-row__pct">{ing.pct}</span>
                </div>
              ))}
            </div>
            <button type="button" className="detail-ingredients-more">
              Bekijk alle ingrediënten
              <img src={detailAssets.arrowRight} alt="" />
            </button>
          </div>
        </div>
      </div>

      {onOpenChat && (
        <button className="chatbot-trigger" type="button" aria-label="Chatbot openen" onClick={onOpenChat}>
          <img src={chatbotAssets.robot} alt="Chatbot assistent" />
        </button>
      )}
      </div>
    </div>
  );
}

function DashboardScreen() {
  const selectedIndex = 0;
  const [compareIndex, setCompareIndex] = useState(2);
  const [chatOpen, setChatOpen] = useState(false);
  const [addDishOpen, setAddDishOpen] = useState(false);
  const [detailDish, setDetailDish] = useState<TallMealCard | null>(null);
  const [scenario, setScenario] = useState<ScenarioItem[]>(initialScenario);
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(22);
  const weekDropdownRef = useRef<HTMLDivElement>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!weekDropdownOpen && !filterDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (weekDropdownRef.current && !weekDropdownRef.current.contains(e.target as Node)) {
        setWeekDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [weekDropdownOpen, filterDropdownOpen]);

  function addMeal(name: string, desc: string, image: string) {
    setScenario(prev => prev.some(s => s.name === name) ? prev : [...prev, { name, desc, image }]);
  }

  function removeMeal(name: string) {
    if (name === '__clear_all__') { setScenario([]); return; }
    setScenario(prev => prev.filter(s => s.name !== name));
  }

  const inScenario = (name: string) => scenario.some(s => s.name === name);

  const selectedMeal = dashboardMeals[selectedIndex];
  const comparedMeal = dashboardMeals[compareIndex];

  const canvasZoom = useFitZoom(1440);

  return (
    <main className="dashboard-shell">
      <div className="background-orbit background-orbit-left" aria-hidden="true" />
      <div className="background-orbit background-orbit-right" aria-hidden="true" />
      <div className="background-arc background-arc-top" aria-hidden="true" />
      <div className="background-arc background-arc-bottom" aria-hidden="true" />

      <div className="dashboard-canvas" style={{ zoom: canvasZoom }}>
      <header className="dashboard-header">
        <div className="dashboard-actions" aria-label="Dashboard acties">
          <div className="week-chip-wrapper" ref={filterDropdownRef}>
            <button
              className={`chip chip--outline${filterDropdownOpen || activeFilter ? ' chip--active' : ''}`}
              type="button"
              aria-expanded={filterDropdownOpen}
              aria-haspopup="listbox"
              onClick={() => setFilterDropdownOpen(o => !o)}
            >
              {!activeFilter && (
                <span className="chip__icon chip__icon--image">
                  <img alt="" src={dashboardIcons.filters} />
                </span>
              )}
              {activeFilter ?? 'Filters'}
            </button>
            {filterDropdownOpen && (
              <div className="week-dropdown" role="listbox" aria-label="Filters kiezen">
                {['gezondheid', 'betaalbaarheid', 'inclusiviteit', 'emissies', 'eerlijke keten', 'biodiversiteit'].map(filter => (
                  <button
                    key={filter}
                    role="option"
                    aria-selected={activeFilter === filter}
                    type="button"
                    className={`week-dropdown__item${activeFilter === filter ? ' week-dropdown__item--selected' : ''}`}
                    onClick={() => {
                      setActiveFilter(prev => prev === filter ? null : filter);
                      setFilterDropdownOpen(false);
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="week-chip-wrapper" ref={weekDropdownRef}>
            <button
              className={`chip chip--outline${weekDropdownOpen ? ' chip--active' : ''}`}
              type="button"
              aria-expanded={weekDropdownOpen}
              aria-haspopup="listbox"
              onClick={() => setWeekDropdownOpen(o => !o)}
            >
              Week {selectedWeek}
              <span className="chip__caret chip__caret--image">
                <img alt="" src={dashboardIcons.dropdown} className={weekDropdownOpen ? 'chip__caret-img--open' : ''} />
              </span>
            </button>
            {weekDropdownOpen && (
              <div className="week-dropdown" role="listbox" aria-label="Week kiezen">
                {[21, 20, 19, 18, 17, 16, 15].map(week => (
                  <button
                    key={week}
                    role="option"
                    aria-selected={selectedWeek === week}
                    type="button"
                    className={`week-dropdown__item${selectedWeek === week ? ' week-dropdown__item--selected' : ''}`}
                    onClick={() => { setSelectedWeek(week); setWeekDropdownOpen(false); }}
                  >
                    Week {week}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="chip chip--solid" type="button">
            Opslaan
          </button>
        </div>

        <div className="dish-logo dashboard-title" aria-label="Dish Score">
          <span className="dish-logo__shadow" aria-hidden="true"><span>Dish </span><span>Score.</span></span>
          <span className="dish-logo__main"><span>Dish </span><span>Score.</span></span>
        </div>
      </header>

      <section className="dashboard-layout">
        <article className="dashboard-main-card">
          <div className="dashboard-main-card__header">
            <h2>Thema-radar</h2>
            <div className="dashboard-main-card__legend">
              <span className="legend-pill legend-pill--blue">{selectedMeal.name}</span>
              <span className="legend-pill legend-pill--orange">{comparedMeal.name}</span>
            </div>
            <span className="dashboard-scale-label">Schaal 0 - 100</span>
          </div>

          <div className="dashboard-radar" aria-label="Thema radar grafiek">
            {activeFilter ? (
              <BarChart
                blueScore={selectedMeal.scores[filterScoreIndex[activeFilter]]}
                orangeScore={comparedMeal.scores[filterScoreIndex[activeFilter]]}
                blueLabel={selectedMeal.name.toLowerCase()}
                orangeLabel={comparedMeal.name.toLowerCase()}
              />
            ) : (
              <RadarChart blueScores={selectedMeal.scores} orangeScores={comparedMeal.scores} />
            )}
          </div>
        </article>

        <aside className="dashboard-sidebar">
          <h2 className="dashboard-sidebar__title">Maaltijden</h2>
          <label className="dashboard-search">
            <span className="dashboard-search__icon">⌕</span>
            <input type="text" placeholder="Zoek op naam, ingredient of label" />
          </label>

          <div className="dashboard-meals">
            {dashboardMeals.map((meal, i) => (
              <article
                key={meal.name}
                className={`meal-card${i === selectedIndex ? ' meal-card--selected' : ''}${i === compareIndex ? ' meal-card--compared' : ''}`}
                onClick={() => { if (i !== selectedIndex) setCompareIndex(i); }}
              >
                <img className="meal-card__image" alt="" src={meal.image} />
                <div className="meal-card__copy">
                  <div className="meal-card__title-row">
                    <h3>{meal.name}</h3>
                    {i === selectedIndex ? <span className="meal-badge">Geselecteerd</span> : null}
                    {i === selectedIndex ? <span className="meal-check">✓</span> : null}
                  </div>
                  <p>{meal.details}</p>
                </div>
              </article>
            ))}
          </div>

          <button className="add-dish" type="button" onClick={() => setAddDishOpen(true)}>
            + Gerecht toevoegen
          </button>

          <div className="dashboard-legend">
            {factors.map((factor, i) => (
              <div key={factor.name} className="dashboard-legend__row">
                <span className="dashboard-legend__dot" style={{ backgroundColor: factor.color }} />
                <span className="dashboard-legend__name">{factor.name}</span>
                <span className="dashboard-legend__bar">
                  <span
                    className="dashboard-legend__bar-fill"
                    style={{ width: `${selectedMeal.scores[i]}%`, backgroundColor: factor.color }}
                  />
                </span>
                <span className="dashboard-legend__value">{selectedMeal.scores[i]}/100</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="dashboard-stats">
        {dashboardCards.map((card) => (
          <article key={card.title} className="stat-card">
            <span className={`stat-card__icon stat-card__icon--${card.accent}`}>
              <img alt="" src={card.icon} />
            </span>
            <h3>{card.title}</h3>
            <strong>{card.value}</strong>
            <p>{card.note}</p>
          </article>
        ))}
      </section>

      {!detailDish && !addDishOpen && (
        <button className="chatbot-trigger chatbot-trigger--docked" type="button" aria-label="Chatbot openen" onClick={() => setChatOpen(true)}>
          <img alt="Chatbot assistent" src={chatbotAssets.robot} />
        </button>
      )}

      </div>

      <AddDishModal
        open={addDishOpen}
        onClose={() => setAddDishOpen(false)}
        onOpenChat={() => { setChatOpen(true); }}
        scenario={scenario}
        addMeal={addMeal}
        removeMeal={removeMeal}
        onSelectDish={setDetailDish}
      />

      <DetailModal
        open={!!detailDish}
        dish={detailDish}
        onClose={() => setDetailDish(null)}
        inScenario={inScenario}
        addMeal={addMeal}
        removeMeal={removeMeal}
        onOpenChat={() => setChatOpen(true)}
      />

      <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} selectedMeal={selectedMeal.name} />
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="page-shell loading-shell">
      <div className="background-orbit background-orbit-left" aria-hidden="true" />
      <div className="background-orbit background-orbit-right" aria-hidden="true" />
      <div className="background-arc background-arc-top" aria-hidden="true" />
      <div className="background-arc background-arc-bottom" aria-hidden="true" />

      <div className="dish-logo loading-brand" aria-label="Dish Score">
        <span className="dish-logo__shadow" aria-hidden="true"><span>Dish </span><span>Score.</span></span>
        <span className="dish-logo__main"><span>Dish </span><span>Score.</span></span>
      </div>

      <div className="loading-ring" aria-hidden="true">
        <img alt="" src={loadingAssets.ellipsis} />
      </div>

      <section className="loading-copy" aria-labelledby="loading-title">
        <h2 id="loading-title">We stellen de tool voor je in</h2>
        <p>We zetten jouw gegevens om naar een persoonlijk kantineprofiel.</p>
      </section>

      <section className="loading-progress" aria-label="Voortgang">
        <div className="loading-step">
          <span className="loading-check loading-check--done" aria-hidden="true">
            <span className="loading-check__tick">✓</span>
          </span>
          <span>Gegevens ontvangen</span>
        </div>

        <div className="loading-step">
          <span className="loading-check loading-check--done" aria-hidden="true">
            <span className="loading-check__tick">✓</span>
          </span>
          <span>Antwoorden verwerkt</span>
        </div>

        <div className="loading-step">
          <span className="loading-check loading-check--pending" aria-hidden="true" />
          <span>Dashboard klaarmaken</span>
        </div>
      </section>
    </main>
  );
}
