'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Droplets,
  Gauge,
  Leaf,
  Menu,
  MoreHorizontal,
  Radio,
  Settings2,
  Sprout,
  Thermometer,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const chartData = [
  { time: '00:00', energy: 42, water: 30, output: 28 },
  { time: '04:00', energy: 46, water: 38, output: 31 },
  { time: '08:00', energy: 65, water: 50, output: 46 },
  { time: '12:00', energy: 58, water: 62, output: 54 },
  { time: '16:00', energy: 74, water: 68, output: 63 },
  { time: '20:00', energy: 67, water: 58, output: 59 },
  { time: '24:00', energy: 78, water: 72, output: 70 },
]

const activities = [
  ['Water loop optimized', 'Irigasi otomatis mengurangi debit 12%', '2 min lalu', 'good'],
  ['Greenhouse temperature', 'Zona B mencapai ambang batas atas', '8 min lalu', 'warn'],
  ['Solar array online', 'Output energi kembali stabil', '16 min lalu', 'good'],
  ['Nutrient cycle complete', 'Batch N-204 siap digunakan kembali', '32 min lalu', 'info'],
]

function Metric({ label, value, unit, change, icon: Icon, tone = 'cyan' }: { label: string; value: string; unit: string; change: string; icon: typeof Activity; tone?: string }) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">{label}</span>
        <div className={`metric-icon ${tone}`}><Icon /></div>
      </div>
      <div className="mt-5 flex items-end gap-2"><strong>{value}</strong><span className="metric-unit">{unit}</span></div>
      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300"><ArrowUpRight className="size-3.5" /> {change} <span className="text-muted-foreground">vs kemarin</span></div>
    </div>
  )
}

function FlowMap() {
  return (
    <div className="flow-map relative min-h-[320px] overflow-hidden p-5">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(92,219,216,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(92,219,216,.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 340" preserveAspectRatio="none" aria-hidden="true">
        <path d="M120 78 C250 78, 220 170, 350 170 S510 112, 640 112" fill="none" stroke="var(--flow-cyan)" strokeWidth="18" strokeOpacity=".16" />
        <path d="M120 78 C250 78, 220 170, 350 170 S510 112, 640 112" fill="none" stroke="var(--flow-cyan)" strokeWidth="2" strokeDasharray="5 8" />
        <path d="M120 260 C250 260, 220 190, 350 190 S510 225, 640 225" fill="none" stroke="var(--flow-green)" strokeWidth="22" strokeOpacity=".14" />
        <path d="M120 260 C250 260, 220 190, 350 190 S510 225, 640 225" fill="none" stroke="var(--flow-green)" strokeWidth="2" strokeDasharray="5 8" />
        <path d="M385 55 C385 110, 385 115, 385 155" fill="none" stroke="var(--flow-amber)" strokeWidth="15" strokeOpacity=".13" />
        <path d="M385 55 C385 110, 385 115, 385 155" fill="none" stroke="var(--flow-amber)" strokeWidth="2" strokeDasharray="4 6" />
      </svg>
      <div className="relative flex h-full min-h-[280px] items-center justify-between gap-3">
        <div className="flow-node"><div className="flow-node-icon cyan"><Droplets /></div><span>INPUT</span><strong>Air & Air Limbah</strong><small>4.820 L / hari</small></div>
        <div className="flow-node active"><div className="flow-node-icon amber"><Radio /></div><span>CORE ENGINE</span><strong>Bio-digester</strong><small>Efisiensi 94,2%</small></div>
        <div className="flex flex-col gap-10"><div className="flow-node"><div className="flow-node-icon green"><Sprout /></div><span>OUTPUT</span><strong>Greenhouse</strong><small>18.6 ton / hari</small></div><div className="flow-node"><div className="flow-node-icon cyan"><Zap /></div><span>OUTPUT</span><strong>Energi</strong><small>1.240 kWh / hari</small></div></div>
      </div>
      <div className="absolute bottom-4 left-5 flex items-center gap-4 text-[10px] uppercase tracking-wider text-muted-foreground"><span className="flex items-center gap-2"><i className="legend-dot cyan" /> aliran aktif</span><span className="flex items-center gap-2"><i className="legend-dot green" /> output terbarukan</span></div>
    </div>
  )
}

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [autoMode, setAutoMode] = useState(true)
  const [pumpOn, setPumpOn] = useState(true)
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="topbar"><div className="flex items-center gap-4"><button className="icon-button lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Buka menu"><Menu /></button><div className="brand-mark"><Leaf /></div><div><div className="brand-name">CIRCULAR<span>FARM</span></div><div className="brand-sub">EDGE ANALYTICS / WEST JAVA</div></div></div><div className="flex items-center gap-3"><div className="system-live"><i /> SYSTEM LIVE <span>99.98%</span></div><button className="icon-button"><Bell /></button><div className="avatar">AF</div></div></header>
      <div className="app-shell">
        <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}><div className="sidebar-label">MAIN MENU</div>{[['Overview', Gauge], ['Resource Flow', Radio], ['Production', BarChart3], ['Actuators', Settings2]].map(([name, Icon], i) => <button key={name as string} className={`nav-item ${i === 0 ? 'active' : ''}`}><Icon /><span>{name as string}</span>{i === 1 && <b>3</b>}</button>)}<div className="sidebar-label mt-9">SYSTEM</div><button className="nav-item"><CircleHelp /><span>Documentation</span></button><button className="nav-item"><Settings2 /><span>Settings</span></button><div className="sidebar-footer"><div className="flex items-center gap-2 text-xs text-emerald-300"><i className="status-dot" /> Semua sistem normal</div><p>Last sync<br /><strong>12 Agu 2026 · 14:32:08</strong></p></div></aside>
        <section className="content"><div className="page-heading"><div><div className="eyebrow">WEDNESDAY, 12 AUGUST 2026 <span className="heading-line" /></div><h1>System <em>Overview</em></h1><p>Memantau aliran sumber daya dan kesehatan operasional farm Anda.</p></div><button className="outline-button"><span className="pulse-dot" /> Live telemetry <ChevronRight /></button></div>
          <div className="alert-banner"><div className="alert-symbol"><AlertTriangle /></div><div className="flex-1"><strong>Peringatan: Suhu Greenhouse B mendekati ambang batas</strong><p>Sensor TH-204 mendeteksi suhu 31.8°C — 1.2°C di bawah batas aman.</p></div><button className="alert-action">Lihat detail <ArrowUpRight /></button></div>
          <div className="metrics-grid"><Metric label="TOTAL ENERGY OUTPUT" value="1,240" unit="kWh" change="+8.4%" icon={Zap} /><Metric label="WATER RECIRCULATION" value="94.2" unit="%" change="+2.1%" icon={Droplets} tone="green" /><Metric label="ACTIVE ZONES" value="07" unit="/ 08" change="1 warning" icon={Activity} tone="amber" /></div>
          <div className="section-row"><div><div className="eyebrow">REAL-TIME RESOURCE NETWORK</div><h2>Resource <em>Flow</em></h2></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="live-bars"><i /><i /><i /></span> Updating every 5s</div></div>
          <FlowMap />
          <div className="section-row mt-9"><div><div className="eyebrow">OPERATIONAL PERFORMANCE</div><h2>Sector <em>Analytics</em></h2></div><button className="ghost-button">View reports <ArrowUpRight /></button></div>
          <div className="sector-grid"><div className="sector-card"><div className="card-top"><span className="sector-tag"><Sprout /> SECTOR A</span><span className="good-tag">OPTIMAL</span></div><h3>Greenhouse</h3><div className="sector-main"><div><strong>28.4</strong><span>°C</span><small>Temperature</small></div><div className="mini-chart"><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div></div></div><div className="sector-stats"><span>Humidity <b>72%</b></span><span>CO₂ <b>648 ppm</b></span></div></div><div className="sector-card"><div className="card-top"><span className="sector-tag"><Droplets /> SECTOR B</span><span className="good-tag">STABLE</span></div><h3>Water Treatment</h3><div className="sector-main"><div><strong>4,820</strong><span>L</span><small>Processed today</small></div><div className="ring-chart"><div><b>94%</b><small>eff.</small></div></div></div><div className="sector-stats"><span>pH Level <b>6.8</b></span><span>Flow rate <b>12.4 L/m</b></span></div></div><div className="sector-card warning-card"><div className="card-top"><span className="sector-tag"><Thermometer /> SECTOR C</span><span className="warn-tag">ATTENTION</span></div><h3>Climate Control</h3><div className="sector-main"><div><strong>31.8</strong><span>°C</span><small>Greenhouse B</small></div><div className="thermo"><div className="thermo-fill" /></div></div><div className="sector-stats"><span>Setpoint <b>30.0°C</b></span><span>Fan status <b className="text-amber-300">89%</b></span></div></div></div>
          <div className="bottom-grid"><div className="panel chart-panel"><div className="panel-heading"><div><div className="eyebrow">LAST 24 HOURS</div><h2>System <em>Performance</em></h2></div><button className="period-button">24H <ChevronRight /></button></div><div className="chart-legend"><span><i className="legend-line cyan" /> Energy output</span><span><i className="legend-line green" /> Water usage</span><span><i className="legend-line amber" /> Production</span></div><div className="h-[240px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="energy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5cdbd8" stopOpacity={.22} /><stop offset="100%" stopColor="#5cdbd8" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(141,179,193,.1)" vertical={false} /><XAxis dataKey="time" tick={{ fill: '#718997', fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#718997', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} /><Tooltip contentStyle={{ background: '#102631', border: '1px solid #244450', borderRadius: 8, fontSize: 11 }} /><Area type="monotone" dataKey="energy" stroke="#5cdbd8" strokeWidth={2} fill="url(#energy)" /><Area type="monotone" dataKey="water" stroke="#65d69b" strokeWidth={2} fill="none" /><Area type="monotone" dataKey="output" stroke="#f2bd64" strokeWidth={2} fill="none" /></AreaChart></ResponsiveContainer></div></div><div className="panel"><div className="panel-heading"><div><div className="eyebrow">CONTROL CENTER</div><h2>Actuator <em>Overrides</em></h2></div><Settings2 className="size-4 text-muted-foreground" /></div><div className="control-row"><div><strong>Auto mode</strong><small>AI-driven optimization</small></div><button className={`switch ${autoMode ? 'on' : ''}`} onClick={() => setAutoMode(!autoMode)} aria-label="Toggle auto mode"><i /></button></div><div className="control-row"><div><strong>Irrigation pump 01</strong><small>Greenhouse A · Main loop</small></div><button className={`switch ${pumpOn ? 'on' : ''}`} onClick={() => setPumpOn(!pumpOn)} aria-label="Toggle irrigation pump"><i /></button></div><div className="control-row"><div><strong>Ventilation fan B</strong><small>Climate zone B · 89%</small></div><button className="switch on" aria-label="Ventilation active"><i /></button></div><button className="manage-button">Manage all actuators <ArrowUpRight /></button></div></div>
          <div className="section-row mt-9"><div><div className="eyebrow">ACTIVITY STREAM</div><h2>Live <em>Events</em></h2></div><span className="text-xs text-muted-foreground">Showing latest activity</span></div><div className="events-panel">{activities.map(([title, detail, time, tone]) => <div className="event-row" key={title}><div className={`event-icon ${tone}`}>{tone === 'warn' ? <AlertTriangle /> : tone === 'info' ? <Radio /> : <Check />}</div><div className="flex-1"><strong>{title}</strong><p>{detail}</p></div><time>{time}</time><MoreHorizontal className="size-4 text-muted-foreground" /></div>)}</div>
          <footer className="footer"><span>CIRCULARFARM OS <b>v2.4.1</b></span><span>SECURE CONNECTION <i /> <b>EDGE NODE CF-07</b></span></footer>
        </section>
      </div>
    </main>
  )
}
