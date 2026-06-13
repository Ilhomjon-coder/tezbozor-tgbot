/* ============ Tezbozor — Rasmiylashtirish + Muvaffaqiyat ekrani ============ */
const { Button: CoButton, Card: CoCard, Badge: CoBadge, IconButton: CoIconButton } = window.TezbozorDesignSystem_77795a;

const MAHALLAS = [
  "Mustaqillik MFY", "Do‘stlik MFY", "Navbahor MFY", "Bog‘ishamol MFY",
  "Guliston MFY", "Yangiobod MFY", "Markaz MFY", "Birlik MFY", "Chorsu MFY",
];

const PAYMENTS = [
  { id: "click", logo: "Click", name: "Click", sub: "Kartadan onlayn to‘lov" },
  { id: "payme", logo: "Payme", name: "Payme", sub: "Kartadan onlayn to‘lov" },
  { id: "naqd",  logo: "💵", name: "Naqd pul", sub: "Yetkazganda to‘laysiz", naqd: true },
];

const SAVED_ADDRESSES = [
  { id: "home", name: "Uy",      tag: "Asosiy", line: "Mustaqillik MFY, 14-uy · Mo‘ljal: maktab yonida" },
  { id: "work", name: "Ish",     line: "Markaz MFY, Amir Temur ko‘chasi, 2-uy · 3-qavat" },
  { id: "mom",  name: "Ona uyi", line: "Do‘stlik MFY, 8-uy · ko‘k darvoza" },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

/* ---- order totals from the default cart ---- */
function useOrderTotals() {
  const rows = window.DEFAULT_CART || [];
  const items = rows.map((r) => ({ ...r, p: PRODUCTS.find((x) => x.id === r.id) })).filter((r) => r.p);
  const goods = items.reduce((a, r) => a + r.p.price * r.qty, 0);
  const count = items.reduce((a, r) => a + r.qty, 0);
  const free = goods >= FREE_DELIVERY_FROM;
  const delivery = free ? 0 : DELIVERY_FEE;
  return { items, goods, count, free, delivery, total: goods + delivery };
}

/* ====================== Rasmiylashtirish ====================== */
function CheckoutScreen({ onBack, onConfirm }) {
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const [selectedId, setSelectedId] = useState(SAVED_ADDRESSES[0].id);
  const [addrMode, setAddrMode] = useState("view"); // view | pick | new
  const [mahalla, setMahalla] = useState("");
  const [house, setHouse] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pay, setPay] = useState("click");
  const [slot, setSlot] = useState("s2");
  const [note, setNote] = useState("");
  const { goods, count, free, delivery, total } = useOrderTotals();

  const chosen = SLOTS.find((s) => s.id === slot);
  const selectedAddr = addresses.find((a) => a.id === selectedId);
  const addrReady = addrMode !== "new" || (mahalla && house.trim());

  const saveNewAddress = () => {
    const id = "addr" + Date.now();
    const line = `${mahalla}, ${house.trim()}` + (landmark.trim() ? ` · ${landmark.trim()}` : "");
    setAddresses((a) => [...a, { id, name: "Yangi manzil", line }]);
    setSelectedId(id);
    setMahalla(""); setHouse(""); setLandmark("");
    setAddrMode("view");
  };

  return (
    <div className="phone-screen">
      <CartChrome />
      <div className="subbar">
        <CoIconButton variant="subtle" ariaLabel="Orqaga" onClick={onBack}><BackIcon /></CoIconButton>
        <div style={{ flex: 1 }}>
          <div className="subbar-title">Rasmiylashtirish</div>
          <div className="subbar-sub">{count} ta mahsulot · {sum(total)} so‘m</div>
        </div>
      </div>

      <div className="scroll">
        <div style={{ paddingBottom: 150 }}>
          {/* 1. Manzil */}
          <div className="co-sec">
            <div className="co-label"><span className="co-step">1</span> Yetkazish manzili</div>

            {addrMode === "view" && (
              <CoCard padding={14}>
                <div className="addr">
                  <div className="addr-ic"><PinIcon /></div>
                  <div className="addr-main">
                    <div className="addr-name">{selectedAddr.name}</div>
                    <div className="addr-line">{selectedAddr.line}</div>
                  </div>
                  <button className="addr-edit" onClick={() => setAddrMode("pick")}>O‘zgartirish</button>
                </div>
              </CoCard>
            )}

            {addrMode === "pick" && (
              <CoCard padding={14}>
                <div className="addr-list-label">Saqlangan manzillar — birini tanlang</div>
                {addresses.map((a) => {
                  const on = a.id === selectedId;
                  return (
                    <button key={a.id} className={"addr-opt" + (on ? " is-on" : "")}
                      onClick={() => { setSelectedId(a.id); setAddrMode("view"); }}>
                      <span className="ao-ic"><PinIcon /></span>
                      <span className="ao-main">
                        <span className="ao-name">{a.name}{a.tag && <span className="ao-tag">{a.tag}</span>}</span>
                        <span className="ao-line">{a.line}</span>
                      </span>
                      <span className="radio"><span className="dot" /></span>
                    </button>
                  );
                })}
                <button className="addr-add" onClick={() => setAddrMode("new")}>＋ Yangi manzil qo‘shish</button>
              </CoCard>
            )}

            {addrMode === "new" && (
              <CoCard padding={14}>
                <div className="field">
                  <label className="field-label">Mahalla</label>
                  <select
                    className={"field-ctl" + (mahalla ? "" : " is-placeholder")}
                    value={mahalla}
                    onChange={(e) => setMahalla(e.target.value)}
                  >
                    <option value="" disabled>Mahallani tanlang</option>
                    {MAHALLAS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Uy / xonadon raqami</label>
                  <input className="field-ctl" inputMode="numeric" placeholder="Masalan: 14-uy, 3-xonadon"
                    value={house} onChange={(e) => setHouse(e.target.value)} />
                </div>
                <div className="field" style={{ marginBottom: 4 }}>
                  <label className="field-label">Mo‘ljal <span className="opt">— ixtiyoriy</span></label>
                  <input className="field-ctl" placeholder="Masalan: maktab yonida, ko‘k darvoza"
                    value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <CoButton variant="ghost" size="sm" onClick={() => setAddrMode("pick")}>Orqaga</CoButton>
                  <CoButton variant="secondary" size="sm" onClick={saveNewAddress} disabled={!mahalla || !house.trim()}>
                    Saqlash va tanlash
                  </CoButton>
                </div>
              </CoCard>
            )}
          </div>

          {/* 2. Yetkazish vaqti — slot picker */}
          <div className="co-sec">
            <div className="co-label"><span className="co-step">2</span> Yetkazish vaqti</div>
            <div className="slot-head">
              <span className="slot-date"><span className="sd-ic">📅</span> Ertaga, 7-iyun</span>
              <span className="slot-hint">Qulay vaqtni tanlang</span>
            </div>
            <div className="slots">
              {SLOTS.map((s) => {
                const on = slot === s.id;
                return (
                  <button
                    key={s.id}
                    className={"slot" + (on ? " is-on" : "") + (s.full ? " is-full" : "")}
                    disabled={s.full}
                    onClick={() => !s.full && setSlot(s.id)}
                  >
                    <div className="slot-time">{s.t}</div>
                    <div className="slot-sub">{s.full ? "To‘ldi" : s.sub}</div>
                    {s.popular && <span className="slot-pop">🔥 Eng ko‘p tanlangan</span>}
                    <span className="slot-check">✓</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. To'lov usuli */}
          <div className="co-sec">
            <div className="co-label"><span className="co-step">3</span> To‘lov usuli</div>
            <div className="pays">
              {PAYMENTS.map((p) => (
                <button key={p.id} className={"pay" + (pay === p.id ? " is-on" : "")} onClick={() => setPay(p.id)}>
                  <span className={"pay-logo" + (p.naqd ? " naqd" : "")}>{p.logo}</span>
                  <span className="pay-main">
                    <span className="pay-name">{p.name}</span>
                    <span className="pay-sub">{p.sub}</span>
                  </span>
                  <span className="radio"><span className="dot" /></span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Izoh */}
          <div className="co-sec">
            <div className="co-label"><span className="co-step">4</span> Kuryerga izoh <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12.5, color: "var(--ink-400)" }}>— ixtiyoriy</span></div>
            <textarea className="field-ctl" placeholder="Masalan: domofon ishlamaydi, qo‘ng‘iroq qiling"
              value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          {/* 5. Buyurtma xulosasi */}
          <div className="co-sec">
            <div className="co-label"><span className="co-step">5</span> Buyurtma xulosasi</div>
            <CoCard padding={16}>
              <div className="sumrow">
                <span className="k">Mahsulotlar ({count} ta)</span>
                <span className="v">{sum(goods)} so‘m</span>
              </div>
              <div className={"sumrow" + (free ? " free" : "")}>
                <span className="k">Yetkazish</span>
                <span className="v">{free ? <span><span className="was">{sum(DELIVERY_FEE)}</span>Bepul ✓</span> : sum(DELIVERY_FEE) + " so‘m"}</span>
              </div>
              <div className="sumrow">
                <span className="k">Yetkazish vaqti</span>
                <span className="v" style={{ color: "var(--green-700)" }}>Ertaga, {chosen.t}</span>
              </div>
              <div className="sum-total">
                <span className="k">Jami to‘lov</span>
                <span className="v">{sum(total)}<small>so‘m</small></span>
              </div>
            </CoCard>
          </div>
        </div>
      </div>

      {/* Sticky confirm */}
      <div className="dock">
        <CoButton variant="primary" size="lg" full disabled={!addrReady} onClick={() => onConfirm({ pay, total, slotTime: chosen.t })}>
          Buyurtmani tasdiqlash — {sum(total)} so‘m
        </CoButton>
      </div>
    </div>
  );
}

/* ====================== To'lov kutilmoqda ====================== */
function PaymentPendingScreen({ pay = "click", total = 83000, onPaid, onCancel }) {
  const brand = PAYMENTS.find((p) => p.id === pay) || PAYMENTS[0];
  useEffect(() => {
    if (!onPaid) return;
    const t = setTimeout(onPaid, 3200);
    return () => clearTimeout(t);
  }, [onPaid]);
  return (
    <div className="phone-screen">
      <CartChrome />
      <div className="subbar">
        <CoIconButton variant="subtle" ariaLabel="Orqaga" onClick={onCancel}><BackIcon /></CoIconButton>
        <div style={{ flex: 1 }}>
          <div className="subbar-title">To‘lov</div>
          <div className="subbar-sub">{brand.name} orqali</div>
        </div>
      </div>
      <div className="paywait">
        <div className="paywait-logo">{brand.logo}</div>
        <div className="spinner" />
        <div className="paywait-amt">{sum(total)} so‘m</div>
        <div className="paywait-title">To‘lov kutilmoqda…</div>
        <div className="paywait-sub">
          <b>{brand.name}</b> ilovasida to‘lovni tasdiqlang. To‘lov o‘tgach, buyurtmangiz avtomatik rasmiylashadi.
        </div>
        <div className="paywait-hint">🔒 Bu oynani yopmang</div>
        {onPaid && <button className="paywait-demo" onClick={onPaid}>Demo: to‘lovni tasdiqlash →</button>}
      </div>
    </div>
  );
}

/* ====================== Muvaffaqiyat ====================== */
function SuccessScreen({ orderNo = "TB-240613-0427", slotTime = "11:00–13:00", onHome }) {
  return (
    <div className="phone-screen">
      <CartChrome />
      <div className="subbar">
        <div style={{ flex: 1 }}>
          <div className="subbar-title">Buyurtma qabul qilindi</div>
        </div>
        <CoBadge tone="green">🥬 Bozor kuni</CoBadge>
      </div>

      {/* tanlangan vaqt — tepada */}
      <div className="status-time">
        <span className="st-ic">🚚</span>
        <span className="st-txt">Ertaga <b>{slotTime}</b> da yetkazamiz</span>
      </div>

      <div className="success">
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="success-ring" />
          <div className="success-check"><CheckIcon /></div>
        </div>
        <div className="success-title">Rahmat! 🛒</div>
        <div className="success-sub">
          Buyurtmangizni qabul qildik. <b>Ertaga {slotTime} da</b> eshigingizda bo‘ladi.
          Go‘sht uchun bozordan video yuboramiz — tanlaganingizdan keyin sotib olamiz.
        </div>
        <div className="order-no">
          <span className="on-label">BUYURTMA RAQAMI</span>
          <span className="on-num">{orderNo}</span>
        </div>
        <div style={{ marginTop: 4 }}>
          <CoButton variant="secondary" size="lg" onClick={onHome}>Bosh sahifaga qaytish</CoButton>
        </div>
      </div>
    </div>
  );
}

/* ---- flow wrapper: checkout -> (to'lov) -> success ---- */
function CheckoutFlow() {
  const [view, setView] = useState("checkout"); // checkout | pending | success
  const [order, setOrder] = useState(null);

  const confirm = (o) => {
    setOrder(o);
    setView(o.pay === "naqd" ? "success" : "pending");
  };

  if (view === "success") {
    return <SuccessScreen slotTime={order.slotTime} onHome={() => { setOrder(null); setView("checkout"); }} />;
  }
  if (view === "pending") {
    return (
      <PaymentPendingScreen
        pay={order.pay}
        total={order.total}
        onPaid={() => setView("success")}
        onCancel={() => setView("checkout")}
      />
    );
  }
  return <CheckoutScreen onBack={() => {}} onConfirm={confirm} />;
}

Object.assign(window, { CheckoutScreen, SuccessScreen, PaymentPendingScreen, CheckoutFlow });
