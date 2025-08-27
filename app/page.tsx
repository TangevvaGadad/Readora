import fs from "fs";
import path from "path";
import Link from "next/link";
import ReadoraHero from "@/components/ReadoraHero";
import PosterWall from "@/components/PosterWall";

export const dynamic = "force-dynamic";

export default async function Home() {
  const coversDir = path.join(process.cwd(), "public", "covers");
  let covers: { id: string; title: string; coverUrl: string }[] = [];
  try {
    const files = fs
      .readdirSync(coversDir)
      .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f));
    covers = files.slice(0, 60).map((f, i) => ({
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

      <div className="flex items-center justify-between px-6 sm:px-10 py-6">
        <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 drop-shadow">Readora</div>
        <div className="flex items-center gap-3">
          <Link href="/upload" className="text-sm hover:underline">Upload</Link>
          <Link href="/books" className="text-sm hover:underline">Library</Link>
        </div>
      </div>

      <ReadoraHero />

      

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500" />
    </main>
  );
}
