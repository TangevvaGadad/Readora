import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default async function ReadoraLanding() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, coverUrl: true },
    take: 30,
  });

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background collage */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 opacity-60">
          {books.map((b, i) => (
            <div key={b.id} className="relative aspect-[2/3]">
              <Image
                src={b.coverUrl}
                alt={b.title}
                fill
                sizes="(max-width:768px) 33vw, (max-width:1024px) 25vw, 16vw"
                className="object-cover"
                priority={i < 8}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-6">
        <div className="text-2xl font-extrabold">Readora</div>
        <div className="flex items-center gap-3">
          <Link href="/upload" className="text-sm hover:underline">Upload</Link>
          <Link href="/" className="text-sm hover:underline">Library</Link>
        </div>
      </div>

      {/* Hero content */}
      <section className="mx-auto max-w-4xl px-6 sm:px-10 pt-20 sm:pt-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-black tracking-tight"
        >
          Unlimited books and PDFs, all in one place.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg sm:text-2xl text-white/80"
        >
          Start exploring now. Cancel anytime.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Get Started
            <span aria-hidden>➜</span>
          </Link>
        </motion.div>
      </section>

      {/* Bottom ribbon */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500" />
    </main>
  );
}


