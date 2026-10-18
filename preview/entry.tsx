// Browser-only build of the site for the in-app preview. Renders the real
// pages from src/app with hash routing (#/devices/…) instead of Next.js.
import { useEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import Home from "@/app/page";
import DevicesPage from "@/app/devices/page";
import ListingPage from "@/app/devices/[id]/page";
import OrderPage from "@/app/orders/[id]/page";
import NotFound from "@/app/not-found";
import { NotFoundError } from "./shims/navigation";

type Route = { path: string; query: URLSearchParams };

function parse(): Route {
  const raw = location.hash.startsWith("#/") ? location.hash.slice(1) : "/";
  const [path, qs = ""] = raw.split("?");
  return { path: decodeURIComponent(path), query: new URLSearchParams(qs) };
}

async function render({ path, query }: Route): Promise<ReactNode> {
  const params = (id: string) => ({ params: Promise.resolve({ id }) });
  try {
    if (path === "/") return Home();
    if (path === "/devices") {
      return await DevicesPage({ searchParams: Promise.resolve(Object.fromEntries(query)) });
    }
    let m = path.match(/^\/devices\/([^/]+)$/);
    if (m) return await ListingPage(params(m[1]));
    m = path.match(/^\/orders\/([^/]+)$/);
    if (m) return await OrderPage(params(m[1]));
  } catch (e) {
    if (!(e instanceof NotFoundError)) throw e;
  }
  return NotFound();
}

function App() {
  const [page, setPage] = useState<ReactNode>(null);

  useEffect(() => {
    let current = "";
    async function go() {
      const route = parse();
      const key = `${route.path}?${route.query}`;
      const section = route.query.get("s");
      if (key !== current) {
        current = key;
        setPage(await render(route));
        if (!section) window.scrollTo(0, 0);
      }
      if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView());
    }
    // Plain in-page anchors (#report, #help) scroll instead of changing the route.
    function onClick(e: MouseEvent) {
      const a = (e.target as Element).closest?.("a[href^='#']");
      const href = a?.getAttribute("href");
      if (!href || href.startsWith("#/")) return;
      e.preventDefault();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
    go();
    window.addEventListener("hashchange", go);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", go);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return page;
}

document.documentElement.lang = "ar";
document.documentElement.dir = "rtl";
createRoot(document.getElementById("root")!).render(<App />);
