"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ReadoraHero() {
  return (
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
          href="/books"
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Get Started
          <span aria-hidden>➜</span>
        </Link>
      </motion.div>
    </section>
  );
}


