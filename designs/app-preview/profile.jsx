/* ============ Tezbozor — Profil (hub + alohida oynalar) ============ */
const { Button: PfButton, Card: PfCard, Badge: PfBadge, IconButton: PfIconButton, Avatar: PfAvatar } = window.TezbozorDesignSystem_77795a;

const USER = { name: "Dilnoza Karimova", phone: "+998 90 123 45 67" };

const INITIAL_ADDRESSES = [
  { id: "home", name: "Uy",      tag: "Asosiy", line: "Mustaqillik MFY, 14-uy · Mo‘ljal: maktab yonida" },
  { id: "work", name: "Ish",     line: "Markaz MFY, Amir Temur ko‘chasi, 2-uy · 3-qavat" },
  { id: "mom",  name: "Ona uyi", line: "Do‘stlik MFY, 8-uy · ko‘k darvoza" },
];

const WEEKLY_IDS = ["non", "sut", "tuxum", "kartoshka", "pomidor", "kokat"];

/* buyurtmalar — mahsulot ro'yxati bilan */
const ACTIVE_ORDER = {
  id: "TB-240613-0427", date: "Bugun, 14:20", status: "active",
  addr: "Uy · Mustaqillik MFY, 14-uy", slot: "11:00–13:00", pay: "Naqd (yetkazganda)",
  products: [["pomidor", 2], ["kartoshka", 2], ["olma", 1], ["tuxum", 1], ["non", 1]],
};
const ORDER_HISTORY = [
  { id: "TB-240612-0391", date: "12-iyun, chorshanba", status: "delivered", deliveredAt: "12-iyun, 11:40 da yetkazildi",
    addr: "Uy · Mustaqillik MFY, 14-uy", slot: "11:00–13:00", pay: "Click",
    products: [["mol", 1], ["pomidor", 2], ["non", 2]] },
  { id: "TB-240608-0244", date: "8-iyun, shanba", status: "delivered", deliveredAt: "8-iyun, 12:10 da yetkazildi",
    addr: "Ish · Markaz MFY, 2-uy", slot: "13:00–16:00", pay: "Naqd (yetkazganda)",
    products: [["kartoshka", 2], ["tuxum", 1], ["sut", 2], ["non", 3]] },
  { id: "TB-240601-0125", date: "1-iyun, shanba", status: "delivered", deliveredAt: "1-iyun, 10:50 da yetkazildi",
    addr: "Uy · Mustaqillik MFY, 14-uy", slot: "09:00–11:00", pay: "Payme",
    products: [["olma", 2], ["guruch", 1], ["qaymoq", 1], ["non", 2]] },
];

function computeOrder(o) {
  const items = o.products.map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? { p, qty, line: p.price * qty } : null;
  }).filter(Boolean);
  const goods = items.reduce((a, r) => a + r.line, 0);
  const delivery = goods >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const count = items.reduce((a, r) => a + r.qty, 0);
  return { items, goods, delivery, count, total: goods + delivery };
}
function orderSummary(o) {
  const items = computeOrder(o).items;
  const names = items.slice(0, 2).map((r) => r.p.name).join(", ");
  const extra = items.length > 2 ? ` +${items.length - 2} mahsulot` : "";
  return { emojis: items.slice(0, 4).map((r) => r.p.emoji), text: names + extra };
}

/* ---- icons ---- */
function Chevron() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function EditIcon2() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4ZM14 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function TrashIcon2() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ReorderIcon() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 1 0-.5 3M20 5v6h-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function PinIcon2() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>;
}

/* ============ sub-screen header ============ */
function SubHeader({ title, sub, onBack, right }) {
  return (
    <div className="subbar">
      {onBack && <PfIconButton variant="subtle" ariaLabel="Orqaga" onClick={onBack}><BackIcon /></PfIconButton>}
      <div style={{ flex: 1 }}>
        <div className="subbar-title">{title}</div>
        {sub && <div className="subbar-sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

/* ============ HUB ============ */
function HubView({ go, addresses, onOpenStatus }) {
  return (
    <div className="scroll">
      <div style={{ paddingBottom: 24 }}>
        <div className="pf-hero">
          <PfAvatar name={USER.name} size={54} />
          <div className="pf-info">
            <div className="pf-name">{USER.name}</div>
            <div className="pf-phone">{USER.phone}</div>
          </div>
          <button className="pf-hero-edit" onClick={() => go("personal")}>Tahrirlash</button>
        </div>

        {/* Joriy buyurtma */}
        <div className="active-order">
          <span className="ao-pulse" />
          <div className="ao-txt">
            <div className="ao-title">Joriy buyurtma · Bozorda xarid</div>
            <div className="ao-sub">Ertaga 11:00–13:00 da yetkaziladi</div>
          </div>
          <button className="ao-link" onClick={onOpenStatus}>Ko‘rish →</button>
        </div>

        {/* Menyu */}
        <div className="menu-list">
          <button className="menu-row" onClick={() => go("orders")}>
            <span className="menu-ic">📦</span>
            <span className="menu-main">
              <span className="menu-label">Buyurtmalar tarixi</span>
              <span className="menu-sub">O‘tgan buyurtmalar va qayta buyurtma</span>
            </span>
            <span className="menu-right">
              <span className="menu-count">{ORDER_HISTORY.length}</span>
              <span className="menu-chev"><Chevron /></span>
            </span>
          </button>

          <button className="menu-row" onClick={() => go("addresses")}>
            <span className="menu-ic">📍</span>
            <span className="menu-main">
              <span className="menu-label">Manzillarim</span>
              <span className="menu-sub">Yetkazish manzillarini boshqaring</span>
            </span>
            <span className="menu-right">
              <span className="menu-count">{addresses.length}</span>
              <span className="menu-chev"><Chevron /></span>
            </span>
          </button>

          <button className="menu-row" onClick={() => go("weekly")}>
            <span className="menu-ic">🔁</span>
            <span className="menu-main">
              <span className="menu-label">Doimiy ro‘yxatim</span>
              <span className="menu-sub">Har hafta oladigan mahsulotlar</span>
            </span>
            <span className="menu-right">
              <span className="menu-count">{WEEKLY_IDS.length}</span>
              <span className="menu-chev"><Chevron /></span>
            </span>
          </button>

          <button className="menu-row" onClick={() => go("personal")}>
            <span className="menu-ic">👤</span>
            <span className="menu-main">
              <span className="menu-label">Shaxsiy ma’lumotlar</span>
              <span className="menu-sub">Ism va telefon raqami</span>
            </span>
            <span className="menu-right"><span className="menu-chev"><Chevron /></span></span>
          </button>
        </div>

        <div className="menu-list">
          <button className="menu-row" onClick={() => {}}>
            <span className="menu-ic" style={{ background: "var(--orange-050)" }}>💬</span>
            <span className="menu-main">
              <span className="menu-label">Yordam va aloqa</span>
              <span className="menu-sub">Savol bo‘lsa — biz bilan bog‘laning</span>
            </span>
            <span className="menu-right"><span className="menu-chev"><Chevron /></span></span>
          </button>
        </div>

        <div className="pf-signout"><button>Chiqish</button></div>
        <div className="pf-version">Tezbozor · Kattaqo‘rg‘on · v1.0</div>
      </div>
    </div>
  );
}

/* ============ Buyurtmalar tarixi ============ */
function OrderCard({ o, onOpen, ping }) {
  const { total } = computeOrder(o);
  const sm = orderSummary(o);
  const active = o.status === "active";
  return (
    <div className="order-card tappable" onClick={() => onOpen(o)}>
      <div className="oc-top">
        <div>
          <div className="oc-date">{o.date}</div>
          <div className="oc-id">{o.id}</div>
        </div>
        {active
          ? <PfBadge tone="orange">● Bozorda xarid</PfBadge>
          : <PfBadge tone="green">✓ Yetkazildi</PfBadge>}
      </div>
      <div className="oc-items">
        <span className="oc-thumbs">{sm.emojis.map((e, i) => <span key={i}>{e}</span>)}</span>
        {sm.text}
      </div>
      <div className="oc-divider" />
      <div className="oc-bottom">
        <div className="oc-sum-wrap">
          <div className="oc-sum-label">Jami</div>
          <div className="oc-sum">{sum(total)} so‘m</div>
        </div>
        {active
          ? <span className="oc-detail-hint">Holatni ko‘rish →</span>
          : <button className="reorder-btn" onClick={(e) => { e.stopPropagation(); ping("✓ Buyurtma savatga qo‘shildi"); }}>
              <ReorderIcon /> Qayta buyurtma
            </button>}
      </div>
    </div>
  );
}

function OrdersView({ onOpen, ping }) {
  return (
    <div className="scroll">
      <div style={{ padding: "16px 16px 24px" }}>
        <OrderCard o={ACTIVE_ORDER} onOpen={onOpen} ping={ping} />
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-400)", letterSpacing: ".03em", textTransform: "uppercase", margin: "6px 2px 10px" }}>O‘tgan buyurtmalar</div>
        {ORDER_HISTORY.map((o) => <OrderCard key={o.id} o={o} onOpen={onOpen} ping={ping} />)}
      </div>
    </div>
  );
}

/* ============ Buyurtma tafsiloti ============ */
function OrderDetailView({ order, onOpenStatus, ping }) {
  const { items, goods, delivery, total, count } = computeOrder(order);
  const active = order.status === "active";
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <React.Fragment>
      <div className="scroll">
        <div style={{ paddingBottom: 150 }}>
          {/* status */}
          <div className={"od-status" + (active ? " active" : "")}>
            <div className="ods-ic">{active ? "🛒" : "✓"}</div>
            <div className="ods-main">
              <div className="ods-title">{active ? "Bozorda xarid qilinmoqda" : "Yetkazildi"}</div>
              <div className="ods-sub">{active ? "Ertaga " + order.slot + " da yetkaziladi" : order.deliveredAt}</div>
            </div>
            {active && <button className="ods-link" onClick={onOpenStatus}>Holat →</button>}
          </div>

          {/* yetkazish ma'lumotlari */}
          <div className="od-sec">
            <div className="od-sec-title">Yetkazish</div>
            <PfCard padding={14}>
              <div className="od-info-row">
                <span className="odi-ic">📍</span>
                <span className="odi-main"><span className="odi-label">Manzil</span><span className="odi-val">{order.addr}</span></span>
              </div>
              <div className="od-info-row">
                <span className="odi-ic">🕒</span>
                <span className="odi-main"><span className="odi-label">Vaqt</span><span className="odi-val">{active ? "Ertaga, " : ""}{order.slot}</span></span>
              </div>
              <div className="od-info-row">
                <span className="odi-ic">💳</span>
                <span className="odi-main"><span className="odi-label">To‘lov</span><span className="odi-val">{order.pay}</span></span>
              </div>
            </PfCard>
          </div>

          {/* mahsulotlar */}
          <div className="od-sec">
            <div className="od-sec-title">Mahsulotlar ({count} ta)</div>
            <PfCard padding={14}>
              {items.map((r) => (
                <div className="od-item" key={r.p.id}>
                  <div className="od-item-thumb">{r.p.emoji}</div>
                  <div className="od-item-main">
                    <div className="od-item-name">{r.p.name}</div>
                    <div className="od-item-qty">{r.qty} {r.p.unit} × {sum(r.p.price)} so‘m</div>
                  </div>
                  <div className="od-item-sum">{sum(r.line)} so‘m</div>
                </div>
              ))}
              <div className="sumdiv" style={{ margin: "8px 0" }} />
              <div className="sumrow"><span className="k">Mahsulotlar</span><span className="v">{sum(goods)} so‘m</span></div>
              <div className={"sumrow" + (delivery === 0 ? " free" : "")}>
                <span className="k">Yetkazish</span>
                <span className="v">{delivery === 0 ? <span><span className="was">{sum(DELIVERY_FEE)}</span>Bepul ✓</span> : sum(DELIVERY_FEE) + " so‘m"}</span>
              </div>
              <div className="sum-total"><span className="k">Jami</span><span className="v">{sum(total)}<small>so‘m</small></span></div>
            </PfCard>
          </div>

          {/* izoh / baho */}
          <div className="od-sec">
            <div className="od-sec-title">{active ? "Izoh qoldiring" : "Buyurtmani baholang"}</div>
            <PfCard padding={14}>
              {sent ? (
                <div className="comment-sent"><span>✓</span> Rahmat! Izohingiz qabul qilindi.</div>
              ) : (
                <React.Fragment>
                  {!active && (
                    <div className="rating">
                      {[1,2,3,4,5].map((n) => (
                        <button key={n} className={"star" + (n <= stars ? " on" : "")} onClick={() => setStars(n)} aria-label={n + " yulduz"}>⭐</button>
                      ))}
                    </div>
                  )}
                  <textarea className="comment-ctl"
                    placeholder={active ? "Masalan: go‘shtni yog‘siz tanlang, non issiq bo‘lsin" : "Buyurtma haqida fikringiz — sifat, yetkazish..."}
                    value={comment} onChange={(e) => setComment(e.target.value)} />
                  <div style={{ marginTop: 10 }}>
                    <PfButton variant="secondary" size="md" full
                      disabled={active ? !comment.trim() : (stars === 0 && !comment.trim())}
                      onClick={() => { setSent(true); ping("✓ Izohingiz yuborildi"); }}>
                      Yuborish
                    </PfButton>
                  </div>
                </React.Fragment>
              )}
            </PfCard>
          </div>
        </div>
      </div>

      {!active && (
        <div className="dock">
          <PfButton variant="primary" size="lg" full onClick={() => ping("✓ Buyurtma savatga qo‘shildi")}>
            🔄 Qayta buyurtma berish — {sum(total)} so‘m
          </PfButton>
        </div>
      )}
    </React.Fragment>
  );
}

/* ============ Manzillarim ============ */
function AddressesView({ addresses, onAdd, onDelete }) {
  return (
    <div className="scroll">
      <div style={{ padding: "16px 16px 24px" }}>
        {addresses.map((a) => (
          <div className="addr-card" key={a.id}>
            <div className="ac-ic"><PinIcon2 /></div>
            <div className="ac-main">
              <div className="ac-name">{a.name}{a.tag && <span className="ac-tag">{a.tag}</span>}</div>
              <div className="ac-line">{a.line}</div>
              <div className="ac-acts">
                <button className="ac-act edit"><EditIcon2 /> Tahrirlash</button>
                {a.id !== "home" && <button className="ac-act del" onClick={() => onDelete(a.id)}><TrashIcon2 /> O‘chirish</button>}
              </div>
            </div>
          </div>
        ))}
        <button className="addr-add" onClick={onAdd}>＋ Yangi manzil qo‘shish</button>
      </div>
    </div>
  );
}

/* ============ Yangi manzil — xaritadan ============ */
function AddAddressView({ onSave, onCancel }) {
  const [label, setLabel] = useState("Uy");
  const [located, setLocated] = useState(false);
  const [mahalla, setMahalla] = useState("");
  const [house, setHouse] = useState("");
  const [landmark, setLandmark] = useState("");

  const ready = mahalla && house.trim();

  return (
    <React.Fragment>
      <div className="scroll">
        <div style={{ padding: "16px 16px 150px" }}>
          {/* xarita */}
          <div className="mappick">
            <div className="road h" style={{ top: "38%" }} />
            <div className="road v" style={{ left: "30%" }} />
            <div className="road thin h" style={{ top: "70%" }} />
            <div className="road thin v" style={{ left: "62%" }} />
            <div className="block" style={{ top: "12%", left: "40%", width: "16%", height: "18%" }} />
            <div className="block" style={{ top: "48%", left: "8%", width: "16%", height: "16%" }} />
            <div className="block" style={{ top: "78%", left: "72%", width: "18%", height: "14%" }} />
            <span className="map-pin-dot" />
            <span className="map-pin">📍</span>
            <div className="map-hint">{located ? "✓ Joylashuv belgilandi" : "Pinni kerakli joyga suring"}</div>
            <button className="map-loc" aria-label="Joriy joylashuv" onClick={() => setLocated(true)}>🎯</button>
          </div>

          {/* label */}
          <div className="field">
            <label className="field-label">Manzil nomi</label>
            <div className="seg">
              {["Uy", "Ish", "Boshqa"].map((l) => (
                <button key={l} className={"seg-btn" + (label === l ? " on" : "")} onClick={() => setLabel(l)}>
                  {l === "Uy" ? "🏠" : l === "Ish" ? "💼" : "📌"} {l}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">Mahalla</label>
            <select className={"field-ctl" + (mahalla ? "" : " is-placeholder")} value={mahalla} onChange={(e) => setMahalla(e.target.value)}>
              <option value="" disabled>Mahallani tanlang</option>
              {MAHALLAS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Uy / xonadon raqami</label>
            <input className="field-ctl" inputMode="numeric" placeholder="Masalan: 14-uy, 3-xonadon" value={house} onChange={(e) => setHouse(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field-label">Mo‘ljal <span className="opt">— ixtiyoriy</span></label>
            <input className="field-ctl" placeholder="Masalan: maktab yonida, ko‘k darvoza" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="dock">
        <PfButton variant="primary" size="lg" full disabled={!ready}
          onClick={() => onSave({ name: label, mahalla, house: house.trim(), landmark: landmark.trim() })}>
          Manzilni saqlash
        </PfButton>
      </div>
    </React.Fragment>
  );
}

/* ============ Doimiy ro'yxat ============ */
function WeeklyView({ ping }) {
  const [weekly, setWeekly] = useState(() => new Set(WEEKLY_IDS));
  const items = WEEKLY_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const toggle = (id) => setWeekly((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const count = weekly.size;
  return (
    <React.Fragment>
      <div className="scroll">
        <div style={{ padding: "14px 16px 150px" }}>
          <div style={{ fontSize: 13, color: "var(--ink-600)", lineHeight: 1.5, marginBottom: 12 }}>
            Har hafta oladigan mahsulotlaringiz. Belgilab, bir bosishda savatga qo‘shing.
          </div>
          <PfCard padding={14}>
            {items.map((p) => {
              const on = weekly.has(p.id);
              return (
                <div className="weekly-item" key={p.id}>
                  <div className="weekly-thumb">{p.emoji}</div>
                  <div className="weekly-main">
                    <div className="weekly-name">{p.name}</div>
                    <div className="weekly-price">{sum(p.price)} so‘m/{p.unit}</div>
                  </div>
                  <button className={"weekly-check" + (on ? " on" : "")} aria-label={on ? "Olib tashlash" : "Qo‘shish"} onClick={() => toggle(p.id)}>
                    {on ? "✓" : ""}
                  </button>
                </div>
              );
            })}
          </PfCard>
        </div>
      </div>
      <div className="dock">
        <PfButton variant="primary" size="lg" full disabled={count === 0}
          onClick={() => ping(`✓ ${count} ta mahsulot savatga qo‘shildi`)}>
          🛒 Hammasini savatga qo‘shish ({count} ta)
        </PfButton>
      </div>
    </React.Fragment>
  );
}

/* ============ Shaxsiy ma'lumotlar ============ */
function PersonalView({ ping }) {
  const [name, setName] = useState(USER.name);
  const [phone, setPhone] = useState(USER.phone);
  return (
    <React.Fragment>
      <div className="scroll">
        <div style={{ padding: "20px 16px 150px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <PfAvatar name={name} size={76} />
          </div>
          <div className="field">
            <label className="field-label">Ism familiya</label>
            <input className="field-ctl" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Telefon raqami</label>
            <input className="field-ctl" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="dock">
        <PfButton variant="primary" size="lg" full onClick={() => ping("✓ Ma’lumotlar saqlandi")}>
          Saqlash
        </PfButton>
      </div>
    </React.Fragment>
  );
}

/* ============ ProfileApp — hub + spokes ============ */
const PF_TITLES = {
  hub: "Profil",
  orders: "Buyurtmalar tarixi",
  orderdetail: "Buyurtma tafsiloti",
  addresses: "Manzillarim",
  addaddr: "Yangi manzil",
  weekly: "Doimiy ro‘yxatim",
  personal: "Shaxsiy ma’lumotlar",
};

function ProfileScreen({ onOpenStatus, initialView = "hub", initialOrder = null }) {
  const [view, setView] = useState(initialView);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [openOrder, setOpenOrder] = useState(initialOrder);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const ping = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const openDetail = (o) => { setOpenOrder(o); setView("orderdetail"); };

  const addAddress = (d) => {
    const id = "a" + Date.now();
    const line = `${d.mahalla}, ${d.house}` + (d.landmark ? ` · ${d.landmark}` : "");
    setAddresses((a) => [...a, { id, name: d.name, line }]);
    setView("addresses");
    ping("✓ Yangi manzil qo‘shildi");
  };
  const delAddress = (id) => { setAddresses((a) => a.filter((x) => x.id !== id)); ping("Manzil o‘chirildi"); };

  const back =
    view === "addaddr" ? () => setView("addresses")
    : view === "orderdetail" ? () => setView("orders")
    : () => setView("hub");

  return (
    <div className="phone-screen">
      <CartChrome />
      {view === "hub"
        ? <SubHeader title="Profil" right={<PfBadge tone="green">🥬 Tezbozor</PfBadge>} />
        : <SubHeader title={PF_TITLES[view]} onBack={back} />}

      {view === "hub" && <HubView go={setView} addresses={addresses} onOpenStatus={onOpenStatus} />}
      {view === "orders" && <OrdersView onOpen={openDetail} ping={ping} />}
      {view === "orderdetail" && openOrder && <OrderDetailView order={openOrder} onOpenStatus={onOpenStatus} ping={ping} />}
      {view === "addresses" && <AddressesView addresses={addresses} onAdd={() => setView("addaddr")} onDelete={delAddress} />}
      {view === "addaddr" && <AddAddressView onSave={addAddress} onCancel={() => setView("addresses")} />}
      {view === "weekly" && <WeeklyView ping={ping} />}
      {view === "personal" && <PersonalView ping={ping} />}

      <div className={"toast" + (toast ? " show" : "")}>
        <span className="t-ic">●</span>{toast}
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen, ACTIVE_ORDER });
