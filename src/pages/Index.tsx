import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { useHorrorAudio } from '@/hooks/useHorrorAudio';

const ARCHIVE_DATA = [
  {
    id: 1,
    date: '2024-11-15',
    region: 'Европа',
    category: 'Взрыв',
    title: 'ВЕНА: ВЗРЫВ В ТОРГОВОМ ЦЕНТРЕ',
    desc: 'Скоординированный подрыв унёс 34 жизни. Следы ведут к законсервированной ячейке. Власти молчат.',
    severity: 'КРИТИЧНО',
    casualties: 34,
    verified: true,
  },
  {
    id: 2,
    date: '2024-09-03',
    region: 'Азия',
    category: 'Стрельба',
    title: 'ТОКИО: МАССОВАЯ СТРЕЛЬБА В МЕТРО',
    desc: 'Нападавший действовал в одиночку. Мотив до сих пор засекречен. 19 пострадавших.',
    severity: 'ВЫСОКИЙ',
    casualties: 19,
    verified: true,
  },
  {
    id: 3,
    date: '2024-07-22',
    region: 'Америка',
    category: 'Захват',
    title: 'НЬЮ-ЙОРК: ЗАХВАТ ЗДАНИЯ ООН',
    desc: '6 часов противостояния. 3 заложника. Переговорщики так и не раскрыли требования террористов.',
    severity: 'ВЫСОКИЙ',
    casualties: 3,
    verified: false,
  },
  {
    id: 4,
    date: '2024-05-10',
    region: 'Ближний Восток',
    category: 'Взрыв',
    title: 'БАГДАД: ДВОЙНОЙ ТЕРАКТ НА РЫНКЕ',
    desc: 'Два заминированных автомобиля. Интервал — 12 минут. Расчёт на спасателей. 71 погибший.',
    severity: 'КРИТИЧНО',
    casualties: 71,
    verified: true,
  },
  {
    id: 5,
    date: '2024-03-18',
    region: 'Африка',
    category: 'Нападение',
    title: 'НАЙРОБИ: АТАКА НА ПОСОЛЬСТВО',
    desc: 'Организованная группа. Пробита внешняя охрана. Дипломатический персонал эвакуирован.',
    severity: 'СРЕДНИЙ',
    casualties: 8,
    verified: true,
  },
  {
    id: 6,
    date: '2024-01-07',
    region: 'Европа',
    category: 'Стрельба',
    title: 'ПАРИЖ: СТРЕЛЬБА У РЕДАКЦИИ ГАЗЕТЫ',
    desc: 'Целенаправленное уничтожение. Трое журналистов. Нападавшие ушли — ни одного задержанного.',
    severity: 'ВЫСОКИЙ',
    casualties: 3,
    verified: true,
  },
  {
    id: 7,
    date: '2023-12-01',
    region: 'Азия',
    category: 'Взрыв',
    title: 'КАБУЛ: ВЗРЫВ У МЕЧЕТИ',
    desc: 'Пятничная молитва. Смертник вошёл в толпу. 47 жертв. Ответственность не установлена.',
    severity: 'КРИТИЧНО',
    casualties: 47,
    verified: true,
  },
  {
    id: 8,
    date: '2023-10-14',
    region: 'Америка',
    category: 'Захват',
    title: 'МЕХИКО: ЗАХВАТ ЗАЛОЖНИКОВ В БАНКЕ',
    desc: 'Четверо вооружённых. 18 часов переговоров. Связь с картелем не подтверждена официально.',
    severity: 'СРЕДНИЙ',
    casualties: 0,
    verified: false,
  },
];

const REGIONS = ['Все', 'Европа', 'Азия', 'Америка', 'Ближний Восток', 'Африка'];
const CATEGORIES = ['Все', 'Взрыв', 'Стрельба', 'Захват', 'Нападение'];
const YEARS = ['Все', '2024', '2023'];

const SEVERITY_COLORS: Record<string, string> = {
  'КРИТИЧНО': '#ff0033',
  'ВЫСОКИЙ': '#ff6600',
  'СРЕДНИЙ': '#ffcc00',
};

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = '01アイウエオカキクケコサシスセソMIAGAUSS死恐怖血';
    const cols = Math.floor(canvas.width / 18);
    const drops: number[] = Array(cols).fill(1);
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(8,8,8,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px Share Tech Mono, monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const isRed = Math.random() > 0.96;
        ctx.fillStyle = isRed ? 'rgba(255,0,51,0.6)' : 'rgba(0,255,65,0.15)';
        ctx.fillText(char, i * 18, y * 18);
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 55);
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { clearInterval(interval); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60" />;
}

function BloodDrips() {
  const drips = [8, 15, 23, 31, 42, 55, 67, 78, 85, 92];
  return (
    <div className="fixed top-0 left-0 w-full pointer-events-none z-10">
      {drips.map((left, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: 0,
            width: '1px',
            background: `linear-gradient(to bottom, #ff0033, #8b0000, transparent)`,
            height: `${30 + Math.random() * 60}px`,
            animationDelay: `${i * 0.7}s`,
            opacity: 0.4 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default function Index() {
  const [regionFilter, setRegionFilter] = useState('Все');
  const [categoryFilter, setCategoryFilter] = useState('Все');
  const [yearFilter, setYearFilter] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [audioOn, setAudioOn] = useState(false);
  const [booted, setBooted] = useState(false);
  const [bootText, setBootText] = useState('');
  const { start, stop } = useHorrorAudio();

  const bootLines = [
    '> ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ MIA_GAUSS.EXE...',
    '> ЗАГРУЗКА АРХИВОВ... [████████████] 100%',
    '> РАСШИФРОВКА ФАЙЛОВ: ОК',
    '> СОЕДИНЕНИЕ С СЕТЬЮ: УСТАНОВЛЕНО',
    '> ПРЕДУПРЕЖДЕНИЕ: КОНТЕНТ СОДЕРЖИТ ЖЕРТВ',
    '> ДОСТУП РАЗРЕШЁН. ДОБРО ПОЖАЛОВАТЬ._',
  ];

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let current = '';
    const type = () => {
      if (lineIdx >= bootLines.length) {
        setTimeout(() => setBooted(true), 600);
        return;
      }
      const line = bootLines[lineIdx];
      if (charIdx < line.length) {
        current += line[charIdx];
        charIdx++;
        setBootText(current);
        setTimeout(type, 18 + Math.random() * 15);
      } else {
        current += '\n';
        setBootText(current);
        lineIdx++;
        charIdx = 0;
        setTimeout(type, 200);
      }
    };
    setTimeout(type, 400);
  }, []);

  const toggleAudio = useCallback(() => {
    if (audioOn) { stop(); setAudioOn(false); }
    else { start(); setAudioOn(true); }
  }, [audioOn, start, stop]);

  const filtered = ARCHIVE_DATA.filter(item => {
    const matchRegion = regionFilter === 'Все' || item.region === regionFilter;
    const matchCat = categoryFilter === 'Все' || item.category === categoryFilter;
    const matchYear = yearFilter === 'Все' || item.date.startsWith(yearFilter);
    const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchCat && matchYear && matchSearch;
  });

  const totalCasualties = filtered.reduce((s, i) => s + i.casualties, 0);

  if (!booted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030303' }}>
        <div style={{ maxWidth: 600, width: '100%', padding: '2rem' }}>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '13px',
            color: '#00ff41',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.8,
            textShadow: '0 0 8px #00ff41',
          }}>
            {bootText}
            <span style={{ animation: 'blink 1s step-end infinite', color: '#00ffe5' }}>█</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#080808' }}>
      <div className="scanline" />
      <div className="noise-overlay" />
      <MatrixRain />
      <BloodDrips />

      {/* HEADER */}
      <header className="relative z-20 border-b" style={{ borderColor: '#ff003322', background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div style={{ width: 3, height: 42, background: 'var(--neon-red)', boxShadow: '0 0 12px var(--neon-red)' }} />
            <div>
              <h1
                className="glitch-text"
                data-text="MIA GAUSS"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: '0.2em',
                  lineHeight: 1,
                }}
              >
                MIA GAUSS
              </h1>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '10px', color: '#ff0033', letterSpacing: '0.3em', marginTop: 2 }}>
                АРХИВ ГЛОБАЛЬНЫХ ИНЦИДЕНТОВ
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '10px', color: '#333', letterSpacing: '0.1em' }}>
              {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}
            </div>
            <button
              onClick={toggleAudio}
              style={{
                fontFamily: 'Share Tech Mono',
                fontSize: '10px',
                letterSpacing: '0.15em',
                padding: '6px 14px',
                border: `1px solid ${audioOn ? 'var(--neon-red)' : '#2a2a2a'}`,
                background: audioOn ? 'rgba(255,0,51,0.08)' : 'transparent',
                color: audioOn ? 'var(--neon-red)' : '#444',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
            >
              {audioOn ? '◼ ЗВУК ВКЛ' : '▶ ЗВУК ВЫКЛ'}
            </button>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--neon-green)',
              boxShadow: '0 0 8px var(--neon-green)',
              animation: 'blink 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </header>

      {/* HERO STRIP */}
      <div className="relative z-20 border-b" style={{ borderColor: '#ff003315', background: 'rgba(10,0,0,0.7)', padding: '24px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: 8 }}>
            ОПЕРАТИВНАЯ СВОДКА
          </div>
          <p style={{ fontFamily: 'Oswald, sans-serif', fontSize: '15px', color: '#888', maxWidth: 700, lineHeight: 1.6, fontWeight: 300 }}>
            Я — <span className="neon-red" style={{ fontWeight: 600 }}>Мия Гаусс</span>. Я собираю то, о чём не говорят в новостях.
            Каждый файл в этом архиве — задокументированное событие. Факты. Цифры. Ничего лишнего.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="relative z-20 border-b" style={{ borderColor: '#1a1a1a', background: 'rgba(5,5,5,0.9)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-4 gap-0">
          {[
            { label: 'ЗАПИСЕЙ В АРХИВЕ', val: ARCHIVE_DATA.length, color: 'var(--neon-cyan)' },
            { label: 'ОТФИЛЬТРОВАНО', val: filtered.length, color: '#fff' },
            { label: 'ЗАДОКУМЕНТИРОВАНО ЖЕРТВ', val: totalCasualties, color: 'var(--neon-red)' },
            { label: 'СТАТУС СИСТЕМЫ', val: 'ONLINE', color: 'var(--neon-green)' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '12px 24px', borderRight: i < 3 ? '1px solid #111' : 'none' }}>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#333', letterSpacing: '0.2em', marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '20px', fontWeight: 700, color: s.color, textShadow: `0 0 12px ${s.color}` }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 relative z-20">
        {/* FILTERS */}
        <div className="border mb-6" style={{ borderColor: '#111', background: 'rgba(10,10,10,0.8)', padding: '16px 20px' }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#333', letterSpacing: '0.25em', marginBottom: 12 }}>
            ► ПАРАМЕТРЫ ФИЛЬТРАЦИИ
          </div>

          {/* Search */}
          <div className="mb-3" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="ПОИСК ПО АРХИВУ..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                fontFamily: 'Share Tech Mono',
                fontSize: '11px',
                letterSpacing: '0.1em',
                padding: '8px 12px 8px 32px',
                background: '#0a0a0a',
                border: '1px solid #1a1a1a',
                color: '#888',
                outline: 'none',
              }}
            />
            <Icon name="Search" size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#333', letterSpacing: '0.15em', alignSelf: 'center', minWidth: 60 }}>РЕГИОН:</span>
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegionFilter(r)} className={`filter-btn ${regionFilter === r ? 'active' : ''}`}>{r}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#333', letterSpacing: '0.15em', alignSelf: 'center', minWidth: 60 }}>ТИП:</span>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} className={`filter-btn ${categoryFilter === c ? 'active-red' : ''}`}>{c}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#333', letterSpacing: '0.15em', alignSelf: 'center', minWidth: 60 }}>ГОД:</span>
            {YEARS.map(y => (
              <button key={y} onClick={() => setYearFilter(y)} className={`filter-btn ${yearFilter === y ? 'active' : ''}`}>{y}</button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'Share Tech Mono', fontSize: '12px', color: '#2a2a2a', letterSpacing: '0.2em' }}>
            // ЗАПИСЕЙ НЕ НАЙДЕНО
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: '#111' }}>
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="card-hover animate-fade-in-up"
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #111',
                  padding: '20px',
                  position: 'relative',
                  animationDelay: `${idx * 0.05}s`,
                  animationFillMode: 'both',
                  opacity: 0,
                }}
              >
                {/* Top line accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '2px',
                  background: `linear-gradient(to right, ${SEVERITY_COLORS[item.severity] || '#333'}, transparent)`,
                  opacity: 0.6,
                }} />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{
                      fontFamily: 'Share Tech Mono', fontSize: '9px', letterSpacing: '0.15em',
                      padding: '2px 8px', border: `1px solid ${SEVERITY_COLORS[item.severity]}22`,
                      color: SEVERITY_COLORS[item.severity],
                      background: `${SEVERITY_COLORS[item.severity]}0a`,
                    }}>
                      {item.severity}
                    </span>
                    {!item.verified && (
                      <span style={{
                        fontFamily: 'Share Tech Mono', fontSize: '8px', letterSpacing: '0.1em',
                        color: '#444', border: '1px solid #1e1e1e', padding: '2px 6px',
                      }}>
                        НЕПРОВЕРЕНО
                      </span>
                    )}
                  </div>
                  <Icon name="AlertTriangle" size={12} style={{ color: SEVERITY_COLORS[item.severity], opacity: 0.5 }} />
                </div>

                <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#333', letterSpacing: '0.2em', marginBottom: 6 }}>
                  {item.date} · {item.region} · {item.category}
                </div>

                <h3 style={{
                  fontFamily: 'Oswald, sans-serif', fontSize: '14px', fontWeight: 600,
                  color: '#e0e0e0', letterSpacing: '0.05em', marginBottom: 8, lineHeight: 1.3,
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontFamily: 'Share Tech Mono', fontSize: '11px', color: '#4a4a4a',
                  lineHeight: 1.6, marginBottom: 12,
                }}>
                  {item.desc}
                </p>

                <div className="flex items-center justify-between" style={{ borderTop: '1px solid #111', paddingTop: 10 }}>
                  <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.1em' }}>
                    ФАЙЛ #{String(item.id).padStart(4, '0')}
                  </div>
                  {item.casualties > 0 && (
                    <div style={{ fontFamily: 'Orbitron', fontSize: '11px', color: 'var(--neon-red)', fontWeight: 700 }}>
                      ☠ {item.casualties}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-20 mt-12 border-t" style={{ borderColor: '#0f0f0f', background: 'rgba(5,5,5,0.9)', padding: '20px 24px' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#222', letterSpacing: '0.2em' }}>
            © MIA GAUSS ARCHIVE · ДАННЫЕ ОБНОВЛЕНЫ: {new Date().toLocaleDateString('ru-RU')}
          </div>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', letterSpacing: '0.15em' }} className="terminal-cursor neon-red">
            СИСТЕМА АКТИВНА
          </div>
        </div>
      </footer>
    </div>
  );
}
