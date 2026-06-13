/* ============ Tezbozor — mini dizayn tizimi (reference) ============ */

const COLOR_GROUPS = [
  { title: "Brend yashil — 30%", note: "Sarlavhalar, faol elementlar, ishonch", swatches: [
    { n: "Bozor yashil", v: "#1FA055", t: "var(--green-500)" },
    { n: "To‘q yashil", v: "#157A40", t: "var(--green-700)" },
    { n: "Och yashil", v: "#E6F4EC", t: "var(--green-050)", dark: false },
  ]},
  { title: "Aksent apelsin — 10%", note: "FAQAT asosiy tugma va aksiyada", swatches: [
    { n: "Tez apelsin", v: "#FF7A00", t: "var(--orange-500)" },
    { n: "Bosilgan", v: "#E66E00", t: "var(--orange-600)" },
    { n: "Och apelsin", v: "#FFF1E0", t: "var(--orange-050)", dark: false },
  ]},
  { title: "Fon — 60%", note: "Iliq oq sahifa, oq kartochka", swatches: [
    { n: "Iliq oq (fon)", v: "#FAF7F2", t: "var(--paper)", dark: false },
    { n: "Kartochka", v: "#FFFFFF", t: "var(--card)", dark: false },
    { n: "Cho‘kkan", v: "#ECEFF1", t: "var(--ink-100)", dark: false },
  ]},
  { title: "Matn / ink", note: "Qora emas — yumshoq to‘q kulrang", swatches: [
    { n: "Asosiy matn", v: "#1E2A32", t: "var(--ink-900)" },
    { n: "Ikkilamchi", v: "#51616B", t: "var(--ink-600)" },
    { n: "So‘nuq", v: "#8A98A0", t: "var(--ink-400)" },
  ]},
  { title: "Holat", note: "Xato — iliq qizil, hech qachon ko‘k", swatches: [
    { n: "Muvaffaqiyat", v: "#1FA055", t: "var(--success-500)" },
    { n: "Ogohlantirish", v: "#FF7A00", t: "var(--warning-500)" },
    { n: "Xato", v: "#D64545", t: "var(--danger-500)" },
  ]},
];

function Swatch({ s }) {
  return (
    <div className="sw">
      <div className="chip" style={{ background: s.v }} />
      <div className="sw-meta">
        <div className="sw-name">{s.n}</div>
        <div className="sw-hex">{s.v}</div>
      </div>
    </div>
  );
}

const TYPE_SPECS = [
  { tag: "H1 · 28/800", el: <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em" }}>Bugungi narxlar</span> },
  { tag: "H2 · 20/700", el: <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20 }}>Go‘sht mahsulotlari</span> },
  { tag: "H3 · 18/700", el: <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18 }}>Mol go‘shti</span> },
  { tag: "Narx · 19/800", el: <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 19 }}>95 000 so‘m/kg</span> },
  { tag: "Matn · 16/400", el: <span style={{ fontFamily: "var(--font-body)", fontSize: 16 }}>Ertaga 10:00–13:00 da yetkazamiz</span> },
  { tag: "Tugma · 16/600", el: <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16 }}>Savatga qo‘shish</span> },
  { tag: "Izoh · 13/500", el: <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13, color: "var(--ink-400)" }}>Narx har kuni ertalab yangilanadi</span> },
];

function DocCard({ title, note, children }) {
  return (
    <div className="doc-card">
      <h3>{title}</h3>
      {note && <div className="doc-note">{note}</div>}
      {children}
    </div>
  );
}

function DesignSystem() {
  return (
    <div className="ds-section">
      {/* Ranglar */}
      <div className="canvas-kicker">Rang tokenlari · 60–30–10</div>
      <div className="ds-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {COLOR_GROUPS.map((g) => (
          <DocCard key={g.title} title={g.title} note={g.note}>
            <div className="sw-grid">{g.swatches.map((s) => <Swatch key={s.v} s={s} />)}</div>
          </DocCard>
        ))}
        <DocCard title="Ko‘k rang — taqiqlangan" note="Click/Payme bilan adashtirmaslik uchun">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: "#2D6CDF", position: "relative", opacity: .5 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🚫</div>
            </div>
            <div style={{ fontSize: 13.5, color: "var(--ink-600)", lineHeight: 1.5 }}>
              Interfeysda ko‘k ishlatilmaydi. To‘lov brendlari (Click/Payme) o‘z ranglarida faqat to‘lov ekranida ko‘rinadi.
            </div>
          </div>
        </DocCard>
      </div>

      {/* Tipografika */}
      <div className="canvas-kicker">Tipografika · Montserrat + Inter</div>
      <DocCard title="Shkala" note="Sarlavha — Montserrat (700/800), matn — Inter (400–600). Test: Gʻoʻzal oʻrikzor.">
        {TYPE_SPECS.map((s, i) => (
          <div className="type-row" key={i}>
            <span className="t-tag">{s.tag}</span>
            <span className="t-demo">{s.el}</span>
          </div>
        ))}
      </DocCard>

      {/* Komponentlar */}
      <div className="canvas-kicker">Komponentlar va holatlar</div>
      <div className="ds-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <DocCard title="Tugmalar" note="Asosiy harakat — apelsin. Brend — yashil. Hech qachon 48px‘dan kichik emas.">
          <div className="bench-block">
            <div className="bench-label">Asosiy (apelsin) — default · hover · pressed · disabled</div>
            <div className="bench">
              <Button variant="primary">Buyurtma berish</Button>
              <Button variant="primary" style={{ background: "var(--orange-600)" }}>Hover</Button>
              <Button variant="primary" className="is-pressed">Pressed</Button>
              <Button variant="disabled" disabled>Bo‘sh</Button>
            </div>
          </div>
          <div className="bench-block">
            <div className="bench-label">Brend (yashil) va yumshoq</div>
            <div className="bench">
              <Button variant="secondary">Tasdiqlash</Button>
              <Button variant="ghost">Batafsil</Button>
              <Button variant="secondary" size="sm">Kichik</Button>
            </div>
          </div>
        </DocCard>

        <DocCard title="Belgilar (badge)" note="Yashil — bozor/ishonch. Apelsin — tezlik/aksiya.">
          <div className="bench">
            <Badge type="bozor">🥬 Bozor kuni</Badge>
            <Badge type="video">🎥 Video orqali tanlaysiz</Badge>
            <Badge type="today">Bugungi narx</Badge>
            <Badge type="free">Bepul yetkazish</Badge>
            <Badge type="promo">Aksiya</Badge>
            <Badge type="down">↓ arzonladi</Badge>
            <Badge style={{ background: "var(--danger-050)", color: "var(--danger-500)" }}>↑ ko‘tarildi</Badge>
          </div>
        </DocCard>

        <DocCard title="Mahsulot kartochkasi" note="Rasm, nom, bugungi narx (so‘m/kg), qo‘shish. Bosilgach — stepper.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <ProductCard product={PRODUCTS.find((p) => p.id === "pomidor")} qty={0} onAdd={() => {}} />
            <DSCardLive />
          </div>
        </DocCard>

        <DocCard title="Go‘sht kartochkasi — video tasdiq" note="Bizning eng kuchli ishonch elementi. Bozordan 2–3 video, mijoz tanlaydi.">
          <ProductCard product={PRODUCTS.find((p) => p.id === "mol")} qty={2} onInc={() => {}} onDec={() => {}} />
        </DocCard>
      </div>

      {/* B-variant protokoli komponenti */}
      <div className="canvas-kicker">“B variant” protokoli — savatdagi har bir mahsulot uchun</div>
      <DocCard title="Topilmasa nima qilamiz?" note="Mijoz oldindan tanlaydi — bozorda mahsulot bo‘lmasa.">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <BVariantChip icon="🔄" label="O‘xshashi bilan almashtiring" active />
          <BVariantChip icon="⏭️" label="O‘tkazib yuboring (pul qaytadi)" />
          <BVariantChip icon="📞" label="Menga qo‘ng‘iroq qiling" />
        </div>
      </DocCard>
    </div>
  );
}

// jonli kartochka — qo'shish/stepper holatini ko'rsatish uchun
function DSCardLive() {
  const [qty, setQty] = useState(1);
  return (
    <ProductCard
      product={PRODUCTS.find((p) => p.id === "olma")}
      qty={qty}
      onAdd={() => setQty(1)}
      onInc={() => setQty((q) => q + 1)}
      onDec={() => setQty((q) => Math.max(0, q - 1))}
    />
  );
}

function BVariantChip({ icon, label, active }) {
  const [on, setOn] = useState(!!active);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        height: 48, padding: "0 16px",
        borderRadius: "var(--radius-pill)",
        border: on ? "1.5px solid var(--green-500)" : "1.5px solid var(--ink-200)",
        background: on ? "var(--green-050)" : "#fff",
        color: on ? "var(--green-700)" : "var(--ink-600)",
        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14.5,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
      {on && <span style={{ marginLeft: 2 }}>✓</span>}
    </button>
  );
}

Object.assign(window, { DesignSystem });
