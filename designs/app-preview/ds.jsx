/* ============ Tezbozor Design System — core components ============
   Vendored from the bound DS (bundle ships empty), API-faithful so the
   cart screen composes with real DS components, not re-skinned HTML.
   Wrapped in an IIFE so babel's per-file helper consts (e.g. _excluded
   for rest-spread) stay scoped and don't collide with other babel files. */
(function () {

function Button({
  children, variant = "primary", size = "md", full = false,
  disabled = false, iconLeft = null, iconRight = null, onClick, type = "button", ...rest
}) {
  const sizes = {
    sm: { height: 40, padding: "0 18px", font: "var(--text-sm)" },
    md: { height: 48, padding: "0 24px", font: "var(--text-base)" },
    lg: { height: 56, padding: "0 32px", font: "var(--text-lg)" },
  };
  const variants = {
    primary:   { background: "var(--action-primary)",   color: "var(--text-on-orange)", boxShadow: "var(--shadow-orange)", border: "none" },
    secondary: { background: "var(--action-secondary)", color: "var(--text-on-green)",  boxShadow: "var(--shadow-green)",  border: "none" },
    outline:   { background: "transparent", color: "var(--green-700)", boxShadow: "none", border: "1.5px solid var(--green-500)" },
    ghost:     { background: "transparent", color: "var(--green-700)", boxShadow: "none", border: "1.5px solid transparent" },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  return (
    <button
      type={type} disabled={disabled} onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: "var(--space-2)", height: s.height, minWidth: s.height, padding: s.padding,
        fontFamily: "var(--body-font)", fontSize: s.font, fontWeight: "var(--weight-semibold)",
        lineHeight: 1, borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
        width: full ? "100%" : "auto",
        transition: "transform .08s ease, filter .15s ease, background .15s ease",
        WebkitTapHighlightColor: "transparent", ...v,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "none"; }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = "brightness(0.95)"; }}
      {...rest}
    >
      {iconLeft}{children}{iconRight}
    </button>
  );
}

function Card({ children, tint = "none", padding = 16, elevation = "sm", style = {}, ...rest }) {
  const tints = {
    none:   { background: "var(--surface-card)", border: "1px solid var(--border-default)" },
    green:  { background: "var(--green-050)", border: "1px solid transparent" },
    orange: { background: "var(--orange-050)", border: "1px solid transparent" },
  };
  const shadows = { none: "none", sm: "var(--shadow-sm)", md: "var(--shadow-md)" };
  return (
    <div style={{ borderRadius: "var(--radius-lg)", padding, boxShadow: shadows[elevation], ...tints[tint], ...style }} {...rest}>
      {children}
    </div>
  );
}

function Badge({ children, tone = "neutral", solid = false, size = "md", ...rest }) {
  const palette = {
    neutral: { soft: ["var(--ink-100)", "var(--ink-600)"], solid: ["var(--ink-600)", "#fff"] },
    green:   { soft: ["var(--green-050)", "var(--green-700)"], solid: ["var(--green-500)", "#fff"] },
    orange:  { soft: ["var(--orange-050)", "var(--orange-600)"], solid: ["var(--orange-500)", "#fff"] },
    danger:  { soft: ["var(--danger-050)", "var(--danger-500)"], solid: ["var(--danger-500)", "#fff"] },
  };
  const p = palette[tone] || palette.neutral;
  const [bg, fg] = solid ? p.solid : p.soft;
  const dims = size === "sm" ? { fontSize: "11px", padding: "3px 8px" } : { fontSize: "12px", padding: "5px 11px" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, background: bg, color: fg,
      fontFamily: "var(--body-font)", fontWeight: "var(--weight-semibold)",
      borderRadius: "var(--radius-pill)", lineHeight: 1, whiteSpace: "nowrap",
      ...dims, ...rest.style,
    }} {...rest}>
      {children}
    </span>
  );
}

function IconButton({ children, variant = "subtle", size = 44, disabled = false, ariaLabel, onClick, ...rest }) {
  const variants = {
    subtle: { background: "var(--card)", color: "var(--ink-900)", border: "1px solid var(--border-default)" },
    green:  { background: "var(--green-500)", color: "#fff", border: "none" },
    orange: { background: "var(--orange-500)", color: "#fff", border: "none" },
    plain:  { background: "transparent", color: "var(--ink-600)", border: "none" },
  };
  const v = variants[variant] || variants.subtle;
  return (
    <button
      type="button" aria-label={ariaLabel} disabled={disabled} onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
        transition: "transform .08s ease, filter .15s ease",
        WebkitTapHighlightColor: "transparent", ...v,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.92)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {children}
    </button>
  );
}

function Avatar({ src = null, name = "", size = 44, shape = "rounded", ...rest }) {
  const initials = name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const radius = shape === "circle" ? "50%" : "var(--radius-md)";
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: src ? "var(--ink-100)" : "var(--green-500)", color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-heading)", fontWeight: "var(--weight-bold)",
      fontSize: Math.round(size * 0.4), overflow: "hidden", flexShrink: 0, ...rest.style,
    }} {...rest}>
      {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (initials || "🛒")}
    </div>
  );
}

window.TezbozorDesignSystem_77795a = Object.assign(window.TezbozorDesignSystem_77795a || {}, {
  Button, Card, Badge, IconButton, Avatar,
});

})();
