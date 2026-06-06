import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ONE_TIME_EVENT = {
  name: "Yonatan Gat Quartet",
  venue: "Shaham Cultural Laboratory",
  date: "Thu, May 28 · 9:00 PM",
  capacity: 80,
  ticketPrice: 30,
  depositAmount: 15,
  genre: "Jazz / Experimental",
  description: "An evening of boundary-pushing jazz from one of Jerusalem's most celebrated guitarists. Limited capacity. Intimate setting.",
  rewards: [
    { threshold: 0.6, label: "60% backed", reward: "Complimentary drink at the bar" },
    { threshold: 0.8, label: "80% backed", reward: "Priority seating at the next show" },
    { threshold: 1.0, label: "Sold out", reward: "$10 venue credit + name on the wall" },
  ],
};

const RECURRING_SERIES = {
  name: "Frequencies Techno Residency",
  curator: "Aether Collective",
  monthlyPrice: 18,
  description: "A monthly underground techno series exploring sound design and community. Curated by residents pushing the boundaries of electronic music.",
  genre: "Techno / Electronic",
  dayOfWeek: "Third Saturday",
  upcomingEvents: [
    { month: "June", date: "June 21", venue: "Warehouse District", attendance: 240 },
    { month: "July", date: "July 19", venue: "TBA", attendance: 0 },
    { month: "August", date: "Aug 16", venue: "TBA", attendance: 0 },
  ],
  communityPerk: "Voting rights on artist lineups, first access to special events",
};

const INITIAL_BACKERS = 47;
const INITIAL_SUBSCRIBERS = 240;

const sparkData = [
  { t: "3w ago", b: 4 },
  { t: "2w ago", b: 11 },
  { t: "10d", b: 18 },
  { t: "7d", b: 24 },
  { t: "5d", b: 31 },
  { t: "3d", b: 38 },
  { t: "2d", b: 43 },
  { t: "Yesterday", b: 47 },
];

export default function App() {
  const [mode, setMode] = useState("oneTime"); // "oneTime" or "recurring"
  const [view, setView] = useState("fan");
  const [backers, setBackers] = useState(INITIAL_BACKERS);
  const [subscribers, setSubscribers] = useState(INITIAL_SUBSCRIBERS);
  const [hasBacked, setHasBacked] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [settlement, setSettlement] = useState("pending");
  const [animating, setAnimating] = useState(false);
  const [chartData, setChartData] = useState(sparkData);

  const EVENT = mode === "oneTime" ? ONE_TIME_EVENT : RECURRING_SERIES;

  const pct = Math.min(backers / EVENT.capacity, 1);
  const projRevenue = backers * EVENT.ticketPrice;
  const depositPool = backers * EVENT.depositAmount;

  function handleBack() {
    if (hasBacked) return;
    setAnimating(true);
    setTimeout(() => {
      setBackers((b) => b + 1);
      setChartData((d) => [...d, { t: "Now", b: backers + 1 }]);
      setHasBacked(true);
      setAnimating(false);
    }, 600);
  }

  function getActiveReward() {
    for (let i = EVENT.rewards.length - 1; i >= 0; i--) {
      if (pct >= EVENT.rewards[i].threshold) return EVENT.rewards[i];
    }
    return null;
  }

  const activeReward = getActiveReward();

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", minHeight: "100vh", background: "#0f0f0f", color: "#f0ede8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1a1a1a; } ::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 2px; }
        .nav-tab { background: none; border: none; cursor: pointer; padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.04em; color: #888; transition: color 0.2s; border-bottom: 2px solid transparent; }
        .nav-tab.active { color: #e8c97a; border-bottom-color: #e8c97a; }
        .nav-tab:hover:not(.active) { color: #ccc; }
        .cta-btn { display: block; width: 100%; padding: 16px; background: #e8c97a; color: #0f0f0f; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; letter-spacing: 0.02em; transition: opacity 0.2s, transform 0.1s; }
        .cta-btn:hover { opacity: 0.9; }
        .cta-btn:active { transform: scale(0.99); }
        .cta-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .settle-btn { padding: 10px 20px; border-radius: 6px; border: 1px solid; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .progress-bar { height: 6px; background: #2a2a2a; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #e8c97a, #f0da9e); transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reward-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #1e1e1e; }
        .reward-row:last-child { border-bottom: none; }
        .stat-card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; padding: 18px 20px; }
        .pulse { animation: pulse 1.2s ease-in-out; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e1e", background: "#0f0f0f", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ padding: "16px 0", display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#e8c97a", letterSpacing: "-0.01em" }}>stake</span>
            <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>prototype</span>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 0, borderRight: "1px solid #2a2a2a", paddingRight: 16 }}>
              {[["oneTime", "One-Time"], ["recurring", "Recurring Series"]].map(([id, label]) => (
                <button key={id} className={`nav-tab ${mode === id ? "active" : ""}`} onClick={() => { setMode(id); setView("fan"); }}>{label}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {[["fan", "Fan View"], ["venue", "Venue Dashboard"], ["settlement", "Settlement"]].map(([id, label]) => (
                <button key={id} className={`nav-tab ${view === id ? "active" : ""}`} onClick={() => setView(id)}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── FAN VIEW ──────────────────────────────────────────── */}
        {view === "fan" && (
          <div>
            {/* Event Hero */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
                <span className="badge" style={{ background: "#1e1a10", color: "#e8c97a", border: "1px solid #3a3018" }}>{EVENT.genre}</span>
                {mode === "oneTime" && hasBacked && <span className="badge" style={{ background: "#102010", color: "#6fbf6f", border: "1px solid #1a3a1a" }}>You're in</span>}
                {mode === "recurring" && hasSubscribed && <span className="badge" style={{ background: "#102010", color: "#6fbf6f", border: "1px solid #1a3a1a" }}>Subscribed</span>}
              </div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, lineHeight: 1.1, marginBottom: 10, color: "#f5f0e8", letterSpacing: "-0.02em" }}>{EVENT.name}</h1>
              {mode === "oneTime" && (
                <>
                  <p style={{ fontSize: 14, color: "#888", marginBottom: 6 }}>{EVENT.date} &nbsp;·&nbsp; {EVENT.venue}</p>
                </>
              )}
              {mode === "recurring" && (
                <>
                  <p style={{ fontSize: 14, color: "#888", marginBottom: 6 }}>Every {EVENT.dayOfWeek} &nbsp;·&nbsp; Curated by {EVENT.curator}</p>
                </>
              )}
              <p style={{ fontSize: 15, color: "#aaa", lineHeight: 1.65, maxWidth: 520 }}>{EVENT.description}</p>
            </div>

            {mode === "oneTime" && (
            <div style={{ background: "#151515", border: "1px solid #2a2a2a", borderRadius: 12, padding: "28px 28px 24px", marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                <div>
                  <span className={`block text-5xl font-bold ${animating ? "pulse" : ""}`} style={{ fontSize: 44, fontWeight: 600, color: "#e8c97a", fontFamily: "'DM Serif Display', serif", display: "block" }}>
                    {backers}
                  </span>
                  <span style={{ fontSize: 13, color: "#666" }}>of {ONE_TIME_EVENT.capacity} backed</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 28, fontWeight: 600, color: "#f0ede8", display: "block" }}>${ONE_TIME_EVENT.depositAmount}</span>
                  <span style={{ fontSize: 13, color: "#666" }}>deposit to back</span>
                </div>
              </div>

              <div className="progress-bar" style={{ marginBottom: 20 }}>
                <div className="progress-fill" style={{ width: `${Math.round((backers / ONE_TIME_EVENT.capacity) * 100)}%` }} />
              </div>

              {/* Reward tiers */}
              <div style={{ marginBottom: 24 }}>
                {ONE_TIME_EVENT.rewards.map((r, i) => {
                  const unlocked = (backers / ONE_TIME_EVENT.capacity) >= r.threshold;
                  const isNext = !unlocked && (i === 0 || (backers / ONE_TIME_EVENT.capacity) >= ONE_TIME_EVENT.rewards[i - 1].threshold);
                  return (
                    <div className="reward-row" key={i}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: unlocked ? "#e8c97a" : isNext ? "#2a2510" : "#1e1e1e", border: `1px solid ${unlocked ? "#e8c97a" : isNext ? "#4a4018" : "#2a2a2a"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {unlocked ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        ) : (
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: isNext ? "#e8c97a" : "#333", display: "block" }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: unlocked ? "#e8c97a" : isNext ? "#e8c97a" : "#555", marginBottom: 2, fontWeight: 500 }}>{r.label}</div>
                        <div style={{ fontSize: 14, color: unlocked ? "#f0ede8" : isNext ? "#aaa" : "#555" }}>{r.reward}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasBacked ? (
                <div style={{ background: "#102010", border: "1px solid #1a3a1a", borderRadius: 8, padding: "14px 18px", textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "#6fbf6f", fontWeight: 500 }}>You've backed this show. Your deposit is locked in.</p>
                  <p style={{ fontSize: 13, color: "#4a8a4a", marginTop: 4 }}>You'll be first to get tickets when the show confirms. If it sells out, you earn rewards.</p>
                </div>
              ) : (
                <button className="cta-btn" onClick={handleBack} disabled={animating}>
                  {animating ? "Locking in deposit..." : `Back this show · $${ONE_TIME_EVENT.depositAmount} deposit`}
                </button>
              )}

              <p style={{ fontSize: 12, color: "#555", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                Deposit is fully refundable if the show is cancelled. If it sells out, you earn rewards. If it doesn't, your deposit becomes a discounted ticket.
              </p>
            </div>
            )}

            {mode === "recurring" && (
            <div style={{ background: "#151515", border: "1px solid #2a2a2a", borderRadius: 12, padding: "28px 28px 24px", marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 44, fontWeight: 600, color: "#e8c97a", fontFamily: "'DM Serif Display', serif", display: "block" }}>
                    {subscribers}
                  </span>
                  <span style={{ fontSize: 13, color: "#666" }}>community members</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 28, fontWeight: 600, color: "#f0ede8", display: "block" }}>${RECURRING_SERIES.monthlyPrice}</span>
                  <span style={{ fontSize: 13, color: "#666" }}>per month</span>
                </div>
              </div>

              {/* Upcoming Events */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, fontWeight: 500 }}>Upcoming Events</p>
                {RECURRING_SERIES.upcomingEvents.map((evt, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < RECURRING_SERIES.upcomingEvents.length - 1 ? "1px solid #1e1e1e" : "none" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8", marginBottom: 2 }}>{evt.date}</p>
                      <p style={{ fontSize: 12, color: "#666" }}>{evt.venue}</p>
                    </div>
                    <p style={{ fontSize: 12, color: "#888" }}>{evt.attendance > 0 ? `${evt.attendance} attending` : "Date TBA"}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#1a1508", border: "1px solid #3a3018", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "#e8c97a", fontWeight: 500, marginBottom: 4 }}>Community Perk</p>
                <p style={{ fontSize: 13, color: "#a09060" }}>{RECURRING_SERIES.communityPerk}</p>
              </div>

              {hasSubscribed ? (
                <div style={{ background: "#102010", border: "1px solid #1a3a1a", borderRadius: 8, padding: "14px 18px", textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "#6fbf6f", fontWeight: 500 }}>You're subscribed to this series.</p>
                  <p style={{ fontSize: 13, color: "#4a8a4a", marginTop: 4 }}>You'll get access to every event and voting rights on lineups.</p>
                </div>
              ) : (
                <button className="cta-btn" onClick={() => setHasSubscribed(true)}>
                  Subscribe · ${RECURRING_SERIES.monthlyPrice}/month
                </button>
              )}

              <p style={{ fontSize: 12, color: "#555", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                Cancel anytime. Subscription covers entry to all monthly events plus community access.
              </p>
            </div>
            )}

            {mode === "oneTime" && (
            <>
            {(() => {
              const pct = Math.min(backers / ONE_TIME_EVENT.capacity, 1);
              const getActiveReward = () => {
                for (let i = ONE_TIME_EVENT.rewards.length - 1; i >= 0; i--) {
                  if (pct >= ONE_TIME_EVENT.rewards[i].threshold) return ONE_TIME_EVENT.rewards[i];
                }
                return null;
              };
              const activeReward = getActiveReward();
              return activeReward && (
                <div style={{ background: "#1a1508", border: "1px solid #3a3018", borderRadius: 8, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 18, flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#e8c97a" strokeWidth="1.5"/><path d="M9 5v4l3 2" stroke="#e8c97a" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#e8c97a", marginBottom: 3 }}>Reward unlocked: {activeReward.label}</p>
                    <p style={{ fontSize: 13, color: "#a09060" }}>{activeReward.reward} — for all backers if the show hits capacity.</p>
                  </div>
                </div>
              );
            })()}
            </>
            )}
          </div>
        )}

        {/* ── PRODUCER DASHBOARD ──────────────────────────────────── */}
        {view === "venue" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#f5f0e8", marginBottom: 6 }}>Producer Dashboard</h2>
              {mode === "oneTime" && <p style={{ fontSize: 14, color: "#666" }}>{ONE_TIME_EVENT.name} &nbsp;·&nbsp; {ONE_TIME_EVENT.date}</p>}
              {mode === "recurring" && <p style={{ fontSize: 14, color: "#666" }}>{RECURRING_SERIES.name} &nbsp;·&nbsp; Curated by {RECURRING_SERIES.curator}</p>}
            </div>

            {/* Stats Grid - One-Time */}
            {mode === "oneTime" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
              {(() => {
                const pct = Math.min(backers / ONE_TIME_EVENT.capacity, 1);
                const depositPool = backers * ONE_TIME_EVENT.depositAmount;
                return [
                  { label: "Backers", value: backers, sub: `of ${ONE_TIME_EVENT.capacity} capacity`, color: "#e8c97a" },
                  { label: "Demand signal", value: `${Math.round(pct * 100)}%`, sub: pct >= 0.8 ? "Strong — price up" : pct >= 0.5 ? "Moderate" : "Building", color: pct >= 0.8 ? "#6fbf6f" : pct >= 0.5 ? "#e8c97a" : "#888" },
                  { label: "Deposit pool", value: `$${depositPool}`, sub: "committed capital", color: "#f0ede8" },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <p style={{ fontSize: 12, color: "#555", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 600, color: s.color, marginBottom: 4, fontFamily: "'DM Serif Display', serif" }}>{s.value}</p>
                    <p style={{ fontSize: 12, color: "#555" }}>{s.sub}</p>
                  </div>
                ));
              })()}
            </div>
            )}

            {/* Stats Grid - Recurring */}
            {mode === "recurring" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
              {[
                { label: "Monthly Subscribers", value: subscribers, sub: "active subscriptions", color: "#e8c97a" },
                { label: "Monthly Revenue", value: `$${subscribers * RECURRING_SERIES.monthlyPrice}`, sub: "MRR (recurring)", color: "#6fbf6f" },
                { label: "Churn Rate", value: "2.1%", sub: "monthly - healthy", color: "#f0ede8" },
              ].map((s, i) => (
                <div className="stat-card" key={i}>
                  <p style={{ fontSize: 12, color: "#555", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 600, color: s.color, marginBottom: 4, fontFamily: "'DM Serif Display', serif" }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: "#555" }}>{s.sub}</p>
                </div>
              ))}
            </div>
            )}

            {mode === "oneTime" && (
            <>
            {/* Backing curve chart */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#555", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 18 }}>Backing velocity</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e8c97a" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#e8c97a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12, color: "#f0ede8" }} cursor={{ stroke: "#3a3a3a" }} />
                  <Area type="monotone" dataKey="b" stroke="#e8c97a" strokeWidth={2} fill="url(#gold)" dot={false} name="Backers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pricing Recommendation */}
            <div style={{ background: "#1a1508", border: "1px solid #3a3018", borderRadius: 10, padding: "22px 24px", marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>AI Pricing Recommendation</p>
              {(() => {
                const pct = Math.min(backers / ONE_TIME_EVENT.capacity, 1);
                return pct >= 0.8 ? (
                  <>
                    <p style={{ fontSize: 18, fontWeight: 600, color: "#e8c97a", marginBottom: 6 }}>Raise ticket price to $38–$42</p>
                    <p style={{ fontSize: 14, color: "#a09060", lineHeight: 1.6 }}>Backing velocity is strong. Demand is outpacing comparable shows at this stage. General sale tickets can carry a premium without damaging fill rate.</p>
                  </>
                ) : pct >= 0.5 ? (
                  <>
                    <p style={{ fontSize: 18, fontWeight: 600, color: "#e8c97a", marginBottom: 6 }}>Hold at $30, activate promotion in 5 days</p>
                    <p style={{ fontSize: 14, color: "#a09060", lineHeight: 1.6 }}>Moderate demand. Maintain current price and set a trigger: if backers don't reach 65% by 5 days out, activate a targeted social push or early-bird offer.</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 18, fontWeight: 600, color: "#e8c97a", marginBottom: 6 }}>Consider a $25 early-bird tier now</p>
                    <p style={{ fontSize: 14, color: "#a09060", lineHeight: 1.6 }}>Backing is below target pace. A limited early-bird discount can accelerate momentum. Low backing this early is normal — but act before the 10-day window closes.</p>
                  </>
                );
              })()}
            </div>

            {/* Revenue Projection */}
            <div className="stat-card">
              <p style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Revenue Projection</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {(() => {
                  const pct = Math.min(backers / ONE_TIME_EVENT.capacity, 1);
                  return [
                    { label: "Baseline (flat pricing)", value: `$${ONE_TIME_EVENT.capacity * ONE_TIME_EVENT.ticketPrice}` },
                    { label: "Projected with Stake", value: `$${Math.round(ONE_TIME_EVENT.capacity * ONE_TIME_EVENT.ticketPrice * (pct >= 0.8 ? 1.32 : pct >= 0.5 ? 1.18 : 1.08))}` },
                    { label: "Uplift", value: `+${pct >= 0.8 ? "32" : pct >= 0.5 ? "18" : "8"}%`, highlight: true },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>{s.label}</p>
                      <p style={{ fontSize: 20, fontWeight: 600, color: s.highlight ? "#6fbf6f" : "#f0ede8" }}>{s.value}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>
            </>
            )}

            {mode === "recurring" && (
            <>
            {/* Growth chart */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#555", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 18 }}>Subscriber growth</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={[
                  { t: "Month 1", s: 120 },
                  { t: "Month 2", s: 168 },
                  { t: "Month 3", s: 201 },
                  { t: "Month 4", s: 228 },
                  { t: "Month 5", s: 235 },
                  { t: "Month 6", s: 240 },
                ]} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6fbf6f" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6fbf6f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12, color: "#f0ede8" }} cursor={{ stroke: "#3a3a3a" }} />
                  <Area type="monotone" dataKey="s" stroke="#6fbf6f" strokeWidth={2} fill="url(#green)" dot={false} name="Subscribers" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Recommendations */}
            <div style={{ background: "#1a1508", border: "1px solid #3a3018", borderRadius: 10, padding: "22px 24px", marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Series Health</p>
              <p style={{ fontSize: 18, fontWeight: 600, color: "#e8c97a", marginBottom: 6 }}>Growing steadily. Next target: 300 subscribers.</p>
              <p style={{ fontSize: 14, color: "#a09060", lineHeight: 1.6 }}>You're on a healthy growth trajectory. Focus on community engagement (voting, exclusive access) and word-of-mouth from existing subscribers. Consider a featured event every 6 months to drive retention.</p>
            </div>

            {/* Revenue Overview */}
            <div className="stat-card">
              <p style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Revenue Overview</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: "Current MRR", value: `$${subscribers * RECURRING_SERIES.monthlyPrice}` },
                  { label: "ARR Projection", value: `$${subscribers * RECURRING_SERIES.monthlyPrice * 12}` },
                  { label: "Stake Fee", value: `5%`, highlight: true },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>{s.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 600, color: s.highlight ? "#e8c97a" : "#f0ede8" }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {/* ── SETTLEMENT ───────────────────────────────────────── */}
        {view === "settlement" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#f5f0e8", marginBottom: 6 }}>Settlement Simulator</h2>
              {mode === "oneTime" && <p style={{ fontSize: 14, color: "#666" }}>Simulate what happens when the event closes.</p>}
              {mode === "recurring" && <p style={{ fontSize: 14, color: "#666" }}>Simulate scenarios for your recurring series.</p>}
            </div>

            {/* Outcome Selector - One-Time */}
            {mode === "oneTime" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 32 }}>
              {[
                { id: "soldout", label: "Sold Out", sub: "100% capacity", color: "#6fbf6f", borderColor: "#1a3a1a" },
                { id: "partial", label: "Partial Sell", sub: "60–80% capacity", color: "#e8c97a", borderColor: "#3a3018" },
                { id: "cancelled", label: "Cancelled", sub: "Event doesn't happen", color: "#bf6f6f", borderColor: "#3a1a1a" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSettlement(opt.id)}
                  style={{ background: settlement === opt.id ? "#1a1a1a" : "transparent", border: `1px solid ${settlement === opt.id ? opt.borderColor : "#2a2a2a"}`, borderRadius: 8, padding: "16px 12px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                >
                  <p style={{ fontSize: 15, fontWeight: 600, color: settlement === opt.id ? opt.color : "#666", marginBottom: 4 }}>{opt.label}</p>
                  <p style={{ fontSize: 12, color: "#555" }}>{opt.sub}</p>
                </button>
              ))}
            </div>
            )}

            {/* Outcome Selector - Recurring */}
            {mode === "recurring" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 32 }}>
              {[
                { id: "healthy", label: "Healthy", sub: "Series continues", color: "#6fbf6f", borderColor: "#1a3a1a" },
                { id: "paused", label: "Paused", sub: "Temporary hiatus", color: "#e8c97a", borderColor: "#3a3018" },
                { id: "cancelled", label: "Cancelled", sub: "Series ends", color: "#bf6f6f", borderColor: "#3a1a1a" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSettlement(opt.id)}
                  style={{ background: settlement === opt.id ? "#1a1a1a" : "transparent", border: `1px solid ${settlement === opt.id ? opt.borderColor : "#2a2a2a"}`, borderRadius: 8, padding: "16px 12px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                >
                  <p style={{ fontSize: 15, fontWeight: 600, color: settlement === opt.id ? opt.color : "#666", marginBottom: 4 }}>{opt.label}</p>
                  <p style={{ fontSize: 12, color: "#555" }}>{opt.sub}</p>
                </button>
              ))}
            </div>
            )}

            {/* ── ONE-TIME EVENT SETTLEMENTS ──────────────────────────────── */}
            {mode === "oneTime" && (
            <>
            {(() => {
              const depositPool = backers * ONE_TIME_EVENT.depositAmount;
              return (
                <>
                {settlement === "soldout" && (
                  <div>
                    <div style={{ background: "#102010", border: "1px solid #1a3a1a", borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: "#4a8a4a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Sold Out — Settlement</p>
                      <p style={{ fontSize: 22, fontWeight: 600, color: "#6fbf6f", marginBottom: 16 }}>All rewards unlocked. Deposits refunded.</p>
                      <div style={{ display: "grid", gap: 10 }}>
                        {[
                          { label: `${backers} backers`, action: "Deposits refunded in full", detail: `$${depositPool} returned` },
                          { label: "Top-tier reward", action: "$10 venue credit issued", detail: "Non-transferable, valid 12 months" },
                          { label: "Priority seating", action: "Access confirmed for next show", detail: "Email sent to all backers" },
                          { label: "Venue revenue", action: `$${ONE_TIME_EVENT.capacity * ONE_TIME_EVENT.ticketPrice} gross`, detail: `Stake service fee: $${Math.round(ONE_TIME_EVENT.capacity * ONE_TIME_EVENT.ticketPrice * 0.10)} (10% uplift share)` },
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #1a2a1a" : "none" }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>{row.label}</p>
                              <p style={{ fontSize: 12, color: "#4a8a4a" }}>{row.action}</p>
                            </div>
                            <p style={{ fontSize: 12, color: "#666", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settlement === "partial" && (
                  <div>
                    <div style={{ background: "#1a1508", border: "1px solid #3a3018", borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Partial Fill — Settlement</p>
                      <p style={{ fontSize: 22, fontWeight: 600, color: "#e8c97a", marginBottom: 16 }}>60% reward unlocked. Deposits become discounted tickets.</p>
                      <div style={{ display: "grid", gap: 10 }}>
                        {[
                          { label: `${backers} backers`, action: "Deposits convert to $20 tickets", detail: `$10 discount applied (from $30 face value)` },
                          { label: "Venue retains deposits", action: `$${depositPool} kept as revenue`, detail: "Offsets soft attendance" },
                          { label: "Drink reward", action: "Issued to all backers", detail: "60% threshold was met" },
                          { label: "Venue revenue", action: `$${Math.round(backers * 20 + (ONE_TIME_EVENT.capacity - backers) * 0.6 * 30)} est. gross`, detail: "Stake service fee calculated on uplift above baseline" },
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #2a2010" : "none" }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>{row.label}</p>
                              <p style={{ fontSize: 12, color: "#a09060" }}>{row.action}</p>
                            </div>
                            <p style={{ fontSize: 12, color: "#666", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settlement === "cancelled" && (
                  <div>
                    <div style={{ background: "#1a1010", border: "1px solid #3a1a1a", borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Cancelled — Settlement</p>
                      <p style={{ fontSize: 22, fontWeight: 600, color: "#bf6f6f", marginBottom: 16 }}>Full refunds issued. No fees charged.</p>
                      <div style={{ display: "grid", gap: 10 }}>
                        {[
                          { label: `${backers} backers`, action: "Full deposits refunded", detail: `$${depositPool} returned within 3 business days` },
                          { label: "Stake fee", action: "Zero — cancellation is exempt", detail: "No fee on cancelled events" },
                          { label: "Venue obligation", action: "None beyond refund processing", detail: "Stake handles all backer communications" },
                        ].map((row, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid #2a1010" : "none" }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>{row.label}</p>
                              <p style={{ fontSize: 12, color: "#8a4a4a" }}>{row.action}</p>
                            </div>
                            <p style={{ fontSize: 12, color: "#666", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ background: "#151515", border: "1px solid #2a2a2a", borderRadius: 8, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>Simulate more backers</p>
                    <p style={{ fontSize: 12, color: "#666" }}>Add to the pool to see how rewards and projections shift</p>
                  </div>
                  <button
                    className="cta-btn"
                    style={{ width: "auto", padding: "10px 20px", fontSize: 13 }}
                    onClick={() => { setBackers(b => Math.min(b + 5, ONE_TIME_EVENT.capacity)); setChartData(d => [...d, { t: "+5", b: Math.min(backers + 5, ONE_TIME_EVENT.capacity) }]); }}
                    disabled={backers >= ONE_TIME_EVENT.capacity}
                  >
                    {backers >= ONE_TIME_EVENT.capacity ? "Sold out" : "+ 5 backers"}
                  </button>
                </div>
                </>
              );
            })()}
            </>
            )}

            {/* ── RECURRING SERIES SETTLEMENTS ──────────────────────────────── */}
            {mode === "recurring" && (
            <>
            {settlement === "healthy" && (
              <div>
                <div style={{ background: "#102010", border: "1px solid #1a3a1a", borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#4a8a4a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Healthy Series</p>
                  <p style={{ fontSize: 22, fontWeight: 600, color: "#6fbf6f", marginBottom: 16 }}>Series is thriving. Keep momentum going.</p>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[
                      { label: `${subscribers} active subscribers`, action: "Monthly subscriptions active", detail: `$${subscribers * RECURRING_SERIES.monthlyPrice} MRR` },
                      { label: "Upcoming events", action: "3 events scheduled", detail: "All booked and confirmed" },
                      { label: "Community health", action: "2.1% monthly churn", detail: "Below industry average" },
                      { label: "Stake fee", action: "5% on monthly revenue", detail: `${Math.round(subscribers * RECURRING_SERIES.monthlyPrice * 0.05)} per month` },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #1a2a1a" : "none" }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>{row.label}</p>
                          <p style={{ fontSize: 12, color: "#4a8a4a" }}>{row.action}</p>
                        </div>
                        <p style={{ fontSize: 12, color: "#666", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {settlement === "paused" && (
              <div>
                <div style={{ background: "#1a1508", border: "1px solid #3a3018", borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Series Paused</p>
                  <p style={{ fontSize: 22, fontWeight: 600, color: "#e8c97a", marginBottom: 16 }}>Series on temporary hiatus. Subscriptions frozen.</p>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[
                      { label: `${subscribers} subscribers`, action: "Subscriptions paused", detail: "No charges during hiatus" },
                      { label: "Subscriber access", action: "Pause period access included", detail: "Can rejoin after events resume" },
                      { label: "Resume plan", action: "Communicate timeline to community", detail: "Send email with restart date" },
                      { label: "Stake fee", action: "Zero during pause period", detail: "No fees on paused subscriptions" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #2a2010" : "none" }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>{row.label}</p>
                          <p style={{ fontSize: 12, color: "#a09060" }}>{row.action}</p>
                        </div>
                        <p style={{ fontSize: 12, color: "#666", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {settlement === "cancelled" && (
              <div>
                <div style={{ background: "#1a1010", border: "1px solid #3a1a1a", borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Series Cancelled</p>
                  <p style={{ fontSize: 22, fontWeight: 600, color: "#bf6f6f", marginBottom: 16 }}>Series ends. Subscribers refunded.</p>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[
                      { label: `${subscribers} subscribers`, action: "Pro-rata refunds issued", detail: `Refund amount: ~$${Math.round(subscribers * RECURRING_SERIES.monthlyPrice * 0.5)}` },
                      { label: "Refund timeline", action: "Processed within 5 business days", detail: "Automatic Stripe refund" },
                      { label: "Stake fee", action: "No fee on refunds", detail: "You only paid for events held" },
                      { label: "Community notification", action: "Stake sends goodbye email", detail: "Explains cancellation and refund" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #2a1010" : "none" }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>{row.label}</p>
                          <p style={{ fontSize: 12, color: "#8a4a4a" }}>{row.action}</p>
                        </div>
                        <p style={{ fontSize: 12, color: "#666", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: "#151515", border: "1px solid #2a2a2a", borderRadius: 8, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>Simulate more subscribers</p>
                <p style={{ fontSize: 12, color: "#666" }}>Add to the pool to see how revenue and growth shift</p>
              </div>
              <button
                className="cta-btn"
                style={{ width: "auto", padding: "10px 20px", fontSize: 13 }}
                onClick={() => setSubscribers(s => s + 10)}
              >
                + 10 subscribers
              </button>
            </div>
            </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
