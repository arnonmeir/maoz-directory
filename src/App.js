import { useState, useMemo } from "react";
import MEMBERS from "./members";

const DOMAINS = ["תעסוקה ועמיתים", "ענבר", "חינוך", "מקום", "מיתר"];
const REGIONS = ["מרכז", "ירושלים", "דרום", "צפון"];

// צבעי מותג מעוז
const BRAND = { primary: "#222241", accent: "#aac5db", light: "#e6e7e8", blue: "#6699ff" };

// צבעי מיזמים
const DOMAIN_COLOR = {
  "תעסוקה ועמיתים": "#2CAA59",
  "ענבר":            "#60BCBB",
  "חינוך":           "#8A77AA",
  "מקום":            "#366FA7",
  "מיתר":            "#5830AF",
};
const DOMAIN_ICON = {
  "תעסוקה ועמיתים": "💼",
  "ענבר":            "🌿",
  "חינוך":           "🎓",
  "מקום":            "🏘️",
  "מיתר":            "🎵",
};
const REGION_ICON = { "דרום": "🌵", "מרכז": "🏙️", "צפון": "🌿", "ירושלים": "✦" };
const AVATAR_BG = ["#DBEAFE","#D1FAE5","#FEE2E2","#EDE9FE","#FEF3C7","#CFFAFE","#FCE7F3","#E0E7FF"];
const AVATAR_FG = ["#1D4ED8","#065F46","#991B1B","#5B21B6","#92400E","#0E7490","#9D174D","#3730A3"];

function hashIdx(str, len) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % len;
  return h;
}

function toWALink(phone) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/972${digits.slice(1)}`;
}

function Avatar({ name, size = 46, photo }) {
  const i = hashIdx(name, AVATAR_BG.length);
  const letters = name.split(" ").map(p => p[0]).join("").slice(0, 2);
  if (photo) return (
    <img src={photo} alt={name} style={{
      width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0,
      border: "2px solid #E5E7EB"
    }} onError={e => { e.target.style.display = "none"; }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: AVATAR_BG[i], color: AVATAR_FG[i],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.36, fontFamily: "almoni, 'Heebo', sans-serif"
    }}>{letters}</div>
  );
}

function ProfileModal({ m, onClose }) {
  const color = DOMAIN_COLOR[m.domain] || "#374151";
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "#00000066", zIndex: 200,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "bgFade 0.2s ease"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto",
        paddingBottom: 32, animation: "sheetUp 0.28s cubic-bezier(0.32,0.72,0,1)"
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, background: "#E5E7EB", borderRadius: 2 }} />
        </div>
        <div style={{ height: 5, background: color, margin: "12px 20px 0", borderRadius: 4 }} />
        <div style={{ padding: "20px 20px 0", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Avatar name={m.name} size={58} photo={m.photo} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#111827" }}>{m.name}</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{m.role}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color, marginTop: 2 }}>{m.org}</div>
          </div>
          <button onClick={onClose} style={{
            background: "#F3F4F6", border: "none", borderRadius: "50%",
            width: 32, height: 32, cursor: "pointer", fontSize: 15, color: "#9CA3AF",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>✕</button>
        </div>

        {m.about && (
          <div style={{ margin: "16px 20px 0", background: "#F9FAFB", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1.2, marginBottom: 6 }}>אודות</div>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{m.about}</div>
          </div>
        )}

        {m.offer && (
          <div style={{ margin: "12px 20px 0", background: `${color}0D`, borderRadius: 12, padding: "14px 16px", border: `1px solid ${color}22` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 1.2, marginBottom: 6 }}>מציע/ה לרשת</div>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{m.offer}</div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "12px 20px 0" }}>
          {[
            { label: "תחום", value: `${DOMAIN_ICON[m.domain] || "◈"} ${m.domain}` },
            { label: "אזור", value: `${REGION_ICON[m.region] || ""} ${m.region}` },
          ].map(item => (
            <div key={item.label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {m.skills && (
          <div style={{ margin: "10px 20px 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {m.skills.split(";").map(s => s.trim()).filter(Boolean).map(s => (
              <span key={s} style={{
                background: `${color}14`, color, borderRadius: 20,
                padding: "4px 12px", fontSize: 12, fontWeight: 600
              }}>{s}</span>
            ))}
          </div>
        )}

        {/* כפתורי יצירת קשר */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "20px 20px 0" }}>
          <a href={`tel:${m.phone}`} style={{
            background: BRAND.primary, color: "#fff", borderRadius: 12,
            padding: "13px 6px", textAlign: "center", fontWeight: 700,
            fontSize: 13, display: "block", textDecoration: "none", fontFamily: "almoni, 'Heebo', sans-serif"
          }}>📞 חייג</a>
          <a href={toWALink(m.phone)} target="_blank" rel="noreferrer" style={{
            background: "#25D366", color: "#fff", borderRadius: 12,
            padding: "13px 6px", textAlign: "center", fontWeight: 700,
            fontSize: 13, display: "block", textDecoration: "none", fontFamily: "almoni, 'Heebo', sans-serif"
          }}>💬 וואטסאפ</a>
          <a href={`mailto:${m.email}`} style={{
            background: "#F3F4F6", color: "#374151", borderRadius: 12,
            padding: "13px 6px", textAlign: "center", fontWeight: 700,
            fontSize: 13, display: "block", textDecoration: "none", fontFamily: "almoni, 'Heebo', sans-serif"
          }}>✉️ מייל</a>
        </div>
        <div style={{ marginTop: 6, textAlign: "center" }}>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{m.cohort} · חבר מ-{m.year}</span>
        </div>
      </div>
    </div>
  );
}

function MemberRow({ m, onClick }) {
  const color = DOMAIN_COLOR[m.domain] || "#374151";
  return (
    <div onClick={() => onClick(m)} style={{
      background: "#fff", borderRadius: 14, padding: "14px 16px",
      display: "flex", gap: 13, alignItems: "center",
      boxShadow: "0 1px 3px #0000000A", cursor: "pointer",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px #00000014"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 3px #0000000A"; }}
    >
      <Avatar name={m.name} size={46} photo={m.photo} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{m.name}</div>
          <span style={{ fontSize: 13, flexShrink: 0, marginRight: 6 }}>{REGION_ICON[m.region]}</span>
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {m.role} · {m.org}
        </div>
        <div style={{ marginTop: 7, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ background: `${color}14`, color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>
            {m.domain}
          </span>
        </div>
      </div>
      <div style={{ color: "#D1D5DB", fontSize: 20 }}>›</div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("browse");
  const [query, setQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState(null);
  const [filterDomain, setFilterDomain] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => MEMBERS.filter(m => {
    const q = query.trim().toLowerCase();
    const mQ = !q || m.name.includes(q) || m.org.includes(q) || m.role.includes(q) ||
      (m.skills && m.skills.includes(q)) || (m.offer && m.offer.includes(q));
    const mR = !filterRegion || m.region === filterRegion;
    const mD = !filterDomain || m.domain === filterDomain;
    return mQ && mR && mD;
  }), [query, filterRegion, filterDomain]);

  const hasFilters = filterRegion || filterDomain || query.trim();
  const domainCounts = useMemo(() => {
    const c = {};
    MEMBERS.forEach(m => { c[m.domain] = (c[m.domain] || 0) + 1; });
    return c;
  }, []);

  const css = `
    /* להחליף עם קבצי הפונט האמיתיים לאחר קבלתם */
    @font-face {
      font-family: 'almoni';
      src: url('/fonts/almoni-ml-v5-aaa.woff2') format('woff2'),
           url('/fonts/almoni-ml-v5-aaa.woff') format('woff');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'almoni';
      src: url('/fonts/almoni-ml-v5-aaa-bold.woff2') format('woff2'),
           url('/fonts/almoni-ml-v5-aaa-bold.woff') format('woff');
      font-weight: 700;
      font-style: normal;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #F3F4F6; font-family: almoni, 'Heebo', sans-serif; -webkit-tap-highlight-color: transparent; }
    input:focus { outline: none; box-shadow: 0 0 0 3px #22224120; }
    input::placeholder { color: #9CA3AF; }
    @keyframes bgFade { from { opacity: 0 } to { opacity: 1 } }
    @keyframes sheetUp { from { transform: translateY(60px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    ::-webkit-scrollbar { width: 0; }
    a { -webkit-tap-highlight-color: transparent; }
  `;

  const TABS = [
    { key: "browse", label: "חיפוש", icon: "🔍" },
    { key: "domains", label: "מיזמים", icon: "◉" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "almoni, 'Heebo', sans-serif", direction: "rtl" }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{
            background: BRAND.primary, padding: "10px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <img src="/logo.svg" alt="מעוז" style={{ height: 26, filter: "brightness(0) invert(1)" }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1 }}>ספר הרשת</div>
              <div style={{ fontSize: 10, color: BRAND.accent, marginTop: 2 }}>1,200 חברי רשת</div>
            </div>
          </div>
          <div style={{ display: "flex", padding: "0 20px" }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                padding: "10px 0", fontSize: 13,
                fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? BRAND.primary : "#9CA3AF",
                fontFamily: "almoni, 'Heebo', sans-serif",
                borderBottom: `2px solid ${tab === t.key ? BRAND.primary : "transparent"}`,
                display: "flex", gap: 5, alignItems: "center", justifyContent: "center",
              }}><span>{t.icon}</span>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 100px" }}>

        {tab === "browse" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="חיפוש לפי שם, ארגון, תפקיד, מיומנות..."
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12,
                  fontSize: 14, color: "#111827", fontFamily: "almoni, 'Heebo', sans-serif", direction: "rtl",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {REGIONS.map(r => {
                const active = filterRegion === r;
                return (
                  <button key={r} onClick={() => setFilterRegion(active ? null : r)} style={{
                    background: active ? BRAND.primary : "#fff",
                    color: active ? "#fff" : "#6B7280",
                    border: `1.5px solid ${active ? BRAND.primary : "#E5E7EB"}`,
                    padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "almoni, 'Heebo', sans-serif",
                  }}>{REGION_ICON[r]} {r}</button>
                );
              })}
              {filterDomain && (
                <button onClick={() => setFilterDomain(null)} style={{
                  background: `${DOMAIN_COLOR[filterDomain]}14`,
                  color: DOMAIN_COLOR[filterDomain],
                  border: `1.5px solid ${DOMAIN_COLOR[filterDomain]}44`,
                  padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "almoni, 'Heebo', sans-serif",
                }}>{filterDomain} ✕</button>
              )}
              {hasFilters && (
                <button onClick={() => { setQuery(""); setFilterRegion(null); setFilterDomain(null); }} style={{
                  background: "none", color: "#9CA3AF", border: "1.5px solid #E5E7EB",
                  padding: "5px 13px", borderRadius: 20, fontSize: 12,
                  cursor: "pointer", fontFamily: "almoni, 'Heebo', sans-serif",
                }}>נקה</button>
              )}
            </div>

            <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginBottom: 10 }}>
              מציג {filtered.length} חברים {hasFilters ? "מסוננים" : ""}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(m => <MemberRow key={m.id} m={m} onClick={setSelected} />)}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#D1D5DB" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#9CA3AF" }}>לא נמצאו תוצאות</div>
                </div>
              )}
            </div>
          </>
        )}

        {tab === "domains" && (
          <>
            <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginBottom: 12 }}>בחר מיזם לסינון</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {DOMAINS.map(d => {
                const color = DOMAIN_COLOR[d] || "#374151";
                const count = domainCounts[d] || 0;
                return (
                  <div key={d} onClick={() => { setFilterDomain(d); setTab("browse"); }} style={{
                    background: "#fff", borderRadius: 14, padding: "18px 16px",
                    cursor: "pointer", boxShadow: "0 1px 3px #0000000A",
                    transition: "transform 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = ""}
                  >
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{DOMAIN_ICON[d]}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>{d}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{count} חברים</div>
                    <div style={{ marginTop: 10, height: 3, background: "#F3F4F6", borderRadius: 4 }}>
                      <div style={{
                        height: "100%", borderRadius: 4, background: color,
                        width: `${Math.round((count / MEMBERS.length) * 100)}%`
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff", borderTop: "1px solid #E5E7EB",
        padding: "8px 0 20px", display: "flex", justifyContent: "center",
      }}>
        <div style={{ maxWidth: 480, width: "100%", display: "flex" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "6px 0", fontFamily: "almoni, 'Heebo', sans-serif",
            }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: tab === t.key ? BRAND.primary : "#9CA3AF" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {selected && <ProfileModal m={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
