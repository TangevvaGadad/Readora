import { prisma } from "@/lib/prisma";
import BookList from "@/components/BookList";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Prisma runs only on the server here ✅
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      author: true,
      pdfUrl: true,
      coverUrl: true,
      createdAt: true,
    },
  });

  return <BookList books={books} />;
}
