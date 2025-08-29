import fs from "fs";
import path from "path";
import Link from "next/link";
import ReadoraHero from "@/components/ReadoraHero";
import PosterWall from "@/components/PosterWall";
import StarsBackground from "@/components/StarsBackground";

export const dynamic = "force-dynamic";

export default async function Home() {
  const coversDir = path.join(process.cwd(), "public", "covers");
  let covers: { id: string; title: string; coverUrl: string }[] = [];
  try {
    // Prefer explicit bookN.png files if present
    const explicit: string[] = [];
    for (let i = 1; i <= 200; i++) {
      const name = `book${i}.png`;
      const p = path.join(coversDir, name);
      if (fs.existsSync(p)) explicit.push(name);
    }

    const files = explicit.length
      ? explicit
      : fs
          .readdirSync(coversDir)
          .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f));

    covers = files.slice(0, 120).map((f, i) => ({
      id: String(i),
      title: f,
      coverUrl: `/covers/${f}`,
    }));
  } catch (e) {
    // If folder missing, keep empty array
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <PosterWall covers={covers} />
      <StarsBackground />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/40" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_800px_at_50%_-10%,rgba(255,255,255,0.05),rgba(0,0,0,0)_60%)]" />

      <div className="flex items-center justify-between px-6 sm:px-10 py-6 relative z-10">
      <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-orange-200 to-amber-200 drop-shadow-md [text-shadow:2px_2px_8px_rgba(0,0,0,0.45)]">
  Readora
</div>
        <div className="flex items-center gap-3">
          <Link href="/books" className="text-sm hover:underline">Library</Link>
        </div>
      </div>

      <div className="relative z-10">
        <ReadoraHero />
      </div>

      

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500" />
    </main>
  );
}
