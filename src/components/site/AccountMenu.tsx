"use client";

// Header account controls (PHASE1_PROMPT.md §6):
// signed out → «دخول»; signed in → avatar (initial) + menu حسابي / أجهزتي / اخرج,
// plus «لوحة التحكم» for admins.
// <AccountMenu> sits in the header row (≥ 600px); <AccountPanel> is the same
// thing inside the phone menu panel.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { initialOf, useAuth } from "@/lib/auth/AuthProvider";
import { loginHref } from "@/lib/auth/next";
import { routes } from "@/lib/routes";

function useSignOut() {
  const { signOut } = useAuth();
  const router = useRouter();
  return async () => {
    await signOut();
    router.push(routes.home);
    router.refresh();
  };
}

/** Where «دخول» should come back to: the current page, unless it's a login page. */
function useLoginHref() {
  const pathname = usePathname();
  return pathname.startsWith("/login") ? routes.login : loginHref(pathname);
}

const ITEMS = (isAdmin: boolean) => [
  { href: routes.account, label: "حسابي" },
  { href: routes.accountTab("devices"), label: "أجهزتي" },
  ...(isAdmin ? [{ href: routes.admin.root, label: "لوحة التحكم" }] : []),
];

export function Avatar({ size = 40 }: { size?: number }) {
  const { profile, email } = useAuth();
  return (
    <span className="acc-avatar" style={{ width: size, height: size, fontSize: size * 0.45 }} aria-hidden="true">
      {initialOf(profile, email)}
    </span>
  );
}

export function AccountMenu() {
  const { ready, userId, profile, email, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const signOut = useSignOut();
  const login = useLoginHref();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    wrap.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Same footprint while loading, so the row doesn't jump.
  if (!ready) return <span className="acc-slot acc-wide" aria-hidden="true" />;

  if (!userId)
    return (
      <Link href={login} className="site-btn site-ghost acc-wide">
        دخول
      </Link>
    );

  const name = profile?.full_name || email || "";
  return (
    <div ref={wrap} className="acc-wrap acc-wide">
      <button
        ref={btn}
        type="button"
        className="acc-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`حسابك: ${name}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar />
      </button>
      {open ? (
        <div className="acc-menu" role="menu" aria-label="حسابك">
          <div className="acc-who">
            <span className="acc-name">{profile?.full_name || "حسابك"}</span>
            {email ? (
              <span className="acc-email" dir="ltr">
                {email}
              </span>
            ) : null}
          </div>
          {ITEMS(isAdmin).map((i) => (
            <Link key={i.href} href={i.href} role="menuitem" className="acc-item" onClick={() => setOpen(false)}>
              {i.label}
            </Link>
          ))}
          <button type="button" role="menuitem" className="acc-item acc-out" onClick={signOut}>
            اخرج
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Account block at the top of the phone menu panel. */
export function AccountPanel({ onNavigate }: { onNavigate: () => void }) {
  const { ready, userId, profile, email, isAdmin } = useAuth();
  const signOut = useSignOut();
  const login = useLoginHref();
  if (!ready) return null;

  if (!userId)
    return (
      <div className="acc-panel">
        <Link href={login} className="site-btn site-cta" onClick={onNavigate}>
          دخول
        </Link>
      </div>
    );

  return (
    <div className="acc-panel">
      <div className="acc-panel-who">
        <Avatar size={44} />
        <span className="acc-who">
          <span className="acc-name">{profile?.full_name || "حسابك"}</span>
          {email ? (
            <span className="acc-email" dir="ltr">
              {email}
            </span>
          ) : null}
        </span>
      </div>
      <div className="acc-panel-links">
        {ITEMS(isAdmin).map((i) => (
          <Link key={i.href} href={i.href} className="acc-chip" onClick={onNavigate}>
            {i.label}
          </Link>
        ))}
        <button
          type="button"
          className="acc-chip acc-out"
          onClick={() => {
            onNavigate();
            void signOut();
          }}
        >
          اخرج
        </button>
      </div>
    </div>
  );
}

/** Small initial badge on the phone menu button when signed in. */
export function MenuBadge() {
  const { ready, userId } = useAuth();
  if (!ready || !userId) return null;
  return (
    <span className="acc-badge">
      <Avatar size={20} />
    </span>
  );
}
