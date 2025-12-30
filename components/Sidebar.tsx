"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Book,
  TrendingUp,
  Settings,
  LogOut,
  Layers,
  BarChart3,
  Newspaper,
  Microscope,
  Timer,
  Trophy,
  CheckSquare,
  Target,
  Activity,
  Notebook,
  Calculator,
  ChevronLeft,
  Calendar,
  StickyNote,
  MessageCircle,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";

const navGroups = [
  {
    label: "Analytics",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/journal", icon: Book, label: "Journal" },
      { href: "/calendar", icon: Calendar, label: "Calendar" },
      { href: "/bias", icon: Eye, label: "Bias Review" },
    ],
  },
  {
    label: "Network",
    items: [
      { href: "/leaderboard", icon: Trophy, label: "Socials" },
      { href: "/chat", icon: MessageCircle, label: "Chat" },
    ],
  },
  {
    label: "Strategy",
    items: [
      { href: "/strategies", icon: Layers, label: "Strategies" },
      { href: "/checklists", icon: CheckSquare, label: "Checklists" },
      { href: "/backtester", icon: TrendingUp, label: "Backtester" },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/chart", icon: BarChart3, label: "Chart" },
      { href: "/news", icon: Newspaper, label: "News" },
      { href: "/research", icon: Microscope, label: "Research" },
      { href: "/sessions", icon: Timer, label: "Sessions" },
      { href: "/calculator", icon: Calculator, label: "Calculator" },
    ],
  },
  {
    label: "Productivity",
    items: [
      { href: "/tasks", icon: CheckSquare, label: "Tasks" },
      { href: "/goals", icon: Target, label: "Goals" },
      { href: "/habits", icon: Activity, label: "Habits" },
      { href: "/activity-log", icon: StickyNote, label: "Activity Log" },
      { href: "/notebook", icon: Notebook, label: "Notebook" },
    ],
  },
  {
    label: "System",
    items: [{ href: "/settings", icon: Settings, label: "Settings" }],
  },
];

const Sidebar = React.memo(function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-full bg-[#0A0A0A] border-r border-white/5 z-50 flex flex-col transition-all duration-300 ease-in-out"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] to-purple-500/[0.02] pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <TrendingUp size={18} className="text-black" strokeWidth={3} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-xl tracking-tighter text-white italic"
            >
              APEX<span className="text-white/40 font-black">LEDGER</span>
            </motion.span>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-10 bg-[#0A0A0A] border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all z-50 group shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        <ChevronLeft
          size={14}
          strokeWidth={3}
          className={`transition-transform duration-500 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-6 px-3">
        <nav className="space-y-8">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-3 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4"
                >
                  {group.label}
                </motion.h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.href}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Exit Trading */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-red-500/[0.02] to-transparent pointer-events-none" />
        {isCollapsed ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all mx-auto shadow-xl"
            title="Exit Trading"
          >
            <LogOut size={20} strokeWidth={2.5} />
          </button>
        ) : (
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 border border-white/20 flex items-center justify-center text-sm font-black shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate uppercase tracking-tight">
                  {session?.user?.name}
                </p>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-wider">
                  Active Trader
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 text-[10px] font-black text-white/70 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 rounded-2xl transition-all border border-white/10 tracking-[0.2em] uppercase shadow-xl hover:shadow-red-500/20"
            >
              <LogOut size={16} strokeWidth={2.5} />
              Exit Trading
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
});

function NavItem({ href, icon: Icon, label, active, isCollapsed }: any) {
  return (
    <Link href={href}>
      <div
        className={`
                relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group
                ${
                  active
                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    : "text-white/70 hover:text-white hover:bg-white/5 hover:border-white/10"
                }
                ${!active ? "border border-transparent" : ""}
            `}
      >
        {active && (
          <motion.div
            layoutId="active-nav"
            className="absolute inset-0 bg-white rounded-2xl z-[-1]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Icon
          size={isCollapsed ? 22 : 20}
          strokeWidth={active ? 3 : 2}
          className="shrink-0"
        />
        {!isCollapsed && (
          <span
            className={`text-[13px] tracking-tight ${
              active ? "font-black uppercase" : "font-bold"
            }`}
          >
            {label}
          </span>
        )}
        {isCollapsed && (
          <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-wider rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-100 shadow-2xl border border-white/20">
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-white" />
          </div>
        )}
      </div>
    </Link>
  );
}

export default Sidebar;
