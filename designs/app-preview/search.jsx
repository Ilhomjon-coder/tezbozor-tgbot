/* ============ Tezbozor — Qidiruv (jonli qidiruv + natijalar) ============
   SearchScreen ikki holatda: "search" (fokus — so'nggi/mashhur + jonli
   takliflar) va "results" (natijalar oynasi). Bosh sahifadagi qidiruv
   inputi buni overlay sifatida ochadi; alohida ham ko'rsatiladi. */

function IcoArrowBack() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

const SRCH_RECENTS = ["Pomidor", "Mol go‘shti", "Sut", "Olma"];
const SRCH_POPULAR = ["tovuq", "tuxum", "banan", "guruch", "non", "kartoshka"];

function catNameOf(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.name : "";
}

/* nomdagi mos qismni ajratib ko'rsatish */
function Highlight({ text, q }) {
  const ql = q.trim().toLowerCase();
  if (!ql) return <>{text}</>;
  const i = text.toLowerCase().indexOf(ql);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + ql.length)}</mark>
      {text.slice(i + ql.length)}
    </>
  );
}

function SearchRow({ p, q, qty, onPick, onAdd }) {
  return (
    <div className="srch-row" role="button" onClick={() => onPick(p)}>
      <span className="srch-row-thumb">{p.emoji}</span>
      <span className="srch-row-main">
        <span className="srch-row-name"><Highlight text={p.name} q={q} /></span>
        <span className="srch-row-cat">
          {catNameOf(p.cat)}
          <span>·</span>
          <span className="srch-row-price">{sum(p.price)} so‘m/{p.unit}</span>
        </span>
      </span>
      <button
        className={"srch-row-add" + (qty > 0 ? " added" : "")}
        aria-label="Savatga qo‘shish"
        onClick={(e) => { e.stopPropagation(); onAdd(p.id); }}
      >
        {qty > 0 ? qty : "+"}
      </button>
    </div>
  );
}

function SearchScreen({ cart: cartProp, onAdd, onDec, onClose, initialQuery = "", initialView = "search", autoFocus = false, isStatic = false }) {
  const [localCart, setLocalCart] = useState({});
  const cart = cartProp || localCart;
  const add = onAdd || ((id) => setLocalCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })));

  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);
  const [view, setView] = useState(initialView);
  const [filter, setFilter] = useState("all");
  const [recents, setRecents] = useState(SRCH_RECENTS);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && view === "search" && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [autoFocus, view]);

  const q = query.trim();
  const ql = q.toLowerCase();
  const matchesQ = (p) => p.name.toLowerCase().includes(ql) || catNameOf(p.cat).toLowerCase().includes(ql);

  const suggestions = q ? PRODUCTS.filter(matchesQ).slice(0, 7) : [];

  const runSearch = (term) => {
    const t = (term != null ? term : query).trim();
    if (!t) return;
    setQuery(t);
    setSubmitted(t);
    setRecents((r) => [t, ...r.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 6));
    setView("results");
  };

  const pickProduct = (p) => runSearch(p.name);

  const back = () => {
    if (view === "results") { setView("search"); return; }
    if (onClose) { onClose(); return; }
    setQuery("");
  };

  // ----- natijalar -----
  const sl = submitted.trim().toLowerCase();
  const matchSub = (p) => p.name.toLowerCase().includes(sl) || catNameOf(p.cat).toLowerCase().includes(sl);
  let direct = PRODUCTS.filter(matchSub);
  if (filter === "down") direct = direct.filter((p) => p.trend === "down");
  else if (filter === "bozor") direct = direct.filter((p) => p.bozor);
  const matchCats = [...new Set(PRODUCTS.filter(matchSub).map((p) => p.cat))];
  const similar = filter === "all"
    ? PRODUCTS.filter((p) => matchCats.includes(p.cat) && !PRODUCTS.filter(matchSub).includes(p))
    : [];

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((a, [id, qy]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return a + (p ? p.price * qy : 0);
  }, 0);

  return (
    <div className={"srch" + (isStatic ? " is-static" : "")}>
      {/* qidiruv bar */}
      <div className="srch-bar">
        <button className="srch-back" aria-label="Orqaga" onClick={back}><IcoArrowBack /></button>
        {view === "results" ? (
          <div className="srch-field srch-fieldbtn" role="button" onClick={() => setView("search")}>
            <span className="sf-ic">🔍</span>
            <span className="sf-q">{submitted}</span>
          </div>
        ) : (
          <div className="srch-field is-focus">
            <span className="sf-ic">🔍</span>
            <input
              ref={inputRef}
              value={query}
              placeholder="Mahsulot qidirish — masalan, pomidor"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
            />
            {query && <button className="sf-clear" aria-label="Tozalash" onClick={() => { setQuery(""); if (inputRef.current) inputRef.current.focus({ preventScroll: true }); }}>×</button>}
          </div>
        )}
      </div>

      {/* ===== HOLAT 1: FOKUS — jonli qidiruv ===== */}
      {view === "search" && (
        <div className="srch-body">
          {!q && (
            <>
              {recents.length > 0 && (
                <div className="srch-block">
                  <div className="srch-block-head">
                    <span className="srch-block-label">So‘nggi qidiruvlar</span>
                    <button className="srch-clearall" onClick={() => setRecents([])}>Tozalash</button>
                  </div>
                  <div className="srch-chips">
                    {recents.map((r) => (
                      <button key={r} className="srch-chip" onClick={() => runSearch(r)}>
                        <span className="sc-ic">🕘</span>{r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="srch-block">
                <div className="srch-block-head">
                  <span className="srch-block-label">Mashhur mahsulotlar</span>
                </div>
              </div>
              <div className="srch-list">
                {SRCH_POPULAR.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean).map((p) => (
                  <SearchRow key={p.id} p={p} q="" qty={cart[p.id] || 0} onPick={pickProduct} onAdd={add} />
                ))}
              </div>
              <div className="srch-pad-bottom" />
            </>
          )}

          {q && (
            <>
              <button className="srch-action" onClick={() => runSearch()}>
                <span className="sa-ic">🔍</span>
                <span className="sa-txt"><b>“{q}”</b> bo‘yicha qidirish</span>
                <span className="sa-go">›</span>
              </button>
              {suggestions.length > 0 ? (
                <div className="srch-list">
                  {suggestions.map((p) => (
                    <SearchRow key={p.id} p={p} q={q} qty={cart[p.id] || 0} onPick={pickProduct} onAdd={add} />
                  ))}
                  <div className="srch-pad-bottom" />
                </div>
              ) : (
                <div className="srch-empty">
                  <div className="srch-empty-ill">🔍</div>
                  <div className="srch-empty-title">Taklif topilmadi</div>
                  <div className="srch-empty-sub">Boshqacha yozib ko‘ring yoki “qidirish”ni bosing.</div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ===== HOLAT 2: NATIJALAR OYNASI ===== */}
      {view === "results" && (
        <>
          <div className="srch-body">
            <div className="srch-rhead">
              <div className="srch-rhead-title">“<b>{submitted}</b>” bo‘yicha natija</div>
              <div className="srch-rhead-count">
                {PRODUCTS.filter(matchSub).length > 0
                  ? `${PRODUCTS.filter(matchSub).length} ta mahsulot topildi`
                  : "Mos mahsulot topilmadi"}
              </div>
            </div>

            {PRODUCTS.filter(matchSub).length > 0 ? (
              <>
                <div className="srch-filters">
                  {[
                    { id: "all", label: "Barchasi" },
                    { id: "down", label: "↓ Arzonlashgan" },
                    { id: "bozor", label: "🥬 Bozor kuni" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      className={"srch-filter" + (filter === f.id ? " is-on" : "")}
                      onClick={() => setFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {direct.length > 0 ? (
                  <div className="pgrid">
                    {direct.map((p) => (
                      <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={() => add(p.id)} onInc={() => add(p.id)} onDec={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="srch-empty" style={{ paddingTop: 28 }}>
                    <div className="srch-empty-ill" style={{ width: 72, height: 72, fontSize: 34 }}>🧺</div>
                    <div className="srch-empty-sub">Bu filtrga mos mahsulot yo‘q. Boshqa filtrni tanlang.</div>
                  </div>
                )}

                {similar.length > 0 && (
                  <>
                    <div className="srch-similar-label">O‘xshash mahsulotlar</div>
                    <div className="srch-similar-sub">Shu turkumdan tanlovingiz uchun</div>
                    <div className="pgrid">
                      {similar.map((p) => (
                        <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={() => add(p.id)} onInc={() => add(p.id)} onDec={() => {}} />
                      ))}
                    </div>
                  </>
                )}
                <div className="srch-pad-bottom" />
              </>
            ) : (
              <div className="srch-empty">
                <div className="srch-empty-ill">🤷</div>
                <div className="srch-empty-title">“<b>{submitted}</b>” topilmadi</div>
                <div className="srch-empty-sub">Hozircha bu mahsulot yo‘q. Quyidagilardan birini sinab ko‘ring:</div>
                <div className="srch-chips" style={{ justifyContent: "center", marginTop: 4 }}>
                  {["Pomidor", "Tovuq", "Sut", "Olma"].map((r) => (
                    <button key={r} className="srch-chip" onClick={() => runSearch(r)}>{r}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* yopishqoq savat tugmasi */}
          <div className="mainbtn-wrap">
            <button className={"mainbtn" + (count === 0 ? " is-empty" : "")} disabled={count === 0}>
              <span className="mb-count">{count}</span>
              <span className="mb-label">{count === 0 ? "Savat bo‘sh" : "Savatni ko‘rish"}</span>
              {count > 0 && <span className="mb-sum">{sum(total)} so‘m</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { SearchScreen });
