import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function Home() {
  const books = await prisma.book.findMany({
  orderBy: {
    createdAt: 'desc',
  },
  select: {
    id: true,
    title: true,
    author: true,
    pdfUrl: true,
    coverUrl: true, // ✅ This is the important fix
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
            <div key={book.id} className="border p-4 rounded shadow bg-white">
              <Image
                src={book.coverUrl}
                alt={`${book.title} cover`}
                width={300}
                height={400}
                className="rounded mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <a
                href={book.pdfUrl}
                download
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
