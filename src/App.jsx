import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ONE_TIME_EVENT = {
  name: "Burial B2B Four Tet",
  venue: "Fabric, London",
  date: "Sat, Jun 21 · 11:00 PM",
  capacity: 400,
  ticketPrice: 35,
  depositAmount: 15,
  genre: "Dubstep / Ambient",
  description: "A rare b2b set from two of electronic music's most elusive figures. Strictly limited capacity. No phones. No encore.",
  rewards: [
    { threshold: 0.6, label: "60% backed", reward: "Free drink token on entry" },
    { threshold: 0.8, label: "80% backed", reward: "Early entry + soundcheck access" },
    { threshold: 1.0, label: "Sold out", reward: "$15 credit + name on the flyer" },
  ],
};

const RECURRING_SERIES = {
  name: "Parallax",
  curator: "Aether Collective",
  monthlyPrice: 18,
  description: "A monthly underground techno residency. Rotating international guests. Undisclosed locations announced 48 hours before doors. No photos, no socials — just the music.",
  genre: "Techno / Industrial",
  dayOfWeek: "Third Saturday",
  upcomingEvents: [
    { date: "Jun 21", venue: "Warehouse District, Unit 4", attendance: 312 },
    { date: "Jul 19", venue: "Location TBA", attendance: 0 },
    { date: "Aug 16", venue: "Location TBA", attendance: 0 },
  ],
  communityPerk: "Vote on lineups. First access to special editions. Members-only drops.",
};

const INITIAL_BACKERS = 47;
const INITIAL_SUBSCRIBERS = 312;

const sparkData = [
  { t: "3w", b: 4 },
  { t: "2w", b: 11 },
  { t: "10d", b: 18 },
  { t: "7d", b: 24 },
  { t: "5d", b: 31 },
  { t: "3d", b: 38 },
  { t: "2d", b: 43 },
  { t: "1d", b: 47 },
];

const subGrowthData = [
  { t: "M1", s: 120 },
  { t: "M2", s: 168 },
  { t: "M3", s: 210 },
  { t: "M4", s: 261 },
  { t: "M5", s: 295 },
  { t: "M6", s: 312 },
];

export default function App() {
  const [mode, setMode] = useState("oneTime");
  const [view, setView] = useState("fan");
  const [backers, setBackers] = useState(INITIAL_BACKERS);
  const [subscribers, setSubscribers] = useState(INITIAL_SUBSCRIBERS);
  const [hasBacked, setHasBacked] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [settlement, setSettlement] = useState("none");
  const [animating, setAnimating] = useState(false);
  const [chartData, setChartData] = useState(sparkData);

  const pct = Math.min(backers / ONE_TIME_EVENT.capacity, 1);
  const depositPool = backers * ONE_TIME_EVENT.depositAmount;
  const mrr = subscribers * RECURRING_SERIES.monthlyPrice;

  function handleBack() {
    if (hasBacked) return;
    setAnimating(true);
    setTimeout(() => {
      setBackers((b) => b + 1);
      setChartData((d) => [...d, { t: "now", b: backers + 1 }]);
      setHasBacked(true);
      setAnimating(false);
    }, 600);
  }

  function getActiveReward() {
    for (let i = ONE_TIME_EVENT.rewards.length - 1; i >= 0; i--) {
      if (pct >= ONE_TIME_EVENT.rewards[i].threshold) return ONE_TIME_EVENT.rewards[i];
    }
    return null;
  }

  const EVENT = mode === "oneTime" ? ONE_TIME_EVENT : RECURRING_SERIES;

  return (
    <div style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif", minHeight: "100vh", background: "#080808", color: "#e8e8e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0f0f0f; }
        ::-webkit-scrollbar-thumb { background: #00d4ff44; border-radius: 2px; }

        .nav-tab {
          background: none; border: none; cursor: pointer;
          padding: 8px 16px; font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: #444; transition: color 0.15s;
          border-bottom: 2px solid transparent;
        }
        .nav-tab.active { color: #00d4ff; border-bottom-color: #00d4ff; }
        .nav-tab:hover:not(.active) { color: #aaa; }

        .mode-btn {
          background: none; border: 1px solid #1f1f1f; cursor: pointer;
          padding: 7px 16px; font-family: 'Space Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #444; transition: all 0.15s;
          border-radius: 3px;
        }
        .mode-btn.active {
          background: #00d4ff14; border-color: #00d4ff66; color: #00d4ff;
        }
        .mode-btn:hover:not(.active) { border-color: #333; color: #888; }

        .cta-btn {
          display: block; width: 100%; padding: 16px;
          background: linear-gradient(135deg, #00d4ff, #7c3aed);
          color: #fff; border: none; border-radius: 4px;
          font-family: 'Space Grotesk', sans-serif; font-size: 14px;
          font-weight: 700; cursor: pointer; letter-spacing: 0.06em;
          text-transform: uppercase; transition: opacity 0.2s, transform 0.1s;
        }
        .cta-btn:hover { opacity: 0.88; }
        .cta-btn:active { transform: scale(0.99); }
        .cta-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .stat-card {
          background: #0f0f0f; border: 1px solid #1a1a1a;
          border-radius: 4px; padding: 18px 20px;
        }
        .stat-card-cyan { border-color: #00d4ff22; }

        .progress-bar { height: 3px; background: #1a1a1a; border-radius: 2px; overflow: hidden; }
        .progress-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, #00d4ff, #7c3aed);
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 8px #00d4ff66;
        }

        .reward-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #141414; }
        .reward-row:last-child { border-bottom: none; }

        .badge {
          display: inline-block; padding: 3px 10px; border-radius: 2px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        }

        .pulse { animation: pulse 1.2s ease-in-out; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }

        .glow { text-shadow: 0 0 20px #00d4ff88; }
        .glow-purple { text-shadow: 0 0 20px #7c3aed88; }

        .settle-opt {
          background: transparent; border: 1px solid #1a1a1a;
          border-radius: 4px; padding: 16px 12px; cursor: pointer;
          text-align: center; transition: all 0.15s; width: 100%;
        }
        .settle-opt:hover { border-color: #333; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid #141414", background: "#080808", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          {/* Top row: logo + mode toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 10px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
                stake
              </span>
              <span style={{ fontSize: 9, color: "#333", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>prototype</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[["oneTime", "One-Time Event"], ["recurring", "Recurring Series"]].map(([id, label]) => (
                <button key={id} className={`mode-btn ${mode === id ? "active" : ""}`}
                  onClick={() => { setMode(id); setView("fan"); setSettlement("none"); }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* Bottom row: view tabs */}
          <div style={{ display: "flex", gap: 0 }}>
            {[["fan", "Fan View"], ["venue", "Producer Dashboard"], ["settlement", "Settlement"]].map(([id, label]) => (
              <button key={id} className={`nav-tab ${view === id ? "active" : ""}`} onClick={() => setView(id)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 100px" }}>

        {/* ── FAN VIEW ── */}
        {view === "fan" && (
          <div>
            {/* Hero */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 18, alignItems: "center" }}>
                <span className="badge" style={{ background: "#00d4ff14", color: "#00d4ff", border: "1px solid #00d4ff33" }}>{EVENT.genre}</span>
                {mode === "oneTime" && hasBacked && <span className="badge" style={{ background: "#00ff8814", color: "#00ff88", border: "1px solid #00ff8833" }}>You're In</span>}
                {mode === "recurring" && hasSubscribed && <span className="badge" style={{ background: "#00ff8814", color: "#00ff88", border: "1px solid #00ff8833" }}>Subscribed</span>}
              </div>
              <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.05, marginBottom: 12, color: "#fff", letterSpacing: "-0.03em" }}>
                {EVENT.name}
              </h1>
              {mode === "oneTime" && (
                <p style={{ fontSize: 13, color: "#555", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
                  {ONE_TIME_EVENT.date}&nbsp;&nbsp;/&nbsp;&nbsp;{ONE_TIME_EVENT.venue}
                </p>
              )}
              {mode === "recurring" && (
                <p style={{ fontSize: 13, color: "#555", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
                  Every {RECURRING_SERIES.dayOfWeek}&nbsp;&nbsp;/&nbsp;&nbsp;{RECURRING_SERIES.curator}
                </p>
              )}
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 540 }}>{EVENT.description}</p>
            </div>

            {/* ── ONE-TIME BACKING BLOCK ── */}
            {mode === "oneTime" && (
              <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 6, padding: "28px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                  <div>
                    <span className={`glow ${animating ? "pulse" : ""}`} style={{ fontSize: 52, fontWeight: 700, color: "#00d4ff", display: "block", lineHeight: 1 }}>
                      {backers}
                    </span>
                    <span style={{ fontSize: 12, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>of {ONE_TIME_EVENT.capacity} backed</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", display: "block", lineHeight: 1 }}>${ONE_TIME_EVENT.depositAmount}</span>
                    <span style={{ fontSize: 12, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>deposit to back</span>
                  </div>
                </div>

                <div className="progress-bar" style={{ marginBottom: 24 }}>
                  <div className="progress-fill" style={{ width: `${Math.round(pct * 100)}%` }} />
                </div>

                {/* Reward tiers */}
                <div style={{ marginBottom: 28 }}>
                  {ONE_TIME_EVENT.rewards.map((r, i) => {
                    const unlocked = pct >= r.threshold;
                    const isNext = !unlocked && (i === 0 || pct >= ONE_TIME_EVENT.rewards[i - 1].threshold);
                    return (
                      <div className="reward-row" key={i}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: unlocked ? "#00d4ff" : isNext ? "#00d4ff14" : "#111", border: `1px solid ${unlocked ? "#00d4ff" : isNext ? "#00d4ff44" : "#222"}` }}>
                          {unlocked
                            ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <span style={{ width: 5, height: 5, borderRadius: "50%", background: isNext ? "#00d4ff" : "#2a2a2a", display: "block" }} />
                          }
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: unlocked || isNext ? "#00d4ff" : "#333", marginBottom: 2, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{r.label}</div>
                          <div style={{ fontSize: 13, color: unlocked ? "#e8e8e8" : isNext ? "#777" : "#333" }}>{r.reward}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasBacked ? (
                  <div style={{ background: "#00ff8808", border: "1px solid #00ff8822", borderRadius: 4, padding: "14px 18px", textAlign: "center" }}>
                    <p style={{ fontSize: 14, color: "#00ff88", fontWeight: 600 }}>You're in. Deposit locked.</p>
                    <p style={{ fontSize: 12, color: "#00ff8877", marginTop: 4 }}>First access to tickets when the show confirms. Earn rewards if it sells out.</p>
                  </div>
                ) : (
                  <button className="cta-btn" onClick={handleBack} disabled={animating}>
                    {animating ? "Locking in..." : `Back This Show · $${ONE_TIME_EVENT.depositAmount} Deposit`}
                  </button>
                )}

                <p style={{ fontSize: 11, color: "#333", textAlign: "center", marginTop: 12, lineHeight: 1.6, letterSpacing: "0.02em" }}>
                  Fully refundable if cancelled. Deposit converts to discounted ticket if it doesn't sell out. Rewards unlock at capacity.
                </p>
              </div>
            )}

            {/* Reward unlocked banner */}
            {mode === "oneTime" && (() => {
              const r = getActiveReward();
              return r ? (
                <div style={{ background: "#00d4ff08", border: "1px solid #00d4ff22", borderRadius: 4, padding: "14px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#00d4ff" strokeWidth="1.5"/><path d="M8 4.5v3.5l2.5 1.5" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#00d4ff", letterSpacing: "0.08em", textTransform: "uppercase" }}>Reward unlocked: {r.label} — </span>
                    <span style={{ fontSize: 12, color: "#00d4ff88" }}>{r.reward}</span>
                  </div>
                </div>
              ) : null;
            })()}

            {/* ── RECURRING SUBSCRIPTION BLOCK ── */}
            {mode === "recurring" && (
              <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 6, padding: "28px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                  <div>
                    <span className="glow-purple" style={{ fontSize: 52, fontWeight: 700, color: "#7c3aed", display: "block", lineHeight: 1 }}>
                      {subscribers}
                    </span>
                    <span style={{ fontSize: 12, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>community members</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", display: "block", lineHeight: 1 }}>${RECURRING_SERIES.monthlyPrice}</span>
                    <span style={{ fontSize: 12, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>per month</span>
                  </div>
                </div>

                {/* Upcoming events */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Upcoming</p>
                  {RECURRING_SERIES.upcomingEvents.map((evt, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < RECURRING_SERIES.upcomingEvents.length - 1 ? "1px solid #141414" : "none" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8", marginBottom: 2 }}>{evt.date}</p>
                        <p style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.04em" }}>{evt.venue}</p>
                      </div>
                      <span style={{ fontSize: 11, color: evt.attendance > 0 ? "#7c3aed" : "#333", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {evt.attendance > 0 ? `${evt.attendance} going` : "TBA"}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#7c3aed0a", border: "1px solid #7c3aed33", borderRadius: 4, padding: "12px 16px", marginBottom: 24 }}>
                  <p style={{ fontSize: 10, color: "#7c3aed", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Member Perks</p>
                  <p style={{ fontSize: 13, color: "#7c3aed99" }}>{RECURRING_SERIES.communityPerk}</p>
                </div>

                {hasSubscribed ? (
                  <div style={{ background: "#00ff8808", border: "1px solid #00ff8822", borderRadius: 4, padding: "14px 18px", textAlign: "center" }}>
                    <p style={{ fontSize: 14, color: "#00ff88", fontWeight: 600 }}>Subscribed. You're in the community.</p>
                    <p style={{ fontSize: 12, color: "#00ff8877", marginTop: 4 }}>Access to all events + voting rights on lineups.</p>
                  </div>
                ) : (
                  <button className="cta-btn" onClick={() => setHasSubscribed(true)}>
                    Subscribe · ${RECURRING_SERIES.monthlyPrice}/Month
                  </button>
                )}

                <p style={{ fontSize: 11, color: "#333", textAlign: "center", marginTop: 12, lineHeight: 1.6, letterSpacing: "0.02em" }}>
                  Cancel anytime. Covers entry to all monthly events plus community access.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCER DASHBOARD ── */}
        {view === "venue" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Producer Dashboard</h2>
              {mode === "oneTime" && <p style={{ fontSize: 12, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>{ONE_TIME_EVENT.name} · {ONE_TIME_EVENT.date}</p>}
              {mode === "recurring" && <p style={{ fontSize: 12, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>{RECURRING_SERIES.name} · {RECURRING_SERIES.curator}</p>}
            </div>

            {/* Stats - One-Time */}
            {mode === "oneTime" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
                {[
                  { label: "Backers", value: backers, sub: `of ${ONE_TIME_EVENT.capacity}`, color: "#00d4ff" },
                  { label: "Demand", value: `${Math.round(pct * 100)}%`, sub: pct >= 0.8 ? "Strong" : pct >= 0.5 ? "Moderate" : "Building", color: pct >= 0.8 ? "#00ff88" : pct >= 0.5 ? "#00d4ff" : "#555" },
                  { label: "Deposit Pool", value: `$${depositPool}`, sub: "committed", color: "#fff" },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <p style={{ fontSize: 10, color: "#444", marginBottom: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{s.label}</p>
                    <p style={{ fontSize: 30, fontWeight: 700, color: s.color, marginBottom: 4, letterSpacing: "-0.02em" }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Stats - Recurring */}
            {mode === "recurring" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
                {[
                  { label: "Subscribers", value: subscribers, sub: "active", color: "#7c3aed" },
                  { label: "MRR", value: `$${mrr}`, sub: "monthly recurring", color: "#00ff88" },
                  { label: "Churn", value: "2.1%", sub: "monthly / healthy", color: "#fff" },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <p style={{ fontSize: 10, color: "#444", marginBottom: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{s.label}</p>
                    <p style={{ fontSize: 30, fontWeight: 700, color: s.color, marginBottom: 4, letterSpacing: "-0.02em" }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Chart - One-Time */}
            {mode === "oneTime" && (
              <>
              <div className="stat-card" style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Backing Velocity</p>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
                    <defs>
                      <linearGradient id="cyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" tick={{ fill: "#333", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#333", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 4, fontSize: 12, color: "#e8e8e8" }} cursor={{ stroke: "#222" }} />
                    <Area type="monotone" dataKey="b" stroke="#00d4ff" strokeWidth={2} fill="url(#cyan)" dot={false} name="Backers" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0c0c0c", border: "1px solid #7c3aed33", borderRadius: 4, padding: "22px 24px", marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700 }}>AI Pricing Signal</p>
                {pct >= 0.8 ? (
                  <>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#00ff88", marginBottom: 6 }}>Raise to $42–$48</p>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>Demand is outpacing comparable shows. General sale tickets can carry a premium without hurting fill rate.</p>
                  </>
                ) : pct >= 0.5 ? (
                  <>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#00d4ff", marginBottom: 6 }}>Hold at $35. Push in 5 days.</p>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>Moderate momentum. If backers don't reach 65% by 5 days out, activate a targeted social push or early-bird tier.</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>Launch a $25 early-bird now.</p>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>Backing is below pace. A limited early-bird tier can accelerate momentum before the 10-day window closes.</p>
                  </>
                )}
              </div>

              <div className="stat-card">
                <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 700 }}>Revenue Projection</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Baseline", value: `$${ONE_TIME_EVENT.capacity * ONE_TIME_EVENT.ticketPrice}` },
                    { label: "With Stake", value: `$${Math.round(ONE_TIME_EVENT.capacity * ONE_TIME_EVENT.ticketPrice * (pct >= 0.8 ? 1.32 : pct >= 0.5 ? 1.18 : 1.08))}` },
                    { label: "Uplift", value: `+${pct >= 0.8 ? "32" : pct >= 0.5 ? "18" : "8"}%`, green: true },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 10, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{s.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: s.green ? "#00ff88" : "#e8e8e8" }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              </>
            )}

            {/* Chart - Recurring */}
            {mode === "recurring" && (
              <>
              <div className="stat-card" style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Subscriber Growth</p>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={subGrowthData} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
                    <defs>
                      <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" tick={{ fill: "#333", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#333", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 4, fontSize: 12, color: "#e8e8e8" }} cursor={{ stroke: "#222" }} />
                    <Area type="monotone" dataKey="s" stroke="#7c3aed" strokeWidth={2} fill="url(#purple)" dot={false} name="Subscribers" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0c0c0c", border: "1px solid #00d4ff22", borderRadius: 4, padding: "22px 24px", marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700 }}>Series Health</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#00d4ff", marginBottom: 6 }}>Growing. Next target: 400 subscribers.</p>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>Strong trajectory. Focus on community engagement and word-of-mouth. Consider a special edition event to spike subscriber growth and retention.</p>
              </div>

              <div className="stat-card">
                <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 700 }}>Revenue Overview</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[
                    { label: "MRR", value: `$${mrr}` },
                    { label: "ARR Proj.", value: `$${mrr * 12}` },
                    { label: "Stake Fee", value: "5%", highlight: true },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 10, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{s.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: s.highlight ? "#7c3aed" : "#e8e8e8" }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              </>
            )}
          </div>
        )}

        {/* ── SETTLEMENT ── */}
        {view === "settlement" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Settlement Simulator</h2>
              <p style={{ fontSize: 12, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {mode === "oneTime" ? "Simulate what happens when the event closes." : "Simulate scenarios for your recurring series."}
              </p>
            </div>

            {/* Outcome Selector - One-Time */}
            {mode === "oneTime" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 32 }}>
                {[
                  { id: "soldout", label: "Sold Out", sub: "100% capacity", color: "#00ff88", border: "#00ff8833" },
                  { id: "partial", label: "Partial", sub: "60–80% filled", color: "#00d4ff", border: "#00d4ff33" },
                  { id: "cancelled", label: "Cancelled", sub: "Event cancelled", color: "#ef4444", border: "#ef444433" },
                ].map((opt) => (
                  <button key={opt.id} className="settle-opt"
                    onClick={() => setSettlement(opt.id)}
                    style={{ border: `1px solid ${settlement === opt.id ? opt.border : "#1a1a1a"}`, background: settlement === opt.id ? opt.color + "0a" : "transparent" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: settlement === opt.id ? opt.color : "#444", marginBottom: 4, letterSpacing: "-0.01em" }}>{opt.label}</p>
                    <p style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em" }}>{opt.sub}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Outcome Selector - Recurring */}
            {mode === "recurring" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 32 }}>
                {[
                  { id: "healthy", label: "Healthy", sub: "Series continues", color: "#00ff88", border: "#00ff8833" },
                  { id: "paused", label: "Paused", sub: "Temporary hiatus", color: "#00d4ff", border: "#00d4ff33" },
                  { id: "cancelled", label: "Cancelled", sub: "Series ends", color: "#ef4444", border: "#ef444433" },
                ].map((opt) => (
                  <button key={opt.id} className="settle-opt"
                    onClick={() => setSettlement(opt.id)}
                    style={{ border: `1px solid ${settlement === opt.id ? opt.border : "#1a1a1a"}`, background: settlement === opt.id ? opt.color + "0a" : "transparent" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: settlement === opt.id ? opt.color : "#444", marginBottom: 4, letterSpacing: "-0.01em" }}>{opt.label}</p>
                    <p style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em" }}>{opt.sub}</p>
                  </button>
                ))}
              </div>
            )}

            {settlement === "none" && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#333" }}>
                <p style={{ fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}>Select a scenario above</p>
              </div>
            )}

            {/* ── ONE-TIME OUTCOMES ── */}
            {mode === "oneTime" && settlement === "soldout" && (
              <SettleBlock accent="#00ff88" title="Sold Out" headline="All rewards unlocked. Deposits refunded." rows={[
                { label: `${backers} backers`, action: "Deposits refunded in full", detail: `$${depositPool} returned` },
                { label: "Top reward", action: "$15 credit issued", detail: "Valid 12 months" },
                { label: "Priority entry", action: "Access confirmed for next show", detail: "Email sent to all backers" },
                { label: "Producer revenue", action: `$${ONE_TIME_EVENT.capacity * ONE_TIME_EVENT.ticketPrice} gross`, detail: `Stake fee: $${Math.round(ONE_TIME_EVENT.capacity * ONE_TIME_EVENT.ticketPrice * 0.05)}` },
              ]} />
            )}
            {mode === "oneTime" && settlement === "partial" && (
              <SettleBlock accent="#00d4ff" title="Partial Fill" headline="Deposits convert to discounted tickets." rows={[
                { label: `${backers} backers`, action: "Deposits become $20 tickets", detail: "$15 discount applied" },
                { label: "60% reward", action: "Free drink token issued", detail: "Threshold was met" },
                { label: "Remaining capacity", action: "General sale opens", detail: "At full $35 price" },
                { label: "Producer revenue", action: `$${Math.round(backers * 20 + (ONE_TIME_EVENT.capacity - backers) * 0.6 * 35)} est.`, detail: "Stake fee on uplift only" },
              ]} />
            )}
            {mode === "oneTime" && settlement === "cancelled" && (
              <SettleBlock accent="#ef4444" title="Cancelled" headline="Full refunds. No fees." rows={[
                { label: `${backers} backers`, action: "Full deposits refunded", detail: `$${depositPool} returned in 3 days` },
                { label: "Stake fee", action: "Zero on cancellation", detail: "No fee charged" },
                { label: "Producer obligation", action: "None beyond refund", detail: "Stake handles comms" },
              ]} />
            )}

            {/* ── RECURRING OUTCOMES ── */}
            {mode === "recurring" && settlement === "healthy" && (
              <SettleBlock accent="#00ff88" title="Healthy Series" headline="Series thriving. Keep momentum." rows={[
                { label: `${subscribers} subscribers`, action: "Monthly billing active", detail: `$${mrr} MRR` },
                { label: "Events", action: "3 upcoming confirmed", detail: "All booked" },
                { label: "Churn", action: "2.1% monthly", detail: "Below industry average" },
                { label: "Stake fee", action: "5% on MRR", detail: `$${Math.round(mrr * 0.05)}/month` },
              ]} />
            )}
            {mode === "recurring" && settlement === "paused" && (
              <SettleBlock accent="#00d4ff" title="Series Paused" headline="Subscriptions frozen. No charges." rows={[
                { label: `${subscribers} subscribers`, action: "Billing paused", detail: "No charges during hiatus" },
                { label: "Access", action: "Maintained during pause", detail: "Rejoin when events resume" },
                { label: "Resume", action: "Set restart date", detail: "Stake emails community" },
                { label: "Stake fee", action: "Zero during pause", detail: "No fees on frozen subs" },
              ]} />
            )}
            {mode === "recurring" && settlement === "cancelled" && (
              <SettleBlock accent="#ef4444" title="Series Cancelled" headline="Series ends. Pro-rata refunds issued." rows={[
                { label: `${subscribers} subscribers`, action: "Pro-rata refunds", detail: `~$${Math.round(mrr * 0.5)} returned` },
                { label: "Timeline", action: "5 business days", detail: "Automatic via Stripe" },
                { label: "Stake fee", action: "No fee on refunds", detail: "You paid for events held" },
                { label: "Community", action: "Goodbye email sent", detail: "Stake handles all comms" },
              ]} />
            )}

            {/* Simulator controls */}
            {settlement !== "none" && (
              <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 4, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>
                    {mode === "oneTime" ? "Simulate more backers" : "Simulate more subscribers"}
                  </p>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 2 }}>See how numbers shift in real time</p>
                </div>
                <button className="cta-btn" style={{ width: "auto", padding: "10px 20px", fontSize: 12 }}
                  onClick={() => {
                    if (mode === "oneTime") {
                      setBackers(b => Math.min(b + 5, ONE_TIME_EVENT.capacity));
                      setChartData(d => [...d, { t: "+5", b: Math.min(backers + 5, ONE_TIME_EVENT.capacity) }]);
                    } else {
                      setSubscribers(s => s + 10);
                    }
                  }}
                  disabled={mode === "oneTime" && backers >= ONE_TIME_EVENT.capacity}
                >
                  {mode === "oneTime" ? (backers >= ONE_TIME_EVENT.capacity ? "Sold Out" : "+ 5 Backers") : "+ 10 Subscribers"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SettleBlock({ accent, title, headline, rows }) {
  return (
    <div style={{ background: "#0c0c0c", border: `1px solid ${accent}22`, borderRadius: 4, padding: "22px 24px", marginBottom: 16 }}>
      <p style={{ fontSize: 10, color: accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>{title}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: accent, marginBottom: 20, letterSpacing: "-0.01em" }}>{headline}</p>
      <div style={{ display: "grid", gap: 0 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < rows.length - 1 ? "1px solid #141414" : "none" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#e8e8e8" }}>{row.label}</p>
              <p style={{ fontSize: 11, color: accent + "99", marginTop: 2 }}>{row.action}</p>
            </div>
            <p style={{ fontSize: 11, color: "#444", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
