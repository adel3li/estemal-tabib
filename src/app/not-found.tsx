import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="m-0 text-3xl">الصفحة دي مش موجودة</h1>
        <p className="m-0 text-muted">ممكن الجهاز اتباع أو اللينك اتغيّر.</p>
        <Link href="/devices" className={btn.primary}>
          شوف كل الأجهزة
        </Link>
      </main>
      <Footer />
    </>
  );
}
