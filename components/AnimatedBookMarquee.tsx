"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  covers: { id: string; title: string; coverUrl: string }[];
};

export default function AnimatedBookMarquee({ covers }: Props) {
  const rows = [covers, [...covers].reverse()];
  return (
    <div className="pointer-events-none relative w-full overflow-hidden">
      {rows.map((row, idx) => (
        <motion.div
          key={idx}
          className="flex gap-4 mb-4"
          initial={{ x: 0 }}
          animate={{ x: idx % 2 === 0 ? "-50%" : "-50%" }}
          transition={{ repeat: Infinity, duration: 30 + idx * 6, ease: "linear" }}
        >
          {[...row, ...row].map((b, i) => (
            <div key={`${b.id}-${i}`} className="relative h-36 w-24 rounded-md overflow-hidden shadow-md">
              <Image src={b.coverUrl} alt={b.title} fill sizes="96px" className="object-cover" />
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}


