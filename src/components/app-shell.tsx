"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CheckSquare2,
  Home,
  Leaf,
  Menu,
  MessageCircleHeart,
  Settings,
  UserRoundSearch,
  X,
} from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";
import { CandleAmbience, CandleMark } from "@/components/candle-brand";
import { useCare } from "@/components/care-provider";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/home", label: "Today", icon: Home },
  { href: "/tasks", label: "My focus", icon: CheckSquare2 },
  {
    href: "/community",
    label: "Community",
    icon: MessageCircleHeart,
    groupStart: true,
  },
  { href: "/messages", label: "Messages", icon: Bell },
  { href: "/connections", label: "Connect", icon: UserRoundSearch },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    settings,
    encouragement,
    conversations,
    sharedTaskLists,
  } = useCare();
  const [menuOpen, setMenuOpen] = useState(false);
  const isCaregiver = settings.communityRole !== "affected";
  const unreadMessages = conversations
    .filter(
      (conversation) =>
        conversation.audience === (isCaregiver ? "caregiver" : "affected"),
    )
    .reduce((total, conversation) => total + conversation.unread, 0);
  const unseenSharedLists = isCaregiver
    ? sharedTaskLists.filter(
        (list) =>
          list.audience === "caregiver" &&
          !list.seen &&
          (list.recipientId === "current-user" ||
            list.recipientId === settings.displayName),
      ).length
    : 0;

  function getBadgeCount(href: string) {
    if (href === "/messages") return unreadMessages;
    if (href === "/tasks") return unseenSharedLists;
    return 0;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <CandleAmbience
        className={
          pathname === "/home" || pathname.startsWith("/home/")
            ? "is-prominent"
            : ""
        }
      />
      <aside className={cn("sidebar", menuOpen && "is-open")}>
        <div className="sidebar-top">
          <Link className="brand" href="/home" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true">
              <CandleMark />
            </span>
            <span>Be My Light</span>
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
        <nav className="side-nav" aria-label="Be My Light">
          {navigation.map((item) => {
            const { href, label, icon: Icon } = item;
            const active = pathname === href || pathname.startsWith(`${href}/`);
            const badgeCount = getBadgeCount(href);
            return (
              <Fragment key={href}>
                {"groupStart" in item && item.groupStart ? (
                  <span className="nav-section-label">Community</span>
                ) : null}
                <Link
                  className={cn("side-nav-link", active && "is-active")}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon-wrap">
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    {badgeCount > 0 ? (
                      <span
                        className="nav-notification-dot"
                        aria-label={
                          href === "/messages"
                            ? `${badgeCount} unread message`
                            : `${badgeCount} new shared list`
                        }
                      />
                    ) : null}
                  </span>
                  <span className="side-nav-label">{label}</span>
                </Link>
              </Fragment>
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
            <span className="brand-mark brand-mark-compact" aria-hidden="true">
              <CandleMark />
            </span>
            Be My Light
          </Link>
          <Link className="avatar-small" href="/settings" aria-label="Settings">
            {(settings.displayName || "BM").slice(0, 2)}
          </Link>
        </header>
        <main id="main-content" className="app-content">
          {children}
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          const badgeCount = getBadgeCount(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(active && "is-active")}
              aria-current={active ? "page" : undefined}
            >
              <span className="nav-icon-wrap">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                {badgeCount > 0 ? (
                  <span className="nav-notification-dot" aria-hidden="true" />
                ) : null}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
