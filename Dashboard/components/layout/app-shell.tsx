'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BarChart3, Bell, CircleHelp, FileBarChart, Menu, MoreHorizontal, Settings, Sprout, X, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { navigationItems } from '@/services/navigation'

const icons: Record<string, LucideIcon> = { Overview: BarChart3, Sectors: Sprout, Alerts: Bell, Automation: Zap, Reports: FileBarChart }

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = navigationItems.find((item) => item.href === pathname)?.label ?? 'Overview'
  return <main className="min-h-screen bg-background text-foreground"><div className="flex min-h-screen">
    <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-border bg-sidebar p-5 transition-transform md:static md:translate-x-0`}>
      <div className="flex items-center gap-3 px-2"><div className="flex size-9 items-center justify-center rounded-lg bg-emerald-400 text-slate-950"><Sprout className="size-5" /></div><div><div className="font-mono text-sm font-bold tracking-tight">SMARTFARM</div><div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">IIoT Control</div></div><button className="ml-auto md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="size-4" /></button></div>
      <nav className="mt-10 flex flex-col gap-1">{navigationItems.map((item) => { const Icon = icons[item.label] ?? Activity; const isActive = pathname === item.href; return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive ? 'bg-emerald-400/10 text-emerald-300' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><Icon className="size-4" /><span>{item.label}</span>{item.count ? <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] text-amber-300">{item.count}</span> : null}</Link> })}</nav>
      <div className="mt-auto flex flex-col gap-1"><button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"><Settings className="size-4" />Settings</button><button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"><CircleHelp className="size-4" />Help center</button><div className="mt-4 flex items-center gap-3 border-t border-border pt-4"><div className="flex size-8 items-center justify-center rounded-full bg-violet-400/20 font-mono text-xs text-violet-200">AR</div><div className="min-w-0"><p className="truncate text-xs font-medium">Alex Rivera</p><p className="truncate text-[10px] text-muted-foreground">Farm manager</p></div><MoreHorizontal className="ml-auto size-4 text-muted-foreground" /></div></div>
    </aside>
    <div className="min-w-0 flex-1"><header className="flex h-20 items-center justify-between border-b border-border px-5 md:px-10"><div className="flex items-center gap-3"><button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="size-5" /></button><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Farm operations / {active.toLowerCase()}</p><h1 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">SmartFarm IIoT Control</h1></div></div><div className="flex items-center gap-2 text-xs text-emerald-300"><span className="size-2 rounded-full bg-emerald-400" />All systems operational</div></header><div className="mx-auto max-w-[1500px] p-5 md:p-10">{children}</div></div>
  </div></main>
}

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="mb-8"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">{eyebrow}</p><h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div> }

export function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <section className={`rounded-xl border border-border bg-card/80 p-6 ${className}`}>{children}</section> }

