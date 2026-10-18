// next/link stand-in for the preview build: routes live in the URL hash.
import type { AnchorHTMLAttributes } from "react";

export function toHash(href: string) {
  if (!href.startsWith("/")) return href;
  const [path, anchor] = href.split("#");
  const route = path || "/";
  return anchor ? `#${route}${route.includes("?") ? "&" : "?"}s=${anchor}` : `#${route}`;
}

export default function Link({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={toHash(href)} {...rest} />;
}
