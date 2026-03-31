import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { useHorrorAudio } from '@/hooks/useHorrorAudio';

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
    miaVoice: 'Я была в Вене через три дня после взрыва. Власти назвали это изолированным инцидентом. Ложь. Я видела оцепление в двух кварталах — там нашли второе устройство, о котором не сообщали.',
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
    miaVoice: 'Нападавший стоял неподвижно 40 секунд перед первым выстрелом — как будто ждал команды. Его телефон уничтожили прямо в камере полиции.',
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
    miaVoice: 'Официально — психически нестабильный одиночка. Неофициально — человек с дипломатическим паспортом, вычеркнутый из всех баз данных за 72 часа до инцидента.',
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
    miaVoice: '71 человек. Двенадцатиминутный интервал — это почерк. Я видела этот же интервал в трёх других атаках за два года. Никто не собирает эту статистику. Кроме меня.',
  },
  {
    id: 5,
    date: '2024-03-22',
    region: 'Россия',
    category: 'Стрельба',
    title: 'МОСКВА: ТЕРАКТ В «КРОКУС СИТИ ХОЛЛ»',
    desc: 'Вооружённые нападавшие открыли огонь по зрителям. Пожар охватил здание. 145 погибших.',
    severity: 'КРИТИЧНО',
    casualties: 145,
    verified: true,
    miaVoice: 'Самый смертоносный теракт в России за два десятилетия. Четверо нападавших действовали слаженно. Вопрос о возможной халатности спецслужб так и не получил официального ответа.',
  },
  {
    id: 6,
    date: '2024-01-03',
    region: 'Ближний Восток',
    category: 'Взрыв',
    title: 'КЕРМАН: ДВОЙНОЙ ВЗРЫВ НА ПОХОРОНАХ',
    desc: 'Два смертника подорвались в толпе на траурной церемонии. 84 погибших.',
    severity: 'КРИТИЧНО',
    casualties: 84,
    verified: true,
    miaVoice: 'Люди пришли проститься — и попали в ловушку. Второй взрыв произошёл когда подбежали помочь после первого. Это хладнокровный расчёт.',
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
    miaVoice: 'Ему было примерно 17 лет. Он не выглядел как монстр на фотографии. Кто превратил его в оружие — вот настоящий вопрос.',
  },
  {
    id: 8,
    date: '2023-10-07',
    region: 'Ближний Восток',
    category: 'Нападение',
    title: 'ИЗРАИЛЬ: АТАКА НА КИБУЦЫ',
    desc: 'Массированное нападение с прорывом границы. Захват заложников. Свыше 1200 погибших.',
    severity: 'КРИТИЧНО',
    casualties: 1200,
    verified: true,
    miaVoice: 'Крупнейшая атака на мирное население в истории Израиля. Масштаб координации указывает на многолетнюю подготовку. Мировое сообщество ответило по-разному — и это само по себе говорит о многом.',
  },
  {
    id: 9,
    date: '2023-09-10',
    region: 'Россия',
    category: 'Взрыв',
    title: 'СЕВАСТОПОЛЬ: УДАР ПО ПЛОЩАДИ НАХИМОВА',
    desc: 'Взрывы в центре города в День города. 122 пострадавших, в том числе дети.',
    severity: 'КРИТИЧНО',
    casualties: 122,
    verified: true,
    miaVoice: 'Праздничный день. Семьи с детьми на набережной. В официальных сводках — минимум деталей. Я собирала свидетельства очевидцев напрямую.',
  },
  {
    id: 10,
    date: '2023-07-30',
    region: 'Россия',
    category: 'Взрыв',
    title: 'МОСКВА: АТАКА БЕСПИЛОТНИКОВ НА ДЕЛОВОЙ ЦЕНТР',
    desc: 'Несколько БПЛА поразили здания в деловом районе столицы. Эвакуация тысяч человек.',
    severity: 'ВЫСОКИЙ',
    casualties: 3,
    verified: true,
    miaVoice: 'Дроны над Москвой — это изменение правил игры. Психологический эффект был рассчитан точно. Население почувствовало войну там, где её не ждали.',
  },
  {
    id: 11,
    date: '2023-04-15',
    region: 'Америка',
    category: 'Взрыв',
    title: 'БОСТОН: 10 ЛЕТ МАРАФОНСКОМУ ТЕРАКТУ',
    desc: 'Памятная церемония омрачена угрозой повторной атаки. Оцепление, эвакуация. Угроза не подтвердилась.',
    severity: 'СРЕДНИЙ',
    casualties: 0,
    verified: true,
    miaVoice: 'Страх — тоже оружие. Они не взорвали ничего в этот день. Но тысячи людей разбежались. Иногда достаточно просто напомнить.',
  },
  {
    id: 12,
    date: '2022-12-25',
    region: 'Америка',
    category: 'Взрыв',
    title: 'НЭШВИЛЛ: ВЗРЫВ ФУРГОНА В РОЖДЕСТВО',
    desc: 'Заминированный фургон взорвался в центре города ранним утром. Предварительное предупреждение через громкоговоритель.',
    severity: 'ВЫСОКИЙ',
    casualties: 8,
    verified: true,
    miaVoice: 'Нападавший заблаговременно предупредил через запись. Он не хотел жертв — он хотел что-то сказать. Что именно — следствие так и не раскрыло полностью.',
  },
  {
    id: 13,
    date: '2024-01-07',
    region: 'Европа',
    category: 'Стрельба',
    title: 'ПАРИЖ: РАССТРЕЛ РЕДАКЦИИ',
    desc: 'Целенаправленное уничтожение. Трое журналистов. Нападавшие ушли незамеченными.',
    severity: 'ВЫСОКИЙ',
    casualties: 3,
    verified: true,
    miaVoice: 'Они публиковали то, что публикую я. Если вы читаете этот архив и меня больше нет — значит, я оказалась права.',
  },
  {
    id: 14,
    date: '2023-06-14',
    region: 'Россия',
    category: 'Нападение',
    title: 'ДАГЕСТАН: НАПАДЕНИЕ НА ЦЕРКВИ И ПОСТ ДПС',
    desc: 'Скоординированные атаки на православные церкви и синагогу. 20 погибших силовиков.',
    severity: 'КРИТИЧНО',
    casualties: 20,
    verified: true,
    miaVoice: 'Атаки одновременно на разные религиозные объекты. Цель — не просто убить, а разжечь. Это была попытка поджечь общество изнутри.',
  },
  {
    id: 15,
    date: '2023-03-27',
    region: 'Америка',
    category: 'Стрельба',
    title: 'НЭШВИЛЛ: СТРЕЛЬБА В ХРИСТИАНСКОЙ ШКОЛЕ',
    desc: 'Нападение на начальную школу. 6 погибших, в том числе трое детей.',
    severity: 'КРИТИЧНО',
    casualties: 6,
    verified: true,
    miaVoice: 'Трое детей. Я не могу писать об этом без дрожи. Манифест нападавшей засекречен властями до сих пор. Почему? Что в нём такого, что нельзя показать?',
  },
  {
    id: 16,
    date: '2024-03-18',
    region: 'Африка',
    category: 'Нападение',
    title: 'НАЙРОБИ: АТАКА НА ПОСОЛЬСТВО',
    desc: 'Организованная группа пробила внешнюю охрану. Дипперсонал эвакуирован.',
    severity: 'СРЕДНИЙ',
    casualties: 8,
    verified: true,
    miaVoice: 'Восемь охранников погибли. Их имён нет в официальном отчёте — только "персонал местного найма". Я нашла их семьи. Никто не получил компенсации.',
  },
];

const REGIONS = ['Все', 'Европа', 'Азия', 'Россия', 'Америка', 'Ближний Восток', 'Африка'];
const CATEGORIES = ['Все', 'Взрыв', 'Стрельба', 'Захват', 'Нападение'];
const YEARS = ['Все', '2024', '2023', '2022'];

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

// Кровавые следы пальцев/капли поверх логотипа
function BloodOnTitle() {
  const drops = [
    { left: '2%',  delay: 0,    height: 38, width: 2,   opacity: 0.85 },
    { left: '8%',  delay: 0.3,  height: 22, width: 1.5, opacity: 0.6  },
    { left: '15%', delay: 0.7,  height: 50, width: 2.5, opacity: 0.9  },
    { left: '23%', delay: 0.1,  height: 30, width: 1.5, opacity: 0.7  },
    { left: '31%', delay: 0.5,  height: 44, width: 2,   opacity: 0.8  },
    { left: '40%', delay: 0.9,  height: 18, width: 1,   opacity: 0.5  },
    { left: '50%', delay: 0.2,  height: 55, width: 3,   opacity: 0.95 },
    { left: '58%', delay: 0.6,  height: 28, width: 1.5, opacity: 0.65 },
    { left: '67%', delay: 0.4,  height: 42, width: 2,   opacity: 0.8  },
    { left: '75%', delay: 0.8,  height: 20, width: 1,   opacity: 0.55 },
    { left: '83%', delay: 0.15, height: 48, width: 2.5, opacity: 0.88 },
    { left: '91%', delay: 0.55, height: 33, width: 2,   opacity: 0.72 },
    { left: '97%', delay: 0.35, height: 25, width: 1.5, opacity: 0.6  },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {drops.map((d, i) => (
        <div key={i} style={{ position: 'absolute', left: d.left, top: 0 }}>
          {/* Основная капля */}
          <div style={{
            width: `${d.width}px`,
            height: `${d.height}px`,
            background: `linear-gradient(to bottom, #cc0022, #8b0000 60%, #3a0008)`,
            borderRadius: '0 0 50% 50%',
            boxShadow: `0 0 4px rgba(200,0,34,0.6)`,
            animationDelay: `${d.delay}s`,
            opacity: d.opacity,
          }} />
          {/* Шарик на конце */}
          <div style={{
            width: `${d.width * 2.2}px`,
            height: `${d.width * 2.2}px`,
            borderRadius: '50%',
            background: '#8b0000',
            marginLeft: `-${d.width * 0.6}px`,
            marginTop: '-1px',
            opacity: d.opacity * 0.9,
            boxShadow: '0 2px 6px rgba(139,0,0,0.7)',
          }} />
        </div>
      ))}
    </div>
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
        timerRef.current = setTimeout(type, 20 + Math.random() * 16);
      } else {
        setTyping(false);
      }
    };
    timerRef.current = setTimeout(type, 100);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, text]);

  if (!visible && displayed === '') return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(100% + 10px)',
      left: 0, right: 0,
      background: 'rgba(4,0,0,0.97)',
      border: '1px solid rgba(255,0,51,0.4)',
      boxShadow: '0 0 24px rgba(255,0,51,0.15), inset 0 0 30px rgba(255,0,51,0.03)',
      padding: '14px 16px',
      zIndex: 100,
      pointerEvents: 'none',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 12, borderTop: '2px solid #ff0033', borderLeft: '2px solid #ff0033' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderTop: '2px solid #ff0033', borderRight: '2px solid #ff0033' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 12, height: 12, borderBottom: '2px solid #ff0033', borderLeft: '2px solid #ff0033' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderBottom: '2px solid #ff0033', borderRight: '2px solid #ff0033' }} />
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#ff0033', letterSpacing: '0.2em', marginBottom: 8, opacity: 0.7 }}>
        ▶ МИЯ ГАУСС / ЛИЧНЫЙ КОММЕНТАРИЙ
      </div>
      <p style={{ fontFamily: 'Share Tech Mono', fontSize: '11px', color: '#c8c8c8', lineHeight: 1.7, margin: 0 }}>
        {displayed}
        {typing && <span style={{ animation: 'blink 0.7s step-end infinite', color: '#00ffe5' }}>█</span>}
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

      {/* HEADER */}
      <header className="relative z-20 border-b" style={{ borderColor: '#ff003318', background: 'rgba(6,0,0,0.96)', backdropFilter: 'blur(10px)', overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div style={{ width: 3, height: 44, background: '#ff0033', boxShadow: '0 0 14px #ff0033' }} />
            <div style={{ position: 'relative' }}>
              {/* Кровь поверх заголовка */}
              <div style={{ position: 'absolute', top: -4, left: 0, right: 0, height: '120%', pointerEvents: 'none', zIndex: 2 }}>
                <BloodOnTitle />
              </div>
              <h1
                className="glitch-text"
                data-text="MIA GAUSS"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: '0.22em',
                  lineHeight: 1,
                  position: 'relative',
                  zIndex: 3,
                  textShadow: '0 0 20px rgba(255,0,51,0.4)',
                }}
              >
                MIA GAUSS
              </h1>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#ff0033', letterSpacing: '0.35em', marginTop: 4, position: 'relative', zIndex: 3 }}>
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
            Я собираю то, о чём не говорят в новостях.{' '}
            <span style={{ color: '#ff003366' }}>Наведи курсор на событие</span> — и я расскажу тебе то, чего нет в официальных отчётах.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="relative z-20 border-b" style={{ borderColor: '#111', background: 'rgba(5,5,5,0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-4 gap-0">
          {[
            { label: 'ЗАПИСЕЙ', val: ARCHIVE_DATA.length, color: '#00ffe5' },
            { label: 'ПОКАЗАНО', val: filtered.length, color: '#fff' },
            { label: 'ЖЕРТВ', val: totalCasualties.toLocaleString('ru-RU'), color: '#ff0033' },
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
              const sc = SEVERITY_COLORS[item.severity] || '#888';
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="animate-fade-in-up"
                  style={{
                    background: isHovered ? 'rgba(12,0,0,0.98)' : '#090909',
                    border: `1px solid ${isHovered ? sc + '55' : '#111'}`,
                    padding: '18px',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: isHovered ? `0 0 24px ${sc}18, inset 0 0 24px ${sc}05` : 'none',
                    animationDelay: `${idx * 0.04}s`,
                    animationFillMode: 'both',
                    opacity: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                    background: `linear-gradient(to right, ${sc}, transparent)`,
                    opacity: isHovered ? 0.8 : 0.3,
                    transition: 'opacity 0.2s',
                  }} />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{
                        fontFamily: 'Share Tech Mono', fontSize: '8px', letterSpacing: '0.15em',
                        padding: '2px 7px',
                        border: `1px solid ${sc}33`,
                        color: sc,
                        background: `${sc}0d`,
                      }}>
                        {item.severity}
                      </span>
                      {!item.verified && (
                        <span style={{ fontFamily: 'Share Tech Mono', fontSize: '8px', color: '#333', border: '1px solid #1a1a1a', padding: '2px 6px' }}>
                          НЕПРОВЕРЕНО
                        </span>
                      )}
                    </div>
                    <Icon name="AlertTriangle" size={11} style={{ color: sc, opacity: isHovered ? 0.8 : 0.3, transition: 'opacity 0.2s' }} />
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
                        ☠ {item.casualties.toLocaleString('ru-RU')}
                      </div>
                    )}
                  </div>

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
