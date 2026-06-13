/* ============ Tezbozor — Savat ekrani ============ */
const { Button: DsButton, Card: DsCard, Badge: DsBadge, IconButton: DsIconButton, Avatar: DsAvatar } = window.TezbozorDesignSystem_77795a;

const BVARIANTS = [
  { id: "swap", icon: "🔄", label: "O‘xshashi bilan" },
  { id: "skip", icon: "⏭️", label: "O‘tkazib yuboring" },
  { id: "call", icon: "📞", label: "Qo‘ng‘iroq qiling" },
];

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7m4 4v6m4-6v6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* bitta savat qatori + B-variant tanlovi */
function CartRow({ item, qty, bvar, onInc, onDec, onBvar }) {
  const p = item;
  const lineTotal = p.price * qty;
  return (
    <DsCard padding={14} style={{ marginBottom: 12 }}>
      <div className="crow">
        <div className="crow-thumb">
          {p.emoji}
          {p.video && <span className="thumb-tag thumb-bozor" style={{ top: 4, right: 4, left: "auto", width: 22, height: 22, fontSize: 11 }}>🎥</span>}
        </div>
        <div className="crow-main">
          <div className="crow-name">{p.name}</div>
          <div className="crow-unitprice">{sum(p.price)} so‘m/{p.unit} · bugungi narx</div>
          <div className="crow-foot">
            <div className="cstepper">
              <button className="step-btn" aria-label="Kamaytirish" onClick={onDec}>−</button>
              <span className="step-val">{qty} <span className="step-unit">{p.unit}</span></span>
              <button className="step-btn step-add" aria-label="Ko‘paytirish" onClick={onInc}>+</button>
            </div>
            <div className="crow-linetotal">{sum(lineTotal)} so‘m</div>
          </div>
        </div>
      </div>

      {/* B variant protokoli */}
      <div className="bvar">
        <div className="bvar-q">
          <span>🛒</span> Topilmasa nima qilamiz?
        </div>
        <div className="bvar-chips">
          {BVARIANTS.map((b) => {
            const on = bvar === b.id;
            return (
              <button key={b.id} className={"bchip" + (on ? " is-on" : "")} onClick={() => onBvar(b.id)}>
                <span className="bchip-ic">{b.icon}</span>
                {b.label}
                {on && <span className="bchip-check">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </DsCard>
  );
}

/* ---- bo'sh savat ---- */
function EmptyCart({ onBrowse }) {
  return (
    <div className="phone-screen">
      <CartChrome />
      <div className="subbar">
        <DsIconButton variant="subtle" ariaLabel="Orqaga" onClick={onBrowse}><BackIcon /></DsIconButton>
        <div>
          <div className="subbar-title">Savat</div>
          <div className="subbar-sub">Hozircha bo‘sh</div>
        </div>
      </div>
      <div className="empty">
        <div className="empty-ill">🧺</div>
        <div className="empty-title">Savatingiz bo‘sh</div>
        <div className="empty-sub">Bugungi narxlardan tanlang — ertaga 10:00–13:00 da eshigingizda bo‘ladi 🛒</div>
        <div style={{ marginTop: 6 }}>
          <DsButton variant="secondary" size="lg" onClick={onBrowse}>Xaridni boshlash</DsButton>
        </div>
      </div>
    </div>
  );
}

function CartChrome() {
  return (
    <React.Fragment>
      <div className="tg-statusrow">
        <span>9:41</span>
        <span className="dots">📶 &nbsp;🔋</span>
      </div>
    </React.Fragment>
  );
}

/* ---- to'liq savat ---- */
const DEFAULT_CART = [
  { id: "pomidor", qty: 2, bvar: "swap" },
  { id: "kartoshka", qty: 2, bvar: "swap" },
  { id: "olma", qty: 1, bvar: "skip" },
  { id: "tuxum", qty: 1, bvar: "swap" },
  { id: "non", qty: 1, bvar: "call" },
];

function CartScreen({ initial = DEFAULT_CART, onBrowse }) {
  const [rows, setRows] = useState(initial);

  const setQty = (id, d) => setRows((rs) =>
    rs.map((r) => r.id === id ? { ...r, qty: r.qty + d } : r).filter((r) => r.qty > 0)
  );
  const setBvar = (id, v) => setRows((rs) => rs.map((r) => r.id === id ? { ...r, bvar: v } : r));

  const items = rows.map((r) => ({ ...r, p: PRODUCTS.find((x) => x.id === r.id) })).filter((r) => r.p);
  const goods = items.reduce((a, r) => a + r.p.price * r.qty, 0);
  const count = items.reduce((a, r) => a + r.qty, 0);
  const saved = items.reduce((a, r) => a + (r.p.old && r.p.old > r.p.price ? (r.p.old - r.p.price) * r.qty : 0), 0);

  if (items.length === 0) return <EmptyCart onBrowse={onBrowse} />;

  const reachedMin = goods >= MIN_ORDER;
  const free = goods >= FREE_DELIVERY_FROM;
  const delivery = free ? 0 : DELIVERY_FEE;
  const total = goods + (reachedMin ? delivery : 0);
  const toFree = Math.max(0, FREE_DELIVERY_FROM - goods);
  const pct = Math.min(100, Math.round((goods / FREE_DELIVERY_FROM) * 100));

  return (
    <div className="phone-screen">
      <CartChrome />
      <div className="subbar">
        <DsIconButton variant="subtle" ariaLabel="Orqaga" onClick={onBrowse}><BackIcon /></DsIconButton>
        <div style={{ flex: 1 }}>
          <div className="subbar-title">Savat</div>
          <div className="subbar-sub">{count} ta mahsulot · {TODAY.label}</div>
        </div>
        <DsBadge tone="green">🥬 Bozor kuni</DsBadge>
      </div>

      <div className="scroll">
        <div style={{ padding: "14px 16px 170px" }}>
          {/* Hammasini tozalash */}
          <div className="clear-row">
            <span className="clear-count">{count} ta mahsulot savatda</span>
            <button className="clear-btn" onClick={() => setRows([])}>
              <TrashIcon /> Tozalash
            </button>
          </div>

          {/* Mahsulotlar */}
          {items.map((r) => (
            <CartRow
              key={r.id}
              item={r.p}
              qty={r.qty}
              bvar={r.bvar}
              onInc={() => setQty(r.id, 1)}
              onDec={() => setQty(r.id, -1)}
              onBvar={(v) => setBvar(r.id, v)}
            />
          ))}

          {/* Hisob-kitob */}
          <DsCard padding={16} style={{ marginTop: 2, marginBottom: 8 }}>
            <div className="sumcard-head"><span className="sc-ic">🧾</span> Hisob-kitob</div>
            <div className="sumrow">
              <span className="k">Mahsulotlar ({count} ta)</span>
              <span className="v">{sum(goods)} so‘m</span>
            </div>
            <div className={"sumrow" + (free && reachedMin ? " free" : "")}>
              <span className="k">Yetkazish</span>
              <span className="v">
                {!reachedMin
                  ? "—"
                  : free
                    ? <span><span className="was">{sum(DELIVERY_FEE)}</span>Bepul ✓</span>
                    : sum(DELIVERY_FEE) + " so‘m"}
              </span>
            </div>

            {saved > 0 && (
              <div className="sum-save">
                <span>🥬 Bozor kuni — bugun tejadingiz</span>
                <span className="sv">−{sum(saved)} so‘m</span>
              </div>
            )}

            <div className="sum-total">
              <span className="k">Jami to‘lov</span>
              <span className="v">{sum(reachedMin ? total : goods)}<small>so‘m</small></span>
            </div>
          </DsCard>
        </div>
      </div>

      {/* Bottom dock — progress + checkout */}
      <div className="dock">
        {!reachedMin ? (
          <div className="locknote">
            <span className="ln-ic">ℹ️</span>
            <span className="ln-txt">
              Minimal buyurtma — <b>50 000 so‘m</b>. Yana <b>{sum(MIN_ORDER - goods)} so‘m</b> qo‘shsangiz,
              buyurtmani rasmiylashtira olasiz.
            </span>
          </div>
        ) : free ? (
          <div className="free-chip">🎉 Bepul yetkazish — ertaga 10:00–13:00 da</div>
        ) : (
          <div className="freebar-mini">
            <div className="fbm-row">
              <span className="fbm-label">
                <span className="truck">🚚</span>
                Yana <b>{sum(toFree)} so‘m</b> — bepul yetkazish
              </span>
            </div>
            <div className="fbm-track">
              <div className="fbm-fill" style={{ width: pct + "%" }} />
            </div>
          </div>
        )}
        <DsButton variant="primary" size="lg" full disabled={!reachedMin}>
          {reachedMin
            ? `Rasmiylashtirish — ${sum(total)} so‘m`
            : "Minimal summa to‘lmadi"}
        </DsButton>
      </div>
    </div>
  );
}

Object.assign(window, { CartScreen, EmptyCart, DEFAULT_CART });
