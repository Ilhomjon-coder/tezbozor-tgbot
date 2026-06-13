/* ============ Tezbozor — umumiy komponentlar ============ */
const { useState, useEffect, useRef } = React;

const ASSET = "assets/";

function Mark({ size = 28 }) {
  return <img src={ASSET + "tezbozor-mark.svg"} width={size} height={size} alt="Tezbozor" style={{ display: "block" }} />;
}

/* ---- Badge ---- */
function Badge({ type = "today", children, style }) {
  return <span className={"badge badge-" + type} style={style}>{children}</span>;
}

/* ---- Button (showcase chrome only; DS Button is the real one in ds.jsx).
   Note: explicit props — NO object-rest — so babel does not emit a global
   `_excluded` here that would collide with the DS components' rest-spread. ---- */
function Button({ variant = "primary", size, className = "", children, style, disabled, onClick }) {
  const cls = ["btn", "btn-" + variant, size === "sm" ? "btn-sm" : "", className].filter(Boolean).join(" ");
  return <button className={cls} style={style} disabled={disabled} onClick={onClick}>{children}</button>;
}

/* ---- Narx tendensiyasi (bugun arzonladi / qimmatladi) ---- */
function TrendTag({ product }) {
  if (product.trend === "down") {
    return <span className="badge badge-down" title={"Kecha: " + sum(product.old) + " so‘m"}>↓ arzonladi</span>;
  }
  if (product.trend === "up") {
    return <span className="badge" style={{ background: "var(--danger-050)", color: "var(--danger-500)" }}>↑ ko‘tarildi</span>;
  }
  return null;
}

/* ---- Miqdor stepper (− N +) ---- */
function Stepper({ qty, onDec, onInc, unit }) {
  return (
    <div className="stepper">
      <button className="step-btn" aria-label="Kamaytirish" onClick={onDec}>−</button>
      <span className="step-val">{qty} <span className="step-unit">{unit}</span></span>
      <button className="step-btn step-add" aria-label="Ko‘paytirish" onClick={onInc}>+</button>
    </div>
  );
}

/* ============ Mahsulot kartochkasi ============
   - oddiy (2 ustun) variant
   - video variant: go'sht uchun keng, ajralib turadigan
*/
function ProductCard({ product, qty, onAdd, onInc, onDec }) {
  const p = product;
  if (p.video) {
    return (
      <div className="pcard pcard-video">
        <div className="pcard-video-thumb">
          <span className="pcard-emoji">{p.emoji}</span>
          <span className="play-pill"><span className="play-tri" />Video</span>
        </div>
        <div className="pcard-video-body">
          <div className="pcard-name">{p.name}</div>
          <Badge type="video" style={{ marginTop: 2 }}>🎥 Video orqali tanlaysiz</Badge>
          <div className="pcard-priceline" style={{ marginTop: "auto" }}>
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
  return (
    <div className="pcard">
      <div className="pcard-thumb">
        <span className="pcard-emoji">{p.emoji}</span>
        {p.trend === "down" && <span className="thumb-tag thumb-down">↓</span>}
        {p.bozor && TODAY.isBozorDay && <span className="thumb-tag thumb-bozor">🥬</span>}
        {p.fresh
          ? <span className="pcard-flag fresh">🌿 Yangi keldi</span>
          : p.stable && <span className="pcard-flag stable">🔒 Barqaror narx</span>}
      </div>
      <div className="pcard-name">{p.name}</div>
      <div className="pcard-priceline">
        <div className="price">
          <span className="price-num">{sum(p.price)}</span>
          <span className="price-unit">so‘m/{p.unit}</span>
        </div>
        {qty > 0
          ? null
          : <button className="add-btn" aria-label="Savatga qo‘shish" onClick={onAdd}>+</button>}
      </div>
      {qty > 0 && <Stepper qty={qty} unit={p.unit} onDec={onDec} onInc={onInc} />}
    </div>
  );
}

Object.assign(window, { Mark, Badge, Button, TrendTag, Stepper, ProductCard, ASSET });
