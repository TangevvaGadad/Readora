"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Cover = { id: string; title: string; coverUrl: string };

export default function PosterWall({ covers }: { covers: Cover[] }) {
  if (!covers || covers.length === 0) return null;

  // Ensure enough tiles to cover the screen even when rotated
  let tiles: (Cover & { key: string })[] = [];
  const needed = 180;
  let loop = 0;
  while (tiles.length < needed) {
    tiles = tiles.concat(
      covers.map((c, idx) => ({ ...c, key: `${c.id}-${loop}-${idx}` }))
    );
    loop += 1;
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black" />
      <motion.div
        className="absolute inset-0"
        style={{ transform: "rotate(-12deg) scale(1.25)" }}
        animate={{ x: [0, 80, 0], y: [0, -80, 0] }}
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(14, minmax(90px, 1fr))",
            height: "160vh",
            width: "170vw",
            marginLeft: "-25vw",
            marginTop: "-15vh",
          }}
        >
          {tiles.map((b, i) => (
            <div key={b.key} className="relative aspect-[2/3] rounded-md overflow-hidden">
              <Image
                src={b.coverUrl}
                alt={b.title}
                fill
                sizes="96px"
                className="object-cover"
                priority={i < 18}
                unoptimized
                style={{ opacity: 0.4 }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}


