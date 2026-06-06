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
  const [scenario, setScenario] = useState("none");
  const [animating, setAnimating] = useState(false);

  const mrr = members * COMMUNITY.monthlyPrice;
  const arr = mrr * 12;

  function handleJoin() {
    if (hasMembership) return;
    setAnimating(true);
    setTimeout(() => {
      setMembers((m) => m + 1);
      setHasMembership(true);
      setAnimating(false);
    }, 600);
  }

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh", background: "#13131a", color: "#e2e2f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #1a1a24; }
        ::-webkit-scrollbar-thumb { background: #a855f766; border-radius: 2px; }

        .nav-tab {
          background: none; border: none; cursor: pointer;
          padding: 10px 18px; font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase; color: #5a5a7a; transition: all 0.15s;
          border-bottom: 2px solid transparent;
        }
        .nav-tab.active { color: #fff; border-bottom-color: #a855f7; }
        .nav-tab:hover:not(.active) { color: #9090b0; }

        .cta-btn {
          display: block; width: 100%; padding: 16px;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          color: #fff; border: none; border-radius: 10px;
          font-family: 'Space Grotesk', sans-serif; font-size: 14px;
          font-weight: 700; cursor: pointer; letter-spacing: 0.05em;
          text-transform: uppercase; transition: opacity 0.2s, transform 0.1s;
          box-shadow: 0 4px 24px #a855f740;
        }
        .cta-btn:hover { opacity: 0.9; box-shadow: 0 6px 32px #a855f760; }
        .cta-btn:active { transform: scale(0.99); }
        .cta-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

        .card {
          background: #1c1c28; border: 1px solid #2a2a3d;
          border-radius: 14px; padding: 24px;
        }

        .stat-card {
          background: #1c1c28; border: 1px solid #2a2a3d;
          border-radius: 12px; padding: 20px;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pulse { animation: pulse 1.2s ease-in-out; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }

        .perk-item {
          display: flex; gap: 12px; align-items: center;
          padding: 12px 0; border-bottom: 1px solid #22223a;
        }
        .perk-item:last-child { border-bottom: none; }

        .dot-live {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .event-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; border-bottom: 1px solid #22223a;
        }
        .event-row:last-child { border-bottom: none; }

        .scenario-btn {
          background: #1c1c28; border: 1px solid #2a2a3d;
          border-radius: 10px; padding: 18px 12px; cursor: pointer;
          text-align: center; transition: all 0.2s; width: 100%;
          font-family: 'Space Grotesk', sans-serif;
        }
        .scenario-btn:hover { border-color: #3a3a55; background: #22223a; }

        .settle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid #22223a;
        }
        .settle-row:last-child { border-bottom: none; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid #22223a", background: "#13131a", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                <rect x="1" y="7" width="3" height="7" rx="1.5" fill="white"/>
                <rect x="6" y="3" width="3" height="11" rx="1.5" fill="white"/>
                <rect x="11" y="5" width="3" height="8" rx="1.5" fill="white"/>
                <rect x="16" y="9" width="2" height="5" rx="1" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>rite</span>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {[["fan", "Community"], ["producer", "Dashboard"], ["settlement", "Scenarios"]].map(([id, label]) => (
              <button key={id} className={`nav-tab ${view === id ? "active" : ""}`}
                onClick={() => { setView(id); setScenario("none"); }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 100px" }}>

        {/* ── COMMUNITY VIEW ── */}
        {view === "fan" && (
          <div>
            {/* Hero with gradient bg */}
            <div style={{ background: "linear-gradient(180deg, #1e1430 0%, #13131a 100%)", margin: "0 -24px", padding: "48px 24px 44px", marginBottom: 32 }}>
              <div style={{ maxWidth: 820, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
                  <span className="badge" style={{ background: "#a855f722", color: "#c084fc", border: "1px solid #a855f744" }}>{COMMUNITY.genre}</span>
                  {hasMembership
                    ? <span className="badge" style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44" }}><span className="dot-live" />Member</span>
                    : <span className="badge" style={{ background: "#ffffff0a", color: "#9090b0", border: "1px solid #ffffff14" }}>{members} members</span>
                  }
                </div>
                <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.0, marginBottom: 14, color: "#fff", letterSpacing: "-0.04em" }}>
                  {COMMUNITY.name}
                </h1>
                <p style={{ fontSize: 13, color: "#6060a0", marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
                  {COMMUNITY.cadence}&nbsp;&nbsp;·&nbsp;&nbsp;Global Series
                </p>
                <p style={{ fontSize: 16, color: "#8080b0", lineHeight: 1.7, maxWidth: 520 }}>{COMMUNITY.description}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
              {/* Left: Events + Perks */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Upcoming Events */}
                <div className="card">
                  <p style={{ fontSize: 11, color: "#5050a0", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Upcoming Events</p>
                  {COMMUNITY.upcomingEvents.map((evt, i) => (
                    <div key={i} className="event-row">
                      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                        <div style={{ background: i === 0 ? "linear-gradient(135deg, #a855f7, #ec4899)" : "#22223a", borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 52 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{evt.date.split(" ")[1]}</p>
                          <p style={{ fontSize: 10, color: i === 0 ? "#ffffff99" : "#5050a0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{evt.date.split(" ")[0]}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#e2e2f0", marginBottom: 2 }}>{evt.city}</p>
                          <p style={{ fontSize: 12, color: "#5050a0" }}>{evt.venue}</p>
                        </div>
                      </div>
                      {evt.attendance > 0
                        ? <span style={{ fontSize: 12, color: "#a855f7", fontWeight: 600 }}>{evt.attendance} going</span>
                        : <span style={{ fontSize: 11, color: "#3a3a5a", textTransform: "uppercase", letterSpacing: "0.06em" }}>TBA</span>
                      }
                    </div>
                  ))}
                </div>

                {/* Perks */}
                <div className="card">
                  <p style={{ fontSize: 11, color: "#5050a0", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Member Perks</p>
                  {COMMUNITY.communityPerks.map((perk, i) => (
                    <div key={i} className="perk-item">
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #a855f722, #ec489922)", border: "1px solid #a855f744", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p style={{ fontSize: 14, color: "#b0b0d0" }}>{perk}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Join Card */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="card" style={{ border: "1px solid #a855f733", background: "linear-gradient(160deg, #1e1c30 0%, #1c1c28 100%)" }}>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <span className={`${animating ? "pulse" : ""}`} style={{ fontSize: 48, fontWeight: 700, color: "#fff", display: "block", lineHeight: 1, letterSpacing: "-0.03em" }}>
                          {members}
                        </span>
                        <span style={{ fontSize: 12, color: "#6060a0", textTransform: "uppercase", letterSpacing: "0.06em" }}>members</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", display: "block", lineHeight: 1 }}>${COMMUNITY.monthlyPrice}</span>
                        <span style={{ fontSize: 12, color: "#6060a0", textTransform: "uppercase", letterSpacing: "0.06em" }}>/month</span>
                      </div>
                    </div>
                    {/* Member bar */}
                    <div style={{ height: 4, background: "#22223a", borderRadius: 2, overflow: "hidden", marginTop: 16 }}>
                      <div style={{ height: "100%", width: `${Math.min((members / 400) * 100, 100)}%`, background: "linear-gradient(90deg, #a855f7, #ec4899)", borderRadius: 2, boxShadow: "0 0 8px #a855f766", transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#5050a0", marginTop: 6, textAlign: "right" }}>Next milestone: 400</p>
                  </div>

                  {hasMembership ? (
                    <div style={{ background: "#22c55e0f", border: "1px solid #22c55e33", borderRadius: 10, padding: "16px", textAlign: "center" }}>
                      <p style={{ fontSize: 14, color: "#22c55e", fontWeight: 700, marginBottom: 4 }}>You're in the community.</p>
                      <p style={{ fontSize: 12, color: "#22c55e77" }}>Access to all events + voting rights.</p>
                    </div>
                  ) : (
                    <button className="cta-btn" onClick={handleJoin} disabled={animating}>
                      {animating ? "Joining..." : `Join Community · $${COMMUNITY.monthlyPrice}/mo`}
                    </button>
                  )}

                  <p style={{ fontSize: 11, color: "#3a3a5a", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                    Cancel anytime. Covers all monthly events + full community access.
                  </p>
                </div>

                {/* Curator Card */}
                <div className="card">
                  <p style={{ fontSize: 11, color: "#5050a0", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Curated by</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #a855f7)", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{COMMUNITY.curator}</p>
                      <p style={{ fontSize: 12, color: "#5050a0" }}>Independent Collective</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCER DASHBOARD ── */}
        {view === "producer" && (
          <div style={{ paddingTop: 40 }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Producer Dashboard</h2>
              <p style={{ fontSize: 12, color: "#5050a0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{COMMUNITY.name} · {COMMUNITY.curator}</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Members", value: members, sub: "active subscriptions", color: "#c084fc", bg: "#a855f714", border: "#a855f733" },
                { label: "MRR", value: `$${mrr.toLocaleString()}`, sub: "monthly recurring", color: "#4ade80", bg: "#22c55e14", border: "#22c55e33" },
                { label: "Churn", value: "2.1%", sub: "monthly — healthy", color: "#e2e2f0", bg: "#ffffff08", border: "#ffffff1a" },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "20px" }}>
                  <p style={{ fontSize: 10, color: "#5050a0", marginBottom: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{s.label}</p>
                  <p style={{ fontSize: 32, fontWeight: 700, color: s.color, marginBottom: 4, letterSpacing: "-0.03em" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#4040a0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Growth Chart */}
            <div className="stat-card" style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#5050a0", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>Member Growth</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={growthData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: "#4040a0", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#4040a0", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1c1c28", border: "1px solid #2a2a3d", borderRadius: 8, fontSize: 12, color: "#e2e2f0" }} cursor={{ stroke: "#2a2a3d" }} />
                  <Area type="monotone" dataKey="m" stroke="#a855f7" strokeWidth={2.5} fill="url(#purple)" dot={false} name="Members" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Health Block */}
            <div style={{ background: "linear-gradient(135deg, #1e1430 0%, #1c1c28 100%)", border: "1px solid #a855f733", borderRadius: 12, padding: "22px 24px", marginBottom: 16 }}>
              <p style={{ fontSize: 10, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>Community Health</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Growing steadily. Next target: 400 members.</p>
              <p style={{ fontSize: 13, color: "#6060a0", lineHeight: 1.7 }}>Strong trajectory. Focus on engagement through voting, exclusive access, and curated lineups. Consider a special edition event to accelerate growth and retention.</p>
            </div>

            {/* Revenue */}
            <div className="stat-card">
              <p style={{ fontSize: 11, color: "#5050a0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18, fontWeight: 700 }}>Revenue Overview</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {[
                  { label: "MRR", value: `$${mrr.toLocaleString()}` },
                  { label: "ARR", value: `$${arr.toLocaleString()}` },
                  { label: "Rite Fee", value: "8%", highlight: true },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "16px", background: "#22223a", borderRadius: 10 }}>
                    <p style={{ fontSize: 10, color: "#5050a0", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{s.label}</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: s.highlight ? "#c084fc" : "#fff" }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SCENARIOS ── */}
        {view === "settlement" && (
          <div style={{ paddingTop: 40 }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>Membership Scenarios</h2>
              <p style={{ fontSize: 12, color: "#5050a0", textTransform: "uppercase", letterSpacing: "0.06em" }}>Simulate what happens to your community in different situations.</p>
            </div>

            {/* Scenario Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 32 }}>
              {[
                { id: "healthy", label: "Thriving", sub: "Community grows", color: "#4ade80", bg: "#22c55e0a", border: "#22c55e44", activeBorder: "#22c55e66" },
                { id: "paused",  label: "Paused",   sub: "Temporary hiatus", color: "#60a5fa", bg: "#3b82f60a", border: "#3b82f644", activeBorder: "#3b82f666" },
                { id: "ended",   label: "Ended",    sub: "Series concluded", color: "#f87171", bg: "#ef44440a", border: "#ef444444", activeBorder: "#ef444466" },
              ].map((opt) => (
                <button key={opt.id} className="scenario-btn"
                  onClick={() => setScenario(opt.id)}
                  style={{ border: `1px solid ${scenario === opt.id ? opt.activeBorder : "#2a2a3d"}`, background: scenario === opt.id ? opt.bg : "#1c1c28" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: scenario === opt.id ? opt.color : "#6060a0", marginBottom: 5 }}>{opt.label}</p>
                  <p style={{ fontSize: 11, color: "#3a3a5a", textTransform: "uppercase", letterSpacing: "0.06em" }}>{opt.sub}</p>
                </button>
              ))}
            </div>

            {scenario === "none" && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: "#1c1c28", border: "1px solid #2a2a3d", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#3a3a5a" strokeWidth="1.5"/><path d="M12 8v4l3 3" stroke="#3a3a5a" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <p style={{ fontSize: 13, color: "#3a3a5a", letterSpacing: "0.06em", textTransform: "uppercase" }}>Select a scenario above</p>
              </div>
            )}

            {scenario !== "none" && (
              <>
              <ScenarioBlock scenario={scenario} members={members} mrr={mrr} />
              <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#e2e2f0", marginBottom: 3 }}>Simulate growth</p>
                  <p style={{ fontSize: 12, color: "#5050a0" }}>Add members to see numbers shift in real time</p>
                </div>
                <button className="cta-btn" style={{ width: "auto", padding: "11px 22px", fontSize: 12 }}
                  onClick={() => setMembers(m => m + 10)}>
                  + 10 Members
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

function ScenarioBlock({ scenario, members, mrr }) {
  const configs = {
    healthy: {
      accent: "#4ade80", border: "#22c55e33", bg: "#22c55e08",
      title: "Thriving Community",
      headline: "Community is growing. Keep the momentum.",
      rows: [
        { label: `${members} active members`, action: "Monthly billing active", detail: `$${mrr.toLocaleString()} MRR` },
        { label: "Events", action: "Regular monthly events booked", detail: "All confirmed" },
        { label: "Churn", action: "2.1% monthly", detail: "Below industry average" },
        { label: "Rite fee", action: "8% on revenue", detail: `$${Math.round(mrr * 0.08).toLocaleString()}/month` },
      ],
    },
    paused: {
      accent: "#60a5fa", border: "#3b82f633", bg: "#3b82f608",
      title: "Membership Paused",
      headline: "Series on hiatus. No charges to members.",
      rows: [
        { label: `${members} members`, action: "Billing frozen", detail: "No charges during hiatus" },
        { label: "Access", action: "Maintained during pause", detail: "Auto-resumes when events restart" },
        { label: "Communication", action: "Announce restart date", detail: "Rite emails your community" },
        { label: "Rite fee", action: "Zero during pause", detail: "No fees on frozen memberships" },
      ],
    },
    ended: {
      accent: "#f87171", border: "#ef444433", bg: "#ef444408",
      title: "Series Ended",
      headline: "Community concluded. Pro-rata refunds issued.",
      rows: [
        { label: `${members} members`, action: "Pro-rata refunds processed", detail: `~$${Math.round(mrr * 0.5).toLocaleString()} returned` },
        { label: "Timeline", action: "5 business days", detail: "Automatic via Stripe" },
        { label: "Rite fee", action: "No fee on refunds", detail: "You only pay for events held" },
        { label: "Community", action: "Farewell email sent", detail: "Rite handles all messaging" },
      ],
    },
  };

  const c = configs[scenario];

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: "24px" }}>
      <p style={{ fontSize: 10, color: c.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>{c.title}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 22, letterSpacing: "-0.01em" }}>{c.headline}</p>
      <div>
        {c.rows.map((row, i) => (
          <div key={i} className="settle-row" style={{ borderBottomColor: "#1e1e2e" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e2f0" }}>{row.label}</p>
              <p style={{ fontSize: 12, color: c.accent + "99", marginTop: 2 }}>{row.action}</p>
            </div>
            <p style={{ fontSize: 12, color: "#5050a0", textAlign: "right", maxWidth: 180 }}>{row.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
