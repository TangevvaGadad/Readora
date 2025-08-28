import { prisma } from "@/lib/prisma";
import BookList from "@/components/BookList";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  let books: {
    id: string;
    title: string;
    author: string;
    pdfUrl: string;
    coverUrl: string;
    createdAt: Date;
  }[] = [];

  try {
    books = await prisma.book.findMany({
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
  } catch (err) {
    console.error("Database unavailable, showing empty library.", err);
    books = [];
  }

  return <BookList books={books} />;
}


