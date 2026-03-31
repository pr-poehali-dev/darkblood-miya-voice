import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { useHorrorAudio } from '@/hooks/useHorrorAudio';

function useMiaVoice() {
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ru-RU';
    utter.rate = 0.82;
    utter.pitch = 1.35;
    utter.volume = 0.9;

    // Подбираем женский голос
    const voices = window.speechSynthesis.getVoices();
    const femaleRu = voices.find(v =>
      v.lang.startsWith('ru') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('женский') || v.name.includes('Milena') || v.name.includes('Irina') || v.name.includes('Anna') || v.name.includes('Victoria') || v.name.includes('Oksana'))
    ) || voices.find(v => v.lang.startsWith('ru')) || null;

    if (femaleRu) utter.voice = femaleRu;
    speakRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  useEffect(() => () => { stop(); }, []);
  return { speak, stop };
}

const ARCHIVE_DATA = [
  {
    id: 1,
    date: '2024-11-15',
    region: 'Европа',
    category: 'Взрыв',
    title: 'ВЕНА: ВЗРЫВ В ТОРГОВОМ ЦЕНТРЕ',
    desc: 'Скоординированный подрыв унёс 34 жизни. Следы ведут к законсервированной ячейке.',
    severity: 'КРИТИЧНО',
    casualties: 34,
    verified: true,
    miaVoice: 'Я была в Вене через три дня после взрыва. Запах горелого пластика до сих пор стоит в памяти. Власти назвали это "изолированным инцидентом". Ложь. Я видела оцепление в двух кварталах — там нашли второе устройство, о котором не сообщали.',
  },
  {
    id: 2,
    date: '2024-09-03',
    region: 'Азия',
    category: 'Стрельба',
    title: 'ТОКИО: СТРЕЛЬБА В МЕТРО',
    desc: 'Нападавший действовал в одиночку. Мотив засекречен. 19 пострадавших.',
    severity: 'ВЫСОКИЙ',
    casualties: 19,
    verified: true,
    miaVoice: 'Японские СМИ показали размытые кадры. Я получила оригиналы. Нападавший стоял неподвижно 40 секунд перед первым выстрелом — как будто ждал команды. Его телефон был уничтожен прямо в камере полиции. Кем? Никто не ответил.',
  },
  {
    id: 3,
    date: '2024-07-22',
    region: 'Америка',
    category: 'Захват',
    title: 'НЬЮ-ЙОРК: ЗАХВАТ ЗДАНИЯ ООН',
    desc: '6 часов противостояния. 3 заложника. Требования террористов засекречены.',
    severity: 'ВЫСОКИЙ',
    casualties: 3,
    verified: false,
    miaVoice: 'Официально — психически нестабильный одиночка. Неофициально — человек с дипломатическим паспортом, которого вычеркнули из всех баз данных за 72 часа до инцидента. Заложники до сих пор не дают интервью. Им запрещено.',
  },
  {
    id: 4,
    date: '2024-05-10',
    region: 'Ближний Восток',
    category: 'Взрыв',
    title: 'БАГДАД: ДВОЙНОЙ ТЕРАКТ НА РЫНКЕ',
    desc: 'Два заминированных автомобиля. Интервал 12 минут — расчёт на спасателей. 71 погибший.',
    severity: 'КРИТИЧНО',
    casualties: 71,
    verified: true,
    miaVoice: '71 человек. Я читала каждое имя. Двенадцатиминутный интервал — это не случайность, это почерк. Я видела этот же интервал в трёх других атаках за последние два года. Никто не собирает эту статистику. Кроме меня.',
  },
  {
    id: 5,
    date: '2024-03-18',
    region: 'Африка',
    category: 'Нападение',
    title: 'НАЙРОБИ: АТАКА НА ПОСОЛЬСТВО',
    desc: 'Организованная группа пробила внешнюю охрану. Дипперсонал эвакуирован.',
    severity: 'СРЕДНИЙ',
    casualties: 8,
    verified: true,
    miaVoice: 'Восемь охранников погибли. Их имён нет в официальном отчёте — только "персонал местного найма". Я нашла их семьи. Никто не получил компенсации. Посольство работает в штатном режиме. Мир продолжается.',
  },
  {
    id: 6,
    date: '2024-01-07',
    region: 'Европа',
    category: 'Стрельба',
    title: 'ПАРИЖ: РАССТРЕЛ РЕДАКЦИИ',
    desc: 'Целенаправленное уничтожение. Трое журналистов. Нападавшие ушли незамеченными.',
    severity: 'ВЫСОКИЙ',
    casualties: 3,
    verified: true,
    miaVoice: 'Они публиковали то, что публикую я. Меня предупреждали — это может стать предупреждением и мне. Я не остановилась. Если вы читаете этот архив и меня больше нет — значит, я оказалась права.',
  },
  {
    id: 7,
    date: '2023-12-01',
    region: 'Азия',
    category: 'Взрыв',
    title: 'КАБУЛ: ВЗРЫВ У МЕЧЕТИ',
    desc: 'Пятничная молитва. Смертник вошёл в толпу. 47 жертв.',
    severity: 'КРИТИЧНО',
    casualties: 47,
    verified: true,
    miaVoice: 'Ему было, предположительно, 17 лет. Я смотрела на фотографию долго. Он не выглядел как монстр. Кто превратил его в оружие — вот настоящий вопрос. Ответа нет. Его, возможно, никогда не будет.',
  },
  {
    id: 8,
    date: '2023-10-14',
    region: 'Америка',
    category: 'Захват',
    title: 'МЕХИКО: ЗАХВАТ В БАНКЕ',
    desc: 'Четверо вооружённых. 18 часов переговоров. Связь с картелем не подтверждена.',
    severity: 'СРЕДНИЙ',
    casualties: 0,
    verified: false,
    miaVoice: 'Официально — ограбление. Но переговорщик прилетел на частном самолёте из Вашингтона. Ради ограбления банка? Что они хотели получить из этого здания — никто так и не сказал. Я до сих пор работаю над этим делом.',
  },
];

const REGIONS = ['Все', 'Европа', 'Азия', 'Америка', 'Ближний Восток', 'Африка'];
const CATEGORIES = ['Все', 'Взрыв', 'Стрельба', 'Захват', 'Нападение'];
const YEARS = ['Все', '2024', '2023'];

const SEVERITY_COLORS: Record<string, string> = {
  КРИТИЧНО: '#ff0033',
  ВЫСОКИЙ: '#ff6600',
  СРЕДНИЙ: '#ffaa00',
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
    const chars = '01アイウエオMIAGAUSS死恐血';
    const cols = Math.floor(canvas.width / 18);
    const drops: number[] = Array(cols).fill(1);
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(8,8,8,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.97 ? 'rgba(255,0,51,0.5)' : 'rgba(0,255,65,0.12)';
        ctx.fillText(char, i * 18, y * 18);
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 55);
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}

function MiaTooltip({ text, visible }: { text: string; visible: boolean }) {
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!visible) {
      setDisplayed('');
      setTyping(false);
      return;
    }
    setDisplayed('');
    setTyping(true);
    let i = 0;
    const type = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        timerRef.current = setTimeout(type, 22 + Math.random() * 18);
      } else {
        setTyping(false);
      }
    };
    timerRef.current = setTimeout(type, 120);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, text]);

  if (!visible && displayed === '') return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 12px)',
        left: 0,
        right: 0,
        background: 'rgba(4,0,0,0.97)',
        border: '1px solid rgba(255,0,51,0.4)',
        boxShadow: '0 0 24px rgba(255,0,51,0.15), inset 0 0 30px rgba(255,0,51,0.03)',
        padding: '14px 16px',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {/* Угловые декоры */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 12, borderTop: '2px solid #ff0033', borderLeft: '2px solid #ff0033' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderTop: '2px solid #ff0033', borderRight: '2px solid #ff0033' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 12, height: 12, borderBottom: '2px solid #ff0033', borderLeft: '2px solid #ff0033' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderBottom: '2px solid #ff0033', borderRight: '2px solid #ff0033' }} />

      <div style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '9px',
        color: '#ff0033',
        letterSpacing: '0.2em',
        marginBottom: 8,
        opacity: 0.7,
      }}>
        ▶ МИЯ ГАУСС / ЛИЧНЫЙ КОММЕНТАРИЙ
      </div>
      <p style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '11px',
        color: '#c8c8c8',
        lineHeight: 1.7,
        margin: 0,
      }}>
        {displayed}
        {typing && (
          <span style={{ animation: 'blink 0.7s step-end infinite', color: '#00ffe5' }}>█</span>
        )}
      </p>
    </div>
  );
}

export default function Index() {
  const [regionFilter, setRegionFilter] = useState('Все');
  const [categoryFilter, setCategoryFilter] = useState('Все');
  const [yearFilter, setYearFilter] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [booted, setBooted] = useState(false);
  const [bootText, setBootText] = useState('');
  useHorrorAudio();
  const mia = useMiaVoice();

  const bootLines = [
    '> ИНИЦИАЛИЗАЦИЯ MIA_GAUSS.EXE...',
    '> ЗАГРУЗКА АРХИВОВ... [████████████] 100%',
    '> РАСШИФРОВКА: ОК',
    '> ПОДКЛЮЧЕНИЕ К СЕТИ: УСТАНОВЛЕНО',
    '> ФАЙЛЫ ГОТОВЫ К ПРОСМОТРУ._',
  ];

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let current = '';
    const type = () => {
      if (lineIdx >= bootLines.length) {
        setTimeout(() => setBooted(true), 500);
        return;
      }
      const line = bootLines[lineIdx];
      if (charIdx < line.length) {
        current += line[charIdx];
        charIdx++;
        setBootText(current);
        setTimeout(type, 16 + Math.random() * 14);
      } else {
        current += '\n';
        setBootText(current);
        lineIdx++;
        charIdx = 0;
        setTimeout(type, 180);
      }
    };
    setTimeout(type, 300);
  }, []);

  const filtered = ARCHIVE_DATA.filter(item => {
    const matchRegion = regionFilter === 'Все' || item.region === regionFilter;
    const matchCat = categoryFilter === 'Все' || item.category === categoryFilter;
    const matchYear = yearFilter === 'Все' || item.date.startsWith(yearFilter);
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchCat && matchYear && matchSearch;
  });

  const totalCasualties = filtered.reduce((s, i) => s + i.casualties, 0);

  if (!booted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030303' }}>
        <div style={{ maxWidth: 560, width: '100%', padding: '2rem' }}>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '13px',
            color: '#00ff41',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.9,
            textShadow: '0 0 8px #00ff41',
          }}>
            {bootText}
            <span style={{ color: '#00ffe5' }}>█</span>
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

      {/* Кровавые подтёки сверху */}
      <div className="fixed top-0 left-0 w-full pointer-events-none z-10">
        {[7, 14, 22, 33, 44, 56, 67, 79, 88, 95].map((left, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${left}%`, top: 0,
            width: '1px',
            height: `${25 + (i * 7) % 45}px`,
            background: 'linear-gradient(to bottom, #ff0033, #5a0010, transparent)',
            opacity: 0.35 + (i % 3) * 0.12,
          }} />
        ))}
      </div>

      {/* HEADER */}
      <header className="relative z-20 border-b" style={{ borderColor: '#ff003318', background: 'rgba(6,0,0,0.96)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div style={{ width: 3, height: 44, background: '#ff0033', boxShadow: '0 0 14px #ff0033' }} />
            <div>
              <h1 className="glitch-text" data-text="MIA GAUSS" style={{
                fontFamily: 'Orbitron, monospace', fontSize: '22px', fontWeight: 900,
                color: '#fff', letterSpacing: '0.22em', lineHeight: 1,
              }}>
                MIA GAUSS
              </h1>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#ff0033', letterSpacing: '0.35em', marginTop: 3 }}>
                АРХИВ ГЛОБАЛЬНЫХ ИНЦИДЕНТОВ
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.1em' }}>
              {new Date().toLocaleDateString('ru-RU')}
            </div>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#00ff41', boxShadow: '0 0 10px #00ff41',
              animation: 'blink 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </header>

      {/* HERO STRIP */}
      <div className="relative z-20 border-b" style={{ borderColor: '#ff003310', background: 'rgba(8,0,0,0.6)', padding: '20px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#333', letterSpacing: '0.25em', marginBottom: 8 }}>
            ОПЕРАТИВНАЯ СВОДКА
          </div>
          <p style={{ fontFamily: 'Share Tech Mono', fontSize: '12px', color: '#666', maxWidth: 680, lineHeight: 1.7 }}>
            Я — <span className="neon-red" style={{ fontWeight: 600 }}>Мия Гаусс</span>.
            Я собираю то, о чём не говорят в новостях. <span style={{ color: '#ff003388' }}>Наведи курсор на событие</span> — и я расскажу тебе то, чего нет в официальных отчётах.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="relative z-20 border-b" style={{ borderColor: '#111', background: 'rgba(5,5,5,0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-4 gap-0">
          {[
            { label: 'ЗАПИСЕЙ', val: ARCHIVE_DATA.length, color: '#00ffe5' },
            { label: 'ПОКАЗАНО', val: filtered.length, color: '#fff' },
            { label: 'ЖЕРТВ', val: totalCasualties, color: '#ff0033' },
            { label: 'СТАТУС', val: 'ONLINE', color: '#00ff41' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '10px 20px', borderRight: i < 3 ? '1px solid #0f0f0f' : 'none' }}>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#2a2a2a', letterSpacing: '0.2em', marginBottom: 3 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '18px', fontWeight: 700, color: s.color, textShadow: `0 0 10px ${s.color}` }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 relative z-20">
        {/* FILTERS */}
        <div className="border mb-6" style={{ borderColor: '#111', background: 'rgba(8,8,8,0.85)', padding: '14px 18px' }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#2a2a2a', letterSpacing: '0.25em', marginBottom: 10 }}>
            ► ПАРАМЕТРЫ ФИЛЬТРАЦИИ
          </div>

          <div style={{ position: 'relative', marginBottom: 10 }}>
            <input
              type="text"
              placeholder="ПОИСК ПО АРХИВУ..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                fontFamily: 'Share Tech Mono',
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '7px 12px 7px 30px',
                background: '#060606',
                border: '1px solid #181818',
                color: '#888',
                outline: 'none',
              }}
            />
            <Icon name="Search" size={11} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#2a2a2a' }} />
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#2a2a2a', letterSpacing: '0.15em', alignSelf: 'center', minWidth: 56 }}>РЕГИОН:</span>
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegionFilter(r)} className={`filter-btn ${regionFilter === r ? 'active' : ''}`}>{r}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#2a2a2a', letterSpacing: '0.15em', alignSelf: 'center', minWidth: 56 }}>ТИП:</span>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} className={`filter-btn ${categoryFilter === c ? 'active-red' : ''}`}>{c}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#2a2a2a', letterSpacing: '0.15em', alignSelf: 'center', minWidth: 56 }}>ГОД:</span>
            {YEARS.map(y => (
              <button key={y} onClick={() => setYearFilter(y)} className={`filter-btn ${yearFilter === y ? 'active' : ''}`}>{y}</button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'Share Tech Mono', fontSize: '11px', color: '#1e1e1e', letterSpacing: '0.2em' }}>
            // ЗАПИСЕЙ НЕ НАЙДЕНО
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1px', background: '#111' }}>
            {filtered.map((item, idx) => {
              const isHovered = hoveredId === item.id;
              const severityColor = SEVERITY_COLORS[item.severity] || '#888';
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => { setHoveredId(item.id); mia.speak(item.miaVoice); }}
                  onMouseLeave={() => { setHoveredId(null); mia.stop(); }}
                  className="animate-fade-in-up"
                  style={{
                    background: isHovered ? 'rgba(12,0,0,0.98)' : '#090909',
                    border: `1px solid ${isHovered ? severityColor + '55' : '#111'}`,
                    padding: '18px',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: isHovered ? `0 0 24px ${severityColor}18, inset 0 0 24px ${severityColor}05` : 'none',
                    animationDelay: `${idx * 0.05}s`,
                    animationFillMode: 'both',
                    opacity: 0,
                  }}
                >
                  {/* Верхняя полоска */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                    background: `linear-gradient(to right, ${severityColor}, transparent)`,
                    opacity: isHovered ? 0.8 : 0.3,
                    transition: 'opacity 0.2s',
                  }} />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{
                        fontFamily: 'Share Tech Mono', fontSize: '8px', letterSpacing: '0.15em',
                        padding: '2px 7px',
                        border: `1px solid ${severityColor}33`,
                        color: severityColor,
                        background: `${severityColor}0d`,
                      }}>
                        {item.severity}
                      </span>
                      {!item.verified && (
                        <span style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#333', border: '1px solid #1a1a1a', padding: '2px 6px' }}>
                          НЕПРОВЕРЕНО
                        </span>
                      )}
                    </div>
                    <Icon name="AlertTriangle" size={11} style={{ color: severityColor, opacity: isHovered ? 0.8 : 0.3, transition: 'opacity 0.2s' }} />
                  </div>

                  <div style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#2a2a2a', letterSpacing: '0.2em', marginBottom: 6 }}>
                    {item.date} · {item.region} · {item.category}
                  </div>

                  <h3 style={{
                    fontFamily: 'Oswald, sans-serif', fontSize: '14px', fontWeight: 600,
                    color: isHovered ? '#fff' : '#d0d0d0',
                    letterSpacing: '0.05em', marginBottom: 8, lineHeight: 1.3,
                    transition: 'color 0.2s',
                  }}>
                    {item.title}
                  </h3>

                  <p style={{ fontFamily: 'Share Tech Mono', fontSize: '10px', color: '#3a3a3a', lineHeight: 1.6, marginBottom: 10 }}>
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between" style={{ borderTop: '1px solid #0f0f0f', paddingTop: 8 }}>
                    <div style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#222', letterSpacing: '0.1em' }}>
                      ФАЙЛ #{String(item.id).padStart(4, '0')}
                    </div>
                    {item.casualties > 0 && (
                      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#ff0033', fontWeight: 700 }}>
                        ☠ {item.casualties}
                      </div>
                    )}
                  </div>

                  {/* Tooltip Мии */}
                  <MiaTooltip text={item.miaVoice} visible={isHovered} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-20 mt-12 border-t" style={{ borderColor: '#0d0d0d', background: 'rgba(4,0,0,0.95)', padding: '16px 24px' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#1e1e1e', letterSpacing: '0.2em' }}>
            © MIA GAUSS ARCHIVE · {new Date().toLocaleDateString('ru-RU')}
          </div>
          <div className="terminal-cursor neon-red" style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', letterSpacing: '0.15em' }}>
            СИСТЕМА АКТИВНА
          </div>
        </div>
      </footer>
    </div>
  );
}