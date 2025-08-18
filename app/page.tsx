import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch all books from DB
  const books = await prisma.book.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      author: true,
      pdfUrl: true,
      coverUrl: true, 
      createdAt: true,
    },
  });

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">📚 Available Books</h1>

      {books.length === 0 ? (
        <p>No books uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border p-4 rounded shadow bg-white flex flex-col items-center"
            >
              {/* ✅ Cloudinary image */}
              <Image
                src={book.coverUrl}
                alt={`${book.title} cover`}
                width={300}
                height={400}
                className="rounded mb-4 object-cover"
                priority
              />

              <h2 className="text-xl font-semibold text-center">
                {book.title}
              </h2>
              <p className="text-gray-600 mb-2">by {book.author}</p>

              <a
                href={book.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                📥 Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
