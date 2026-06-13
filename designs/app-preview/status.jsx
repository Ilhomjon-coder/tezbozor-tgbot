/* ============ Tezbozor — Buyurtma holati ekrani ============ */
const { Button: StButton, Card: StCard, Badge: StBadge, IconButton: StIconButton } = window.TezbozorDesignSystem_77795a;

const STATUS_STEPS = [
  { id: 1, title: "Qabul qilindi",            sub: "Bugun 14:20 · buyurtmangiz tasdiqlandi" },
  { id: 2, title: "Bozorda xarid qilinmoqda", sub: "Hozir · mahsulotlaringiz tanlanmoqda" },
  { id: 3, title: "Yo‘lda",                   sub: "Ertaga ~10:30 · kuryer yo‘lga chiqadi" },
  { id: 4, title: "Yetkazildi",               sub: "Ertaga 11:00–13:00 oralig‘ida" },
];

const MEAT_VIDEOS = [
  { id: "v1", label: "1-variant", emoji: "🥩", desc: "Orqa son — yog‘i kam, qovurmaga", weight: "1.2 kg", price: 95000, dur: "0:12" },
  { id: "v2", label: "2-variant", emoji: "🍖", desc: "Suyaksiz — qiyma va dimlamaga", weight: "1.0 kg", price: 98000, dur: "0:15", best: true },
  { id: "v3", label: "3-variant", emoji: "🥩", desc: "Bo‘yin — sho‘rva va shovlaga", weight: "1.4 kg", price: 88000, dur: "0:10" },
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}
function TgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M21 4.5 3.6 11.2c-.9.35-.9 1.05.04 1.32l4.4 1.27 1.7 5.1c.22.6.6.66 1.06.2l2.4-2.35 4.5 3.3c.6.4 1.1.18 1.27-.6L21.9 5.5c.2-.95-.35-1.4-.9-1Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}

/* GO'SHT VIDEO TASDIG'I — hero trust block */
function MeatVideoBlock() {
  const [chosen, setChosen] = useState(null);
  const sel = MEAT_VIDEOS.find((v) => v.id === chosen);
  return (
    <div className="meatblock">
      <span className="meatblock-badge">🎥 Go‘sht video tasdig‘i</span>
      <div className="meatblock-title">Go‘shtdan 3 ta variant video qildik</div>
      <div className="meatblock-sub">Videolarni ko‘ring va o‘zingizga ma’qulini tanlang — faqat shundan keyin sotib olamiz.</div>

      <div className="vlist">
        {MEAT_VIDEOS.map((v) => {
          const on = chosen === v.id;
          return (
            <div key={v.id} className={"vcard" + (on ? " is-chosen" : "")}>
              <div className="vthumb">
                <span className="v-emoji">{v.emoji}</span>
                <span className="v-play"><span className="tri" /></span>
                <span className="v-dur">▶ {v.dur}</span>
              </div>
              <div className="vinfo">
                <div className="vinfo-label">{v.label}{v.best && <span className="vinfo-best">Sermag‘iz</span>}</div>
                <div className="vinfo-desc">{v.desc}</div>
                <div className="vinfo-meta">{sum(v.price)} so‘m/kg <span className="vw">· ~{v.weight}</span></div>
              </div>
              <div className="vselect">
                <button className="vbtn" onClick={() => setChosen(v.id)}>
                  {on ? "✓ Tanlandi" : "Tanlash"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {sel && (
        <div className="meat-confirm">
          <span className="mc-ic">✓</span>
          <span><b>{sel.label}</b> tanlandi — shu go‘shtni siz uchun sotib olamiz. Rahmat! 🛒</span>
        </div>
      )}
    </div>
  );
}

function OrderStatusScreen() {
  const currentId = 2; // hozirgi bosqich: bozorda xarid

  return (
    <div className="phone-screen">
      <CartChrome />
      <div className="subbar">
        <StIconButton variant="subtle" ariaLabel="Orqaga"><BackIcon /></StIconButton>
        <div style={{ flex: 1 }}>
          <div className="subbar-title">Buyurtma holati</div>
          <div className="subbar-sub">TB-240613-0427 · 5 ta mahsulot</div>
        </div>
        <StBadge tone="green">🥬 Bozor kuni</StBadge>
      </div>

      {/* tanlangan vaqt */}
      <div className="status-time" style={{ marginTop: 12 }}>
        <span className="st-ic">🚚</span>
        <span className="st-txt">Ertaga <b>11:00–13:00</b> da yetkazamiz</span>
      </div>

      <div className="scroll">
        <div style={{ paddingBottom: 130 }}>
          <div className="timeline">
            {STATUS_STEPS.map((s, i) => {
              const state = s.id < currentId ? "done" : s.id === currentId ? "current" : "next";
              const isLast = i === STATUS_STEPS.length - 1;
              return (
                <div key={s.id} className={"tl-step is-" + state}>
                  <div className="tl-rail">
                    <div className={"tl-node " + state}>
                      {state === "done" ? "✓" : s.id}
                    </div>
                    {!isLast && <div className={"tl-line" + (s.id < currentId ? " filled" : "")} />}
                  </div>
                  <div className="tl-body">
                    <div className="tl-title">{s.title}</div>
                    <div className="tl-sub">{s.sub}</div>
                    {state === "current" && <span className="tl-now">● Hozir shu bosqichda</span>}

                    {/* go'sht video tasdig'i — current bosqich ostida */}
                    {s.id === currentId && (
                      <div style={{ marginTop: 14 }}>
                        <MeatVideoBlock />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* kuryer aloqasi */}
      <div className="courier-dock">
        <div className="courier-row">
          <div className="courier-ava">🧑‍🌾</div>
          <div className="courier-info">
            <div className="courier-name">Akmal aka</div>
            <div className="courier-role">Sizning kuryeringiz</div>
          </div>
          <StBadge tone="green">Onlayn</StBadge>
        </div>
        <div className="courier-btns">
          <button className="cbtn call"><PhoneIcon /> Qo‘ng‘iroq</button>
          <button className="cbtn tg"><TgIcon /> Telegram</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OrderStatusScreen, MeatVideoBlock });
