"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Cover = { id: string; title: string; coverUrl: string };

export default function PosterWall({ covers }: { covers: Cover[] }) {
  const repeated = Array.from({ length: 5 }).flatMap((_, i) =>
    covers.map((c, idx) => ({ ...c, key: `${c.id}-${i}-${idx}` }))
  );

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
      <motion.div
        className="absolute left-1/2 top-1/2"
        initial={{ x: "-50%", y: "-50%" }}
        animate={{ x: "-50%", y: "-50%" }}
        style={{
          width: "160vw",
          transform: "translate(-50%, -50%) rotate(-12deg) scale(1.2)",
        }}
      >
        <motion.div
          className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3 opacity-80"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          {repeated.map((b, i) => (
            <div key={b.key} className="relative aspect-[2/3] rounded-md overflow-hidden">
              <Image
                src={b.coverUrl}
                alt={b.title}
                fill
                sizes="120px"
                className="object-cover"
                priority={i < 12}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}


