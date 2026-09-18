"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CheckSquare2,
  HeartHandshake,
  Home,
  Leaf,
  Menu,
  MessageCircleHeart,
  Settings,
  UserRoundSearch,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useCare } from "@/components/care-provider";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/home", label: "Today", icon: Home },
  { href: "/tasks", label: "My focus", icon: CheckSquare2 },
  { href: "/community", label: "Community", icon: MessageCircleHeart },
  { href: "/connections", label: "Connect", icon: UserRoundSearch },
  { href: "/messages", label: "Messages", icon: Bell },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { settings, encouragement } = useCare();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className={cn("sidebar", menuOpen && "is-open")}>
        <div className="sidebar-top">
          <Link className="brand" href="/home" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true">
              <HeartHandshake size={22} strokeWidth={1.8} />
            </span>
            <span>CareTogether</span>
          </Link>
          <button
            className="icon-button mobile-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="side-nav" aria-label="CareTogether">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                className={cn("side-nav-link", active && "is-active")}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <Link
            className={cn(
              "sidebar-reflection-card",
              pathname.startsWith("/encouragement") && "is-active",
            )}
            href="/encouragement"
            onClick={() => setMenuOpen(false)}
          >
            <span className="sidebar-reflection-label">
              <Leaf size={14} aria-hidden="true" />
              A moment for you
            </span>
            <span className="sidebar-reflection-text">{encouragement.text}</span>
            <span className="sidebar-reflection-action">Open reflection</span>
          </Link>
          <Link
            className={cn(
              "side-nav-link",
              pathname.startsWith("/settings") && "is-active",
            )}
            href="/settings"
          >
            <Settings size={20} aria-hidden="true" />
            Settings
          </Link>
        </div>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className="app-stage">
        <header className="mobile-header">
          <button
            className="icon-button"
            type="button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
          <Link className="brand brand-compact" href="/home">
            <HeartHandshake size={21} aria-hidden="true" />
            CareTogether
          </Link>
          <Link className="avatar-small" href="/settings" aria-label="Settings">
            {settings.displayName.slice(0, 2)}
          </Link>
        </header>
        <main id="main-content" className="app-content">
          {children}
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(active && "is-active")}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
