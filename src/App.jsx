import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COMMUNITY = {
  name: "Parallax",
  curator: "Aether Collective",
  monthlyPrice: 18,
  description: "A monthly underground techno residency. Rotating international guests. Undisclosed locations announced 48 hours before doors. No photos, no socials — just the music.",
  genre: "Techno / Industrial",
  cadence: "Third Saturday of every month",
  upcomingEvents: [
    { date: "Jun 21", venue: "Warehouse District, Unit 4", city: "London", attendance: 312 },
    { date: "Jul 19", venue: "Location TBA", city: "Berlin", attendance: 0 },
    { date: "Aug 16", venue: "Location TBA", city: "Amsterdam", attendance: 0 },
  ],
  communityPerks: [
    "Voting rights on monthly lineups",
    "First access to special editions",
    "Members-only drops and recordings",
    "Exclusive Discord community",
  ],
};

const INITIAL_MEMBERS = 312;

const growthData = [
  { t: "M1", m: 120 },
  { t: "M2", m: 168 },
  { t: "M3", m: 210 },
  { t: "M4", m: 261 },
  { t: "M5", m: 295 },
  { t: "M6", m: 312 },
];

export default function App() {
  const [view, setView] = useState("fan");
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [hasMembership, setHasMembership] = useState(false);
  const [scenarioSettlement, setScenarioSettlement] = useState("none");
  const [animating, setAnimating] = useState(false);

  const mrr = members * COMMUNITY.monthlyPrice;
  const arr = mrr * 12;

  function handleJoinCommunity() {
    if (hasMembership) return;
    setAnimating(true);
    setTimeout(() => {
      setMembers((m) => m + 1);
      setHasMembership(true);
      setAnimating(false);
    }, 600);
  }

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

        .badge {
          display: inline-block; padding: 3px 10px; border-radius: 2px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        }

        .pulse { animation: pulse 1.2s ease-in-out; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }

        .glow-purple { text-shadow: 0 0 20px #7c3aed88; }

        .perk-list { display: grid; gap: 12px; }
        .perk-item {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 12px 0; border-bottom: 1px solid #141414;
        }
        .perk-item:last-child { border-bottom: none; }
        .perk-check {
          width: 18px; height: 18px; flexShrink: 0; display: flex;
          align-items: center; justify-content: center;
          background: #7c3aed22; border: 1px solid #7c3aed44; border-radius: 3px;
        }
        .perk-text { font-size: 13px; color: #aaa; }

        .settle-btn {
          background: transparent; border: 1px solid #1a1a1a;
          border-radius: 4px; padding: 16px 12px; cursor: pointer;
          text-align: center; transition: all 0.15s; width: 100%;
          font-family: 'Space Grotesk', sans-serif;
        }
        .settle-btn:hover { border-color: #333; }

        .settle-block {
          background: #0c0c0c; border-radius: 4px; padding: "22px 24px"; margin-bottom: 16px;
        }

        .settle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: "10px 0"; border-bottom: 1px solid #141414;
        }
        .settle-row:last-child { border-bottom: none; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid #141414", background: "#080808", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
                stake
              </span>
              <span style={{ fontSize: 9, color: "#333", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>community membership</span>
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {[["fan", "Community"], ["producer", "Producer Dashboard"], ["settlement", "Scenarios"]].map(([id, label]) => (
                <button key={id} className={`nav-tab ${view === id ? "active" : ""}`} onClick={() => { setView(id); setScenarioSettlement("none"); }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 100px" }}>

        {/* ── COMMUNITY VIEW ── */}
        {view === "fan" && (
          <div>
            {/* Hero */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 18, alignItems: "center" }}>
                <span className="badge" style={{ background: "#7c3aed14", color: "#7c3aed", border: "1px solid #7c3aed33" }}>{COMMUNITY.genre}</span>
                {hasMembership && <span className="badge" style={{ background: "#00ff8814", color: "#00ff88", border: "1px solid #00ff8833" }}>You're In</span>}
              </div>
              <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.05, marginBottom: 12, color: "#fff", letterSpacing: "-0.03em" }}>
                {COMMUNITY.name}
              </h1>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
                {COMMUNITY.cadence}&nbsp;&nbsp;/&nbsp;&nbsp;Global Series
              </p>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 540 }}>{COMMUNITY.description}</p>
            </div>

            {/* Community Card */}
            <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 6, padding: "28px", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                <div>
                  <span className={`glow-purple ${animating ? "pulse" : ""}`} style={{ fontSize: 52, fontWeight: 700, color: "#7c3aed", display: "block", lineHeight: 1 }}>
                    {members}
                  </span>
                  <span style={{ fontSize: 12, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>community members</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", display: "block", lineHeight: 1 }}>${COMMUNITY.monthlyPrice}</span>
                  <span style={{ fontSize: 12, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>per month</span>
                </div>
              </div>

              {/* Upcoming Events */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Upcoming Events</p>
                {COMMUNITY.upcomingEvents.map((evt, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < COMMUNITY.upcomingEvents.length - 1 ? "1px solid #141414" : "none" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8", marginBottom: 2 }}>{evt.date}</p>
                      <p style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.04em" }}>{evt.city}</p>
                    </div>
                    <span style={{ fontSize: 11, color: evt.attendance > 0 ? "#7c3aed" : "#333", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      {evt.attendance > 0 ? `${evt.attendance} members` : "TBA"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Perks */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Member Perks</p>
                <div className="perk-list">
                  {COMMUNITY.communityPerks.map((perk, i) => (
                    <div key={i} className="perk-item">
                      <div className="perk-check">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p className="perk-text">{perk}</p>
                    </div>
                  ))}
                </div>
              </div>

              {hasMembership ? (
                <div style={{ background: "#00ff8808", border: "1px solid #00ff8822", borderRadius: 4, padding: "14px 18px", textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "#00ff88", fontWeight: 600 }}>You're a member. Welcome to the community.</p>
                  <p style={{ fontSize: 12, color: "#00ff8877", marginTop: 4 }}>Access to all events + full voting rights on lineups.</p>
                </div>
              ) : (
                <button className="cta-btn" onClick={handleJoinCommunity} disabled={animating}>
                  {animating ? "Joining..." : `Join Community · $${COMMUNITY.monthlyPrice}/Month`}
                </button>
              )}

              <p style={{ fontSize: 11, color: "#333", textAlign: "center", marginTop: 12, lineHeight: 1.6, letterSpacing: "0.02em" }}>
                Cancel anytime. Covers access to all monthly events in this series plus full community participation.
              </p>
            </div>
          </div>
        )}

        {/* ── PRODUCER DASHBOARD ── */}
        {view === "producer" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Producer Dashboard</h2>
              <p style={{ fontSize: 12, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>{COMMUNITY.name} · {COMMUNITY.curator}</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Active Members", value: members, sub: "paying subscribers", color: "#7c3aed" },
                { label: "Monthly Revenue", value: `$${mrr}`, sub: "MRR", color: "#00ff88" },
                { label: "Churn Rate", value: "2.1%", sub: "monthly", color: "#fff" },
              ].map((s, i) => (
                <div className="stat-card" key={i}>
                  <p style={{ fontSize: 10, color: "#444", marginBottom: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{s.label}</p>
                  <p style={{ fontSize: 30, fontWeight: 700, color: s.color, marginBottom: 4, letterSpacing: "-0.02em" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Growth Chart */}
            <div className="stat-card" style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Member Growth</p>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={growthData} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: "#333", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#333", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 4, fontSize: 12, color: "#e8e8e8" }} cursor={{ stroke: "#222" }} />
                  <Area type="monotone" dataKey="m" stroke="#7c3aed" strokeWidth={2} fill="url(#purple)" dot={false} name="Members" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Community Health */}
            <div style={{ background: "#0c0c0c", border: "1px solid #00d4ff22", borderRadius: 4, padding: "22px 24px", marginBottom: 16 }}>
              <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700 }}>Community Health</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#00d4ff", marginBottom: 6 }}>Strong growth. Next milestone: 400 members.</p>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>Healthy trajectory. Focus on engagement through voting, exclusive access, and curated lineups. Consider a special edition event to accelerate growth.</p>
            </div>

            {/* Revenue */}
            <div className="stat-card">
              <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 700 }}>Revenue Overview</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: "Current MRR", value: `$${mrr}` },
                  { label: "ARR Projection", value: `$${arr}` },
                  { label: "Stake Fee", value: "8%", highlight: true },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{s.label}</p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: s.highlight ? "#7c3aed" : "#e8e8e8" }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTLEMENT SCENARIOS ── */}
        {view === "settlement" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Membership Scenarios</h2>
              <p style={{ fontSize: 12, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Simulate what happens to your community in different situations.</p>
            </div>

            {/* Scenario Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 32 }}>
              {[
                { id: "healthy", label: "Thriving", sub: "Community grows", color: "#00ff88", border: "#00ff8833" },
                { id: "paused", label: "Paused", sub: "Temporary hiatus", color: "#00d4ff", border: "#00d4ff33" },
                { id: "cancelled", label: "Ended", sub: "Series concluded", color: "#ef4444", border: "#ef444433" },
              ].map((opt) => (
                <button key={opt.id} className="settle-btn"
                  onClick={() => setScenarioSettlement(opt.id)}
                  style={{ border: `1px solid ${scenarioSettlement === opt.id ? opt.border : "#1a1a1a"}`, background: scenarioSettlement === opt.id ? opt.color + "0a" : "transparent" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: scenarioSettlement === opt.id ? opt.color : "#444", marginBottom: 4, letterSpacing: "-0.01em" }}>{opt.label}</p>
                  <p style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em" }}>{opt.sub}</p>
                </button>
              ))}
            </div>

            {scenarioSettlement === "none" && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#333" }}>
                <p style={{ fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}>Select a scenario above</p>
              </div>
            )}

            {/* Healthy */}
            {scenarioSettlement === "healthy" && (
              <div style={{ background: "#0c0c0c", border: "1px solid #00ff8833", borderRadius: 4, padding: "22px 24px", marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#00ff88", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>Thriving Community</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#00ff88", marginBottom: 20, letterSpacing: "-0.01em" }}>Community is growing. Keep the momentum.</p>
                <div style={{ display: "grid", gap: 0 }}>
                  {[
                    { label: `${members} active members`, action: "Monthly billing active", detail: `$${mrr} MRR` },
                    { label: "Events", action: "Regular monthly events scheduled", detail: "All confirmed and booked" },
                    { label: "Engagement", action: "Strong community participation", detail: "2.1% churn / 98% healthy" },
                    { label: "Stake fee", action: "8% on monthly revenue", detail: `$${Math.round(mrr * 0.08)}/month` },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #141414" : "none" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#e8e8e8" }}>{row.label}</p>
                        <p style={{ fontSize: 11, color: "#00ff8877", marginTop: 2 }}>{row.action}</p>
                      </div>
                      <p style={{ fontSize: 11, color: "#444", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paused */}
            {scenarioSettlement === "paused" && (
              <div style={{ background: "#0c0c0c", border: "1px solid #00d4ff33", borderRadius: 4, padding: "22px 24px", marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#00d4ff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>Membership Paused</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#00d4ff", marginBottom: 20, letterSpacing: "-0.01em" }}>Series on hiatus. Memberships frozen.</p>
                <div style={{ display: "grid", gap: 0 }}>
                  {[
                    { label: `${members} members`, action: "Billing paused", detail: "No charges during hiatus" },
                    { label: "Access", action: "Maintained during pause period", detail: "Auto-resume when events restart" },
                    { label: "Communication", action: "Announce restart date", detail: "Stake sends community email" },
                    { label: "Stake fee", action: "Zero during pause", detail: "No fees on frozen memberships" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #141414" : "none" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#e8e8e8" }}>{row.label}</p>
                        <p style={{ fontSize: 11, color: "#00d4ff77", marginTop: 2 }}>{row.action}</p>
                      </div>
                      <p style={{ fontSize: 11, color: "#444", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled */}
            {scenarioSettlement === "cancelled" && (
              <div style={{ background: "#0c0c0c", border: "1px solid #ef444433", borderRadius: 4, padding: "22px 24px", marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>Series Ended</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#ef4444", marginBottom: 20, letterSpacing: "-0.01em" }}>Community concluded. Pro-rata refunds issued.</p>
                <div style={{ display: "grid", gap: 0 }}>
                  {[
                    { label: `${members} members`, action: "Pro-rata refunds issued", detail: `~$${Math.round(mrr * 0.5)} returned` },
                    { label: "Timeline", action: "5 business days", detail: "Automatic via Stripe" },
                    { label: "Stake fee", action: "No fee on refunds", detail: "You only paid for events held" },
                    { label: "Community", action: "Farewell email sent", detail: "Stake handles all messaging" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #141414" : "none" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#e8e8e8" }}>{row.label}</p>
                        <p style={{ fontSize: 11, color: "#ef444477", marginTop: 2 }}>{row.action}</p>
                      </div>
                      <p style={{ fontSize: 11, color: "#444", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulator */}
            {scenarioSettlement !== "none" && (
              <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 4, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>Simulate member growth</p>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 2 }}>See how numbers shift in real time</p>
                </div>
                <button className="cta-btn" style={{ width: "auto", padding: "10px 20px", fontSize: 12 }}
                  onClick={() => setMembers(m => m + 10)}>
                  + 10 Members
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
