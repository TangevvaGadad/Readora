"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ReadoraHero() {
  return (
    <section className="mx-auto max-w-4xl px-6 sm:px-10 pt-20 sm:pt-28 text-center text-black">
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
        className="mt-4 text-lg sm:text-2xl text-black/80"
      >
        Start exploring now...
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link
  href="/books"
  className="inline-flex items-center gap-2 rounded-md 
             bg-gradient-to-r from-cyan-900 via-blue-800 to-indigo-900
             px-6 py-3 text-lg font-semibold text-white
             shadow-lg [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]
             hover:from-cyan-950 hover:via-blue-900 hover:to-indigo-950
             transition-all"
>
  Get Started
  <span aria-hidden>➜</span>
</Link>




      </motion.div>
    </section>
  );
}


