/* ============ Tezbozor — Onboarding oqimi ============
   Yangi foydalanuvchi yo'li: Telegram bot chati → Splash → 4 ekranli intro.
   Har bosqich o'z .phone-screen'ini render qiladi (boshqa ekranlar kabi). */

/* ---- kichik ikonlar ---- */
function IcoBack({ c = "currentColor" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function IcoVerified() {
  return (
    <svg className="tgbot-verified" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.2 1.6 2.7-.3 1 2.5 2.4 1.3-.6 2.6.9 2.6-2 1.8.1 2.7-2.7.6-1.5 2.3-2.5-.9-2.5.9-1.5-2.3-2.7-.6.1-2.7-2-1.8.9-2.6L2 9.6l2.4-1.3 1-2.5 2.7.3z" fill="#fff"/>
      <path d="M8.5 12.2l2.2 2.2 4.6-4.8" stroke="#1FA055" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IcoGrid({ c = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" />
    </svg>
  );
}
function IcoSend({ c = "currentColor" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
function IcoDots() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
  );
}

/* Brend belgisi — animatsiya uchun qismlarga ajratilgan (xalta+chiziq+poya).
   bag/stalk rangini props orqali beramiz (splash uchun iliq-oq). */
function MarkParts({ bag = "#1FA055", className = "" }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <rect className="sp-part sp-line sp-line1" x="11" y="42" width="22" height="8" rx="4" fill="#FF7A00" />
      <rect className="sp-part sp-line sp-line2" x="17" y="58" width="15" height="8" rx="4" fill="#FF7A00" opacity=".55" />
      <path className="sp-part sp-bag" d="M45 44 H109 L100 90 Q99 96 93 96 H61 Q55 96 54 90 Z M60.5 57 h33 a2.5 2.5 0 0 1 0 5 h-33 a2.5 2.5 0 0 1 0 -5 Z M63.5 69 h27 a2.5 2.5 0 0 1 0 5 h-27 a2.5 2.5 0 0 1 0 -5 Z" fill={bag} fillRule="evenodd" />
      <path className="sp-part sp-stalk" d="M62 44 L73 24 M92 44 L81 24" stroke={bag} strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* =====================================================================
   1) TELEGRAM BOT CHATI
   ===================================================================== */
function TelegramBotScreen() {
  return (
    <div className="phone-screen">
      <div className="tg-statusrow">
        <span>9:41</span>
        <span className="dots">📶 &nbsp;🔋</span>
      </div>

      <div className="tgbot" data-anim="on">
        {/* chat header */}
        <div className="tgbot-bar">
          <span className="tgbot-back"><IcoBack /></span>
          <span className="tgbot-ava"><Mark size={26} /></span>
          <div className="tgbot-id">
            <div className="tgbot-name">Tezbozor <IcoVerified /></div>
            <div className="tgbot-status"><span className="tgbot-online" />bot · onlayn</div>
          </div>
          <div className="tgbot-actions">⋮</div>
        </div>

        {/* chat body */}
        <div className="tgbot-chat">
          <span className="tgbot-daypill">Bugun</span>

          <div className="tgbot-msg d1">
            <div className="tgbot-msg-name">Tezbozor</div>
            <div className="tgbot-msg-text">
              Assalomu alaykum! 👋<br />
              <b>Tezbozor</b>'ga xush kelibsiz — Kattaqo‘rg‘on uchun kundalik oziq-ovqat bozori.
              <span className="tgbot-msg-time">9:41</span>
            </div>
          </div>

          <div className="tgbot-msg d2">
            <div className="tgbot-msg-text">
              Bozor qilishni atigi <b>2 daqiqada</b> bitiring. Boshlash uchun ilovani oching 👇

              <div className="tgbot-appcard">
                <span className="tgbot-appcard-ic"><Mark size={28} /></span>
                <div className="tgbot-appcard-main">
                  <div className="tgbot-appcard-name">Tezbozor — mini bozor</div>
                  <div className="tgbot-appcard-sub">Yangi narxlar · bugun 21:00 gacha buyurtma</div>
                </div>
              </div>

              <div className="tgbot-spotlight">
                <button className="tgbot-inline">
                  <span className="ti-ic">🛒</span> Ilovani ochish <span className="ti-arrow">›</span>
                </button>
              </div>
              <span className="tgbot-msg-time" style={{ marginTop: 8 }}>9:41</span>
            </div>
          </div>
        </div>

        {/* pastki kirish qatori + doimiy menu tugmasi */}
        <div className="tgbot-inputbar">
          <button className="tgbot-menubtn">
            <IcoGrid /> Ochish
          </button>
          <div className="tgbot-inputfield">Xabar yozing…</div>
          <span className="tgbot-send"><IcoSend c="var(--green-700)" /></span>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   2) SPLASH — belgi yig'ilib chiqadi
   ===================================================================== */
function SplashScreen() {
  const [run, setRun] = useState(0);
  return (
    <div className="phone-screen">
      <div className="splash" data-anim="on" key={run}>
        <div className="splash-glow" />
        <div className="splash-ring" />
        <div className="splash-mark"><MarkParts bag="#FAF7F2" /></div>
        <div className="splash-word">Tezbozor</div>
        <div className="splash-tag">Bozoringiz — cho‘ntagingizda</div>

        <div className="splash-bar"><div className="splash-bar-fill" /></div>
        <div className="splash-version">Kattaqo‘rg‘on · mini bozor</div>

        <button className="splash-replay" onClick={() => setRun((r) => r + 1)}>↻ Qayta ko‘rish</button>
      </div>
    </div>
  );
}

/* =====================================================================
   3) ONBOARDING — 4 ekran, next / next / skip
   ===================================================================== */
const ONB_STEPS = [
  {
    tint: "green", hero: "🛒",
    chips: [
      { pos: "tl", tone: "orange", ic: "⚡", t: "2 daqiqa" },
      { pos: "br", tone: "green", ic: "🥬", t: "320+ mahsulot" },
    ],
    title: "Bozorni 2 daqiqada bitiring",
    text: <>Bozorga borib <b>2–3 soat</b> sarflamang. Mahsulotni tanlang — qolganini biz qilamiz. Tezbozordagi “tez” — bu <b>bozor qilish</b> tezligi.</>,
  },
  {
    tint: "orange", hero: "🚚",
    chips: [
      { pos: "tr", tone: "orange", ic: "🕘", t: "21:00 gacha" },
      { pos: "bl", tone: "green", ic: "📅", t: "Ertaga" },
    ],
    title: "Bugun buyurtma — ertaga yetkazamiz",
    text: <>Soat <span className="o">21:00</span> gacha buyurtma bering, ertaga <b>o‘zingiz tanlagan vaqtda</b> eshigingizgacha yetkazamiz.</>,
  },
  {
    tint: "green", hero: "🏷️",
    chips: [
      { pos: "tl", tone: "green", ic: "📉", t: "Bugungi narx" },
      { pos: "br", tone: "orange", ic: "🥬", t: "Bozor kuni arzon" },
    ],
    title: "Har kuni yangi, bugungi narx",
    text: <>Narxlar har kuni ertalab bozordan yangilanadi. Bozor kunlari — <b>chorshanba, juma, yakshanba</b> — yanada arzon.</>,
  },
  {
    final: true,
    title: "Tayyormisiz?",
    text: <>Birinchi savatingizni to‘ldiring — yangi mahsulotlar va bugungi narxlar sizni kutmoqda. 🛒</>,
  },
];

function OnbScene({ step }) {
  if (step.final) {
    return <div className="onb-finalmark"><MarkParts /></div>;
  }
  const posClass = { tl: "onb-chip-tl", tr: "onb-chip-tr", bl: "onb-chip-bl", br: "onb-chip-br" };
  return (
    <div className={"onb-scene " + step.tint}>
      <span className="onb-scene-hero">{step.hero}</span>
      {step.chips.map((c, i) => (
        <span key={i} className={"onb-chip " + c.tone + " " + posClass[c.pos]}>
          <span className="oc-ic">{c.ic}</span>{c.t}
        </span>
      ))}
    </div>
  );
}

function OnboardingScreen({ initialStep = 0 }) {
  const [step, setStep] = useState(initialStep);
  const last = ONB_STEPS.length - 1;
  const s = ONB_STEPS[step];
  const isLast = step === last;

  const next = () => setStep((n) => (n >= last ? 0 : n + 1));
  const back = () => setStep((n) => Math.max(0, n - 1));
  const skip = () => setStep(last);

  return (
    <div className="phone-screen">
      <div className="tg-statusrow">
        <span>9:41</span>
        <span className="dots">📶 &nbsp;🔋</span>
      </div>

      <div className="onb">
        {/* tepa: orqaga + o'tkazib yuborish */}
        <div className="onb-top">
          <button className={"onb-back" + (step === 0 ? " hidden" : "")} aria-label="Orqaga" onClick={back}>
            <IcoBack c="var(--ink-600)" />
          </button>
          {!isLast && <button className="onb-skip" onClick={skip}>O‘tkazib yuborish</button>}
        </div>

        {/* asosiy maydon */}
        <div className="onb-body">
          <div className="onb-anim" key={step}>
            <OnbScene step={s} />
            <h2 className="onb-title">{s.title}</h2>
            <p className="onb-text">{s.text}</p>
          </div>
        </div>

        {/* pastki boshqaruv */}
        <div className="onb-foot">
          <div className="onb-dots">
            {ONB_STEPS.map((_, i) => (
              <span key={i} className={"onb-dot" + (i === step ? " on" : "")} />
            ))}
          </div>
          <button className="onb-cta" onClick={next}>
            {isLast
              ? <>Boshlash <span className="cta-arrow">🛒</span></>
              : <>Keyingi <span className="cta-arrow">→</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TelegramBotScreen, SplashScreen, OnboardingScreen, MarkParts });
