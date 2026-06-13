/* ============ Tezbozor — Bosh sahifa (Telegram Mini App) ============ */

// vaqtni 21:00 gacha hisoblash
function useDeadline() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const end = new Date(now);
  end.setHours(21, 0, 0, 0);
  let diff = Math.max(0, end - now);
  const open = diff > 0;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { open, h, m };
}

const FEED_IDS = ["pomidor","kartoshka","olma","bodring","kokat","tovuq","uzum","sut","tuxum","guruch","non","un"];

/* D) Kunning mahsuloti — ajratilgan kartochka */
function FeaturedCard({ qty, onAdd, onInc, onDec }) {
  const p = PRODUCTS.find((x) => x.id === FEATURED.id);
  if (!p) return null;
  return (
    <div className="featured">
      <span className="featured-ribbon">⭐ Kunning mahsuloti</span>
      <div className="featured-thumb">{p.emoji}</div>
      <div className="featured-body">
        <div className="featured-name">{p.name}</div>
        <div className="featured-note">{FEATURED.note}</div>
        <div className="featured-priceline">
          <div className="price">
            <span className="price-num">{sum(p.price)}</span>
            <span className="price-unit">so‘m/{p.unit}</span>
          </div>
          {qty > 0
            ? <Stepper qty={qty} unit={p.unit} onDec={onDec} onInc={onInc} />
            : <button className="add-btn" aria-label="Savatga qo‘shish" onClick={onAdd}>+</button>}
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ todayIdx = 3, dateLabel = "7-iyun, chorshanba", onOpenProfile }) {
  const [cart, setCart] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { open, h, m } = useDeadline();

  const info = deliveryInfo(todayIdx);
  const dToBozor = daysToBozor(todayIdx);
  const isBozorToday = BOZOR_WEEKDAYS.includes(todayIdx);
  const showFeatured = info.kind !== "eve";

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart((c) => {
    const n = (c[id] || 0) - 1;
    const next = { ...c };
    if (n <= 0) delete next[id]; else next[id] = n;
    return next;
  });

  const list = activeCat
    ? PRODUCTS.filter((p) => p.cat === activeCat)
    : FEED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((a, [id, q]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return a + (p ? p.price * q : 0);
  }, 0);
  const reachedMin = total >= MIN_ORDER;
  const toFree = FREE_DELIVERY_FROM - total;

  return (
    <div className="phone-screen">
      {/* Telegram chrome */}
      <div className="tg-statusrow">
        <span>9:41</span>
        <span className="dots">📶 &nbsp;🔋</span>
      </div>
      <div className="tg-bar">
        <div className="tg-app-ava"><Mark size={24} /></div>
        <div>
          <div className="tg-app-name">Tezbozor</div>
          <div className="tg-app-sub">Kattaqo‘rg‘on · mini bozor</div>
        </div>
        <button className="tg-profile" aria-label="Profil" onClick={onOpenProfile}>DK</button>
      </div>

      <div className="scroll">
        {/* 1. Salomlashish + sana */}
        <div className="greet">
          <div className="greet-hi">Assalomu alaykum! 👋</div>
          <div className="greet-date">
            <span>📅 {dateLabel}</span>
            {isBozorToday && <Badge type="bozor">🥬 Bugun bozor kuni</Badge>}
          </div>
        </div>

        {/* A) Ertaga bozor kuni teaser */}
        {info.kind === "eve" && (
          <div className="teaser">
            <div className="teaser-ic">🥬</div>
            <div className="teaser-txt">
              <div className="teaser-title">Ertaga — bozor kuni!</div>
              <div className="teaser-sub">Bugun buyurtma bering, arzon olasiz 🛒</div>
            </div>
          </div>
        )}

        {/* C) Kun mavzusi banner */}
        {info.kind === "theme" && info.theme && (
          <div className="theme-banner">
            <div className="theme-ic">{info.theme.emoji}</div>
            <div className="theme-txt">
              <div className="theme-title">{info.theme.title}</div>
              <div className="theme-sub">{info.theme.text}</div>
            </div>
          </div>
        )}

        {/* 2. Deadline banner */}
        <div className="deadline">
          <div className="deadline-ic">🛒</div>
          <div className="deadline-txt">
            <div className="deadline-title">Bugun 21:00 gacha buyurtma bering</div>
            <div className="deadline-sub">Ertaga o‘zingiz tanlagan vaqtda yetkazamiz 🚪</div>
            {open
              ? <div className="deadline-time"><span className="lbl">qoldi</span> {h} soat {m} daqiqa</div>
              : <div className="deadline-time"><span className="lbl">bugungi qabul yopildi</span></div>}
          </div>
        </div>

        {/* G) Bozor narxigacha countdown — kichik yordamchi */}
        {!isBozorToday && dToBozor != null && (
          <div className="countdown">
            <span className="cd-dot">🥬</span>
            Bozor narxigacha <b>{dToBozor} kun</b> qoldi
          </div>
        )}

        {/* 3. Qidiruv */}
        <div className="search" role="button" onClick={() => setSearchOpen(true)}>
          <span className="s-ic">🔍</span>
          <input placeholder="Mahsulot qidirish — masalan, pomidor" readOnly style={{ pointerEvents: "none", cursor: "pointer" }} />
        </div>

        {/* 4. Kategoriyalar */}
        <div className="cats">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className={"cat" + (activeCat === c.id ? " is-active" : "")}
              onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
            >
              <div className={"cat-emoji" + (c.video ? " cat-vid" : "")}>
                {c.emoji}
                {c.video && <span className="cat-vid-dot">🎥</span>}
              </div>
              <div className="cat-name">{c.name}</div>
            </div>
          ))}
        </div>

        {/* D) Kunning mahsuloti — Bugungi narxlar tepasida */}
        {showFeatured && !activeCat && (
          <FeaturedCard
            qty={cart[FEATURED.id] || 0}
            onAdd={() => add(FEATURED.id)}
            onInc={() => add(FEATURED.id)}
            onDec={() => dec(FEATURED.id)}
          />
        )}

        {/* 5. Bugungi narxlar */}
        <div className="sec-head">
          <div className="sec-title">{activeCat ? CATEGORIES.find((c) => c.id === activeCat).name : "Bugungi narxlar"}</div>
          {activeCat && <div className="sec-note" onClick={() => setActiveCat(null)} style={{ cursor: "pointer", color: "var(--green-700)" }}>← Hammasi</div>}
        </div>
        <div className="today-strip">
          <span className="pulse" />
          Narxlar bugun ertalab yangilandi · har kuni o‘zgaradi
        </div>

        <div className="pgrid">
          {list.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={cart[p.id] || 0}
              onAdd={() => add(p.id)}
              onInc={() => add(p.id)}
              onDec={() => dec(p.id)}
            />
          ))}
        </div>
      </div>

      {/* 6. Yopishqoq savat tugmasi */}
      <div className="mainbtn-wrap">
        {count > 0 && (
          <div className={"minhint" + (reachedMin ? "" : " warn")}>
            {reachedMin
              ? (toFree > 0
                  ? <span>Yetkazish 6 000 so‘m · yana <b>{sum(toFree)} so‘m</b> — bepul bo‘ladi</span>
                  : <span><b>Bepul yetkazish!</b> 🎉 100 000 so‘mdan oshdi</span>)
              : <span>Minimal buyurtma 50 000 so‘m · yana <b>{sum(MIN_ORDER - total)} so‘m</b></span>}
          </div>
        )}
        <button className={"mainbtn" + (count === 0 ? " is-empty" : "")} disabled={count === 0}>
          <span className="mb-count">{count}</span>
          <span className="mb-label">{count === 0 ? "Savat bo‘sh" : "Savatni ko‘rish"}</span>
          {count > 0 && <span className="mb-sum">{sum(total)} so‘m</span>}
        </button>
      </div>

      {/* Qidiruv overlay — input bosilganda ochiladi */}
      {searchOpen && (
        <SearchScreen
          cart={cart}
          onAdd={add}
          onDec={dec}
          onClose={() => setSearchOpen(false)}
          autoFocus
        />
      )}
    </div>
  );
}

Object.assign(window, { HomeScreen, FeaturedCard });
